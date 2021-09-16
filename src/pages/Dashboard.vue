<template>
  <q-page class="q-pa-lg">
    <h5 class="q-mt-none">{{ $t("pages.dashboard") }}</h5>
    <counter-status />
    <camera-configs />
    <break-configs />
    <sound-configs />
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import CameraConfigs from "src/components/CameraConfigs.vue";
import BreakConfigs from "src/components/BreakConfigs.vue";
import CounterStatus from "src/components/CounterStatus.vue";
import SoundConfigs from "src/components/SoundConfigs.vue";
import { DEFAULT_OPTIONS } from "src/utils/defaults";

export default {
  components: { CounterStatus, CameraConfigs, BreakConfigs, SoundConfigs },
  name: "Dashboard",
  data() {
    return {
      tictoc: false,
    };
  },
  computed: {
    ...mapState({
      enable: (state) => state.countdown.enable,
      faceDetected: (state) => state.camera.faceDetected,
    }),
    ...mapGetters({
      hasSetup: "countdown/hasSetup",
      isCheckingPoint: "countdown/isCheckingPoint",
      isNotifyPeriod: "countdown/isNotifyPeriod",
    }),
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
            this.faceDetectedAction();
          } else {
            this.faceUndectectedAction();
          }
        }, DEFAULT_OPTIONS.cameraCheckTime);
      }
    },
    isNotifyPeriod(val) {
      if (val) {
        this.notify();
      }
    },
  },
  methods: {
    ...mapMutations({
      setPlaying: "camera/setPlaying",
      resetChecking: "countdown/resetChecking",
    }),
    ...mapActions({
      faceDetectedAction: "countdown/faceDetectedAction",
      faceUndectectedAction: "countdown/faceUndectectedAction",
      tick: "countdown/tick",
      notify: "sounds/notify",
    }),
  },
};
</script>
