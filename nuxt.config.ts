// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  site: {
    url: 'https://rayforce.com.mx'
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap'
  ],

  sitemap: {
    exclude: [
      '/admin/**',
      '/carrito/**',
      '/checkout/**',
      '/login',
      '/perfil',
      '/recuperar-contrasena',
      '/verificar'
    ],
    sources: [
      '/api/__sitemap__/urls'
    ]
  },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Rayforce | Technical Support & Help Center',
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/images/favicon-r.svg'
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
        },
      ],
    },
  },

runtimeConfig: {
  wooUrl: process.env.WOO_URL,
  wooKey: process.env.WOO_KEY,
  wooSecret: process.env.WOO_SECRET,
  adminPassword: process.env.ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  resendApiKey: process.env.RESEND_API_KEY,
  resendFrom: process.env.RESEND_FROM,
  public: {}
},

  // Fix Node 24 Windows ESM: xlsx usa require() interno con rutas C:\ absolutas
  // que no son válidas para el loader ESM. Lo excluimos del bundle del servidor
  // y solo lo usamos via import() dinámico en el cliente.
  nitro: {
    externals: {
      external: ['xlsx'],
    },
    rollupConfig: {
      external: ['xlsx'],
    },
  },

  vite: {
    // En el servidor SSR, xlsx no debe bundlearse
    ssr: {
      external: ['xlsx'],
      noExternal: [],
    },
  },

  compatibilityDate: '2024-11-01',
})