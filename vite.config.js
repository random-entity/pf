import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works under any GitHub Pages path
// (e.g. https://user.github.io/repo/) without further configuration.
export default defineConfig({
  base: './',
  plugins: [react()],
})
