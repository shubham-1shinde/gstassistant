import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/v1': 'http://localhost:8000/api',  // backend mdhe routes /api/vi/...  pasun chalu hotat mnun v1 la aapn proxy sarkh use karu sakta toch v1 la frontend la as a proxy use karaych
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
