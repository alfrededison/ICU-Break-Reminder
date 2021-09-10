<template>
  <q-page class="q-pa-lg">
    <h5 class="q-mt-none">{{ $t("pages.dashboard") }}</h5>
    <div class="q-gutter-md">
      <div class="row">
        <div class="col">
          <div class="text-h5 text-primary">
            {{ $t("config_group.counter") }}
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-toggle
            color="secondary"
            :disabled="!hasSetup"
            v-model="enable"
            :label="mainButtonLabel"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-btn-group>
            <q-btn
              disable
              glossy
              no-caps
              text-color="black"
              color="yellow"
              :label="currentStatusText"
            />
            <q-btn
              disable
              glossy
              no-caps
              text-color="black"
              color="amber"
              :label="counterStatusText"
            />
            <q-btn
              disable
              glossy
              no-caps
              text-color="black"
              color="orange"
              :label="nextBreakText"
            />
            <q-btn
              disable
              glossy
              no-caps
              text-color="black"
              color="brown-5"
              :label="nextCamCheckText"
            />
          </q-btn-group>
        </div>
      </div>
      <camera-configs />
      <div class="row">
        <div class="col">
          <div class="text-h5 text-primary">
            {{ $t("config_group.break_configs") }}
          </div>
        </div>
      </div>
      <div class="row q-gutter-md">
        <div class="col q-ml-none">
          <q-input
            outlined
            v-model="timeBetweenBreaks"
            mask="#:##:##"
            unmasked-value
            :hint="$t('configs.duration_format') + ': h:mm:ss'"
            :label="$t('configs.time_between_breaks')"
          />
        </div>
        <div class="col">
          <q-input
            outlined
            v-model="breakDuration"
            mask="##:##"
            unmasked-value
            :hint="$t('configs.duration_format') + ': mm:ss'"
            :label="$t('configs.break_duration')"
          />
        </div>
      </div>
      <div class="row q-gutter-md">
        <div class="col q-ml-none">
          <q-input
            outlined
            v-model="timeBetweenChecks"
            mask="#:##"
            unmasked-value
            :hint="$t('configs.duration_format') + ': m:ss'"
            :label="$t('configs.time_between_checks')"
          />
        </div>
        <div class="col">
          <q-input
            outlined
            v-model="notifyBefore"
            mask="##"
            unmasked-value
            :hint="$t('configs.duration_format') + ': ss'"
            :label="$t('configs.notify_before')"
          />
        </div>
      </div>
      <div class="row">
        <div class="col q-gutter-md">
          <q-btn
            color="primary"
            :label="$t('configs.save')"
            @click="saveConfig"
          />
          <q-btn
            color="warning"
            :label="$t('configs.reload_configs')"
            @click="loadConfig"
          />
          <q-btn
            color="negative"
            :label="$t('configs.load_default')"
            @click="loadDefault"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { convertDurationStringToSeconds } from "src/utils/time";
import * as Configs from "src/utils/configs";
import CameraConfigs from "src/components/CameraConfigs.vue";


const DEFAULT_CONFIGS = {
  timeBetweenBreaks: "02000",
  breakDuration: "0020",
  timeBetweenChecks: "100",
  notifyBefore: "10",
};

