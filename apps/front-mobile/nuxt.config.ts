// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    [
      '@vee-validate/nuxt',
      {
        autoImport: true
      }
    ],
    'dayjs-nuxt',
    'nuxt-icon',
    '@nuxtjs/snipcart',
    '@pinia/nuxt',
    '@sidebase/nuxt-session',
    'nuxt-lodash',
    '@sfxcode/nuxt-primevue',
    '@nuxtjs/i18n'
  ],
  i18n: {
    vueI18n: './i18n.config.ts'
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' }
      ]
    }
  },

  auth: {
    // baseURL: process.env.NUXT_PUBLIC_API_BASE + '/', // An issue with nuxt-auth here: https://github.com/sidebase/nuxt-auth/issues/368
    baseURL: 'https://tickets.rklf.fr/api/',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/auth/login', method: 'post' },
        signOut: { path: '/auth/logout', method: 'post' },
        signUp: { path: '/users', method: 'post' },
        getSession: { path: '/auth/check', method: 'get' }
      },
      pages: {
        login: '/signin'
      },
      token: {
        signInResponseTokenPointer: '/accessToken',
        maxAgeInSeconds: 60 * 60 * 24 * 7
      }
    }
  },

  typescript: {
    shim: false
  },

  css: [
    '~/assets/css/main.scss',
    'primevue/resources/primevue.css',
    'primevue/resources/themes/soho-light/theme.css'
  ],

  build: {
    transpile: ['primevue', '@vee-validate/rules']
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      googleApiKey: ''
    }
  },

  dayjs: {
    locales: ['fr'],
    defaultLocale: 'fr',
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultTimezone: 'Europe/Paris'
  },

  snipcart: {
    publicApiKey: 'NjE1YWRlYmUtNDAxNS00NzhhLTlmYzUtNmE1MWQwYmFmZDYzNjM4MjEzMTY4OTU3MDI4Mzg2',
    templatesUrl: '/snipcart-custom.html',
    currency: 'EUR',
    language: 'fr',
    version: '3.6.0'
  },

  devtools: {
    enabled: true
  },
  tailwindcss: {
    exposeConfig: true
  }
})
