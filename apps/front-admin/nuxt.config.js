// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: false,
  modules: [
    '@sidebase/nuxt-auth',
    [
      '@vee-validate/nuxt',
      {
        autoImport: true
      }
    ],
    'dayjs-nuxt',
    '@nuxtjs/i18n'
  ],
  app: {
    head: {
      title: 'Sakai Vue',
      link: [
        {
          id: 'theme-css',
          rel: 'stylesheet',
          type: 'text/css',
          href: '/themes/lara-light-indigo/theme.css'
        }
      ]
    }
  },
  build: {
    transpile: ['primevue']
  },
  script: [
    {
      strategy: 'lazyOnload',
      src: 'https://www.googletagmanager.com/gtag/js?id=UA-93461466-1'
    },
    {
      id: 'ga-analytics',
      strategy: 'lazyOnload',
      children: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-93461466-1');
          `
    }
  ],
  css: ['primeicons/primeicons.css', 'primeflex/primeflex.scss', 'primevue/resources/primevue.min.css', '@/assets/styles.scss'],
  auth: {
    baseURL: process.env.NUXT_PUBLIC_API_BASE + '/',
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
  }
})
