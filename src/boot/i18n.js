import Quasar from 'quasar';
import messages from 'src/i18n';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const defaultLocale = Quasar.lang.getLocale();
const userLocale = typeof window !== 'undefined' && localStorage.getItem('lang');
console.log('locale', userLocale, defaultLocale);

const i18n = new VueI18n({
  locale: userLocale || defaultLocale,
  fallbackLocale: 'en-us',
  messages
});

export default ({app}) => {
  // Set i18n instance on app
  app.i18n = i18n;
}

export {i18n};
