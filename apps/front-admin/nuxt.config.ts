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
    '@nuxt/devtools'
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
  typescript: {
    shim: false
  }
})
