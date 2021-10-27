<template>
  <div class="q-gutter-md q-mt-md">
    <div class="row">
      <div class="col">
        <div class="text-h5 text-primary">
          {{ $t("config_group.camera_configs") }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-btn color="primary" :label="playPauseLabel" @click="playPause" />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <span class="text-body1">{{ $t("configs.camera_status") }}: </span>
        <q-chip :color="cameraStatusColor" text-color="white">
          {{ cameraStatus }}
        </q-chip>
        <q-chip v-if="humanMissingCounter" color="red" text-color="white">
          x{{ humanMissingCounter }}
        </q-chip>
      </div>
    </div>
    <div :class="{ hidden: !isPlaying, row: true }">
      <div class="col">
        <video
          width="480"
          height="360"
          @loadedmetadata="onPlay"
          ref="inputVideo"
          autoplay
          muted
          playsinline
        ></video>
      </div>
    </div>
  </div>
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
    };
  },
  computed: {
    ...mapState({
      isPlaying: (state) => state.camera.isPlaying,
      humanDetected: (state) => state.camera.humanDetected,
      humanMissingCounter: (state) => state.countdown.humanMissingCounter,
    }),
    ...mapGetters({
      isCheckingPoint: "countdown/isCheckingPoint",
    }),
    playPauseLabel() {
      return this.isPlaying ? this.$t("configs.stop") : this.$t("configs.play");
    },
    cameraStatus() {
      return this.humanDetected
        ? this.$t("camera.human_detected")
        : this.$t("camera.human_undetected");
    },
    cameraStatusColor() {
      return this.humanDetected ? "green" : "red";
    },
  },
  watch: {
    isPlaying(val) {
      if (val) {
        this.displayCamera().then();
      } else {
        this.turnOffCamera().then();
      }
    },
  },
  methods: {
    ...mapMutations({
      resetChecking: "countdown/resetChecking",
      setPlaying: "camera/setPlaying",
      setHumanDetected: "camera/setHumanDetected",
    }),
    ...mapActions({
      humanDetectedAction: "countdown/humanDetectedAction",
      humanUndectectedAction: "countdown/humanUndectectedAction",
    }),
    playPause() {
      this.setPlaying(!this.isPlaying);
    },
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
    async onPlay() {
      if (!this.isPlaying) return;

      const videoEl = this.$refs.inputVideo;

      if (videoEl && this.modelRef && this.isCheckingPoint) {
        const predictions = await this.modelRef.detect(videoEl);

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
        this.resetChecking();
      }
      requestAnimationFrame(() => this.onPlay());
    },
  },
  mounted() {
    cocoSsd.load().then((model) => {
      this.modelRef = model;
    });
  },
};
</script>
