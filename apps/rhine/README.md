# Zizhen Liu · Personal Archive

刘子箴的第三版个人作品集，基于 [LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI) 改造。

保留上游的暖灰界面、Three.js 玻璃档案阵列、完整开场、抽取与归位、同步解密、360° 查看器、明暗主题和声音设置。沿用整套交互，内容换成真实项目与经历。

## 本版本

- 原创 ZL 字标，个人身份、联系方式与项目链接。
- 五类按内容数量组织：个人资料 10 / 实习经历 3 / Web 与应用 8 / AI 与数据 4 / 系统与硬件 6。
- 共 31 份主档案，包含 18 个项目、10 份个人资料（含学历与兴趣）和 3 段实习。技术专题收录在对应档案的“实现记录”页签中，不再独立占位。
- 31 份档案均使用对应资料制作的 Blender 内构，包括个人介绍、学历爱好与三段实习。模型按需加载，首次打开后缓存。制作与依据见 [档案模型说明](art/ARCHIVE-EXHIBITS.md)。
- 编号按 P（个人）/ I（实习）/ W（Web）/ A（AI 与数据）/ S（系统）分别从 001 开始；旧 X 编号继续支持搜索、收藏迁移与 TXT 下载。
- 中英文界面、正文与 TXT 导出，默认跟随浏览器语言；点击中 / EN 按钮直接切换并记住选择，无需重载页面或三维资源，保留当前档案与开场进度。
- 深浅色默认跟随系统，在设置中可选择自动、浅色或深色并记住选择。
- 开场右上角“设置”按钮默认收起，点击展开语言、配色、性能／画质、动画速度及静音控制；点击外部或按 Esc 收起。播放期间仍可调整，语言切换保留进度，静音偏好也会记住。
- 加载动画默认 2 倍速，可选择原速 1×、快速 2×、极速 3×，仅调整开场与读取档案时的解密动画；镜头、抽取与归位、数字与文字滚动、弹窗及模型查看器保持原速。系统的减少动态效果偏好仍优先。
- 手机和平板首次使用默认性能模式：60% 三维渲染比例、像素密度上限 1、关闭阴影／AO／景深／SMAA、降低折射精度并停用界面背景模糊，文字保持原生清晰度。手动切换画质后记住选择。
- 英文采用澳洲／英式拼写，页面语言标记为 `en-AU`，保留技术名词、产品名及许可原文。
- 档案说明与列导航增加磨砂背景，打开档案使用高对比度按钮；适配手机与平板横竖屏。
- 技术栈检索、收藏，以及真实的源码 / 项目 / 邮件入口。
- 已作为 `apps/rhine` 整合到主个人网站仓库，默认首页使用 Rhine；黑客帝国版与 Aero 版分别保留在 `/matrix` 和 `/desktop`。本目录仍可独立构建和预览，整合说明见 [INTEGRATION.md](INTEGRATION.md)。

## 运行

需要 Node.js 22.12+。

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:5174 。点击“进入作品集”播放完整开场，右上“跳过开场”（英文界面 ENTER SYSTEM）可跳过。

```sh
npm run check:content
npm run test:e2e
npm run build
```

端到端测试使用本机 Microsoft Edge；其他环境可在 playwright.config.ts 中调整浏览器 channel。

## 内容维护

页面与导出共用中文 [content/archives.json](content/archives.json) 与英文 [content/archives.en.json](content/archives.en.json)，两种语言保持相同档案 ID。界面翻译位于 `src/ui-messages.json` 与 `src/locale.ts`。原作品集数据可显式重新导入：

```sh
node --experimental-strip-types scripts/import-portfolio.mjs ../zizhen-liu-portfolio
node --experimental-strip-types scripts/import-portfolio-en.mjs ../zizhen-liu-portfolio
node scripts/organise-archives.mjs
npm run export:archives
```

导入读取源项目当前工作区的 portfolio.ts 与中英文翻译；构建不依赖源项目。修改后先运行内容检查。
项目指标来自已有作品集陈述，本次迁移没有重新进行性能测试。

### 三维模型

当前阵列共用 `archive-cassette.glb`，360° 查看器共用 `archive-assembly.glb`；档案 ID 标签随选择更新。更换标签或配色可直接修改代码，独立几何造型则需要新模型，并接入按档案选择、延迟加载、缓存、尺寸归一化及释放逻辑。

建议保留共享档案阵列，仅在打开具体项目时加载独立模型，避免手机同时加载多套资源。本仓库的美术模型制作约定见 AGENTS.md，使用 Blender MCP 并保留生成脚本与源文件；本轮没有制作或替换模型。

## 致谢与许可

本项目基于 **[LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI)**，界面与核心三维交互来自上游。原项目自行编写且有权授权的代码、建模脚本和技术文档采用 MIT License，Copyright (c) 2026 LBEILC。

完整 [LICENSE](LICENSE) 保留不变，运行产物同时携带 [许可副本](public/licenses/RhineLabUI-MIT.txt)，设置页提供上游链接与许可入口。本版本新增的代码采用 MIT，Copyright (c) 2026 Zizhen Liu。

**MIT 不自动覆盖仓库的所有素材。** 此版仍保留上游 GLB / Blender 模型以便本地体验原 UI；其非代码资产和原作相关视觉的权利限制继续适用，没有将其重新声明为 MIT。本次未发布改造后的在线站点。

- 《明日方舟》、莱茵生命及原 PV 的权利归各自权利人所有，本项目与官方无隶属关系。
- 可见品牌与图标改为 ZL；键入声音改为程序合成，不再调用原 PV 提取短音。
- MiSans、Rolling Number 与其他依赖继续保留原许可。
- 不获取上游作者的专有 Novecento Webfont kit；新品牌文字使用现有 MiSans，其他固定开场文字沿用上游图形回退。
- 上游完整文档见 [UPSTREAM-README](docs/UPSTREAM-README.md)；其中原作者部署地址、历史授权和截图属于上游项目。

后续公开部署前，应另行处理仍沿用的模型等非代码素材许可或替换相应资源。
