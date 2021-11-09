<template>
  <q-page class="q-pa-lg">
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
import { NOTIFY_TYPES } from "src/utils/constants";
import { convertSecondsToTimeDigital } from "src/utils/time";

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
      isWorkingPeriod: "countdown/isWorkingPeriod",
      timeLeftBeforeBreak: "countdown/timeLeftBeforeBreak",
      timeLeftToEndBreak: "countdown/timeLeftToEndBreak",
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
        this.notify(NOTIFY_TYPES.NOTIFY_BREAK);
      }
    },
    isEndOfBreak(val) {
      if (val) {
        this.notify(NOTIFY_TYPES.END_BREAK);
      }
    },
  },
  methods: {
    ...mapActions({
      tick: "countdown/tick",
      soundNotify: "sounds/notify",
    }),
    notify(type) {
      const url = `#/notify?type=${type}`;
      if (this.$q.platform.is.electron) {
        const { ipcRenderer } = require("electron");
        ipcRenderer.send("alert", url);
      } else {
        window.open(
          "/" + url,
          "_blank",
          "top=400,left=300,width=500,height=200,frame=false"
        );
      }

      this.soundNotify();
    },
  },
  mounted() {
    if (this.$q.platform.is.electron) {
      const { ipcRenderer } = require("electron");
      ipcRenderer.on("tray-click", (event, message) => {
        const showAppMessage = this.$t("menu.show-app");
        const breakMessage = this.isWorkingPeriod
          ? this.$t("countdown.next_break_in") +
            " " +
            convertSecondsToTimeDigital(this.timeLeftBeforeBreak)
          : this.$t("countdown.end_break_in") +
            " " +
            convertSecondsToTimeDigital(this.timeLeftToEndBreak);
        const quitMessage = this.$t("menu.quit");

        ipcRenderer.send("tray-menu", {
          showAppMessage,
          breakMessage,
          quitMessage,
        });
      });
    }
  },
};
</script>
