import { defineConfig } from 'vitepress'

const base = "/jdh/";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: "简单鹤",
  description: "简单鹤，简单的鹤，好喝的鹤",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
