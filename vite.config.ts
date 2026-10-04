import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'RAYNET_')
  const credentials = Buffer.from(`${env.RAYNET_USERNAME}:${env.RAYNET_API_KEY}`).toString('base64')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      // přihlašovací údaje přidává dev server, takže se klíč nedostane do prohlížeče
      proxy: {
        '/api': {
          target: 'https://app.raynet.cz/api/v2',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          headers: {
            Authorization: `Basic ${credentials}`,
            'X-Instance-Name': env.RAYNET_INSTANCE,
          },
        },
      },
    },
  }
})
