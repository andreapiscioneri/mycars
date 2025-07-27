// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',

  devtools: {
    enabled: true,
  },

  css: [
    '~/assets/css/responsive.css'
  ],

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ]
    },
  },

  modules: [
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',

    '@nuxtjs/i18n',
  ],
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'it',
    lazy: true,
    //langDir: 'i18n/locales',
    //reloadOnLanguageSwitch: true, // 🔥 chiave per risolvere il problema
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'it',
    },
    locales: [
      { code: 'it', name: 'Italiano', file: 'it.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
  },
})
