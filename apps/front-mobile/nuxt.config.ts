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
    '@vite-pwa/nuxt'
  ],
  pwa: {
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
      globIgnores: ['snipcart-custom.html']
    },
    client: {
      installPrompt: true
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20
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
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultTimezone: 'Europe/Paris'
  },

  snipcart: {
    publicApiKey: process.env.SNIPCART_API_KEY ?? 'NjE1YWRlYmUtNDAxNS00NzhhLTlmYzUtNmE1MWQwYmFmZDYzNjM4MjEzMTY4OTU3MDI4Mzg2',
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
