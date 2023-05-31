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
    '@sfxcode/nuxt-primevue'
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  auth: {
    baseURL: 'http://localhost:3000/',
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
    transpile: ['primevue']
  },

  devServer: {
    port: 3002,
    url: process.env.BASE_URL
  },

  runtimeConfig: {
    public: {
      apiBase: '',
      localExposedApiUrl: ''
    }
  },

  dayjs: {
    locales: ['fr'],
    defaultLocale: 'fr',
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultTimezone: 'Europe/Paris'
  },

  snipcart: {
    publicApiKey: process.env.SNIPCART_API_KEY,
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