export default {
  components: { CameraConfigs },
  name: "Dashboard",
  data() {
    return {
      enable: true,
      tictoc: false,

      timeBetweenBreaks: DEFAULT_CONFIGS.timeBetweenBreaks,
      breakDuration: DEFAULT_CONFIGS.breakDuration,
      timeBetweenChecks: DEFAULT_CONFIGS.timeBetweenChecks,
      notifyBefore: DEFAULT_CONFIGS.notifyBefore,
    };
  },
  computed: {
    ...mapState({
      working: (state) => state.countdown.working,
      isPlaying: (state) => state.camera.isPlaying,
      faceDetected: (state) => state.camera.faceDetected,
    }),
    ...mapGetters({
      hasSetup: "countdown/hasSetup",
      timeLeftBeforeBreak: "countdown/timeLeftBeforeBreak",
      timeLeftToEndBreak: "countdown/timeLeftToEndBreak",
      timeLeftBeforeCheck: "countdown/timeLeftBeforeCheck",
      isWorkingPeriod: "countdown/isWorkingPeriod",
      isNotifyPeriod: "countdown/isNotifyPeriod",
      isBreakPeriod: "countdown/isBreakPeriod",
      isCheckingPoint: "countdown/isCheckingPoint",
    }),

    mainButtonLabel() {
      return this.enable ? this.$t("app.enable") : this.$t("app.disable");
    },
    currentStatusText() {
      return this.working
        ? this.$t("countdown.working")
        : this.$t("countdown.breaking");
    },
    counterStatusText() {
      switch (true) {
        case this.isNotifyPeriod:
          return this.$t("countdown.notifying");
        case this.isWorkingPeriod:
          return this.$t("countdown.working");
        case this.isBreakPeriod:
          return this.$t("countdown.breaking");
        default:
          return "???";
      }
    },
    nextBreakText() {
      return this.isWorkingPeriod
        ? this.$t("countdown.next_break_in") +
            " " +
            this.$moment.utc(this.timeLeftBeforeBreak * 1000).format("HH:mm:ss")
        : this.$t("countdown.end_break_in") +
            " " +
            this.$moment.utc(this.timeLeftToEndBreak * 1000).format("HH:mm:ss");
    },
    nextCamCheckText() {
      return (
        this.$t("countdown.next_cam_check_in") +
        " " +
        this.$moment.utc(this.timeLeftBeforeCheck * 1000).format("HH:mm:ss")
      );
    },
  },
  watch: {
    tictoc(val) {
      if (this.hasSetup && this.enable) {
        setTimeout(() => {
          this.tictoc = !this.tictoc;
          this.tick();
        }, 1000);
      }
    },
    hasSetup: {
      handler(val) {
        if (val) this.tictoc = !this.tictoc;
      },
      immediate: true,
    },
    enable: {
      handler(val) {
        if (val) this.tictoc = !this.tictoc;
      },
    },
    isCheckingPoint(val) {
      if (val) {
        this.setPlaying(true);
        setTimeout(() => {
          this.setPlaying(false);
          this.resetChecking();
          if (this.faceDetected) {
            this.work();
          } else {
            this.break();
          }
        }, 5000);
      }
    },
  },
  methods: {
    ...mapMutations({
      setPlaying: "camera/setPlaying",
      work: "countdown/working",
      break: "countdown/breaking",
      setup: "countdown/setup",
      resetChecking: "countdown/resetChecking",
    }),
    ...mapActions({
      tick: "countdown/tick",
    }),
    loadDefault() {
      this.$_.assign(this, DEFAULT_CONFIGS);
    },
    loadConfig() {
      const configData = Configs.load();
      const mountedData = this.$_.pick(configData, [
        "timeBetweenBreaks",
        "breakDuration",
        "timeBetweenChecks",
        "notifyBefore",
      ]);
      this.$_.assign(this, mountedData);
    },
    saveConfig() {
      Configs.save(
        this.$_.pick(this, [
          "timeBetweenBreaks",
          "breakDuration",
          "timeBetweenChecks",
          "notifyBefore",
        ])
      );
      this.setUpCounter();
    },
    setUpCounter() {
      this.setup({
        timeBetweenBreaks: convertDurationStringToSeconds(
          this.timeBetweenBreaks
        ),
        breakDuration: convertDurationStringToSeconds(this.breakDuration),
        timeBetweenChecks: convertDurationStringToSeconds(
          this.timeBetweenChecks
        ),
        notifyBefore: convertDurationStringToSeconds(this.notifyBefore),
      });
    },
  },
  mounted() {
    this.loadConfig();
    this.setUpCounter();
  },
};
</script>
