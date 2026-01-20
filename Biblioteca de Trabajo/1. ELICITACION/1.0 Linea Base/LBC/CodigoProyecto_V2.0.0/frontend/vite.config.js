import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  preview: {
    host: '0.0.0.0',  // ya lo tienes probablemente vía CLI
    port: Number(process.env.PORT) || 4173, 
    allowedHosts: ['.onrender.com']  
    // O más específico: allowedHosts: ['two7835-g5-ads-1-front.onrender.com', '.onrender.com']
  }
})
