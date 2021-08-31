
module.exports = {
  vueFilesPath: './src/**/*.vue',
  languageFilesPath: './src/i18n/*.json',
  options: {
    output: false,
    add: true, // false | true => Use if you want to add missing keys into your json language files.
  }
};
