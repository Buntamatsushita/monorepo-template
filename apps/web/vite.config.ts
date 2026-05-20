import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const usePolling = process.env.VITE_USE_POLLING === '1'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // nginx 経由で LAN IP やタブレットから開くときの Host チェックを緩める
    allowedHosts: true,
    watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
  },
})
