# Portfolio Project Notes

## Project Overview
- Purpose: Personal portfolio website for finding software engineering jobs
- Owner: Zizhen Liu
- Tech stack: Next.js + TypeScript + Tailwind CSS
- Goal: Learn and demonstrate senior-level SWE skills

## Project Setup (2026-05-27)
- Initialized Next.js project with `create-next-app@latest`
- Options: TypeScript, Tailwind CSS, ESLint, App Router, src directory, `@/*` import alias, npm
- Directory structure uses `src/app/` (App Router pattern)

## Key Decisions
- Next.js over Vite+React: better SEO, SSR/SSG, deployment to Vercel
- No Docker needed: Vercel handles deployment
- No Vite needed: Next.js has its own build system

## Tech Decisions for This Project
- Responsive layout: use Tailwind breakpoints (sm: md: lg:), covers media queries
- Intersection Observer: use for scroll animations (section fade-in, nav highlight)
- Router: Next.js App Router built-in, file-based routing
- rem: Tailwind defaults to rem, no extra config
- ResizeObserver: only if needed for container-responsive components
- Custom Hooks: extract when repeated logic appears during development, not upfront
- Framer Motion: evaluate for animation enhancement
- NOT using: Bootstrap, jQuery, Handlebars, D3.js, ECharts, Web Worker, Redux, Docker

## Deployment Plan
- Target platform: Vercel (free tier, zero-config for Next.js)

---

# Q&A Knowledge Base

## Next.js vs React vs Vite 的关系
- **React**: UI 库，负责组件化和渲染
- **Vite**: 构建工具/dev server，替代老的 CRA，负责打包和热更新
- **Next.js**: 框架，内含 React + 构建工具 + 路由 + SSR，一站式方案
- Vite + React = 纯前端 SPA，轻量，需要自己加路由
- Next.js = 全套方案，SEO 友好，开箱即用
- 选了 Next.js 就不需要 Vite，两者构建系统冲突

## React 虚拟 DOM
- 状态变了 → 生成新虚拟 DOM 树 → Diff 对比新旧树 → 只更新差异部分到真实 DOM
- Diff 算法是 O(n) 的 Reconciliation（协调），不是 deep 算法
- 基于两个假设：不同类型元素产生不同树；通过 `key` 识别稳定子元素
- 虚拟 DOM 不一定比直接操作 DOM 快，优势是开发体验好 + 性能够用
- 不需要手动使用，React/Next.js 底层自动工作

## Token 存储与安全
- `sessionStorage`: 不防 XSS，标签页关了就没
- `localStorage`: 不防 XSS，持久化，不推荐存 token
- **`httpOnly Cookie`**: 防 XSS，前端 JS 读不到，生产环境推荐
- 面试回答思路：说明 tradeoff，能讲出改进方案（httpOnly Cookie + CSRF token）

## 前端工程化 / CRA vs Vite
- CRA (Create React App) 已停止维护，现在主流用 Vite 或 Next.js
- Vite 为什么快：ESM dev server + Rollup 打包
- 代理方案：CRA 的 `proxy` 字段 / Vite 的 `server.proxy` / Next.js 的 `rewrites`
- API 层封装：统一 fetch 调用便于拦截器、错误处理、token 注入

## HOC vs Custom Hooks
- HOC (Higher Order Component): Class 组件时代的模式，现在过时
- Render Props: 过渡期方案，少用
- **Custom Hooks**: 函数组件时代的主流方案
- 简历建议写 Custom Hooks 而非 HOC
- Custom Hooks 不需要提前规划，开发中发现重复逻辑时自然抽取

## Redux
- 适合大型应用、复杂共享状态（多组件跨层级共享数据）
- Portfolio 不需要，用 React 自带的 useState / useContext 足够

## i18n 语言切换方案
- 使用 next-intl 库
- 默认英文主页（英式英语 en-AU，目标岗位在澳洲）
- 自动检测：通过 middleware 读浏览器 `Accept-Language` 头（比 IP 准）
- 不用 IP 检测：VPN/代理/海外华人会误判
- 手动切换：提供按钮让用户自己选
- 持久化：用户选择存 cookie，下次访问记住
- README：英文优先（README.md），中文版单独一个（README.zh-CN.md），互相链接

## Glassmorphism 设计风格
- 风格：Frutiger Aero / Windows Aero / macOS Tahoe liquid glass
- 核心 Tailwind 实现：`bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg`
- 深浅色不冲突：浅色用 `bg-white/20`，深色用 `dark:bg-black/20`
- 资源：shadcn/ui（基础组件）、Aceternity UI（动效组件）、glassmorphism.com（CSS 生成器）

## 不需要的技术及原因
- **Bootstrap 5**: 和 Tailwind CSS 冲突，不能同时用两套 CSS 框架
- **jQuery**: React 自己管 DOM，jQuery 直接操作 DOM 会冲突
- **Handlebars**: 模板引擎，React JSX 已经替代
- **D3.js / ECharts**: 数据可视化库，portfolio 不需要复杂图表
- **Web Worker**: portfolio 没有重计算场景
- **Docker**: Vercel 处理部署，不需要容器化
