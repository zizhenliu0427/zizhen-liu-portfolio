# 刘子箴 (Lance) — 个人网站

[English](README.md) | **中文**

个人网站，用于展示软件工程技能和项目经验。

## 技术栈

- **基础环境：** Node.js 24.2
- **核心框架：** Next.js 16.2 (App Router)
- **UI 库：** React 19.2
- **语言：** TypeScript 6（类型检查使用原生 TypeScript 7 / `tsgo` 预览版）
- **样式：** CSS Modules（主站）+ Tailwind CSS 4 · Aero 使用玻璃拟态
- **代码检查：** ESLint 9
- **多语言：** 中英文切换——规划中（Priority 4）
- **目前临时部署：** Cloudflare（OpenNext 静态导出）

## 设计风格

两套并存的视觉体系：

- **主站（`/`）**——黑客帝国 (Matrix) 风格的 CRT 操作员终端：近黑底色、荧绿高亮、
  Canvas 代码雨、扫描线与辉光，并提供减弱动效 / 低功耗降级。招聘者的阅读
  路径优先，视觉效果始终在内容之后。
- **FA/Y2K 美学界面（`/desktop`、`/oobe`、`/demo`）**——Frutiger Aero / 玻璃拟态，
  灵感来自 Windows Aero (Longhorn - Vista - 7) 与 Mac OS X Aqua / macOS Liquid Glass：手写的
  可拖拽窗口管理器、OOBE 风格简历向导和组件演示。后续计划加入 XP 与
  Windows 98 界面。

## 站点内容

- **精选项目**——五张带手绘终端视觉的项目卡：IoT 传感分析、CMO-DB、CTV 暴力检测、
  Novacart 电商、Codritium 实习平台工作 (MediaJira / Marketing Simplified)。
- **`/projects`**——可按领域过滤的完整项目归档（WEB / AI-ML / SYSTEMS / HARDWARE /
  MOBILE / LAB），诚实标注访问状态：LIVE、SOURCE、NDA、CODE PRIVATE、开发中。
- **经历**——Codritium（在职）、Intelli New Technologies、金夫人摄影。
- **大学教育**——UNSW 与 UTS。
- **`/about`**——终端背后的人：爱好：摄影、汽车、动漫、语言。
- **Aero 页面展示**——`/desktop`、`/oobe`、`/demo` Windows 7 时代展示。

所有内容都是 [`src/data/portfolio.ts`](src/data/portfolio.ts) 里的类型化数据，
主题只改变呈现方式。

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
