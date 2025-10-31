import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      // This line is key
      '/api': {
        target: 'https://matrixwebservice.onrender.com',
        changeOrigin: true, // Needed for virtual hosting environments like Render
        secure: true,       // Since Render uses HTTPS
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Optional, but ensures the /api path remains
      },
    },
  },
})