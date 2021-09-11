<template>
  <div class="q-gutter-md">
    <div class="row">
      <div class="col">
        <div class="text-h5 text-primary">
          {{ $t("config_group.sound_configs") }}
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-btn
          color="secondary"
          :label="$t('configs.test_notification')"
          @click="testNotification"
        />
      </div>
      <div class="col">
        <q-btn
          color="accent"
          :label="$t('configs.test_alarm')"
          @click="testAlarm"
        />
      </div>
    </div>
  </div>
</template>

<script>
const playAudio = (file) => {
  const music = new Audio(file);
  music.play();
  return music;
}

export default {
  name: "SoundConfigs",
  data() {
    return {};
  },
  methods: {
    testAlarm() {
      playAudio('/sounds/alarm.wav');
    },
    testNotification() {
      playAudio('/sounds/notification.wav');
    },
  },
};
</script>
