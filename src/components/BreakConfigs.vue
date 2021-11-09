<template>
  <q-expansion-item
    :label="$t('config_group.break_configs')"
    :caption="summary"
    expand-separator
    icon="timer"
    header-class="text-primary text-body1"
  >
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="row q-gutter-md">
            <div class="col">
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
            <div class="col">
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
          <div class="row q-gutter-md">
            <div class="col">
              <q-btn
                color="primary"
                class="full-width full-height"
                :label="$t('configs.save')"
                @click="saveConfig"
              />
            </div>
            <div class="col">
              <q-btn
                color="warning"
                class="full-width full-height"
                :label="$t('configs.reload_configs')"
                @click="loadConfig"
              />
            </div>
            <div class="col">
              <q-btn
                color="negative"
                class="full-width full-height"
                :label="$t('configs.load_default')"
                @click="loadDefault"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { mapMutations } from "vuex";
import {
  convertDurationStringToSeconds,
  convertSecondsToDuration,
} from "src/utils/time";
import * as Configs from "src/utils/configs";
import { DEFAULT_CONFIGS } from "src/utils/defaults";

export default {
  name: "BreakConfigs",
  data() {
    return {
      timeBetweenBreaks: DEFAULT_CONFIGS.timeBetweenBreaks,
      breakDuration: DEFAULT_CONFIGS.breakDuration,
      timeBetweenChecks: DEFAULT_CONFIGS.timeBetweenChecks,
      notifyBefore: DEFAULT_CONFIGS.notifyBefore,
    };
  },
  computed: {
    summary() {
      return (
        this.$t("configs.work") +
        " " +
        convertSecondsToDuration(
          convertDurationStringToSeconds(this.timeBetweenBreaks)
        ) +
        ", " +
        this.$t("configs.break") +
        " " +
        convertSecondsToDuration(
          convertDurationStringToSeconds(this.breakDuration)
        )
      );
    },
  },
  methods: {
    ...mapMutations({
      setup: "countdown/setup",
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
  },
  mounted() {
    this.loadConfig();
    this.setUpCounter();
  },
};
</script>
