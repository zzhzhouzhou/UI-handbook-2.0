# 形色场 UI Handbook 2.0（独立项目）

从 `E:/Downloads/ui-handbook-redesign-and-expansion.zip` 解出的 **2.0 重构版**，单独放在 `E:/TheBetterUI-2.0/`。

**与 `E:/TheBetterUI`（1.x 单页教程站）完全独立**：两个目录各有自己的 `package.json`、`package-lock.json`、`node_modules` 与构建产物，互不影响。原项目一个文件都没改。

> 之所以不合并：2.0 是换架构重写，不是补丁——路由、状态管理、组件注册方式、目录结构、章节文件全部不同，硬塞进 1.x 只会两套代码互相干扰。

---

## 这是什么

可交互的组件手册 + 设计实验室：**12 个章节 / 184 个组件**（含新增的设计实验室 `lab`、游戏与彩蛋 `play`），每个组件都有可交互预览、用途、实现要点、无障碍说明与可复制代码。

| | 1.x（E:/TheBetterUI） | 2.0（本项目） |
|---|---|---|
| 页面模型 | 单个长页面 + 滚动侦测 | Hash 路由多页面（首页 / 章节页） |
| 目录数据 | `src/nav.ts` + `scripts/check-nav.mjs` 双向校验 | `src/registry.ts` 汇总各章节导出的 `items` |
| 状态 | 组件内局部状态 | 全局 `store`（主题、强调色相、圆角、字体、书签、已学、Toast、命令面板） |
| 图标 | 手写内联 SVG | `lucide-react` 1.69.0 |
| 组件数 | 115 | 184 |
| 视觉 | 纯黑白灰 | 可调强调色（默认紫）、可调圆角/字体、渐变章节头 |

技术栈：React 19.2.6 + TypeScript 5.9 + Tailwind CSS 4（`@theme` + CSS 变量）+ Vite 7 + `vite-plugin-singlefile`（单文件产物）。运行时依赖 `clsx`、`tailwind-merge`、`lucide-react`。

## 跑起来

```bash
cd E:/TheBetterUI-2.0
npm ci                 # 已装好依赖，换机器时按 lock 精确还原；需 Node >= 20.19 或 >= 22.12
npm run dev            # 开发预览 http://localhost:5173
npm run build          # → dist/index.html（单文件）
npm run preview        # 预览构建产物
```

`dist/index.html` 把 JS/CSS 全部内联，**双击就能离线打开**（Hash 路由在 `file://` 下同样工作）。

## 目录地图

```
src/
├── main.tsx / App.tsx        应用外壳：Topbar / Sidebar / 命令面板 / Tweaks / Toast / 回到顶部
├── registry.ts               ★ 章节与组件的唯一汇总入口（stats、itemMap、groups 都从这里出）
├── index.css                 设计令牌：--accent-h / --accent / --rs(圆角) / --ff-sans，@theme 映射到 Tailwind
├── lib/
│   ├── router.ts             Hash 路由：#/s/<section>/<item>
│   ├── store.tsx             全局状态 + localStorage 持久化（hb-theme 等）
│   ├── hooks.ts              useLocalStorage / useCopy / useInView / useClickOutside / useInterval
│   ├── color.ts              强调色 oklch 计算
│   ├── confetti.ts           彩蛋纸屑
│   └── types.ts              Item / Section 类型 + item() 辅助函数
├── components/
│   ├── Shell.tsx             顶栏、侧边栏、Toast、回到顶部、Tweaks 微调面板、全局样式
│   ├── Pages.tsx             首页 Home 与章节页 SectionPage
│   ├── Doc.tsx               组件文档卡：预览/代码双 Tab、复制、重播、书签、已学
│   ├── Palette.tsx           ⌘K / Ctrl+K 命令面板
│   └── ui.tsx                 基础原子组件（Btn、inputCls…）
├── sections/                 11 个文件 → 12 个章节（guides.tsx 导出 standards + patterns）
│   └── foundations / basic / forms / nav / feedback / data / pointer / motion / lab / play / guides
└── utils/cn.ts                clsx + tailwind-merge
```

## 改代码要知道的

1. **新增组件**：在对应 `src/sections/*.tsx` 里用 `item({ id, title, en, level, desc, points, a11y, mistakes, code, demo, tags? })` 加一条，`registry.ts` 会自动汇总——不需要手动改目录表。`id` 必须全站唯一（它是路由、书签、已学、搜索的键）。
2. **`code` 是展示给读者看的字符串，不是执行的实现**。改了 `demo` 组件的行为，必须同步改 `code` 和 `points / a11y / mistakes`，否则教程与实现不一致。
3. **主题与视觉由 CSS 变量驱动**：`src/index.css` 的 `--accent-h`（色相）、`--rs`（圆角倍率）、`--ff-sans`；Tweaks 面板写的就是这些变量，改视觉优先改变量而不是散落的 class。
4. **文字排版依赖 Google Fonts CDN**（Inter / JetBrains Mono / Noto Serif SC，见 `index.html` 的 `preconnect` 与 stylesheet）。联网时正常；**完全离线时字体会退回系统字体栈**（`ui-sans-serif / PingFang SC / Microsoft YaHei` 等），功能与布局不受影响，只是字形不同。若要严格离线自包含，需把字体改成本地 `@font-face` 或纯系统字体。
5. **保持单文件构建**：`vite-plugin-singlefile` 要求所有资源内联，别引远程 JS/CSS 或本地图片文件；需要图形继续用内联 SVG / data URI。
6. 本项目没有 1.x 的 `check:nav`（目录校验）——2.0 用 `registry.ts` 运行时汇总，构建时 Vite 会校验所有 import。

## 构建记录

- 独立构建验证通过：2094 个模块转换，`dist/index.html` **808.44 kB**（gzip 238.16 kB），JS/CSS 全部内联。
- 外部资源仅 Google Fonts 三个 `<link>`；无任何远程 JS / 图片依赖。
- 依赖锁：`package-lock.json` 锁定 164+ 包，含 `lucide-react@1.69.0`（`resolved` + `integrity` 完整），`npm ci` 可精确还原。

## 部署（GitHub Pages）

- 仓库：<https://github.com/zzhzhouzhou/UI-handbook-2.0>
- 在线：<https://zzhzhouzhou.github.io/UI-handbook-2.0/>
- 推送到 `main` 会自动触发 `.github/workflows/deploy-pages.yml`：`npm ci` → `npm run build` → 上传 `dist/` → 部署到 Pages；也可以在 Actions 里手动 `workflow_dispatch`。
- 构建产物由 CI 生成，`dist/` 不入库（见 `.gitignore`）。

## 备注

- 原项目 `E:/TheBetterUI` 的 `README.md`、`SKILL.md`、`docs/handbook.md`、`AI_HANDOFF.md` 描述的是 1.x，**不适用于本项目**；本项目以 `src/` 源码为准。
