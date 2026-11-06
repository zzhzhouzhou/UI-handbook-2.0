import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bookmark, ChevronLeft, ChevronRight, Command, Copy, Dices, Layers, MousePointerClick, Palette, Search, Sparkles, Trophy, Zap } from "lucide-react";
import { cn } from "../utils/cn";
import { useApp } from "../lib/store";
import { go, type Route } from "../lib/router";
import { allItems, itemMap, sectionMap, sections, stats } from "../registry";
import { ItemCard, LEVEL_STYLE } from "./Doc";
import { Btn, Range, Switch } from "./ui";
import { useInView } from "../lib/hooks";
import type { Level } from "../lib/types";

function CountUp({ to, className }: { to: number; className?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>("0px");
  const [v, setV] = useState(0);
  useEffect(() => { if (!seen) return; const t0 = performance.now(); let id = 0; const loop = (t: number) => { const p = Math.min((t - t0) / 1400, 1); setV(Math.round(to * (1 - Math.pow(1 - p, 4)))); if (p < 1) id = requestAnimationFrame(loop); }; id = requestAnimationFrame(loop); return () => cancelAnimationFrame(id); }, [seen, to]);
  return <span ref={ref} className={className}>{v}</span>;
}

/* ---------------- 首页 Hero ---------------- */
function LivePlayground() {
  const { hue, setHue, radius, setRadius } = useApp();
  const [on, setOn] = useState(true);
  const [p, setP] = useState(64);
  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-accent/30 via-pink-400/20 to-amber-300/20 blur-2xl" />
      <div className="anim-float rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-2xl shadow-accent/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-400" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></div><span className="text-[11px] font-medium text-zinc-400">LIVE · 拖动滑块试试</span></div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4"><Range label="主色色相" value={hue} onChange={setHue} min={0} max={360} /><Range label="圆角" value={radius} onChange={setRadius} min={0} max={2} step={0.1} unit="×" /></div>
          <div className="flex flex-wrap items-center gap-2"><Btn variant="accent">主要按钮</Btn><Btn variant="outline">描边</Btn><Btn variant="secondary">次要</Btn><span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">徽章</span></div>
          <div className="flex items-center justify-between rounded-xl bg-zinc-100 px-3 py-2.5 dark:bg-zinc-800/70"><span className="text-sm font-medium">推送通知</span><Switch checked={on} onChange={setOn} label="推送通知" /></div>
          <div><div className="mb-1.5 flex justify-between text-xs text-zinc-500"><span>学习进度</span><span className="tabular-nums">{p}%</span></div><input type="range" className="rng w-full" value={p} onChange={(e) => setP(+e.target.value)} style={{ background: `linear-gradient(90deg, var(--accent) ${p}%, transparent ${p}%), var(--color-zinc-200)` }} aria-label="进度" /></div>
          <div className="grid grid-cols-3 gap-2 text-center">{[["组件", stats.total], ["章节", stats.chapters], ["新增", stats.fresh]].map(([l, n]) => <div key={l as string} className="rounded-xl border border-zinc-200 py-2.5 dark:border-zinc-700"><p className="text-xl font-bold tabular-nums text-accent"><CountUp to={n as number} /></p><p className="text-[11px] text-zinc-500">{l}</p></div>)}</div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { setPaletteOpen } = useApp();
  const random = () => { const i = allItems[Math.floor(Math.random() * allItems.length)]; go(`/s/${i.sectionId}/${i.id}`); };
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <span className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-accent/25 blur-[90px]" style={{ animation: "aurora 20s ease-in-out infinite" }} />
        <span className="absolute -right-10 top-10 h-80 w-80 rounded-full bg-pink-400/20 blur-[90px]" style={{ animation: "aurora 24s -8s ease-in-out infinite" }} />
        <span className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-300/20 blur-[90px]" style={{ animation: "aurora 28s -14s ease-in-out infinite" }} />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
        <div>
          <span className="anim-fade-up inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-zinc-600 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>Interface Component Handbook · 2026 · v2.0</span>
          <h1 className="anim-fade-up mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight [animation-delay:80ms] sm:text-5xl lg:text-6xl">把界面上会用到的一切，<br />看一遍、懂一遍、<span className="text-gradient">做一遍</span>。</h1>
          <p className="anim-fade-up mt-6 max-w-xl text-base leading-relaxed text-zinc-600 [animation-delay:160ms] dark:text-zinc-400">一份从设计令牌到高级交互的可交互 UI 教程。每个组件都有<b className="text-zinc-900 dark:text-zinc-100">可操作的预览</b>、用途说明、实现要点、无障碍细节与<b className="text-zinc-900 dark:text-zinc-100">可复制的核心代码</b>。2.0 新增设计实验室、游戏与彩蛋，以及全站可调的主色 / 圆角 / 字体。</p>
          <div className="anim-fade-up mt-8 flex flex-wrap items-center gap-3 [animation-delay:240ms]">
            <Btn variant="accent" size="lg" onClick={() => go("/s/foundations")}>从基础开始 <ArrowRight className="h-4 w-4" /></Btn>
            <Btn variant="outline" size="lg" onClick={() => go("/s/lab")}><Sparkles className="h-4 w-4" />逛逛设计实验室</Btn>
            <Btn variant="ghost" size="lg" onClick={random}><Dices className="h-4 w-4" />手气不错</Btn>
          </div>
          <button onClick={() => setPaletteOpen(true)} className="anim-fade-up mt-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900 [animation-delay:320ms] dark:hover:text-white"><Command className="h-4 w-4" />按 <kbd className="rounded border border-zinc-300 px-1.5 font-mono text-xs dark:border-zinc-700">⌘</kbd> <kbd className="rounded border border-zinc-300 px-1.5 font-mono text-xs dark:border-zinc-700">K</kbd> 快速搜索任意组件</button>
        </div>
        <LivePlayground />
      </div>
    </section>
  );
}

