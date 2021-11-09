import Quasar from 'quasar';

export default async ({ ssrContext }) => {
  const isSSR = !!ssrContext;
  const defaultLocale = Quasar.lang.getLocale();
  const userLocale = !isSSR && localStorage.getItem('lang');
  const langIso = userLocale || defaultLocale;

  try {
    const lang = await import(
      /* webpackInclude: /(en-us|vi)\.js$/ */
      'quasar/lang/' + langIso
    )
    Quasar.lang.set(lang.default);
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
  }
}
