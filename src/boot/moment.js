import moment from 'moment';
import Quasar from 'quasar';
import Vue from 'vue';

export default async ({ ssrContext }) => {
  const isSSR = !!ssrContext;
  const defaultLocale = Quasar.lang.getLocale();
  const userLocale = !isSSR && localStorage.getItem('lang');
  const langIso = userLocale || defaultLocale;

  try {
    await import(
      /* webpackInclude: /(vi)\.js$/ */
      'moment/locale/' + langIso
    )
    moment.locale(langIso);
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }

  Vue.prototype.$moment = moment;
}
