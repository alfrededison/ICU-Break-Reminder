<template>
  <q-page class="q-pa-lg">
    <q-banner inline-actions class="text-white bg-red">
      {{ $t("popup.notify") }}
      <template v-slot:action>
        <q-btn flat color="white" label="OK" @click="close"/>
      </template>
    </q-banner>
  </q-page>
</template>

<script>
export default {
  name: "Notify",
  methods: {
    close() {
      window.close();
    }
  }
};
</script>
