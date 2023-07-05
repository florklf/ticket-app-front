// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    [
      '@vee-validate/nuxt',
      {
        autoImport: true
      }
    ],
    'dayjs-nuxt',
    '@nuxtjs/i18n',
    '@nuxt/devtools',
    'nuxt-mapbox'
  ],
  app: {
    head: {
      title: 'Sakai Vue',
      link: [
        {
          id: 'theme-css',
          rel: 'stylesheet',
          type: 'text/css',
          href: 'themes/lara-light-indigo/theme.css'
        }
      ]
    }
  },
  mapbox: {
    accessToken: 'pk.eyJ1IjoiemVkbGlrZSIsImEiOiJjbGpuNDV3czQweGMzM2xyN2s1Y3JlNnJ0In0.wPMaPeA9AVBsDennj2p6fQ'
  },
  build: {
    transpile: ['primevue']
  },
  dayjs: {
    locales: ['fr'],
    defaultLocale: 'fr',
    plugins: ['weekOfYear', 'advancedFormat', 'advancedFormat', 'isoWeek', 'localeData']
  },
  css: ['primeicons/primeicons.css', 'primeflex/primeflex.scss', 'primevue/resources/primevue.min.css', '@/assets/styles.scss'],
  auth: {
    baseURL: process.env.NODE_ENV === 'production' ? 'https://tickets.rklf.fr/api/auth' : process.env.NUXT_PUBLIC_API_BASE + '/auth',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: { path: '/users', method: 'post' },
        getSession: { path: '/check', method: 'get' }
      },
      pages: {
        login: '/signin'
      },
      token: {
        signInResponseTokenPointer: '/accessToken',
        maxAgeInSeconds: 60 * 60 * 24 * 7
      }
    },
    globalAppMiddleware: {
      isEnabled: true
    }
  },
  devServer: {
    port: 3003,
    url: process.env.BASE_URL
  },
  runtimeConfig: {
    public: {
      apiBase: '',
      localExposedApiUrl: '',
      googleApiKey: ''
    }
  },
  i18n: {
    vueI18n: './i18n.config.ts'
  },
  typescript: {
    shim: false
  }
})
