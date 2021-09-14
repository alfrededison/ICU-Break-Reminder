<template>
  <div class="q-gutter-md q-mt-md">
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
</template>

<script>
import { mapMutations } from "vuex";
import { convertDurationStringToSeconds } from "src/utils/time";
import * as Configs from "src/utils/configs";

const DEFAULT_CONFIGS = {
  timeBetweenBreaks: "02000",
  breakDuration: "0020",
  timeBetweenChecks: "100",
  notifyBefore: "10",
};

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
