import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs/promises'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const contentFile = fileURLToPath(new URL('./src/assets/content.md', import.meta.url))

function markdownPersistencePlugin() {
  return {
    name: 'markdown-persistence',
    configureServer(server) {
      server.middlewares.use('/api/markdown', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')

        if (req.method === 'GET') {
          try {
            const content = await fs.readFile(contentFile, 'utf-8')
            res.end(JSON.stringify({ content }))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to read content.md' }))
          }
          return
        }

        if (req.method === 'POST') {
          try {
            const chunks = []
            for await (const chunk of req) {
              chunks.push(chunk)
            }
            const body = Buffer.concat(chunks).toString('utf-8') || '{}'
            let parsed

            try {
              parsed = JSON.parse(body) as { content?: unknown }
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Malformed JSON payload' }))
              return
            }

            if (typeof parsed.content !== 'string') {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid payload' }))
              return
            }

            await fs.writeFile(contentFile, parsed.content, 'utf-8')
            res.end(JSON.stringify({ ok: true }))
          } catch (error) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to save content.md' }))
          }
          return
        }

        res.statusCode = 405
        res.end(JSON.stringify({ error: 'Method not allowed' }))
      })
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    markdownPersistencePlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
