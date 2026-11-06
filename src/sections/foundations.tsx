import { useState } from "react";
import {
  Bell, Calendar, Camera, Cloud, Download, Globe, Heart, Home, Lock, Loader2, Mail, Map, Moon, Music,
  Palette, Search, Settings, Share2, Star, Sun, Trash2, User, Zap, Image as ImageIcon, Edit3, Bookmark,
} from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Copyable, Range, Seg, Switch } from "../components/ui";
import { cn } from "../utils/cn";
import { useApp } from "../lib/store";

/* ---------- 色彩 ---------- */
const ZINC = [
  ["50", "bg-zinc-50"], ["100", "bg-zinc-100"], ["200", "bg-zinc-200"], ["300", "bg-zinc-300"], ["400", "bg-zinc-400"],
  ["500", "bg-zinc-500"], ["600", "bg-zinc-600"], ["700", "bg-zinc-700"], ["800", "bg-zinc-800"], ["900", "bg-zinc-900"], ["950", "bg-zinc-950"],
];
function ColorsDemo() {
  const { hue, setHue } = useApp();
  return (
    <div className="space-y-7">
      <div>
        <h4 className="mb-2 text-xs font-medium text-zinc-500">中性灰阶 Zinc · 点击复制</h4>
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
          {ZINC.map(([n, c]) => (
            <Copyable key={n} text={"zinc-" + n} className="group text-left">
              <span className={cn("block h-14 rounded-lg ring-1 ring-black/10 transition group-hover:-translate-y-0.5 dark:ring-white/10", c)} />
              <span className="mt-1 block text-center text-[11px] text-zinc-500">{n}</span>
            </Copyable>
          ))}
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-xs font-medium text-zinc-500">语义色 · 背景（浅）+ 前景（深）成对出现</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-lg border border-sky-200 bg-sky-50 px-3 py-2.5 text-sm font-medium text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">信息 Info</div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">成功 Success</div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">警告 Warning</div>
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">危险 Danger</div>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-xs font-medium text-zinc-500">强调色 · 拖动色相，整个站点同步变色</h4>
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            {[0.96, 0.9, 0.82, 0.72, 0.62, 0.52, 0.42].map((l) => (
              <span key={l} className="h-10 w-10 rounded-lg" style={{ background: `oklch(${l} 0.2 ${hue})` }} />
            ))}
          </div>
          <div className="min-w-40 flex-1">
            <Range label="Hue" value={hue} onChange={setHue} min={0} max={360} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- 排版 ---------- */
function TypographyDemo() {
  const [ratio, setRatio] = useState(1.25);
  const [base, setBase] = useState(16);
  const lv = [
    ["Display", 4, "font-extrabold tracking-tight"], ["H1", 3, "font-bold tracking-tight"], ["H2", 2, "font-semibold tracking-tight"],
    ["H3", 1, "font-semibold"], ["Body", 0, ""], ["Caption", -1, "text-zinc-500"],
  ] as const;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-6">
        <div>
          <p className="mb-1.5 text-xs text-zinc-500">字阶倍率</p>
          <Seg value={ratio} onChange={setRatio} options={[{ value: 1.125, label: "1.125" }, { value: 1.2, label: "1.2" }, { value: 1.25, label: "1.25" }, { value: 1.333, label: "1.333" }, { value: 1.5, label: "1.5" }]} />
        </div>
        <Range className="w-48" label="基准字号" value={base} onChange={setBase} min={12} max={20} unit="px" />
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {lv.map(([name, n, cls]) => {
          const size = Math.round(base * Math.pow(ratio, n) * 10) / 10;
          return (
            <div key={name} className="flex items-baseline gap-4 overflow-hidden py-2.5">
              <span className="w-16 shrink-0 font-mono text-[11px] text-zinc-400">{name}</span>
              <span className={cn("min-w-0 flex-1 truncate", cls)} style={{ fontSize: Math.min(size, 64), lineHeight: n > 1 ? 1.15 : 1.6 }}>设计即秩序 Aa 123</span>
              <span className="shrink-0 font-mono text-[11px] text-zinc-400">{size}px</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- 间距 ---------- */
function SpacingDemo() {
  const [cols, setCols] = useState(12);
  const [gap, setGap] = useState(8);
  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        {[4, 8, 12, 16, 24, 32, 48, 64].map((n) => (
          <div key={n} className="flex items-center gap-3">
            <span className="w-10 text-right font-mono text-[11px] text-zinc-500">{n}px</span>
            <div className="h-4 rounded-sm bg-accent/80" style={{ width: n * 3 }} />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-6">
          <Seg value={cols} onChange={setCols} options={[{ value: 4, label: "4 列" }, { value: 6, label: "6 列" }, { value: 12, label: "12 列" }]} />
          <Range className="w-44" label="Gap" value={gap} onChange={setGap} min={0} max={32} unit="px" />
        </div>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gap }}>
          {Array.from({ length: cols }, (_, i) => (
            <div key={i} className="h-14 rounded bg-accent/15 text-center font-mono text-[10px] leading-[56px] text-accent">{i + 1}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- 圆角阴影 ---------- */
function ElevationDemo() {
  const [r, setR] = useState(16);
  const [p, setP] = useState(8);
  const sh = ["shadow-none", "shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-2xl"];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
        {sh.map((s, i) => (
          <div key={s} className={cn("flex aspect-square flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white text-center dark:border-zinc-700 dark:bg-zinc-800", s)}>
            <span className="text-lg font-semibold">{i}</span>
            <span className="font-mono text-[10px] text-zinc-500">{s.replace("shadow-", "")}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-8">
        <div className="bg-accent/90 shadow-lg shadow-accent/30" style={{ padding: p, borderRadius: r }}>
          <div className="flex h-24 w-32 items-center justify-center bg-white text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" style={{ borderRadius: Math.max(r - p, 0) }}>
            内圆角 {Math.max(r - p, 0)}px
          </div>
        </div>
        <div className="w-56 space-y-3">
          <Range label="外圆角" value={r} onChange={setR} min={0} max={40} unit="px" />
          <Range label="内边距" value={p} onChange={setP} min={0} max={24} unit="px" />
          <p className="text-[11px] text-zinc-500">内圆角 = 外圆角 − 内边距</p>
        </div>
      </div>
    </div>
  );
}

/* ---------- 动效 ---------- */
const CURVES = [
  ["linear", "linear"], ["ease-out", "cubic-bezier(0,0,0.2,1)"], ["ease-in-out", "cubic-bezier(0.4,0,0.2,1)"],
  ["弹性 spring-ish", "cubic-bezier(0.32,0.72,0,1.3)"], ["back-out", "cubic-bezier(0.34,1.56,0.64,1)"],
];
function MotionDemo() {
  const [on, setOn] = useState(false);
  const [dur, setDur] = useState(700);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <Btn variant="accent" onClick={() => setOn((v) => !v)}>{on ? "◀ 返回" : "播放 ▶"}</Btn>
        <Range className="w-52" label="时长" value={dur} onChange={setDur} min={100} max={1500} step={50} unit="ms" />
      </div>
      <div className="space-y-2.5">
        {CURVES.map(([n, c]) => (
          <div key={n} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-zinc-500">{n}</span>
            <div className="relative h-8 flex-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800">
              <div className="pointer-events-none absolute inset-0 [container-type:inline-size]">
                <div
                  className="absolute left-1 top-1 h-6 w-6 rounded-full bg-accent shadow"
                  style={{ transform: `translateX(${on ? "calc(100cqw - 32px)" : "0px"})`, transition: `transform ${dur}ms ${c}` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 状态 ---------- */
function StatesDemo() {
  const base = "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition";
  const cells: [string, string, React.ReactNode][] = [
    ["默认", "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900", "按钮"],
    ["悬停 Hover", "bg-zinc-700 text-white dark:bg-zinc-200 dark:text-zinc-900", "按钮"],
    ["按下 Active", "scale-[0.97] bg-zinc-800 text-white dark:bg-zinc-300 dark:text-zinc-900", "按钮"],
    ["聚焦 Focus", "bg-zinc-900 text-white ring-2 ring-accent ring-offset-2 ring-offset-white dark:bg-white dark:text-zinc-900 dark:ring-offset-zinc-950", "按钮"],
    ["禁用 Disabled", "cursor-not-allowed bg-zinc-900 text-white opacity-50 dark:bg-white dark:text-zinc-900", "按钮"],
    ["加载 Loading", "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900", <><Loader2 className="h-4 w-4 animate-spin" />加载中</>],
  ];
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {cells.map(([n, c, label]) => (
        <div key={n} className="rounded-xl border border-zinc-200 p-3 text-center dark:border-zinc-800">
          <div className="mb-3 text-[11px] text-zinc-500">{n}</div>
          <span className={cn(base, c)}>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- 新增：语义令牌 深浅对照 ---------- */
function PreviewCard({ dark }: { dark?: boolean }) {
  return (
    <div className={cn(dark && "dark")}>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg"><Zap className="h-4 w-4" /></span>
          <div>
            <p className="text-sm font-semibold leading-tight">语义令牌</p>
            <p className="text-xs text-zinc-500">{dark ? "dark" : "light"} · 同一份代码</p>
          </div>
        </div>
        <div className="mb-3 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-full w-2/3 rounded-full bg-accent" /></div>
        <div className="flex gap-2">
          <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-900">主要</span>
          <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium dark:bg-zinc-800">次要</span>
          <span className="rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent">强调</span>
        </div>
      </div>
    </div>
  );
}
function TokenPairDemo() {
  const rows = [["--bg", "white", "zinc-950"], ["--surface", "zinc-50", "zinc-900"], ["--border", "zinc-200", "zinc-800"], ["--fg", "zinc-900", "zinc-100"], ["--muted", "zinc-500", "zinc-400"], ["--accent", "oklch(.56 .23 h)", "oklch(.73 .17 h)"]];
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <PreviewCard />
        <div className="rounded-xl bg-zinc-950 p-3"><PreviewCard dark /></div>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 text-xs dark:border-zinc-800">
        {rows.map(([t, l, d], i) => (
          <div key={t} className={cn("grid grid-cols-3 px-3 py-2 font-mono", i % 2 ? "bg-zinc-50/60 dark:bg-zinc-900/40" : "")}>
            <span className="text-accent">{t}</span><span>{l}</span><span className="text-zinc-500">{d}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- 新增：图标系统 ---------- */
const ICONS = [Home, Search, Settings, Bell, Heart, Star, User, Mail, Camera, Cloud, Download, Music, Map, Lock, Zap, Moon, Sun, Calendar, Bookmark, Trash2, Edit3, Share2, ImageIcon, Globe];
function IconDemo() {
  const [size, setSize] = useState(24);
  const [sw, setSw] = useState(2);
  const [filled, setFilled] = useState(false);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Range label="尺寸" value={size} onChange={setSize} min={12} max={40} unit="px" />
        <Range label="描边 stroke-width" value={sw} onChange={setSw} min={0.75} max={3} step={0.25} />
        <label className="flex items-center justify-between text-xs text-zinc-500">填充 fill <Switch checked={filled} onChange={setFilled} label="填充" /></label>
      </div>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-12">
        {ICONS.map((I, i) => (
          <div key={i} className="group grid aspect-square place-items-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:border-accent hover:text-accent dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <I width={size} height={size} strokeWidth={sw} fill={filled ? "currentColor" : "none"} className="transition group-hover:scale-110" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const foundations: Section = {
  id: "foundations", title: "设计基础", en: "Design Foundations", group: "设计基础", icon: Palette, hue: 268,
  blurb: "组件只是表象，真正决定界面是否“高级”的是底层的设计令牌：色彩、字体、间距、圆角、阴影与动效。先把这些统一，后面所有组件都会自然协调。",
  items: [
    item({
      id: "colors", title: "色彩系统", en: "Color System", level: "基础", demo: ColorsDemo, tags: ["color", "zinc", "颜色"],
      desc: "极简界面只需三类颜色：中性灰阶（承担 90%）、一个强调色（只用于最重要的动作）、语义色（成功 / 警告 / 危险 / 信息）。",
      points: ["文字：主 900，次要 500–600，占位 400，禁用 300。", "页面 white / 950，卡片 white / 900，边框 200 / 800。", "用 CSS 变量定义语义色（--bg / --fg / --accent），深色模式只替换变量。", "强调色出现越少越有力量。"],
      a11y: ["正文对比度 ≥ 4.5:1，大字与图标 ≥ 3:1（WCAG AA）。", "避免纯黑 #000 大面积背景，用 zinc-950 更柔和。"],
      mistakes: ["同一界面使用超过 2 个饱和色。", "深色模式只简单反色，没调整阴影与边框。"],
      code: `@theme inline {
  --color-accent: var(--accent);
}
:root {
  --accent-h: 268;
  --accent: oklch(0.56 0.23 var(--accent-h));
}
.dark {
  /* 深色模式：提高明度、降低饱和度 */
  --accent: oklch(0.73 0.17 var(--accent-h));
}`,
    }),
    item({
      id: "typography", title: "排版层级", en: "Typography Scale", level: "基础", demo: TypographyDemo, tags: ["font", "字体", "字号"],
      desc: "用 5–6 级字号、2–3 种字重和明确的行高建立层级。标题收紧字距，正文保持 1.6–1.7 行高，数字用等宽数字对齐。",
      points: ["字号采用倍率比例（如 1.25 Major Third）：12 / 14 / 16 / 20 / 25 / 31。", "大标题 letter-spacing -0.02em ~ -0.04em。", "一行正文 60–75 字符（max-w-prose）。", "数字 / 表格用 tabular-nums 防止抖动。"],
      mistakes: ["字号层级过多，彼此差距太小。"],
      code: `const size = (n: number, base = 16, ratio = 1.25) =>
  Math.round(base * Math.pow(ratio, n) * 10) / 10;

// size(0)=16  size(1)=20  size(2)=25  size(3)=31.3`,
    }),
    item({
      id: "spacing", title: "间距与栅格", en: "Spacing & Grid", level: "基础", demo: SpacingDemo, tags: ["gap", "margin", "grid", "栅格"],
      desc: "使用 4px 基准的间距刻度，所有 padding / gap / margin 只从刻度里取。亲密性传达关系：相关元素靠近、无关元素拉远。",
      points: ["组件内部 4–12px，组件之间 16–24px，区块之间 48–96px。", "优先使用 gap 而非 margin，避免外边距折叠。", "自适应栅格：grid-cols-[repeat(auto-fill,minmax(240px,1fr))]。"],
      code: `<div className="grid grid-cols-12 gap-4">
  <aside className="col-span-3" />
  <main className="col-span-9" />
</div>`,
    }),
    item({
      id: "elevation", title: "圆角阴影层级", en: "Radius & Elevation", level: "基础", demo: ElevationDemo, tags: ["shadow", "radius", "阴影"],
      desc: "极简风格里阴影应当“几乎看不见”：低海拔用 1px 边框 + 极淡阴影，高海拔（弹窗、菜单）用多层叠加的柔和阴影。",
      points: ["小元素 6px、卡片 12px、弹窗 16px。", "多层阴影：0 1px 2px / .04, 0 4px 12px / .08。", "嵌套圆角：内圆角 = 外圆角 − 内边距。", "深色模式阴影几乎不可见，改用更亮的边框表达层级。"],
      mistakes: ["阴影用纯黑高不透明度。", "同一界面圆角超过 3 种。"],
      code: `<div className="rounded-2xl p-2 bg-accent">
  {/* 16 - 8 = 8px */}
  <div className="rounded-lg bg-white" />
</div>`,
    }),
    item({
      id: "motion-tokens", title: "动效令牌", en: "Motion Tokens", level: "基础", demo: MotionDemo, tags: ["easing", "transition", "缓动"],
      desc: "动效要有统一的时长与缓动：微交互 150ms、进出场 200–300ms、退出比进入快 20%。悬停或点击上方，对比五种缓动曲线。",
      points: ["颜色变化 150ms ease；弹窗 200ms ease-out + scale 0.96→1。", "抽屉 300ms cubic-bezier(0.32,0.72,0,1)。", "只对 transform 与 opacity 做动画，避免触发重排。", "列表出现使用 stagger，每项延迟 30–50ms。"],
      a11y: ["尊重 prefers-reduced-motion，减少或关闭动画。"],
      code: `.panel {
  transition: transform 300ms cubic-bezier(0.32, 0.72, 0, 1);
}
@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}`,
    }),
    item({
      id: "states", title: "交互状态", en: "Interaction States", level: "基础", demo: StatesDemo, tags: ["hover", "focus", "disabled"],
      desc: "每个可交互元素至少要设计 6 种状态：默认、悬停、按下、聚焦（键盘）、禁用、加载。状态之间的差异“可感知但不突兀”。",
      points: ["悬停：背景加深一级；按下：scale(0.97)；聚焦：2px 焦点环 + 2px 偏移。", "禁用：opacity 50% + cursor-not-allowed。", "加载态保持按钮宽度，避免布局抖动。"],
      a11y: ["用 :focus-visible 而不是 :focus，鼠标点击不出现焦点环。", "hover 样式包在 @media (hover: hover) 中。"],
      code: `<button className="
  bg-zinc-900 text-white
  hover:bg-zinc-700 active:scale-[0.97]
  focus-visible:ring-2 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">保存</button>`,
    }),
    item({
      id: "token-pair", title: "语义令牌 · 深浅对照", en: "Semantic Tokens Light / Dark", level: "进阶", isNew: true, demo: TokenPairDemo, tags: ["dark", "token", "令牌"],
      desc: "同一份组件代码，在 .dark 作用域内自动换肤。左右两侧渲染的是完全相同的 JSX，只是外层多了一个 dark 类。",
      points: ["Tailwind 4 用 @custom-variant dark (&:where(.dark, .dark *)) 让任意子树都能局部深色。", "组件只引用语义，不引用具体色值。", "可以用此技巧做“深浅对比”文档或局部深色区块（页脚、代码块）。"],
      code: `@custom-variant dark (&:where(.dark, .dark *));

<div className="dark">
  <Card /> {/* 内部 dark: 变体全部生效 */}
</div>`,
    }),
    item({
      id: "icons", title: "图标系统", en: "Iconography", level: "基础", isNew: true, demo: IconDemo, tags: ["icon", "svg", "图标"],
      desc: "图标与文字共享同一条视觉重量：描边粗细要和字重匹配。线性图标统一 1.5–2 描边、24 网格，不要混用填充与线性。",
      points: ["尺寸只取 16 / 20 / 24 三档，和文字行高对齐。", "使用 currentColor 继承文字色，免去深浅色两套资源。", "纯图标按钮必须有 aria-label，点击区不小于 40px。"],
      code: `import { Heart } from "lucide-react";

<Heart size={20} strokeWidth={1.75} className="text-accent" />`,
    }),
  ],
};
