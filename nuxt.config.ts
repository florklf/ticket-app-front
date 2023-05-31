
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
    ]
  ],
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
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.css'
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
      apiBase: ''
    }
  }
})
