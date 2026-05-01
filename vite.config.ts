import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

const isVercel = process.env.VERCEL === '1'

async function getPlugins() {
  const base = [
    tanstackStart(),
    viteReact(),
    tailwindcss(),
    viteTsConfigPaths(),
  ]

  if (isVercel) {
    const { nitro } = await import('nitro/vite')
    return [...base, nitro({ preset: 'vercel' })]
  }

  return base
}

export default defineConfig(async () => ({
  plugins: await getPlugins(),
}))
