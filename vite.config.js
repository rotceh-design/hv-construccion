import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Asegura que las rutas se construyan desde la raíz para evitar errores 404 en despliegues
  base: '/', 
  build: {
    // Genera una estructura limpia para el despliegue en Vercel
    outDir: 'dist',
  }
})