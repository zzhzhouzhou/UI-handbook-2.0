# 形色场 · UI 设计手册（极简重设计版）

黑白灰的交互式 UI 设计手册：**7 个部分 / 24 个章节 / 146 个可交互示例**，从设计令牌到组件范式、设计实验室、高级效果、艺术构成与小游戏，全部手写实现，零 UI 组件库。

本仓库部署在 <https://zzhzhouzhou.github.io/UI-handbook-2.0/>。当前版本来自 `minimalist-ui-handbook-redesign.zip`（极简重设计）；上一版架构（Hash 路由 + `registry.ts`）保留在 git 历史里，可随时回退。另一个 1.x 项目 `E:/TheBetterUI` 与本仓库完全独立，互不影响。

## 技术栈

React 19.2.6 · TypeScript 5.9 · Tailwind CSS 4（`@theme` + CSS 变量）· Vite 7 · `vite-plugin-singlefile`（单文件产物）。运行时依赖 `clsx`、`tailwind-merge`、`lucide-react@1.70.0`。

视觉令牌集中在 `src/index.css` 的 `:root` / `.dark`（`--bg`、`--fg`、`--mute`、`--line`、`--inv` 等），字体走 Google Fonts CDN（Inter / Noto Sans SC / Noto Serif SC / JetBrains Mono）；**离线时退回系统字体栈，功能与布局不受影响**。

## 快速开始

```bash
npm ci                 # 按 package-lock.json 精确还原；需 Node >= 20.19 或 >= 22.12
npm run dev            # http://localhost:5173
npx tsc --noEmit       # 类型检查（交付前建议跑）
npm run build          # → dist/index.html（单文件）
npm run preview        # 预览构建产物
```

`dist/index.html` 把 JS/CSS 全部内联，双击即可离线打开。

## 目录地图

```
src/
├── main.tsx / App.tsx        应用外壳：滚动侦测、阅读进度、侧栏/顶栏、命令面板、彩蛋
├── index.css                 设计令牌、工具类、动画 keyframes、深浅主题
├── types.ts                  Block / Section / Group 类型
├── content/
│   ├── index.ts              ★ 目录唯一汇总入口：groups / sections / flatIds / blockCount / lookup
│   ├── foundations.tsx       设计基础（色彩、字体、间距、图标、动效…）
│   ├── inputs.tsx            按钮、表单、输入、选择器
│   ├── navfeedback.tsx       导航、菜单、对话框、抽屉、Toast、Popover
│   ├── data.tsx              表格、树、图表、虚拟列表…
│   ├── lab.tsx               设计实验室（可调参数、导出 CSS）
│   ├── effects.tsx           文字动效、指针、3D、滚动联动、手势
│   ├── art.tsx               构图、生成艺术、设计流派
│   ├── games.tsx             小游戏与彩蛋
│   └── reference.tsx         检查清单、键盘与无障碍、术语表
├── components/
│   ├── Chrome.tsx            侧栏、顶栏、命令面板、回到顶部
│   ├── Sections.tsx          Hero、目录、分组头、Block 预览框、Footer
│   ├── ui.tsx                Btn / Seg / Switch / Range / Row / Floating 等原子组件
│   └── DotField.tsx          点阵背景画布
├── lib/
│   ├── hooks.ts              useDark / useInView / useClickOutside / useCopy / useInterval…
│   └── color.ts              颜色工具
└── utils/cn.ts                clsx + tailwind-merge
```

## 改代码要知道的

1. **新增示例**：在 `src/content/` 对应文件里加一个 `Block`（`id` / `title` / `desc` / `render` / 可选 `code`、`tips`、`flush`），`content/index.ts` 会自动汇总到目录、侧栏、搜索与统计。`id` 必须全站唯一（锚点、滚动侦测、命令面板都用它）。
2. **`Block.code` 是展示给读者看的字符串，不是实际执行的实现**。改了 `render()` 里的 demo，要同步改 `code` 和 `desc / tips`，否则教程与实现不一致。
3. **浮层统一走 `Floating`**（`src/components/ui.tsx`）：下拉菜单、可搜索下拉、Popover 通过 `createPortal` 挂到 `body`，用 `fixed` 跟随锚点定位、滚动/缩放时自动更新、空间不足向上翻转。原因是 `Sections.tsx` 的 Block 预览容器带 `overflow-hidden`，直接写 `absolute` 面板会被裁进预览框，且被祖先层叠上下文压住。**不要再把新的下拉写成 `absolute`**；对话框/抽屉/命令面板也已经是 Portal。
4. `useClickOutside` 会忽略 `[data-floating]` 内的点击，所以 Portal 面板内部点击不会误触发关闭。
5. **按钮统一用 `ui.tsx` 的 `Btn`**，行内混排的按钮都已统一 `align-middle` / `vertical-align: middle`，避免基线错位；图标按钮用 `inline-grid`，不要随手写成块级 `grid`。
6. **保持单文件、离线自包含**：`vite-plugin-singlefile` 要求资源内联，别引远程 JS/CSS 或本地图片文件；图形继续用内联 SVG / data URI。
7. 主题切换用 View Transitions API（`lib/hooks.ts`），并遵守 `prefers-reduced-motion`；无障碍要求（语义元素、`<label>`、键盘、焦点环、对比度）见 `content/reference.tsx`。

## 本次修复（相对 zip 原版）

| 问题 | 处理 |
|---|---|
| 下拉/选择框被嵌进预览框、层级压住 | 新增 `Floating` Portal 浮层，替换分割按钮菜单、可搜索下拉、账户下拉菜单、使用提示 Popover 共 4 处；右键菜单按设计仍留在虚线框内 |
| 部分按钮基线/垂直对齐不一致 | `Btn` / `Seg` / `Switch` 统一 `align-middle`，全局 `button { vertical-align: middle }`，图标按钮由块级 `grid` 改 `inline-grid`；分割按钮两半对齐 |
| 点击浮层内部被当成「点击外部」 | `useClickOutside` 排除 `[data-floating]` |
| 底部「没有一个 emoji」等自我标榜文案 | 删除；Footer 只保留「少，但是更好。谢谢你读到这里。」，Hero 统计改为「0 个 UI 组件库」，图标规范里的 emoji 措辞改为中文表述 |

设计风格、配色、排版、动画**均未改动**；以上全是实现层修正。另外顺手修了 `ui.tsx` 里 `React.HTMLAttributes` 的类型引用，使 `npx tsc --noEmit` 零错误通过。

## 构建与验证

- `npx tsc --noEmit` ✔ 0 错误
- `npm run build` ✔ 2092 个模块，`dist/index.html` 606.99 kB（gzip 179.89 kB），JS/CSS 全部内联
- 外部资源仅 Google Fonts 的字体链接，无远程 JS / 图片依赖

## 部署（GitHub Pages）

- 仓库：<https://github.com/zzhzhouzhou/UI-handbook-2.0>
- 在线：<https://zzhzhouzhou.github.io/UI-handbook-2.0/>
- 推送到 `main` 会自动触发 `.github/workflows/deploy-pages.yml`：`npm ci` → `npm run build` → 上传 `dist/` → 部署到 Pages；也可在 Actions 里手动 `workflow_dispatch`。
- 构建产物由 CI 生成，`dist/` 不入库（见 `.gitignore`）。
