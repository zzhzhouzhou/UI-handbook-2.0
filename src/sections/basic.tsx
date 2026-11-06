import { useRef, useState } from "react";
import { Check, ChevronDown, Heart, Loader2, MousePointerClick, Moon, Plus, Send, Sun, X, ArrowRight, Download, Copy } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, inputCls } from "../components/ui";
import { cn } from "../utils/cn";
import { useClickOutside, useInterval } from "../lib/hooks";
import { confetti } from "../lib/confetti";
import { useApp } from "../lib/store";

function ButtonDemo() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Btn variant="primary">主要按钮</Btn>
        <Btn variant="accent">强调</Btn>
        <Btn variant="secondary">次要</Btn>
        <Btn variant="outline">描边</Btn>
        <Btn variant="ghost">幽灵</Btn>
        <Btn variant="danger">危险</Btn>
        <button className="text-sm font-medium text-accent underline-offset-4 hover:underline">链接按钮</button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Btn size="sm" variant="primary">Small</Btn>
        <Btn size="md" variant="primary">Medium</Btn>
        <Btn size="lg" variant="primary">Large</Btn>
        <Btn variant="outline" size="md"><Plus className="h-4 w-4" />添加</Btn>
        <Btn variant="primary" onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1600); }} disabled={loading} className="min-w-28">
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" />保存中…</> : "点击加载"}
        </Btn>
        <Btn variant="primary" disabled>禁用</Btn>
        <button aria-label="发送" className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-fg transition hover:scale-105 active:scale-95"><Send className="h-4 w-4" /></button>
      </div>
      <div className="inline-flex overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700">
        {["日", "周", "月"].map((t, i) => (
          <button key={t} className={cn("px-4 py-1.5 text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-800", i && "border-l border-zinc-300 dark:border-zinc-700")}>{t}</button>
        ))}
      </div>
    </div>
  );
}

function SegmentedDemo() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const A = ["列表", "看板", "日历"];
  const B = ["日", "周", "月", "年"];
  return (
    <div className="space-y-6">
      <div className="relative inline-grid grid-cols-3 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        <span className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-lg bg-white shadow transition-transform duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] dark:bg-zinc-600" style={{ transform: `translateX(${a * 100}%)` }} />
        {A.map((t, i) => (
          <button key={t} onClick={() => setA(i)} className={cn("relative z-10 px-6 py-1.5 text-sm font-medium transition-colors", a === i ? "text-zinc-900 dark:text-white" : "text-zinc-500")}>{t}</button>
        ))}
      </div>
      <div className="block">
        <div className="relative inline-grid grid-cols-4 rounded-full border border-zinc-200 p-1 dark:border-zinc-700">
          <span className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/4)] rounded-full bg-accent transition-transform duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]" style={{ transform: `translateX(${b * 100}%)` }} />
          {B.map((t, i) => (
            <button key={t} onClick={() => setB(i)} className={cn("relative z-10 px-5 py-1 text-sm font-medium transition-colors", b === i ? "text-accent-fg" : "text-zinc-500")}>{t}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BadgeDemo() {
  const [n, setN] = useState(3);
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">默认</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300">
          <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />在线
        </span>
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300">待审核</span>
        <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-500/10 dark:text-red-300">已过期</span>
      </div>
      <button onClick={() => setN((v) => v + 1)} className="relative grid h-10 w-10 place-items-center rounded-xl border border-zinc-200 dark:border-zinc-700" aria-label={`通知 ${n} 条`}>
        🔔
        <span key={n} className="anim-pop absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-950">{n > 99 ? "99+" : n}</span>
      </button>
      <span className="relative inline-flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" /></span>
      <span className="text-xs text-zinc-500">点击铃铛 +1</span>
    </div>
  );
}

const AV = ["from-violet-500 to-fuchsia-500", "from-sky-500 to-cyan-400", "from-amber-500 to-orange-500", "from-emerald-500 to-teal-400", "from-rose-500 to-pink-400"];
function AvatarDemo() {
  const names = ["张三", "Lisa", "王五", "Tom", "赵六", "Amy"];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {[28, 36, 48, 64].map((s, i) => (
          <div key={s} className="relative">
            <div className={cn("grid place-items-center rounded-full bg-gradient-to-br font-semibold text-white", AV[i])} style={{ width: s, height: s, fontSize: s / 3 }}>{names[i].slice(0, 1)}</div>
            {i === 2 && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />}
          </div>
        ))}
      </div>
      <div className="flex -space-x-3">
        {names.slice(0, 4).map((n, i) => (
          <div key={n} title={n} className={cn("grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br text-sm font-semibold text-white ring-2 ring-white transition hover:z-10 hover:-translate-y-1 dark:ring-zinc-950", AV[i])}>{n.slice(0, 1)}</div>
        ))}
        <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-200 text-xs font-medium text-zinc-600 ring-2 ring-white dark:bg-zinc-700 dark:text-zinc-200 dark:ring-zinc-950">+12</div>
      </div>
    </div>
  );
}

function TooltipDemo() {
  const pos: Record<string, string> = {
    top: "bottom-full left-1/2 mb-2 -translate-x-1/2", bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
    left: "right-full top-1/2 mr-2 -translate-y-1/2", right: "left-full top-1/2 ml-2 -translate-y-1/2",
  };
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-6">
      {Object.keys(pos).map((p) => (
        <span key={p} className="group relative inline-flex">
          <Btn variant="outline" aria-describedby={"tip-" + p}>{p}</Btn>
          <span role="tooltip" id={"tip-" + p} className={cn("pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs text-white opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-white dark:text-zinc-900", pos[p])}>
            提示信息 · {p}
          </span>
        </span>
      ))}
    </div>
  );
}

