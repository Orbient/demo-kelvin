import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const port = Number(process.env.PORT) || 5173;
// GitHub Pages serves the site from a folder (orbient.github.io/demo-kelvin/), so a build can be given a base
// path. The code names its public files from the root ('/assets/…', '/credits.html'); this pass puts the base
// in front of those strings at build time, so the sources stay the same for the dev server.
const base = process.env.BASE_PATH || '/';
const publicBase = {
  name: 'public-base',
  enforce: 'pre',
  transform(code, id) {
    if (base === '/' || !/\/src\/.*\.jsx?$/.test(id)) return null;
    return code.replace(/(['"`])\/(assets\/|credits\.html)/g, `$1${base}$2`);
  },
};

export default defineConfig({
  base,
  plugins: [publicBase, react()],
  server: { host: '127.0.0.1', port, strictPort: true },
  preview: { host: '127.0.0.1', port, strictPort: true },
});
