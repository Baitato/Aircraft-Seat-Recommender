import { defineConfig } from 'vite'
import { ghPages } from 'vite-plugin-gh-pages'

export default defineConfig({
  base: '/trilogy-assignment/',
  plugins: [
    ghPages({
      branch: 'gh-pages',
      repo: 'https://github.com/baitato/trilogy-assignment.git'
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