import { defineConfig } from 'vite'
import { ghPages } from 'vite-plugin-gh-pages'

export default defineConfig({
  base: '/Trilogy-Assignment/',
  plugins: [
    ghPages({
      branch: 'gh-pages',
      repo: 'https://github.com/baitato/Trilogy-Assignment.git'
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
}) 