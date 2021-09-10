<template>
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
          v-model="mEnable"
          :label="mainButtonLabel"
        />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-btn-group class="q-mb-md">
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
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "CounterStatus",
  data() {
    return {
      mEnable: true,
    };
  },
  computed: {
    ...mapState({
      enable: (state) => state.countdown.enable,
      working: (state) => state.countdown.working,
      isPlaying: (state) => state.camera.isPlaying,
    }),
    ...mapGetters({
      hasSetup: "countdown/hasSetup",
      timeLeftBeforeBreak: "countdown/timeLeftBeforeBreak",
      timeLeftToEndBreak: "countdown/timeLeftToEndBreak",
      timeLeftBeforeCheck: "countdown/timeLeftBeforeCheck",
      isWorkingPeriod: "countdown/isWorkingPeriod",
      isNotifyPeriod: "countdown/isNotifyPeriod",
      isBreakPeriod: "countdown/isBreakPeriod",
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
    mEnable(val) {
      this.setEnable(val);
    },
  },
  methods: {
    ...mapMutations({
      setEnable: "countdown/setEnable",
    }),
  },
};
</script>
