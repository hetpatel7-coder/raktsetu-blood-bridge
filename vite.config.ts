import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const isNetlify = process.env.NETLIFY === 'true'

async function getPlugins() {
  const base = [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    viteTsConfigPaths(),
  ]

  if (isNetlify) {
    const { default: netlify } = await import('@netlify/vite-plugin-tanstack-start')
    return [...base, netlify()]
  }

  return base
}

export default defineConfig(async () => ({
  plugins: await getPlugins(),
}))
