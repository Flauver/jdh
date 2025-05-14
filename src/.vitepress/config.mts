import { defineConfig } from 'vitepress'
import path from "node:path"
import tailwind from "tailwindcss"
import autoprefixer from "autoprefixer"
import { sidebar } from './sidebar'

const base = "/jdh/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: "简单鹤",
  description: "简单的鹤，好喝的鹤",
  lang: "zh-hans-CN",
  outDir: "../dist",
  markdown: {
    theme: {
      light: "light-plus",
      dark: "material-theme-palenight",
    },
    anchor: {
      slugify(s) {
        return encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
      }
    }
  },
  vite: {
    css: {
      postcss: {
        //@ts-ignore
        plugins: [tailwind(), autoprefixer()],
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../../components'),
      }
    }
  },
  themeConfig: {
    nav: [
      { text: '主页', link: '/' }
    ],
    sidebar: [
      {
        items: [
          { text: '教程', link: '/tutorial' },
          { text: '字根练习', link: '/gen'},
          { text: '露台', link: '/lutai'}
        ]
      }
    ],
    darkModeSwitchLabel: "黑暗模式",
    langMenuLabel: "选择语言",
    returnToTopLabel: "回到顶部",
    sidebarMenuLabel: "目录",
    outline: {
      level: "deep",
      label: "本页大纲"
    },
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonAriaLabel: "搜索",
            buttonText: "搜索",
          },
          modal: {
            displayDetails: "展示详细内容",
            resetButtonTitle: "清空关键词",
            noResultsText: "搜索不到，请换个关键词",
            backButtonTitle: "返回",
            footer: {
              selectText: "进入网页",
              navigateText: "浏览",
              navigateDownKeyAriaLabel: "下键",
              navigateUpKeyAriaLabel: "上键",
              closeKeyAriaLabel: "关闭",
              closeText: "取消搜索",
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Flauver/jdh' },
    ]
  },
})