/* ---------------- 学习路径 ---------------- */
function LearningPath() {
  const { learned } = useApp();
  const L: [Level, string, string][] = [["基础", "打好地基", "每个界面都会用到的词汇"], ["进阶", "组合与细节", "状态、动效与可访问性"], ["高级", "高级交互", "手势、Canvas、物理与 3D"]];
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionTitle icon={Trophy} kicker="Learning Path" title="学习路径" sub="三个难度层级，边学边打卡。点击组件卡片右上角的 ✓ 标记“已学会”，进度保存在本地。" />
      <div className="grid gap-4 md:grid-cols-3">
        {L.map(([lv, t, d]) => {
          const list = allItems.filter((i) => i.level === lv); const done = list.filter((i) => learned.includes(i.id)).length; const next = list.find((i) => !learned.includes(i.id));
          return (
            <div key={lv} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", LEVEL_STYLE[lv])}>{lv}</span>
              <h3 className="mt-3 text-xl font-bold tracking-tight">{t}</h3><p className="text-sm text-zinc-500">{d}</p>
              <div className="mt-5 flex items-end justify-between"><p className="text-3xl font-extrabold tabular-nums">{done}<span className="text-base font-medium text-zinc-400"> / {list.length}</span></p><span className="text-xs text-zinc-500">{Math.round((done / list.length) * 100)}%</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-full rounded-full bg-gradient-to-r from-accent to-pink-500 transition-all duration-700" style={{ width: (done / list.length) * 100 + "%" }} /></div>
              <button disabled={!next} onClick={() => next && go(`/s/${next.sectionId}/${next.id}`)} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent disabled:text-emerald-500">{next ? <>继续：{next.title} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></> : "🎉 已全部学会"}</button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SectionTitle({ icon: Icon, kicker, title, sub }: { icon: typeof Zap; kicker: string; title: string; sub?: string }) {
  return <div className="mb-8"><p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent"><Icon className="h-4 w-4" />{kicker}</p><h2 className="text-3xl font-bold tracking-tight">{title}</h2>{sub && <p className="mt-2 max-w-2xl text-sm text-zinc-500">{sub}</p>}</div>;
}

/* ---------------- 章节便当格 ---------------- */
function Chapters() {
  const { learned } = useApp();
  const box = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => { box.current!.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => { const r = c.getBoundingClientRect(); c.style.setProperty("--x", e.clientX - r.left + "px"); c.style.setProperty("--y", e.clientY - r.top + "px"); }); };
  return (
    <section className="border-y border-zinc-200 bg-zinc-50/60 py-16 dark:border-zinc-800 dark:bg-zinc-900/20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle icon={Layers} kicker="Chapters" title={`${stats.chapters} 个章节，${stats.total} 个组件`} sub="从设计令牌到高级交互，覆盖一个设计系统需要的全部内容。带 NEW 的章节为 2.0 新增。" />
        <div ref={box} onMouseMove={move} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s, i) => {
            const Icon = s.icon; const done = s.items.filter((x) => learned.includes(x.id)).length; const fresh = s.items.filter((x) => x.isNew).length;
            return (
              <button key={s.id} data-card onClick={() => go(`/s/${s.id}`)} className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-left transition duration-300 [--x:-999px] [--y:-999px] hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(260px circle at var(--x) var(--y), oklch(0.7 0.16 ${s.hue} / 0.16), transparent 70%)` }} />
                <div className="relative flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl text-white shadow-lg transition group-hover:scale-110 group-hover:rotate-3" style={{ background: `linear-gradient(135deg, oklch(0.62 0.2 ${s.hue}), oklch(0.72 0.17 ${s.hue + 40}))`, boxShadow: `0 8px 20px -6px oklch(0.6 0.2 ${s.hue} / 0.5)` }}><Icon className="h-5 w-5" /></span><span className="font-mono text-xs text-zinc-300 dark:text-zinc-600">{String(i + 1).padStart(2, "0")}</span></div>
                <h3 className="relative mt-4 flex items-center gap-2 text-lg font-bold tracking-tight">{s.title}{fresh === s.items.length && <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-fg">NEW</span>}</h3>
                <p className="relative text-xs text-zinc-400">{s.en}</p>
                <p className="relative mt-2 line-clamp-2 text-sm text-zinc-500">{s.blurb}</p>
                <div className="relative mt-4 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-full rounded-full transition-all duration-700" style={{ width: (done / s.items.length) * 100 + "%", background: `oklch(0.65 0.2 ${s.hue})` }} /></div><span className="text-xs tabular-nums text-zinc-500">{s.items.length} 项{fresh > 0 && fresh < s.items.length && <b className="ml-1 text-accent">+{fresh}</b>}</span></div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- 精选新增 ---------------- */
const PICK = ["lab-easing", "lab-spring", "game-snake", "game-2048", "starfield", "holo", "cube", "charts", "island", "dock", "tour", "gooey", "game-life", "lab-palette", "game-pixel", "game-physics"];
function Featured() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionTitle icon={Sparkles} kicker="What's new in 2.0" title="2.0 精选新增" sub={`相比 1.0 新增了 ${stats.fresh} 个组件与 2 个全新章节。这是其中最值得一试的 ${PICK.length} 个。`} />
      <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-4 no-scrollbar">
        {PICK.map((id, i) => { const it = itemMap.get(id); if (!it) return null; const s = sectionMap.get(it.sectionId)!; return (
          <button key={id} onClick={() => go(`/s/${it.sectionId}/${id}`)} className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60" style={{ background: `oklch(0.7 0.2 ${s.hue + i * 20})` }} />
            <span className="relative text-[11px] font-semibold uppercase tracking-wider" style={{ color: `oklch(0.6 0.2 ${s.hue})` }}>{s.title}</span>
            <h3 className="relative mt-2 text-lg font-bold">{it.title}</h3><p className="relative text-xs text-zinc-400">{it.en}</p>
            <p className="relative mt-3 line-clamp-3 text-sm text-zinc-500">{it.desc}</p>
            <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">试一试 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
          </button>); })}
      </div>
    </section>
  );
}

function Bookmarks() {
  const { bookmarks } = useApp();
  const items = bookmarks.map((b) => itemMap.get(b)).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-6xl px-6 pb-4">
      <SectionTitle icon={Bookmark} kicker="Saved" title="我的收藏" />
      <div className="flex flex-wrap gap-2">{items.map((it) => <button key={it!.id} onClick={() => go(`/s/${it!.sectionId}/${it!.id}`)} className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm transition hover:border-accent hover:text-accent dark:border-zinc-800 dark:bg-zinc-900"><Bookmark className="h-3.5 w-3.5 fill-current text-amber-500" />{it!.title}</button>)}</div>
    </section>
  );
}

function HowTo() {
  const T = [[Search, "全局搜索", "按 ⌘K / Ctrl+K 唤起命令面板，输入中英文名、标签都能跳转。"], [Palette, "实时换肤", "右上角「外观」调节主色、圆角、字体；整站组件同步变化。"], [Copy, "复制代码", "每个组件的「代码」标签页都有一键复制，示例可直接粘进项目。"], [MousePointerClick, "真实交互", "所有 demo 都可操作，⟳ 重播动画；移动端支持拖拽与滑动手势。"]] as const;
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <SectionTitle icon={Zap} kicker="Guide" title="如何使用本站" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{T.map(([I, t, d]) => <div key={t} className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"><span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent"><I className="h-5 w-5" /></span><h3 className="font-semibold">{t}</h3><p className="mt-1 text-sm leading-relaxed text-zinc-500">{d}</p></div>)}</div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl space-y-4 px-6 py-10 text-sm text-zinc-500">
        <p><b className="text-zinc-900 dark:text-zinc-100">推荐延伸阅读的库：</b>Radix UI / Headless UI（无样式可访问组件）· cmdk（命令面板）· sonner（Toast）· vaul（底部面板）· @dnd-kit（拖拽）· Floating UI（定位）· framer-motion（动效）· @tanstack/react-virtual（虚拟列表）· date-fns（日期）。</p>
        <p>形色场 UI Handbook 2.0 · 用 React + Tailwind CSS 4 手写 · 不依赖任何 UI 组件库 · 灵感来自 <a className="text-accent underline-offset-4 hover:underline" href="https://zzhzhouzhou.github.io/UI-handbook/" target="_blank" rel="noreferrer">UI Handbook 1.0</a>。所有示例代码可直接复制使用。</p>
      </div>
    </footer>
  );
}

export function Home() {
  return <><Hero /><LearningPath /><Chapters /><Featured /><Bookmarks /><HowTo /><Footer /></>;
}

/* ---------------- 章节页 ---------------- */
type F = "all" | Level | "new" | "saved" | "todo";
export function SectionPage({ route }: { route: Route }) {
  const s = sectionMap.get(route.section!);
  const { bookmarks, learned } = useApp();
  const [f, setF] = useState<F>("all");
  const [active, setActive] = useState<string>("");
  useEffect(() => { document.title = s ? `${s.title} · 形色场 UI Handbook 2.0` : "形色场 UI Handbook 2.0"; }, [s]);
  useEffect(() => { setF("all"); }, [route.section]);
  const items = useMemo(() => (s ? s.items.filter((i) => f === "all" ? true : f === "new" ? i.isNew : f === "saved" ? bookmarks.includes(i.id) : f === "todo" ? !learned.includes(i.id) : i.level === f) : []), [s, f, bookmarks, learned]);

  useEffect(() => {
    if (!route.item) { window.scrollTo({ top: 0 }); return; }
    if (f !== "all") setF("all");
    const t1 = setTimeout(() => document.getElementById(route.item!)?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    const t2 = setTimeout(() => document.getElementById(route.item!)?.scrollIntoView({ behavior: "smooth", block: "start" }), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.section, route.item, route.nonce]);

  useEffect(() => {
    if (!s) return;
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive(v.target.id); }, { rootMargin: "-90px 0px -65% 0px" });
    items.forEach((i) => { const el = document.getElementById(i.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [s, items]);

  if (!s) return <div className="grid min-h-[60vh] place-items-center text-zinc-500">章节不存在 · <a className="text-accent" href="#/">返回首页</a></div>;
  const idx = sections.indexOf(s); const prev = sections[idx - 1], next = sections[idx + 1]; const Icon = s.icon;
  const done = s.items.filter((i) => learned.includes(i.id)).length;
  const chips: [F, string][] = [["all", `全部 ${s.items.length}`], ["基础", "基础"], ["进阶", "进阶"], ["高级", "高级"], ["new", "NEW"], ["saved", "收藏"], ["todo", "未学"]];
  return (
    <div>
      <header className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="pointer-events-none absolute inset-0 -z-10"><span className="absolute -right-10 -top-20 h-72 w-72 rounded-full blur-[80px]" style={{ background: `oklch(0.75 0.15 ${s.hue} / 0.35)` }} /><div className="bg-dots absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" /></div>
        <div className="mx-auto max-w-5xl px-6 py-12">
          <nav className="mb-5 flex items-center gap-1.5 text-xs text-zinc-500"><a href="#/" className="hover:text-accent">首页</a><ChevronRight className="h-3 w-3" /><span>{s.group}</span><ChevronRight className="h-3 w-3" /><span className="text-zinc-900 dark:text-zinc-100">{s.title}</span></nav>
          <div className="flex items-start gap-5"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white shadow-xl" style={{ background: `linear-gradient(135deg, oklch(0.62 0.2 ${s.hue}), oklch(0.72 0.17 ${s.hue + 40}))` }}><Icon className="h-7 w-7" /></span>
            <div><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{s.title}</h1><p className="mt-1 text-sm text-zinc-400">{s.en}</p></div></div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{s.blurb}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-zinc-500"><span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">{s.items.length} 个组件</span><span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800">已学会 {done}</span><div className="h-1.5 w-32 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: (done / s.items.length) * 100 + "%" }} /></div></div>
        </div>
      </header>
      <div className="mx-auto flex max-w-5xl gap-10 px-6 py-8 xl:max-w-[67rem]">
        <div className="min-w-0 flex-1">
          <div className="sticky top-14 z-20 -mx-2 mb-6 flex flex-wrap gap-1.5 bg-white/85 px-2 py-3 backdrop-blur-lg dark:bg-zinc-950/85">{chips.map(([k, l]) => <button key={k} onClick={() => setF(k)} className={cn("rounded-full border px-3.5 py-1 text-xs font-medium transition", f === k ? "border-accent bg-accent text-accent-fg" : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400")}>{l}</button>)}</div>
          <div className="space-y-8">{items.map((it) => <ItemCard key={it.id} item={it} index={s.items.indexOf(it)} sectionItems={s.items} />)}</div>
          {items.length === 0 && <div className="grid place-items-center rounded-2xl border border-dashed border-zinc-300 py-20 text-center text-sm text-zinc-500 dark:border-zinc-700"><div><p className="text-3xl">🔍</p><p className="mt-2">当前筛选下没有组件</p><button className="mt-3 text-accent underline" onClick={() => setF("all")}>查看全部</button></div></div>}
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {prev ? <button onClick={() => go(`/s/${prev.id}`)} className="group rounded-2xl border border-zinc-200 p-5 text-left transition hover:border-accent dark:border-zinc-800"><span className="flex items-center gap-1 text-xs text-zinc-400"><ChevronLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-1" />上一章</span><b className="mt-1 block">{prev.title}</b></button> : <span />}
            {next ? <button onClick={() => go(`/s/${next.id}`)} className="group rounded-2xl border border-zinc-200 p-5 text-right transition hover:border-accent dark:border-zinc-800"><span className="flex items-center justify-end gap-1 text-xs text-zinc-400">下一章<ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span><b className="mt-1 block">{next.title}</b></button> : <span />}
          </div>
        </div>
        <aside className="sticky top-32 hidden h-[calc(100vh-9rem)] w-52 shrink-0 overflow-y-auto xl:block">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">本章目录</p>
          <ul className="space-y-0.5 border-l border-zinc-200 text-[13px] dark:border-zinc-800">{s.items.map((i) => <li key={i.id}><a href={`#/s/${s.id}/${i.id}`} className={cn("-ml-px block border-l-2 py-1 pl-3 transition", active === i.id ? "border-accent font-semibold text-accent" : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white")}>{i.title}{learned.includes(i.id) && <span className="ml-1 text-emerald-500">✓</span>}</a></li>)}</ul>
        </aside>
      </div>
      <Footer />
    </div>
  );
}
