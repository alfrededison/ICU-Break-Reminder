<template>
  <q-page class="q-pa-lg">
    <h5 class="q-mt-none">{{ $t("pages.dashboard") }}</h5>
    <div class="q-gutter-md">
      <div class="row">
        <div class="col">
          <div>
            <video
              onloadedmetadata="onPlay(this)"
              id="inputVideo"
              autoplay
              muted
              playsinline
            ></video>
            <canvas id="overlay" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <q-select
            emit-value
            map-options
            outlined
            v-model="selectFaceDetector"
            :options="selectFaceDetectorOptions"
            :label="$t('configs.select_face_detector')"
          />
        </div>
        <div class="col">
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
            v-model="selectInputSize"
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
    </div>
  </q-page>
</template>

<script>
const SSD_MOBILENETV1 = "ssd_mobilenetv1";
const TINY_FACE_DETECTOR = "tiny_face_detector";

export default {
  name: "Dashboard",
  data() {
    return {
      SSD_MOBILENETV1: SSD_MOBILENETV1,
      TINY_FACE_DETECTOR: TINY_FACE_DETECTOR,

      selectFaceDetector: null,
      selectFaceDetectorOptions: [
        { label: "SSD Mobilenet V1", value: SSD_MOBILENETV1 },
        { label: "Tiny Face Detector", value: TINY_FACE_DETECTOR },
      ],
      minConfidence: 0.5,
      selectInputSize: "",
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
    };
  },
  methods: {
    detectorMode(val) {
      return this.selectFaceDetector === val;
    },
  },
  mounted() {
    this.selectFaceDetector = TINY_FACE_DETECTOR;
    this.selectInputSize = 128;
  }
};
</script>

<style scoped lang="scss">
</style>
