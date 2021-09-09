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
          <q-btn
            color="secondary"
            :label="mainButtonLabel"
            @click="mainButtonHandler"
          />
        </div>
      </div>
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
      <div :class="{ hidden: !isPlaying, row: true }">
        <div class="col">
          <div class="camera-container">
            <video
              width="480"
              height="360"
              @loadedmetadata="onPlay"
              ref="inputVideo"
              autoplay
              muted
              playsinline
            ></video>
            <canvas ref="overlay" class="overlay" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-select
            emit-value
            map-options
            outlined
            v-model="selectedFaceDetector"
            :options="selectFaceDetectorOptions"
            :label="$t('configs.select_face_detector')"
          />
        </div>
      </div>
      <div class="row q-gutter-md">
        <div class="col q-ml-none">
          <q-input
            outlined
            v-model="time"
            :label="$t('configs.time')"
            disable
          />
        </div>
        <div class="col">
          <q-input
            outlined
            v-model="fps"
            :label="$t('configs.estimated_fps')"
            disable
          />
        </div>
      </div>
      <div class="row" v-if="detectorMode(SSD_MOBILENETV1)">
        <div class="col">
          <div class="text-body1">{{ $t("configs.min_confidence") }}</div>
          <q-slider
            v-model="minConfidence"
            :min="0.1"
            :max="1.0"
            :step="0.1"
            label
            label-always
          />
        </div>
      </div>
      <div class="row" v-if="detectorMode(TINY_FACE_DETECTOR)">
        <div class="col">
          <q-select
            emit-value
            map-options
            outlined
            v-model="selectedInputSize"
            :options="selectInputSizeOptions"
            :label="$t('configs.input_size')"
          />
        </div>
      </div>
      <div class="row" v-if="detectorMode(TINY_FACE_DETECTOR)">
        <div class="col">
          <div class="text-body1">{{ $t("configs.score_threshold") }}</div>
          <q-slider
            v-model="scoreThreshold"
            :min="0.1"
            :max="1.0"
            :step="0.1"
            label
            label-always
          />
        </div>
      </div>
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
            :hint="$t('configs.full_duration_format')"
            :label="$t('configs.time_between_breaks')"
          />
        </div>
        <div class="col">
          <q-input
            outlined
            v-model="breakDuration"
            mask="#:##:##"
            unmasked-value
            :hint="$t('configs.full_duration_format')"
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
            :hint="$t('configs.compact_duration_format')"
            :label="$t('configs.time_between_checks')"
          />
        </div>
        <div class="col">
          <q-input
            outlined
            v-model="notifyBefore"
            mask="##"
            unmasked-value
            :hint="$t('configs.minimal_duration_format')"
            :label="$t('configs.notify_before')"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import * as faceapi from "face-api.js";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { convertDurationStringToSeconds } from "src/utils/time";

const SSD_MOBILENETV1 = "ssd_mobilenetv1";
const TINY_FACE_DETECTOR = "tiny_face_detector";

export default {
  name: "Dashboard",
  data() {
    return {
      SSD_MOBILENETV1: SSD_MOBILENETV1,
      TINY_FACE_DETECTOR: TINY_FACE_DETECTOR,

      isPlaying: false,
      stream: null,

      selectedFaceDetector: "",
      selectFaceDetectorOptions: [
        { label: "SSD Mobilenet V1", value: SSD_MOBILENETV1 },
        { label: "Tiny Face Detector", value: TINY_FACE_DETECTOR },
      ],
      minConfidence: 0.5,
      selectedInputSize: "",
      selectInputSizeOptions: [
        { value: 128, label: "128 x 128" },
        { value: 160, label: "160 x 160" },
        { value: 224, label: "224 x 224" },
        { value: 320, label: "320 x 320" },
        { value: 416, label: "416 x 416" },
        { value: 512, label: "512 x 512" },
        { value: 608, label: "608 x 608" },
      ],
      scoreThreshold: 0.5,
      time: "-",
      fps: "-",

      timeBetweenBreaks: "02000",
      breakDuration: "00020",
      timeBetweenChecks: "100",
      notifyBefore: "10",
    };
  },
  computed: {
    ...mapState({
      working: (state) => state.countdown.working,
    }),
    ...mapGetters({
      hasSetup: "countdown/hasSetup",
    }),
    playPauseLabel() {
      return this.isPlaying ? this.$t("configs.stop") : this.$t("configs.play");
    },
    mainButtonLabel() {
      switch (true) {
        case !this.hasSetup:
          return this.$t("configs.init");
        case this.working:
          return this.$t("configs.pause");
        case !this.working:
          return this.$t("configs.resume");
        default:
          return "???";
      }
    },
  },
  watch: {
    selectedFaceDetector(val) {
      if (!this.isFaceDetectionModelLoaded()) {
        this.getCurrentFaceDetectionNet().load("/weights").then();
      }
    },
  },
  methods: {
    ...mapMutations({
      work: "countdown/working",
      break: "countdown/breaking",
      setup: "countdown/setup",
    }),
    ...mapActions({
      tick: "countdown/tick",
    }),
    mainButtonHandler() {
      switch (true) {
        case !this.hasSetup:
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
          break;
        case this.working:
          this.break();
          break;
        case !this.working:
          this.work();
          break;
        default:
          break;
      }
    },
    detectorMode(val) {
      return this.selectedFaceDetector === val;
    },
    playPause() {
      this.isPlaying = !this.isPlaying;

      if (this.isPlaying) {
        this.displayCamera().then();
      } else {
        this.turnOffCamera().then();
      }
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
    getFaceDetectorOptions() {
      switch (this.selectedFaceDetector) {
        case SSD_MOBILENETV1:
          return new faceapi.SsdMobilenetv1Options({
            minConfidence: this.minConfidence,
          });
        case TINY_FACE_DETECTOR:
          return new faceapi.TinyFaceDetectorOptions({
            inputSize: this.selectedInputSize,
            scoreThreshold: this.scoreThreshold,
          });
      }
    },
    getCurrentFaceDetectionNet() {
      switch (this.selectedFaceDetector) {
        case SSD_MOBILENETV1:
          return faceapi.nets.ssdMobilenetv1;
        case TINY_FACE_DETECTOR:
          return faceapi.nets.tinyFaceDetector;
      }
    },
    isFaceDetectionModelLoaded() {
      return !!this.getCurrentFaceDetectionNet().params;
    },
    updateTimeStats(timeInMs) {
      let forwardTimes = [];
      forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
      const avgTimeInMs =
        forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
      this.time = `${Math.round(avgTimeInMs)} ms`;
      this.fps = `${faceapi.utils.round(1000 / avgTimeInMs)}`;
    },
    async onPlay() {
      const videoEl = this.$refs.inputVideo;

      if (videoEl.paused || videoEl.ended || !this.isFaceDetectionModelLoaded())
        return setTimeout(() => this.onPlay());

      const options = this.getFaceDetectorOptions();

      const ts = Date.now();

      const result = await faceapi.detectSingleFace(videoEl, options);

      this.updateTimeStats(Date.now() - ts);

      if (result) {
        const canvas = this.$refs.overlay;
        const dims = faceapi.matchDimensions(canvas, videoEl, false);
        faceapi.draw.drawDetections(
          canvas,
          faceapi.resizeResults(result, dims)
        );
      }

      setTimeout(() => this.onPlay());
    },
  },
  mounted() {
    this.selectedFaceDetector = TINY_FACE_DETECTOR;
    this.selectedInputSize = 128;
  },
};
</script>

<style scoped lang="scss">
.camera-container {
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
