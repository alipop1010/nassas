import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Доступ по сети
    port: 5173, // Порт разработки
    strictPort: true, // Запрет автоматической смены порта
    headers: {
      "Access-Control-Allow-Origin": "*", // Разрешить CORS
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      
    },
  },
  build: {
    outDir: 'dist', // Папка для production-сборки
    sourcemap: true, // Карты кода для отладки
  },
  resolve: {
    alias: {
      '@': '/src', // Алиас для импортов
    },
  },
});