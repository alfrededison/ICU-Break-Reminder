<template>
  <q-expansion-item
    :label="$t('config_group.sound_configs')"
    expand-separator
    icon="notifications"
    header-class="text-primary text-body1"
  >
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="row q-gutter-md">
            <div class="col">
              <q-btn
                color="secondary"
                class="full-width"
                :label="$t('configs.test_notification')"
                @click="testNotification"
              />
            </div>
            <div class="col">
              <q-btn
                color="accent"
                class="full-width"
                :label="$t('configs.test_alarm')"
                @click="testAlarm"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
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
    this.setNotificationSound("sounds/notification.wav");
    this.setAlarmSound("sounds/alarm.wav");
  },
};
</script>
