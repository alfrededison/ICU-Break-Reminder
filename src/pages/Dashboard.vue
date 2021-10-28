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
import { mapActions, mapGetters, mapState } from "vuex";
import CameraConfigs from "src/components/CameraConfigs.vue";
import BreakConfigs from "src/components/BreakConfigs.vue";
import CounterStatus from "src/components/CounterStatus.vue";
import SoundConfigs from "src/components/SoundConfigs.vue";

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
    }),
    ...mapGetters({
      hasSetup: "countdown/hasSetup",
      isEndOfBreak: "countdown/isEndOfBreak",
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
    isNotifyPeriod(val) {
      if (val) {
        this.notify();
      }
    },
    isEndOfBreak(val) {
      if (val) {
        this.notify();
      }
    },
  },
  methods: {
    ...mapActions({
      tick: "countdown/tick",
      soundNotify: "sounds/notify",
    }),
    notify() {
      if (this.$q.platform.is.electron) {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("alert", "#/popup/notify");
      } else {
        window.open(
          "/#/popup/notify",
          "_blank",
          "top=400,left=300,width=500,height=200,frame=false"
        );
      }

      this.soundNotify();
    },
  },
};
</script>
