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
          <span class="text-body1">{{ $t("configs.camera_status") }}: </span>
          <q-chip :color="cameraStatusColor" text-color="white">{{
            cameraStatus
          }}</q-chip>
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
import * as faceapi from "face-api.js";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { convertDurationStringToSeconds } from "src/utils/time";
import * as Configs from "src/utils/configs";

const SSD_MOBILENETV1 = "ssd_mobilenetv1";
const TINY_FACE_DETECTOR = "tiny_face_detector";

const DEFAULT_CONFIGS = {
  timeBetweenBreaks: "02000",
  breakDuration: "0020",
  timeBetweenChecks: "100",
  notifyBefore: "10",
};

export default {
  name: "Dashboard",
  data() {
    return {
      SSD_MOBILENETV1: SSD_MOBILENETV1,
      TINY_FACE_DETECTOR: TINY_FACE_DETECTOR,

      enable: true,
      isPlaying: false,
      stream: null,
      faceDetected: false,
      tictoc: false,

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

      timeBetweenBreaks: DEFAULT_CONFIGS.timeBetweenBreaks,
      breakDuration: DEFAULT_CONFIGS.breakDuration,
      timeBetweenChecks: DEFAULT_CONFIGS.timeBetweenChecks,
      notifyBefore: DEFAULT_CONFIGS.notifyBefore,
    };
  },
  computed: {
    ...mapState({
      working: (state) => state.countdown.working,
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
    playPauseLabel() {
      return this.isPlaying ? this.$t("configs.stop") : this.$t("configs.play");
    },
    cameraStatus() {
      return this.faceDetected
        ? this.$t("camera.face_detected")
        : this.$t("camera.face_undeteccted");
    },
    cameraStatusColor() {
      return this.faceDetected ? "green" : "red";
    },
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
    selectedFaceDetector(val) {
      if (!this.isFaceDetectionModelLoaded()) {
        this.getCurrentFaceDetectionNet().load("/weights").then();
      }
    },
    isPlaying(val) {
      if (val) {
        this.displayCamera().then();
      } else {
        this.turnOffCamera().then();
      }
    },
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
        this.isPlaying = true;
        setTimeout(() => {
          this.isPlaying = false;
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
    detectorMode(val) {
      return this.selectedFaceDetector === val;
    },
    playPause() {
      this.isPlaying = !this.isPlaying;
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
        this.faceDetected = true;
        const canvas = this.$refs.overlay;
        const dims = faceapi.matchDimensions(canvas, videoEl, false);
        faceapi.draw.drawDetections(
          canvas,
          faceapi.resizeResults(result, dims)
        );
      } else {
        this.faceDetected = false;
      }

      setTimeout(() => this.onPlay());
    },
  },
  mounted() {
    this.selectedFaceDetector = TINY_FACE_DETECTOR;
    this.selectedInputSize = 128;

    this.loadConfig();
    this.setUpCounter();
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
