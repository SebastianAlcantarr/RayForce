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
      title: 'Rayforce | Material Eléctrico, Ferretería e Infraestructura',
      meta: [
        {
          name: 'description',
          content: 'Rayforce es tu proveedor de confianza en material eléctrico de alta calidad, ferretería industrial y soluciones de infraestructura eléctrica para proyectos comerciales, industriales y residenciales.'
        }
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: '/images/favicon-r.svg'
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
  // @ts-ignore
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

  routeRules: {
    '/_nuxt/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/fonts/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'Cache-Control': 'public, max-age=31536000, immutable' } },
  },

  compatibilityDate: '2024-11-01',
})