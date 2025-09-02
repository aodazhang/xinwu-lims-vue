/**
 * @description tailwindcss 配置文件
 * @extends https://tailwind-v3.nodejs.cn/docs/installation
 * @see https://juejin.cn/column/7362805232647487514
 */
import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

/**
 * 1.tailwindcss 单位系统：1 rem = 16px
 * - 数字（对应 rem）：1 = 0.25rem = 4px、4 = 1rem = 16px
 * - 分数（对应 百分比）：1/2 = 50%、1/3 = 33.333%
 * - 自定义（对应 任意值）：[16px]、[46%]、[#ff00ff]、[url('~@/assets/image/card1.png')]
 *
 * 2.tailwindcss 颜色系统：颜色名-50 ~ 950，对应单色饱和度提升
 * - 色板：https://tailwind-v3.nodejs.cn/docs/customizing-colors
 * - 灰色调
 *    - slate 石板色
 *    - gray 镀锌色
 *    - neutral 中性色
 *    - stone 矿石色
 * - 暖色调
 *    - red 红色
 *    - orange 橘色
 *    - amber 琥珀色
 *    - yellow 黄色
 *    - violet 紫罗兰色
 *    - purple 紫色
 *    - fuchsia 紫红色
 *    - pink 粉色
 *    - rose 玫瑰色
 * - 冷色调
 *    - lime 黄绿色
 *    - green 绿色
 *    - emerald 翡翠绿色
 *    - teal 青色
 *    - cyan 蓝绿色
 *    - sky 天空蓝色
 *    - blue 蓝色
 *    - indigo 靛蓝色
 *
 * 3.tailwindcss 响应式系统：从上到下优先级依次升高，因此较小的断点不能放在最后或者扩展配置中
 * - sm（small） >= 640px 生效
 * - md（medium） >= 768px 生效
 * - lg（large） >= 1024px 生效
 * - xl（x large） >= 1280px 生效
 * - 2xl（2x large） >= 1536px 生效
 */

/** @type {import('tailwindcss').Config} */
export default {
  // 1.全局 atomic 前缀：px-4 -> aoda-px-4
  prefix: undefined,
  // 2.全局样式优先级：!important
  important: false,
  // 3.编译文件范围：编译 tailwindcss 有效范围， src/**/* 代表 src 的无限级别子目录中所有文件
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  // 4.主题配置
  theme: {
    // 4-1.颜色配置（不推荐）：配置后会重置默认颜色系统，只能使用 xx-blue，之前的颜色无效例如 bg-blue-400
    // colors: {
    //   blue: '#0000ff'
    // },
    // 4-2.断点配置（不推荐）：与颜色配置相同，会重置默认的断点系统
    // screens: {
    //   sm: '576px',
    // },
    // 4-3.字体配置：与颜色配置相同，会重置默认的断点系统
    fontFamily: {
      ...defaultTheme.fontFamily.sans, // 引入默认的字体配置，在这个基础上添加新字体，确保不影响默认的字体配置
      sans: [
        // 'TaoBaoMaiCaiTi',
        ...defaultTheme.fontFamily.sans
      ] // 中文字体一般是在 sans 下
    },
    // 4-4.扩展配置
    extend: {
      // 扩展颜色配置（推荐）：在原有颜色系统基础上增加新颜色，例如 bg-blue-extend
      colors: {
        // 'blue-extend': '#00ffff'
      },
      // 扩展断点配置（推荐）：在原有断点系统基础上增加新断点，例如 xxxxl:bg-slate-400。不推荐添加比 sm 更小的断点，因为扩展配置是追加，tailwindcss 要求按照所有断点是从小到大顺序排列
      screens: {
        // xxxxl: '1818px'
      }
    }
  },
  // 5.插件
  plugins: [
    /**
     * @tailwindcss/typography
     * 作用：通过 prose 类提供默认排版样式
     * 仓库：https://github.com/tailwindlabs/tailwindcss-typography
     */
    typography,
    /**
     * daisyui
     * 作用：tailwindcss 组件库，建议 tailwindcss v3 使用 daisyui v4
     * 仓库：https://v4.daisyui.com/docs/install/
     */
    daisyui
  ],
  // 6.daisyui 配置项
  daisyui: {
    styled: true, // 是否包含默认组件库样式：true-使用默认样式、false-等价于 headless
    themes: false, // 是否包含全部主题：true-包含所有主题、false-只包含亮色和暗色模式、["light", "dark", "cupcake"]-包含指定主题
    base: true, // 是否包含基础样式
    utils: true, // 是否包含响应式和工具样式
    logs: true, // 是否输出日志
    darkTheme: 'dark', // 自定义暗色模式主题：dark-默认暗色主题
    prefix: '', // 组件库命名前缀（btn -> aoda-btn，避免 class 冲突）
    themeRoot: ':root' // 设置 css 变量元素（默认在 :root 中）
  }
}
