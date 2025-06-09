import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import fs from 'fs';
import path from 'path';

const certPath = path.resolve(__dirname, '/var/py/certs');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    https: {
      key: fs.readFileSync(`${certPath}/key.pem`),
      cert: fs.readFileSync(`${certPath}/cert.pem`),
    },
    host: '0.0.0.0', // Доступ с других устройств
    port: 3000,      // Порт (HTTPS)
  },


});

