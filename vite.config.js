import { defineConfig } from 'vite'
import { ghPages } from 'vite-plugin-gh-pages'

export default defineConfig({
  base: '/Aircraft-Seat-Recommender/',
  plugins: [
    ghPages({
      branch: 'gh-pages',
      repo: 'https://github.com/Baitato/Aircraft-Seat-Recommender.git'
    })
  ]
}) 