<template>
  <q-page class="q-pa-lg">
    <h5 class="q-mt-none">{{ $t("pages.dashboard") }}</h5>
    <counter-status />
    <camera-configs />
    <break-configs />
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import CameraConfigs from "src/components/CameraConfigs.vue";
import BreakConfigs from "src/components/BreakConfigs.vue";
import CounterStatus from "src/components/CounterStatus.vue";

export default {
  components: { CounterStatus, CameraConfigs, BreakConfigs },
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
      resetChecking: "countdown/resetChecking",
    }),
    ...mapActions({
      tick: "countdown/tick",
    }),
  },
};
</script>
