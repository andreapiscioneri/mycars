// i18n.config.ts
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  lazy: true,
  langDir: 'locales/',
  locales: [
    {
      code: 'en',
      name: 'English',
      iso: 'en-US',
      file: 'en.json'
    },
    {
      code: 'it',
      name: 'Italiano',
      iso: 'it-IT',
      file: 'it.json'
    }
  ]
}))
