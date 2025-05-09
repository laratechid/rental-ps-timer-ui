import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5001,
    strictPort: true
   },
   server: {
    port: 5001,
    strictPort: true,
    host: true
   },
})
