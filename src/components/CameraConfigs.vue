<template>
  <q-expansion-item
    :label="$t('config_group.camera_configs')"
    :caption="$t('configs.camera_status') + ': ' + playPauseLabel"
    v-model="mPlayPause"
    expand-separator
    icon="videocam"
    header-class="text-primary text-body1"
  >
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <q-banner
            inline-actions
            class="text-white"
            :class="cameraStatusColor"
          >
            {{ cameraStatus }}
            <template v-slot:action v-if="humanMissingCounter">
              <q-btn
                flat
                disable
                color="white"
                :label="'x ' + humanMissingCounter"
              />
            </template>
          </q-banner>
          <div :class="{ hidden: !isPlaying, row: true }">
            <div class="col">
              <video
                width="480"
                height="360"
                ref="inputVideo"
                autoplay
                muted
                playsinline
                class="full-width"
              ></video>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "CameraConfigs",
  data() {
    return {
      stream: null,
      modelRef: null,

      mPlayPause: false,
    };
  },
  computed: {
    ...mapState({
      enable: (state) => state.countdown.enable,
      isPlaying: (state) => state.camera.isPlaying,
      humanDetected: (state) => state.camera.humanDetected,
      humanMissingCounter: (state) => state.countdown.humanMissingCounter,
    }),
    ...mapGetters({
      isCheckingPoint: "countdown/isCheckingPoint",
    }),
    playPauseLabel() {
      return this.isPlaying ? this.$t("configs.play") : this.$t("configs.stop");
    },
    cameraStatus() {
      return this.humanDetected
        ? this.$t("camera.human_detected")
        : this.$t("camera.human_undetected");
    },
    cameraStatusColor() {
      return this.humanDetected ? "bg-green" : "bg-red";
    },
  },
  watch: {
    mPlayPause(val) {
      this.setPlaying(val);
      if (!val) this.setEnable(val);
    },
    enable(val) {
      if (val) this.mPlayPause = val;
    },
    isPlaying(val) {
      if (val) {
        this.displayCamera().then();
      } else {
        this.turnOffCamera().then();
      }
    },
    async isCheckingPoint(val) {
      if (val && this.isPlaying) {
        const videoEl = this.$refs.inputVideo;

        if (!videoEl) return;

        if (!this.modelRef) {
          try {
            await this.loadModel();
          } catch (_) {
            // ignore
          }
        }

        if (!this.modelRef) return;

        let predictions = [];
        try {
          predictions = await this.modelRef.detect(videoEl);
        } catch (_) {
          //ignore
        }

        let foundPerson = false;
        for (let i = 0; i < predictions.length; i++) {
          if (predictions[i].class === "person") {
            foundPerson = true;
          }
        }

        this.setHumanDetected(foundPerson);

        if (foundPerson) {
          this.humanDetectedAction();
        } else {
          this.humanUndectectedAction();
        }
      }
      this.resetChecking();
    },
  },
  methods: {
    ...mapMutations({
      resetChecking: "countdown/resetChecking",
      setEnable: "countdown/setEnable",
      setPlaying: "camera/setPlaying",
      setHumanDetected: "camera/setHumanDetected",
    }),
    ...mapActions({
      humanDetectedAction: "countdown/humanDetectedAction",
      humanUndectectedAction: "countdown/humanUndectectedAction",
    }),
    async displayCamera() {
      if (this.stream) {
        await this.turnOffCamera();
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.stream = stream;
      const videoEl = this.$refs.inputVideo;
      videoEl.srcObject = stream;
    },
    async turnOffCamera() {
      if (this.stream) {
        this.stream.getVideoTracks()[0].stop();
      }
      const videoEl = this.$refs.inputVideo;
      videoEl.srcObject = null;
    },
    async loadModel() {
      this.$q.loading.show({
        message: this.$t("message.lib_loading"),
      });

      const model = await cocoSsd.load();
      this.modelRef = model;

      this.$q.loading.hide();
    },
  },
};
</script>
