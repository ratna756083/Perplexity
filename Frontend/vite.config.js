import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
   preview: {
    host: "0.0.0.0",
    allowedHosts: ["perplexity-frontend-9e0x.onrender.com"]
  }
})
