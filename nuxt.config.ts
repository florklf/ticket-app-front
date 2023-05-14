// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth',
    '@nuxtjs/tailwindcss',
    '@huntersofbook/naive-ui-nuxt'
  ],
  typescript: {
    shim: false
  },
  css: [
    '~/assets/css/main.scss'
  ]
})
