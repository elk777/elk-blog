import { defineConfig } from 'vitepress'
import  { nav, sidebar } from './elkConf/index'

export default defineConfig({
  // 基础配置
  base: '/elk-blog/', // 基础路径
  title: "灰原同学的猫",
  titleTemplate: "欢迎您",
  lastUpdated: true,
  // 主题配置
  themeConfig: {
    // 顶部左侧标题logo
    logo: './icon.png',

    // 顶部右上：专题栏
    nav: nav,

    // 文章：左侧侧边栏
    sidebar: sidebar,

    // 文章：右侧瞄点导航自动检索
    outline: {
      level: [1, 6],
      label: '目录'
    },
    search: {
      provider: 'local'
    },
    // 顶部右上： github图标
    socialLinks: [
      { icon: 'github', link: 'https://github.com/elk777' }
    ],

    // 博客页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present elk'
    }
  }
})
