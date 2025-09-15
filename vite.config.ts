/**
 * @description vite 配置文件
 * @extends https://cn.vitejs.dev/config
 */
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import { compression } from 'vite-plugin-compression2'

/**
 * vite 坑点总结：
 * 1.环境变量文件 .env 不允许配置 NODE_ENV
 * 2.环境变量加载特殊字符串时会有问题，例如 secret.ts 中的密钥
 * 3.对于部分库必须允许 ts 合成 import，否则打包后运行会报错，例如 day.js
 * 4.导入方式 import.meta.glob 在打包后运作机制和 webpack 的 require.context 不一致，需要额外处理
 */

process.env.VITE_BUILDTIME = `${new Date()}`

export default defineConfig(env => ({
  // 1.静态资源路径
  base: loadEnv(env.mode, process.cwd()).VITE_PUBLIC_PATH,
  // 2.开发服务器
  server: {
    host: 'localhost',
    port: 8080,
    proxy: {
      // 代理访问解决测试环境跨域
      '/xinwu-api': {
        target: 'http://8.153.90.189:8080',
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/xinwu-api/, '')
      }
    }
  },
  // 3.预览服务器
  preview: {
    host: 'localhost',
    port: 5173
  },
  // 4.引用
  resolve: {
    // 路径别名：js -> '@/'、css -> '@/'
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // 5.样式
  css: {
    // 5-1.预处理器
    preprocessorOptions: {
      scss: {
        charset: false // 关闭 sass 编译中文时自动生成 @charset "UTF-8"; 引发的 bug，详见：https://github.com/element-plus/element-plus/issues/3219#issuecomment-960374776
        // additionalData: `` // 配置在每个 scss 文件中引入此文件
      }
    },
    // 5-2.后处理器
    postcss: {
      plugins: [
        /**
         * autoprefixer
         * 作用：针对不同浏览器添加 css 前缀
         */
        autoprefixer(),
        /**
         * tailwindcss
         * 作用：原子化 css 样式库
         */
        tailwindcss()
      ]
    }
  },
  // 6.忽略解析的静态资源格式：https://cn.vitejs.dev/config/shared-options.html#assetsinclude
  assetsInclude: [
    '**/*.hdr',
    '**/*.gltf',
    '**/*.glb',
    '**/*.fbx',
    '**/*.JPEG',
    '**/*.PNG',
    '**/*.GIF'
  ],
  // 7.插件
  plugins: [
    /**
     * @vitejs/plugin-vue
     * 作用：vue3 SFC 组件编译
     */
    vue(),
    /**
     * vite-svg-loader
     * 作用：引入 svg 时可以作为组件使用
     */
    svgLoader(),
    /**
     * vite-plugin-compression2
     * 作用：压缩构建产物
     * 仓库：https://github.com/nonzzz/vite-plugin-compression
     */
    compression()
  ],
  // 8.构建
  build: {
    sourcemap: false,
    // 资源 > 4kb 复制到输出目录并将其 url 内联到打包输出的 js 中
    // 资源 < 4kb 作为 dataURI 内联到打包输出的 js 中
    assetsInlineLimit: 4 * 1024
  },
  // 9.vitest 单元测试：https://cn.vitest.dev/config
  test: {
    include: ['tests/**/*.test.ts'], // 测试包含文件
    environment: 'jsdom', // 测试运行环境：'node'-默认环境、'jsdom'-浏览器环境
    coverage: {
      include: ['src/**'] // 覆盖率报告默认统计 src 目录下
    }
  }
}))
