<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <q-img src="logo.png" />
          </q-avatar>
          {{ $t("title") }}
        </q-toolbar-title>
        <q-select
          v-model="lang"
          :label="$t('drawer.language')"
          :options="langOptions"
          label-color="white"
          color="primary"
          borderless
          emit-value
          map-options
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import languages from "quasar/lang/index.json";

const appLanguages = languages.filter((lang) =>
  ["en-us", "vi"].includes(lang.isoName)
);

export default {
  name: "HomeLayout",
  data() {
    return {
      lang: this.$i18n.locale,
      langOptions: [],
    };
  },
  watch: {
    lang(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("lang", lang);

      this.$moment.locale(lang);

      import(
        /* webpackInclude: /(en-us|vi)\.js$/ */
        "quasar/lang/" + lang
      ).then((lang) => {
        this.$q.lang.set(lang.default);
      });
    },
  },
  created() {
    this.langOptions = appLanguages.map((lang) => ({
      label: lang.nativeName,
      value: lang.isoName,
    }));
  },
};
</script>
