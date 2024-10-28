import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'
import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Inspect from 'vite-plugin-inspect'

export default defineConfig(({ mode }) => {
  const dotenvConfig = dotenv.config({ path: `./.env.${mode}` })
  const dotenvObj = dotenvConfig.parsed
  return {
    base: dotenvObj?.BUILD_PATH,
    build: {
      outDir: dotenvObj?.BUILD_OUT_DIR || 'dist',
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]-[hash].js',
          chunkFileNames: 'js/[name]-[hash].js',
          assetFileNames(assetInfo) {
            // @ts-ignore
            if (assetInfo.name.includes('.css')) {
              return 'css/[name]-[hash].css'
            }
            const imgExits = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.ico', '.webp']
            // @ts-ignore
            if (imgExits.some(ext => ext === assetInfo.name.endsWith(ext))) {
              return 'imgs/[name]-[hash][ext]'
            }
            return 'asset/[name]-[hash][ext]'
          },
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
    plugins: [
      vue(),
      viteSvgIcons({
        iconDirs: [path.resolve(process.cwd(), 'src/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      vueJsx(),
      Inspect(),
    ],
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `@import "src/styles/variables.less";`,
          modifyVars: {},
          javascriptEnabled: true,
        },
      },
    },
    resolve: {
      alias: [
        {
          find: '@/',
          replacement: path.resolve(process.cwd(), 'src') + '/',
        },
      ],
    },
    server: {
      open: true,
    },
  }
})
