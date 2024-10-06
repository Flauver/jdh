import { defineConfig } from 'vitepress'

const base = "/jdh/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: "简单鹤",
  description: "简单的鹤，好喝的鹤",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        items: [
          { text: '教程', link: '/tutorial' },
          { text: '字根练习', link: '/gen'}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Flauver/jdh/' }
    ]
  }
})
