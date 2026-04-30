import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Dev-only plugin: serves /api/chat by loading the same Vercel handler
// the production deploy uses. No vercel CLI needed for local dev.
function devApiPlugin() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        let body = ''
        req.setEncoding('utf8')
        for await (const chunk of req) body += chunk

        // Handler reads body as string and uses raw res.write/res.end —
        // pass the underlying Node res through directly.
        const adaptedReq = {
          method: req.method,
          headers: req.headers,
          body,
        }

        try {
          const mod = await server.ssrLoadModule('/api/chat.js')
          await mod.default(adaptedReq, res)
        } catch (err) {
          console.error('[dev-api] /api/chat error:', err)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
          }
          res.end(JSON.stringify({ error: 'Dev API error: ' + err.message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Make .env vars available to the server-side dev API handler.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
