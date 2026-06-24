# 刘子箴 (Lance) — 个人网站

[English](README.md) | **中文**

个人网站，用于展示软件工程技能和项目经验。

## 技术栈

- **基础环境：** Node.js 24.2
- **核心框架：** Next.js 16.2 (App Router)
- **UI 库：** React 19.2
- **语言：** TypeScript 6.0（类型检查使用原生 TypeScript 7 / `tsgo` 预览版）
- **样式：** Tailwind CSS 4 + 玻璃拟态 (Frutiger Aero)
- **代码检查：** ESLint 9
- **多语言：** next-intl（中英文切换）
- **部署：** Vercel

## 设计风格

采用 Frutiger Aero / 玻璃拟态设计风格，灵感来自 Windows Aero 和 macOS Tahoe 的 liquid glass。视觉元素包括半透明毛玻璃卡片、背景模糊效果、柔和渐变和光效，同时支持深色和浅色主题。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看。

## 类型检查

```bash
npm run typecheck
```

优先使用原生 TypeScript 7 编译器（[`tsgo`](https://www.npmjs.com/package/@typescript/native-preview)，速度约快 10 倍），当原生二进制不可用时自动回退到经典的 JavaScript 版 `tsc`（TypeScript 6）——因此本地和 CI 表现一致。回退逻辑见 [scripts/typecheck.mjs](scripts/typecheck.mjs)。

> 说明：`next build` 通过 SWC 自带类型检查，与此脚本相互独立。

## 开发计划

详见 [TODO.md](TODO.md)。

## 许可证

MIT
