import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/manifest.json',
          dest: '.',
        },
        {
          src: 'src/_locales',
          dest: '.'
        }
      ],
    }),
  ],
    build: {
      outDir: 'build',
      rollupOptions: {
        input: {
          main: './popup/index.html',
        },
        output: {
          entryFileNames: 'popup/[name].js',
          chunkFileNames: 'popup/[name].js',
          assetFileNames: 'popup/[name][extname]'
        }
      },
    },
});