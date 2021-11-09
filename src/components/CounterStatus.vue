<template>
  <q-expansion-item
    :default-opened="true"
    expand-separator
    header-class="text-primary text-body1"
  >
    <template v-slot:header>
      <q-item-section avatar>
        <q-icon name="schedule" />
      </q-item-section>

      <q-item-section>{{ $t("config_group.counter") }}</q-item-section>

      <q-item-section side>
        <q-toggle
          color="secondary"
          :disabled="!hasSetup"
          v-model="mEnable"
          :label="mainButtonLabel"
        />
      </q-item-section>
    </template>
    <q-card>
      <q-card-section>
        <div class="q-gutter-md">
          <div class="row">
            <div class="col">
              <q-btn-group class="full-width">
                <q-btn
                  disable
                  glossy
                  no-caps
                  class="full-width"
                  text-color="black"
                  color="yellow"
                  :label="currentStatusText"
                />
                <q-btn
                  disable
                  glossy
                  no-caps
                  class="full-width"
                  text-color="black"
                  color="amber"
                  :label="counterStatusText"
                />
              </q-btn-group>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-btn-group class="full-width">
                <q-btn
                  disable
                  glossy
                  no-caps
                  class="full-width"
                  text-color="black"
                  color="orange"
                  :label="nextBreakText"
                />
                <q-btn
                  disable
                  glossy
                  no-caps
                  class="full-width"
                  text-color="black"
                  color="brown-5"
                  :label="nextCamCheckText"
                />
              </q-btn-group>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { convertSecondsToTimeDigital } from "src/utils/time";
import { mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "CounterStatus",
  data() {
    return {
      mEnable: false,
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
            convertSecondsToTimeDigital(this.timeLeftBeforeBreak)
        : this.$t("countdown.end_break_in") +
            " " +
            convertSecondsToTimeDigital(this.timeLeftToEndBreak);
    },
    nextCamCheckText() {
      return (
        this.$t("countdown.next_cam_check_in") +
        " " +
        convertSecondsToTimeDigital(this.timeLeftBeforeCheck)
      );
    },
  },
  watch: {
    mEnable(val) {
      this.setEnable(val);
    },
    enable(val) {
      this.mEnable = val;
    },
  },
  methods: {
    ...mapMutations({
      setEnable: "countdown/setEnable",
    }),
  },
};
</script>
