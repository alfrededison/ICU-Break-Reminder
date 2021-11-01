<template>
  <q-page class="q-pa-lg">
    <q-banner inline-actions class="text-white" :class="bannerColor">
      {{ bannerMessage }}
      <template v-slot:action>
        <q-btn flat color="white" label="OK" @click="close" />
      </template>
    </q-banner>
  </q-page>
</template>

<script>
import { NOTIFY_TYPES } from "src/utils/constants";

export default {
  name: "Notify",
  props: {
    type: String,
  },
  methods: {
    close() {
      window.close();
    },
  },
  computed: {
    bannerColor() {
      switch (this.type) {
        case NOTIFY_TYPES.NOTIFY_BREAK:
          return "bg-red";
        case NOTIFY_TYPES.END_BREAK:
          return "bg-green";
        default:
          return "bg-primary";
      }
    },
    bannerMessage() {
      switch (this.type) {
        case NOTIFY_TYPES.NOTIFY_BREAK:
          return this.$t("message.notifyBreak");
        case NOTIFY_TYPES.END_BREAK:
          return this.$t("message.endBreak");
        default:
          return "";
      }
    },
  },
};
</script>
