import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa';
 
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        
        name: 'Train.io',
        short_name: 'Train.io',
        theme_color: '#000000',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000', 
        icons: [
          {
            src: '/assets/images/handsomeSquidward.jpg',
            sizes: '512x512',
            type: 'image/png',
          },
          // Include other sizes as needed
        ],
      },
    }
    )],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})