import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from  '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import path from 'path'
import Inspect from 'vite-plugin-inspect'



const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  server:{
    open:false,
    port:5143,
    host:"localhost",
    proxy: {
      '/blog': {
        target: 'http://175.178.195.144:5797', // 远程服务器地址
        changeOrigin: true,   //  
        rewrite: (path) => path.replace(/^\/blog/, ''),  // 使用 rewrite 替代 pathRewrite
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 这里是配置全局引入的 SCSS 文件
        additionalData: `@use "sass:math";@use "sass:list";@use "@/assets/styles/main.scss" as *;@use "@/assets/styles/variable.scss" as *;
        @use "@/assets/styles/mixin.scss" as *; 
        `
      }
    }
  },
  plugins: [
    Vue(),
    vueJsx(),
    AutoImport({
      // Auto import functions from Vue, e.g. ref, reactive, toRef...
      // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      imports: ['vue'],

      // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [
        ElementPlusResolver(),

        // Auto import icon components
        // 自动导入图标组件
        IconsResolver({
          prefix: 'Icon',
        }),
      ],

      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),

    Components({
      resolvers: [
        // Auto register icon components
        // 自动注册图标组件
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        // Auto register Element Plus components
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],

      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),

    Icons({
      autoInstall: true,
    }),
    Inspect()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
})
