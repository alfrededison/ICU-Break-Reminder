<template>
  <div class="q-gutter-md q-mt-md">
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
import { mapMutations, mapActions } from "vuex";

export default {
  name: "SoundConfigs",
  data() {
    return {};
  },
  methods: {
    ...mapMutations({
      setNotificationSound: "sounds/setNotificationSound",
      setAlarmSound: "sounds/setAlarmSound",
    }),
    ...mapActions({
      notify: "sounds/notify",
      testAlert: "sounds/testAlert",
    }),
    testAlarm() {
      this.testAlert();
    },
    testNotification() {
      this.notify();
    },
  },
  mounted() {
    this.setNotificationSound("/sounds/notification.wav");
    this.setAlarmSound("/sounds/alarm.wav");
  },
};
</script>
