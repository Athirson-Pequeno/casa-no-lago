import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Abre no PC e também acessível pelo Android na mesma rede Wi-Fi
    host: true,   // expõe no IP local (ex: 192.168.x.x:5173)
    port: 5173,
    proxy: {
      // Em dev, redireciona chamadas da API para o backend local (porta 3000)
      '/auth':     'http://localhost:3000',
      '/quartos':  'http://localhost:3000',
      '/reservas': 'http://localhost:3000',
      '/clientes': 'http://localhost:3000',
      '/tags':     'http://localhost:3000',
    }
  }
})
