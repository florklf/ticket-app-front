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
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt',
    'nuxt-mapbox'
  ],
  mapbox: {
    accessToken: 'pk.eyJ1IjoiemVkbGlrZSIsImEiOiJjbGpuNDV3czQweGMzM2xyN2s1Y3JlNnJ0In0.wPMaPeA9AVBsDennj2p6fQ'
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Ticket App',
      short_name: 'TicketApp',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      globIgnores: ['snipcart-custom.html'],
      maximumFileSizeToCacheInBytes: 10000000
    },
    client: {
      installPrompt: true
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },
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
    plugins: ['relativeTime', 'utc', 'timezone', 'isBetween'],
    defaultTimezone: 'Europe/Paris'
  },

  snipcart: {
    publicApiKey: process.env.PUBLIC_SNIPCART_API_KEY ?? 'YjRjYzVmMzMtNDllMC00Y2Y1LTlhYTktMjQyNTYxYzAyNDA4NjM4MjA1MjE3Nzc4NDI3OTc2',
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
