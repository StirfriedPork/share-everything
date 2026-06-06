import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://share-everything-omega.vercel.app').replace(
    /\/$/,
    '',
  )

  return {
    plugins: [
      react(),
      {
        name: 'inject-site-url',
        transformIndexHtml(html) {
          return html.replaceAll('__SITE_URL__', siteUrl)
        },
      },
    ],
  }
})