function TagInputDemo() {
  const [tags, setTags] = useState(["React", "Tailwind"]);
  const [v, setV] = useState("");
  const add = () => {
    const t = v.trim().slice(0, 12);
    if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]);
    setV("");
  };
  return (
    <div className="max-w-md">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-300 bg-white p-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 dark:border-zinc-700 dark:bg-zinc-900">
        {tags.map((t) => (
          <span key={t} className="anim-scale-in inline-flex items-center gap-1 rounded-md bg-accent-soft py-0.5 pl-2 pr-1 text-sm text-accent">
            {t}
            <button aria-label={`移除 ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))} className="rounded p-0.5 hover:bg-accent/20"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input value={v} onChange={(e) => setV(e.target.value)} placeholder={tags.length < 6 ? "输入后回车添加" : "已达上限"} disabled={tags.length >= 6}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } else if (e.key === "Backspace" && !v) setTags(tags.slice(0, -1)); }}
          className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none" />
      </div>
      <p className="mt-1.5 text-xs text-zinc-500">回车添加 · Backspace 删除最后一个 · 最多 6 个</p>
    </div>
  );
}

function NumberStepperDemo() {
  const [n, setN] = useState(2);
  const [min, max] = [1, 10];
  return (
    <div className="flex items-center gap-6">
      <div className="inline-flex items-center rounded-lg border border-zinc-300 dark:border-zinc-700">
        <button aria-label="减少" disabled={n <= min} onClick={() => setN(n - 1)} className="grid h-10 w-10 place-items-center text-lg transition hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800">−</button>
        <input aria-label="数量" value={n} onChange={(e) => setN(Math.min(max, Math.max(min, +e.target.value || min)))} className="h-10 w-12 border-x border-zinc-300 bg-transparent text-center text-sm tabular-nums outline-none dark:border-zinc-700" />
        <button aria-label="增加" disabled={n >= max} onClick={() => setN(n + 1)} className="grid h-10 w-10 place-items-center text-lg transition hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800">+</button>
      </div>
      <span className="text-xs text-zinc-500">范围 {min}–{max} · 到达边界自动禁用</span>
    </div>
  );
}

function CountdownDemo() {
  const [s, setS] = useState(0);
  useInterval(() => setS((v) => v - 1), s > 0 ? 1000 : null);
  return (
    <div className="flex max-w-sm gap-2">
      <input className={inputCls} placeholder="手机号" inputMode="numeric" />
      <Btn variant="accent" className="h-10 w-32" disabled={s > 0} onClick={() => setS(60)}>{s > 0 ? `${s}s 后重发` : "获取验证码"}</Btn>
    </div>
  );
}

function SplitDemo() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("保存");
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  return (
    <div ref={ref} className="relative inline-flex min-h-60 items-start">
      <Btn variant="primary" className="rounded-r-none">{mode}</Btn>
      <button aria-label="更多" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-r-lg border-l border-white/20 bg-zinc-900 text-white transition hover:bg-zinc-700 dark:border-zinc-900/20 dark:bg-white dark:text-zinc-900">
        <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="anim-scale-in absolute left-0 top-11 z-10 w-44 origin-top-left rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {["保存", "保存并关闭", "另存为…", "保存为草稿"].map((m) => (
            <li key={m}><button onClick={() => { setMode(m); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">{m}{m === mode && <Check className="h-3.5 w-3.5 text-accent" />}</button></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StateButtonDemo() {
  const [st, setSt] = useState<"idle" | "loading" | "ok">("idle");
  const [cp, setCp] = useState(false);
  const run = () => { setSt("loading"); setTimeout(() => setSt("ok"), 1500); setTimeout(() => setSt("idle"), 3200); };
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button onClick={run} disabled={st !== "idle"} className={cn("relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full px-6 text-sm font-semibold text-white transition-all duration-500", st === "ok" ? "w-44 bg-emerald-500" : st === "loading" ? "w-11 bg-accent px-0" : "w-44 bg-accent")}>
        <span className={cn("absolute inline-flex items-center gap-2 transition-all duration-300", st === "idle" ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0")}><Download className="h-4 w-4" />下载文件</span>
        <Loader2 className={cn("absolute h-5 w-5 transition-all duration-300", st === "loading" ? "animate-spin opacity-100" : "scale-50 opacity-0")} />
        <span className={cn("absolute inline-flex items-center gap-2 transition-all duration-300", st === "ok" ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}><Check className="h-4 w-4" />下载完成</span>
      </button>
      <button onClick={() => { setCp(true); setTimeout(() => setCp(false), 1400); }} className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-300 px-4 text-sm font-medium transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800">
        <span className="relative h-4 w-4">
          <Copy className={cn("absolute inset-0 h-4 w-4 transition-all duration-300", cp ? "rotate-90 scale-0" : "")} />
          <Check className={cn("absolute inset-0 h-4 w-4 text-emerald-500 transition-all duration-300", cp ? "" : "-rotate-90 scale-0")} />
        </span>
        {cp ? "已复制" : "复制链接"}
      </button>
    </div>
  );
}

function LikeDemo() {
  const [on, setOn] = useState(false);
  const [n, setN] = useState(128);
  return (
    <div className="flex items-center gap-6">
      <button aria-pressed={on} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); if (!on) confetti(r.left + r.width / 2, r.top + r.height / 2, 36); setOn(!on); setN(n + (on ? -1 : 1)); }}
        className={cn("group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition", on ? "border-rose-300 bg-rose-50 text-rose-600 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300" : "border-zinc-300 hover:border-rose-300 dark:border-zinc-700")}>
        <Heart key={String(on)} className={cn("h-5 w-5 transition", on ? "anim-pop fill-current" : "group-hover:scale-110")} />
        <span className="tabular-nums">{n}</span>
      </button>
      <span className="text-xs text-zinc-500">点赞时触发粒子爆发（canvas 纸屑）</span>
    </div>
  );
}

function ChipDemo() {
  const all = ["设计", "前端", "后端", "动效", "无障碍", "性能", "工程化"];
  const [sel, setSel] = useState<string[]>(["前端"]);
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {all.map((c) => {
          const on = sel.includes(c);
          return (
            <button key={c} aria-pressed={on} onClick={() => setSel(on ? sel.filter((x) => x !== c) : [...sel, c])} className={cn("inline-flex items-center gap-1 rounded-full border py-1 text-sm transition-all", on ? "border-accent bg-accent-soft pl-2.5 pr-3 text-accent" : "border-zinc-300 px-3 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300")}>
              {on && <Check className="h-3.5 w-3.5" />}{c}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-zinc-500">已选：{sel.length ? sel.join("、") : "无"}</p>
    </div>
  );
}

function ThemeToggleDemo() {
  const { theme, toggleTheme } = useApp();
  const dark = theme === "dark";
  return (
    <div className="flex items-center gap-6">
      <button onClick={toggleTheme} aria-label="切换主题" className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-zinc-300 transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
        <Sun className={cn("absolute h-5 w-5 transition-all duration-500", dark ? "rotate-90 scale-0" : "")} />
        <Moon className={cn("absolute h-5 w-5 transition-all duration-500", dark ? "" : "-rotate-90 scale-0")} />
      </button>
      <span className="text-xs text-zinc-500">图标旋转 + 缩放交叉淡入，页面以点击位置为圆心扩散切换（View Transitions API）</span>
    </div>
  );
}

function MagicLinkDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <button className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-xl bg-zinc-900 px-6 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full dark:via-black/10" />
        <span className="relative">扫光按钮</span>
      </button>
      <button className="group inline-flex h-11 items-center gap-2 rounded-xl border border-zinc-300 px-6 text-sm font-medium transition hover:border-accent hover:text-accent dark:border-zinc-700">
        了解更多 <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
      <button className="relative inline-flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold text-accent-fg">
        <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-accent via-pink-500 to-amber-400 opacity-70 blur transition group-hover:opacity-100" />
        <span className="absolute inset-0 rounded-xl bg-accent" />
        <span className="relative inline-flex items-center gap-2"><MousePointerClick className="h-4 w-4" />光晕按钮</span>
      </button>
    </div>
  );
}

export const basic: Section = {
  id: "basic", title: "基础组件", en: "Essentials", group: "组件", icon: MousePointerClick, hue: 200,
  blurb: "按钮、徽章、头像、工具提示——这些不依赖复杂状态的元素构成了界面的词汇表。它们「小而常用」，每个像素的一致性都会被放大。",
  items: [
    item({ id: "button", title: "按钮", en: "Button", level: "基础", demo: ButtonDemo, tags: ["btn"],
      desc: "界面中最核心的交互元素。6 种变体、3 种尺寸、图标按钮、加载态、禁用态、按钮组。一个页面里主要按钮只出现一次。",
      points: ["variant × size 两个维度组合 class，用 cva 或简单映射表管理。", "加载态：禁用点击 + spinner，保持宽度不变。", "危险按钮配合二次确认。"],
      a11y: ["纯图标按钮必须有 aria-label。", "触控目标 ≥ 40×40px。"], mistakes: ["一个页面出现多个主要按钮，主次不分。"],
      code: `const V = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-700",
  accent: "bg-accent text-accent-fg hover:brightness-110",
  outline: "border border-zinc-300 hover:bg-zinc-50",
};
<button className={cn("h-9 px-4 rounded-lg active:scale-[0.97]", V[variant])}>保存</button>` }),
    item({ id: "segmented", title: "分段控制器", en: "Segmented Control", level: "基础", demo: SegmentedDemo, tags: ["tab", "toggle"],
      desc: "在 2–4 个互斥视图间切换，比下拉更直接。滑块指示器用 transform 平移，带来 iOS 般的质感。",
      points: ["等分网格 + 绝对定位滑块，translateX(index × 100%)。", "弹性缓动 cubic-bezier(0.34,1.56,0.64,1) 带来轻微回弹。"], a11y: ["role=tablist / tab，aria-selected。方向键切换。"],
      code: `<div className="relative grid grid-cols-3 p-1 rounded-xl bg-zinc-100">
  <span className="absolute inset-y-1 left-1 w-[calc((100%-.5rem)/3)] rounded-lg bg-white
    transition-transform" style={{ transform: "translateX(" + i * 100 + "%)" }} />
  {tabs.map(...)}
</div>` }),
    item({ id: "badge", title: "徽章 · 标签 · 角标", en: "Badge / Tag / Dot", level: "进阶", demo: BadgeDemo, tags: ["tag", "角标"],
      desc: "用小面积颜色传达状态或数量。状态徽章用「浅底 + 深字 + 细环」，角标用红色高对比并加白环与背景分离。",
      points: ["数量超过 99 显示 99+。", "数字变化时用 pop 动画吸引注意。", "在线状态点用 ping 动画表示“活跃”。"], a11y: ["不要只靠颜色：状态需带文字，角标需 aria-label 说明数量。"],
      code: `<span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700
  ring-1 ring-inset ring-emerald-600/20">在线</span>` }),
    item({ id: "avatar", title: "头像", en: "Avatar & Stack", level: "进阶", demo: AvatarDemo, tags: ["user"],
      desc: "用户身份的视觉锚点。无图片时用首字 + 稳定的渐变背景（按名字哈希取色）；多人时叠放并显示 +N。",
      points: ["叠放用负 margin + ring 与背景分离。", "悬停抬起并提高 z-index，方便辨认。", "图片加载失败回退到首字。"], code: `<div className="flex -space-x-3">
  <Avatar className="ring-2 ring-white" />
  <div className="ring-2 ring-white">+12</div>
</div>` }),
    item({ id: "tooltip", title: "工具提示", en: "Tooltip", level: "进阶", demo: TooltipDemo, tags: ["hint"],
      desc: "为图标按钮和缩写补充说明。只放简短文本；需要交互内容请改用 Popover。",
      points: ["纯 CSS：group-hover + group-focus-within，无需 JS。", "出现延迟 ~150ms，避免鼠标划过时闪烁。"], a11y: ["用 aria-describedby 关联；键盘聚焦同样显示；Esc 可关闭。", "触屏设备无 hover，不要把关键信息只放在 tooltip。"],
      code: `<span className="group relative">
  <button aria-describedby="tip">hover</button>
  <span id="tip" role="tooltip" className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">…</span>
</span>` }),
    item({ id: "tag-input", title: "标签输入", en: "Tag Input", level: "进阶", demo: TagInputDemo, tags: ["chips"],
      desc: "输入多个自由文本值（邮箱、关键词、技能）。回车确认，Backspace 删除最后一个。",
      points: ["去重、限制长度与数量，并给出提示。", "整个容器 focus-within 高亮，而不是只有 input。"], a11y: ["删除按钮需要 aria-label 说明被删除的项。"],
      code: `onKeyDown={(e) => {
  if (e.key === "Enter") add();
  if (e.key === "Backspace" && !v) setTags(tags.slice(0, -1));
}}` }),
    item({ id: "number-stepper", title: "数字步进器", en: "Number Stepper", level: "进阶", demo: NumberStepperDemo, tags: ["quantity"],
      desc: "购物车数量、人数选择等小范围整数输入。到达边界自动禁用对应按钮。",
      points: ["输入框失焦时校正到 [min, max]。", "按住 +/− 可连续变化（可选）。"], code: `<button disabled={n <= min} onClick={() => setN(n - 1)}>−</button>` }),
    item({ id: "countdown-btn", title: "倒计时按钮", en: "Countdown Button", level: "进阶", demo: CountdownDemo, tags: ["验证码", "otp"],
      desc: "获取验证码、重发邮件等需要冷却的操作，倒计时期间禁用并显示剩余秒数。",
      points: ["用 setInterval + 清理函数，卸载时清除。", "记录目标时间戳而不是递减，避免标签页切后台时漂移。"], code: `useInterval(() => setS((v) => v - 1), s > 0 ? 1000 : null);` }),
    item({ id: "split-btn", title: "分割按钮", en: "Split Button", level: "进阶", demo: SplitDemo, tags: ["menu"],
      desc: "主操作 + 备选操作。点击主区域执行默认动作，点击箭头展开更多选项。",
      points: ["点击外部与 Esc 关闭菜单。", "记住上次选择的模式，作为下次默认动作。"], a11y: ["箭头按钮需 aria-expanded 与 aria-haspopup。"], code: `<button aria-expanded={open} aria-haspopup="menu">▾</button>` }),
    item({ id: "state-button", title: "状态机按钮", en: "Stateful Button", level: "高级", isNew: true, demo: StateButtonDemo, tags: ["loading", "success"],
      desc: "把按钮建模为 idle → loading → success 的状态机：宽度收缩成圆形 spinner，成功后展开显示对勾，再自动复位。",
      points: ["三个状态的内容绝对定位叠放，用 opacity + translateY 交叉淡入。", "宽度用 transition 过渡，状态切换无跳动。", "复制按钮同理：两个图标旋转缩放交换。"], a11y: ["loading 时 disabled，并用 aria-live 播报结果。"],
      code: `type S = "idle" | "loading" | "ok";
const [st, setSt] = useState<S>("idle");
// idle → loading(1.5s) → ok(1.7s) → idle` }),
    item({ id: "like-btn", title: "点赞爆发", en: "Like Burst", level: "高级", isNew: true, demo: LikeDemo, tags: ["fun", "heart"],
      desc: "微交互让反馈更“有情绪”。点赞时爱心弹跳 + 粒子喷发，取消时无动画，避免反复点击的烦扰。",
      points: ["只在“开”的方向播放粒子。", "用 key 重置 CSS 动画，保证每次都能重新播放。"], code: `if (!on) confetti(x, y, 36);
<Heart key={String(on)} className={on ? "anim-pop fill-current" : ""} />` }),
    item({ id: "chips", title: "筛选标签", en: "Filter Chips", level: "基础", isNew: true, demo: ChipDemo, tags: ["filter"],
      desc: "多选过滤条件。选中态加对勾图标并改变背景，而不仅仅依赖颜色。",
      a11y: ["使用 aria-pressed 表示开关状态。"], code: `<button aria-pressed={on} className={on ? "border-accent bg-accent-soft" : ""}>` }),
    item({ id: "theme-toggle", title: "主题切换按钮", en: "Theme Toggle", level: "进阶", isNew: true, demo: ThemeToggleDemo, tags: ["dark", "moon"],
      desc: "太阳 / 月亮交叉旋转。点击后整页以鼠标位置为圆心扩散换肤——试试右上角的按钮。",
      points: ["document.startViewTransition 截取新旧两帧快照。", "用 clip-path: circle() 动画 ::view-transition-new(root)。", "不支持的浏览器直接切换。"], a11y: ["尊重 prefers-reduced-motion，禁用转场。"],
      code: `const t = document.startViewTransition(apply);
t.ready.then(() => document.documentElement.animate(
  { clipPath: ["circle(0 at x y)", "circle(R at x y)"] },
  { duration: 600, pseudoElement: "::view-transition-new(root)" }
));` }),
    item({ id: "fancy-buttons", title: "特效按钮", en: "Fancy Buttons", level: "进阶", isNew: true, demo: MagicLinkDemo, tags: ["shine", "glow"],
      desc: "扫光、箭头位移、渐变光晕——三种低成本的 hover 特效，用在营销页的主 CTA 上。",
      points: ["扫光：伪元素 translateX(-100% → 100%)。", "光晕：模糊的渐变层放在按钮后面。", "克制使用：一个页面最多一个特效按钮。"], code: `<span className="absolute inset-0 -translate-x-full bg-gradient-to-r
  from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700" />` }),
  ],
};
