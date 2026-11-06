import { useEffect, useRef, useState } from "react";
import { Loader2, PartyPopper, Trash2, Type } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Range } from "../components/ui";
import { cn } from "../utils/cn";
import { clamp, useInView, useInterval, useRaf } from "../lib/hooks";
import { confetti } from "../lib/confetti";

function MarqueeDemo() {
  const logos = ["▲ Vercel", "◆ Linear", "● Stripe", "■ Notion", "✦ Figma", "◐ Framer", "⬢ Raycast", "✺ Arc"];
  const Row = ({ rev, dur }: { rev?: boolean; dur: number }) => (
    <div className="group overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max gap-4 group-hover:[animation-play-state:paused]" style={{ animation: `marquee ${dur}s linear infinite ${rev ? "reverse" : ""}` }}>
        {[...logos, ...logos].map((l, i) => <span key={i} className="whitespace-nowrap rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">{l}</span>)}
      </div>
    </div>
  );
  return <div className="space-y-3"><Row dur={24} /><Row rev dur={30} /><p className="text-center text-xs text-zinc-500">内容复制一份，平移 −50% 无缝循环 · 悬停暂停</p></div>;
}

function TypewriterDemo() {
  const words = ["设计系统", "交互动效", "无障碍体验", "极致性能"];
  const [i, setI] = useState(0), [n, setN] = useState(0), [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i]; let t: ReturnType<typeof setTimeout>;
    if (!del && n < w.length) t = setTimeout(() => setN(n + 1), 140);
    else if (!del) t = setTimeout(() => setDel(true), 1200);
    else if (n > 0) t = setTimeout(() => setN(n - 1), 70);
    else { setDel(false); setI((i + 1) % words.length); return; }
    return () => clearTimeout(t);
  }, [n, del, i]);
  return <h3 className="text-center text-3xl font-bold tracking-tight">构建出色的<span className="text-accent">{words[i].slice(0, n)}</span><span className="ml-0.5 inline-block h-8 w-0.5 translate-y-1.5 bg-accent" style={{ animation: "caret 1s steps(1) infinite" }} /></h3>;
}

const CH = "!<>-_\\/[]{}—=+*^?#ABCDEFGH01";
function ScrambleDemo() {
  const phrases = ["DECODING THE FUTURE", "形色场 UI HANDBOOK", "HELLO, WORLD"];
  const [k, setK] = useState(0);
  const [txt, setTxt] = useState(phrases[0]);
  const run = (to: string) => {
    let f = 0; const total = 36;
    const id = setInterval(() => { f++; setTxt(to.split("").map((c, i) => (c === " " ? " " : f / total > i / to.length + 0.15 ? c : CH[Math.floor(Math.random() * CH.length)])).join("")); if (f >= total) clearInterval(id); }, 35);
    return () => clearInterval(id);
  };
  useEffect(() => run(phrases[k]), [k]);
  return <div className="text-center"><p className="font-mono text-2xl font-bold tracking-wider">{txt}</p><Btn className="mt-4" variant="outline" size="sm" onClick={() => setK((k + 1) % phrases.length)}>下一句</Btn></div>;
}

function Odometer({ value, digits = 5 }: { value: number; digits?: number }) {
  const s = String(value).padStart(digits, "0");
  return <div className="inline-flex gap-1 text-4xl font-bold tabular-nums">{s.split("").map((d, i) => <span key={i} className="relative h-[1.3em] w-[0.75em] overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800"><span className="absolute inset-x-0 top-0 flex flex-col text-center leading-[1.3em] transition-transform duration-1000 [transition-timing-function:cubic-bezier(.2,.9,.3,1)]" style={{ transform: `translateY(-${+d * 1.3}em)` }}>{Array.from({ length: 10 }, (_, n) => <span key={n}>{n}</span>)}</span></span>)}</div>;
}
function CounterDemo() {
  const [ref, seen] = useInView<HTMLDivElement>("0px");
  const [v, setV] = useState(0);
  const [od, setOd] = useState(12345);
  useEffect(() => { if (!seen) return; const t0 = performance.now(); let id = 0; const loop = (t: number) => { const p = Math.min((t - t0) / 1800, 1); setV(Math.round(98765 * (1 - Math.pow(1 - p, 4)))); if (p < 1) id = requestAnimationFrame(loop); }; id = requestAnimationFrame(loop); return () => cancelAnimationFrame(id); }, [seen]);
  return (
    <div ref={ref} className="flex flex-wrap items-center gap-10">
      <div><p className="text-5xl font-extrabold tabular-nums tracking-tight">{v.toLocaleString()}</p><p className="text-sm text-zinc-500">easeOutQuart 计数</p></div>
      <div className="space-y-3"><Odometer value={od} /><div><Btn size="sm" variant="accent" onClick={() => setOd(Math.floor(Math.random() * 99999))}>随机翻牌</Btn></div></div>
    </div>
  );
}

function ScrollRevealDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<Set<number>>(new Set());
  useEffect(() => { const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setShown((s) => new Set(s).add(+(e.target as HTMLElement).dataset.i!))), { root: box.current, threshold: 0.3 }); box.current!.querySelectorAll("[data-i]").forEach((el) => io.observe(el)); return () => io.disconnect(); }, []);
  const dirs = ["translate-x-[-40px]", "translate-y-[40px]", "translate-x-[40px]", "scale-90", "translate-y-[40px]"];
  return (
    <div ref={box} className="h-72 space-y-5 overflow-auto rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs text-zinc-400">↓ 向下滚动</p>
      {dirs.map((d, i) => <div key={i} data-i={i} className={cn("rounded-xl bg-gradient-to-br p-5 text-white transition-all duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)]", ["from-violet-500 to-fuchsia-500", "from-sky-500 to-cyan-400", "from-amber-400 to-orange-500", "from-emerald-500 to-teal-400", "from-rose-500 to-pink-400"][i], shown.has(i) ? "translate-x-0 translate-y-0 scale-100 opacity-100" : cn("opacity-0", d))}><b>区块 {i + 1}</b><p className="text-sm opacity-80">进入视口时淡入 + 位移</p></div>)}
    </div>
  );
}

function StackCardsDemo() {
  const cs = ["from-violet-500 to-indigo-500", "from-sky-500 to-cyan-400", "from-emerald-500 to-lime-400", "from-amber-400 to-orange-500", "from-rose-500 to-pink-500"];
  return (
    <div className="h-80 overflow-auto rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      {cs.map((c, i) => <div key={i} className="sticky mb-6 last:mb-40" style={{ top: 12 + i * 14 }}><div className={cn("grid h-40 place-items-center rounded-2xl bg-gradient-to-br text-3xl font-black text-white shadow-xl", c)}>Card {i + 1}</div></div>)}
    </div>
  );
}

function InfiniteDemo() {
  const [n, setN] = useState(12), [load, setLoad] = useState(false);
  const more = () => { if (load) return; setLoad(true); setTimeout(() => { setN((v) => v + 8); setLoad(false); }, 900); };
  return (
    <div className="h-72 overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800" onScroll={(e) => { const el = e.currentTarget; if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) more(); }}>
      {Array.from({ length: n }, (_, i) => <div key={i} className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 text-sm dark:border-zinc-800"><span className="grid h-8 w-8 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent">{i + 1}</span>动态条目 {i + 1}</div>)}
      <div className="grid h-12 place-items-center text-xs text-zinc-400">{load ? <Loader2 className="h-4 w-4 animate-spin" /> : "滚动到底部加载更多"}</div>
    </div>
  );
}

function DragSortDemo() {
  const [list, setList] = useState(["📋 需求评审", "🎨 视觉设计", "💻 前端开发", "🧪 测试验收", "🚀 发布上线"]);
  const [from, setFrom] = useState<number | null>(null);
  const over = (i: number) => { if (from === null || from === i) return; const l = [...list]; const [x] = l.splice(from, 1); l.splice(i, 0, x); setList(l); setFrom(i); };
  return (
    <ul className="max-w-xs space-y-2">
      {list.map((t, i) => <li key={t} draggable onDragStart={() => setFrom(i)} onDragEnter={() => over(i)} onDragOver={(e) => e.preventDefault()} onDragEnd={() => setFrom(null)} className={cn("flex cursor-grab items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-sm transition active:cursor-grabbing dark:bg-zinc-900", from === i ? "border-accent opacity-60" : "border-zinc-200 dark:border-zinc-800")}><span className="text-zinc-300">⋮⋮</span>{t}</li>)}
    </ul>
  );
}

function ConfettiDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Btn variant="accent" size="lg" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); confetti(r.left + r.width / 2, r.top, 160); }}><PartyPopper className="h-4 w-4" />庆祝一下</Btn>
      <Btn variant="outline" size="lg" onClick={() => { confetti(0, window.innerHeight, 90); confetti(window.innerWidth, window.innerHeight, 90); }}>双侧礼炮</Btn>
    </div>
  );
}

function SwipeDeleteDemo() {
  const [rows, setRows] = useState(["午餐 ¥32", "地铁 ¥6", "咖啡 ¥28", "电影 ¥68"]);
  const Row = ({ t }: { t: string }) => {
    const [dx, setDx] = useState(0); const sx = useRef<number | null>(null); const [gone, setGone] = useState(false);
    return (
      <div className={cn("grid transition-all duration-300", gone ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr]")}>
        <div className="overflow-hidden"><div className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0 flex items-center justify-end bg-red-500 pr-5 text-white"><Trash2 className="h-5 w-5" /></div>
          <div className="relative touch-pan-y select-none bg-white px-4 py-3.5 text-sm dark:bg-zinc-900" style={{ transform: `translateX(${dx}px)`, transition: sx.current === null ? "transform .3s" : "none" }}
            onPointerDown={(e) => { sx.current = e.clientX; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={(e) => sx.current !== null && setDx(clamp(e.clientX - sx.current, -140, 0))}
            onPointerUp={() => { sx.current = null; if (dx < -90) { setDx(-400); setGone(true); setTimeout(() => setRows((r) => r.filter((x) => x !== t)), 320); } else setDx(dx < -40 ? -70 : 0); }}>{t}</div>
        </div></div>
      </div>
    );
  };
  return <div className="max-w-xs space-y-2 overflow-hidden rounded-xl border border-zinc-200 p-2 dark:border-zinc-800">{rows.map((r) => <Row key={r} t={r} />)}{!rows.length && <button className="w-full py-4 text-xs text-accent" onClick={() => setRows(["午餐 ¥32", "地铁 ¥6", "咖啡 ¥28", "电影 ¥68"])}>恢复演示数据</button>}<p className="px-2 text-[11px] text-zinc-400">← 向左拖动 · 过半即删除</p></div>;
}

function ThemeReveal() {
  const [st, setSt] = useState({ dark: false, prev: false, k: 0, x: 120, y: 100 });
  const Panel = ({ d }: { d: boolean }) => <div className={cn("grid h-full place-items-center", d ? "bg-zinc-950 text-white" : "bg-amber-50 text-zinc-900")}><div className="text-center"><p className="text-5xl">{d ? "🌙" : "☀️"}</p><p className="mt-2 font-semibold">{d ? "Dark" : "Light"}</p></div></div>;
  return (
    <div className="relative h-56 cursor-pointer overflow-hidden rounded-xl" onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); setSt((s) => ({ dark: !s.dark, prev: s.dark, k: s.k + 1, x: e.clientX - r.left, y: e.clientY - r.top })); }}>
      <div className="absolute inset-0"><Panel d={st.prev} /></div>
      <div key={st.k} className="absolute inset-0" style={{ animation: st.k ? "reveal .8s ease-in-out both" : "none", ["--px" as string]: st.x + "px", ["--py" as string]: st.y + "px" }}><Panel d={st.dark} /></div>
      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[11px] opacity-60">点击任意位置 · 从点击点扩散</p>
    </div>
  );
}

function ClockDemo() {
  const [t, setT] = useState(new Date());
  useRaf(() => setT(new Date()));
  const s = t.getSeconds() + t.getMilliseconds() / 1000, m = t.getMinutes() + s / 60, h = (t.getHours() % 12) + m / 60;
  return (
    <div className="flex flex-wrap items-center gap-8">
      <svg viewBox="0 0 200 200" className="h-48 w-48 drop-shadow-xl">
        <circle cx="100" cy="100" r="96" className="fill-white stroke-zinc-200 dark:fill-zinc-900 dark:stroke-zinc-700" strokeWidth="3" />
        {Array.from({ length: 60 }, (_, i) => <line key={i} x1="100" y1={i % 5 ? 10 : 14} x2="100" y2={i % 5 ? 14 : 22} transform={`rotate(${i * 6} 100 100)`} className={i % 5 ? "stroke-zinc-300 dark:stroke-zinc-600" : "stroke-zinc-800 dark:stroke-zinc-200"} strokeWidth={i % 5 ? 1 : 2.5} strokeLinecap="round" />)}
        <line x1="100" y1="100" x2="100" y2="55" transform={`rotate(${h * 30} 100 100)`} className="stroke-zinc-900 dark:stroke-white" strokeWidth="5" strokeLinecap="round" />
        <line x1="100" y1="100" x2="100" y2="35" transform={`rotate(${m * 6} 100 100)`} className="stroke-zinc-900 dark:stroke-white" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="100" y1="112" x2="100" y2="26" transform={`rotate(${s * 6} 100 100)`} stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="100" cy="100" r="4" fill="var(--accent)" />
      </svg>
      <p className="font-mono text-4xl font-bold tabular-nums">{t.toLocaleTimeString("zh-CN", { hour12: false })}</p>
    </div>
  );
}

function GalleryDemo() {
  const [a, setA] = useState(1);
  const ps = [["from-violet-500 to-fuchsia-500", "山"], ["from-sky-500 to-cyan-300", "海"], ["from-amber-400 to-rose-500", "日"], ["from-emerald-500 to-lime-300", "林"], ["from-indigo-600 to-purple-400", "夜"]];
  return <div className="flex h-56 gap-2">{ps.map(([g, n], i) => <button key={i} onMouseEnter={() => setA(i)} onFocus={() => setA(i)} onClick={() => setA(i)} className={cn("relative grid place-items-center overflow-hidden rounded-2xl bg-gradient-to-br text-white transition-all duration-500 [transition-timing-function:cubic-bezier(.32,.72,0,1)]", g, a === i ? "flex-[4]" : "flex-1")}><span className={cn("font-black transition-all duration-500", a === i ? "text-6xl" : "text-2xl opacity-70")}>{n}</span></button>)}</div>;
}

function WordScrollDemo() {
  const words = "好的设计是尽可能少的设计。它不是装饰，而是让产品在不被察觉的地方变得更好用。当你滚动阅读这段文字时，每一个词会依次被点亮，引导视线的节奏。".split("");
  const [p, setP] = useState(0);
  return (
    <div className="h-64 overflow-auto rounded-xl bg-zinc-950 px-6" onScroll={(e) => { const el = e.currentTarget; setP(el.scrollTop / (el.scrollHeight - el.clientHeight)); }}>
      <div className="h-24" /><p className="text-3xl font-bold leading-snug">{words.map((w, i) => <span key={i} className="transition-colors duration-200" style={{ color: i / words.length < p * 1.15 ? "#fff" : "rgba(255,255,255,.18)" }}>{w}</span>)}</p><div className="h-72" />
    </div>
  );
}

function SplitDemo() {
  const [w, setW] = useState(40);
  const box = useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="flex h-52 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="grid place-items-center bg-accent-soft text-sm text-accent" style={{ width: w + "%" }}>左 {Math.round(w)}%</div>
      <div role="separator" aria-orientation="vertical" tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowLeft") setW(Math.max(15, w - 3)); if (e.key === "ArrowRight") setW(Math.min(85, w + 3)); }} onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)} onPointerMove={(e) => { if (!e.buttons) return; const r = box.current!.getBoundingClientRect(); setW(clamp(((e.clientX - r.left) / r.width) * 100, 15, 85)); }} className="group relative w-1.5 shrink-0 cursor-col-resize touch-none bg-zinc-200 outline-none transition hover:bg-accent focus-visible:bg-accent dark:bg-zinc-800"><span className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded bg-zinc-400 group-hover:bg-white" /></div>
      <div className="grid flex-1 place-items-center text-sm text-zinc-500">右 {Math.round(100 - w)}%</div>
    </div>
  );
}

function NoiseDemo() {
  const [o, setO] = useState(30);
  return (
    <div className="space-y-4">
      <Range label="噪点强度" value={o} onChange={setO} min={0} max={100} unit="%" className="max-w-xs" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid h-36 place-items-center rounded-2xl bg-gradient-to-br from-accent to-pink-500 font-semibold text-white">无噪点</div>
        <div className="relative grid h-36 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-pink-500 font-semibold text-white"><style>{`.nz::after{opacity:${o / 100}!important}`}</style><div className="noise nz absolute inset-0" />噪点纹理</div>
      </div>
    </div>
  );
}

const TEXT = "极简设计并不意味着内容的缺失。恰恰相反，它意味着每一个元素都经过深思熟虑。设计系统帮助团队用同一种语言沟通，而设计令牌是这门语言的词汇表。";
function HighlightDemo() {
  const [q, setQ] = useState("设计");
  const parts = q ? TEXT.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")) : [TEXT];
  const count = q ? parts.filter((_, i) => i % 2).length : 0;
  return (
    <div className="max-w-lg space-y-3">
      <div className="flex items-center gap-3"><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="输入关键词" className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-accent dark:border-zinc-700 dark:bg-zinc-900" /><span className="text-xs text-zinc-500">{count} 处匹配</span></div>
      <p className="text-sm leading-loose">{parts.map((p, i) => (i % 2 ? <mark key={i} className="rounded bg-amber-200 px-0.5 text-zinc-900 dark:bg-amber-400/80">{p}</mark> : <span key={i}>{p}</span>))}</p>
    </div>
  );
}

/* ---------- 新增 ---------- */
function GlitchDemo() {
  const T = "GLITCH";
  return (
    <div className="grid place-items-center bg-zinc-950 py-10">
      <div className="relative text-6xl font-black tracking-widest text-white">
        {T}
        <span aria-hidden className="absolute inset-0 text-cyan-400" style={{ animation: "glitch1 2s infinite linear alternate-reverse", mixBlendMode: "screen" }}>{T}</span>
        <span aria-hidden className="absolute inset-0 text-rose-500" style={{ animation: "glitch2 1.6s infinite linear alternate-reverse", mixBlendMode: "screen" }}>{T}</span>
      </div>
    </div>
  );
}

function WaveTextDemo() {
  const t = "Hello, Wave!  你好，波浪";
  return <p className="flex flex-wrap justify-center text-4xl font-bold">{t.split("").map((c, i) => <span key={i} className="inline-block whitespace-pre text-accent" style={{ animation: `wave 1.4s ${i * 0.07}s ease-in-out infinite` }}>{c}</span>)}</p>;
}

function RollingTextDemo() {
  const Roll = ({ t }: { t: string }) => (
    <a className="group inline-flex cursor-pointer overflow-hidden text-2xl font-bold" aria-label={t}>
      {t.split("").map((c, i) => <span key={i} className="relative inline-block h-[1.3em] overflow-hidden leading-[1.3em]" aria-hidden><span className="block whitespace-pre transition-transform duration-500 [transition-timing-function:cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-full" style={{ transitionDelay: i * 25 + "ms" }}>{c}<span className="absolute left-0 top-full text-accent">{c}</span></span></span>)}
    </a>
  );
  return <div className="flex flex-wrap items-center justify-center gap-10"><Roll t="Hover Me" /><Roll t="悬停翻滚文字" /><Roll t="Portfolio" /></div>;
}

function MorphWordsDemo() {
  const w = ["灵感", "设计", "代码", "产品", "体验"];
  const [i, setI] = useState(0);
  useInterval(() => setI((v) => (v + 1) % w.length), 2200);
  return <p className="text-center text-5xl font-black tracking-tight">把<span className="relative mx-3 inline-grid">{w.map((x, k) => <span key={x} className="col-start-1 row-start-1 text-accent transition-all duration-700" style={{ opacity: k === i ? 1 : 0, filter: k === i ? "blur(0)" : "blur(14px)", transform: k === i ? "scale(1)" : "scale(.8)" }}>{x}</span>)}</span>变成现实</p>;
}

function SvgDrawDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="space-y-3 text-center">
      <svg key={k} viewBox="0 0 320 120" className="mx-auto h-36 w-full max-w-md" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 2.2s ease-in-out forwards" }} d="M20 80 C 30 20, 55 20, 50 70 S 70 100, 85 55 C 92 30, 110 30, 105 60 S 125 95, 140 50 L 150 28 M 165 40 C 150 70, 175 90, 190 55 S 215 20, 215 55 S 240 100, 262 40 M 280 30 L 280 70 M 280 85 L 280 86" />
        <path pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 1.6s .8s ease-in-out forwards" }} stroke="#ec4899" d="M16 104 C 90 112, 200 96, 300 104" />
      </svg>
      <Btn size="sm" variant="outline" onClick={() => setK(k + 1)}>重新书写</Btn>
    </div>
  );
}

function GradientTextDemo() {
  return <div className="space-y-2 text-center"><p className="text-gradient text-5xl font-black tracking-tight">Shimmering Gradient</p><p className="text-gradient text-2xl font-bold">渐变流光文字</p></div>;
}

function ElasticDemo() {
  const [s, setS] = useState(1);
  const [txt, setTxt] = useState("按住这个按钮");
  return (
    <div className="grid place-items-center py-6">
      <button onPointerDown={() => { setS(0.86); setTxt("松开试试"); }} onPointerUp={() => { setS(1); setTxt("弹回来了！"); }} onPointerLeave={() => setS(1)} className="h-24 w-24 rounded-full bg-gradient-to-br from-accent to-pink-500 text-sm font-semibold text-white shadow-xl" style={{ transform: `scale(${s})`, transition: s === 1 ? "transform .7s cubic-bezier(.34,2.2,.64,1)" : "transform .15s" }}>{txt}</button>
    </div>
  );
}


export const motion: Section = {
  id: "motion", title: "文字、滚动与高级模式", en: "Text, Scroll & Advanced", group: "视觉", icon: Type, hue: 45,
  blurb: "文字动效、滚动联动和手势交互：让页面“活”起来的细节。每一个都是真实可用的小技巧。",
  items: [
    item({ id: "marquee", title: "无限跑马灯", en: "Marquee", level: "基础", demo: MarqueeDemo, tags: ["logos", "ticker"], desc: "内容复制一份并平移 −50% 实现无缝循环。两行反向、不同速度更有层次；悬停暂停。", points: ["mask-image 做两端渐隐。", "animation-direction: reverse 做反向。"], a11y: ["提供暂停手段；纯装饰内容 aria-hidden。"], code: `@keyframes marquee { to { transform: translateX(-50%) } }
<div className="flex w-max" style={{ animation: "marquee 24s linear infinite" }}>{[...logos, ...logos]}</div>` }),
    item({ id: "typewriter", title: "打字机", en: "Typewriter", level: "基础", demo: TypewriterDemo, tags: ["typing", "text"], desc: "逐字输入、停顿、逐字删除、切换下一个词。光标用 steps(1) 闪烁。", points: ["用 useEffect + setTimeout 链驱动状态机。", "删除速度快于输入速度，更自然。"], a11y: ["提供静态替代文本，屏幕阅读器读完整句。"], code: `@keyframes caret { 50% { opacity: 0 } } /* animation: caret 1s steps(1) infinite */` }),
    item({ id: "scramble", title: "文字乱码解码", en: "Text Scramble", level: "进阶", demo: ScrambleDemo, tags: ["hacker", "decode"], desc: "文字先随机字符闪烁，再从左到右逐个“解码”为目标字符。黑客风格。", points: ["进度 > i/length 的字符显示真实字符，其余随机。", "等宽字体防止宽度抖动。"], code: `c = f / total > i / len ? target[i] : CH[Math.floor(Math.random() * CH.length)]` }),
    item({ id: "counter", title: "数字滚动", en: "Counter & Odometer", level: "进阶", demo: CounterDemo, tags: ["number", "count-up"], desc: "进入视口时从 0 缓动到目标值；翻牌器则把每一位做成垂直滚动的数字条。", points: ["easeOutQuart: 1 − (1 − p)⁴。", "翻牌器：translateY(−digit × 1.3em)。", "toLocaleString 加千分位。"], a11y: ["tabular-nums 防止宽度跳动。"], code: `const eased = 1 - Math.pow(1 - p, 4); setV(Math.round(target * eased));` }),
    item({ id: "scroll-reveal", title: "滚动显现", en: "Scroll Reveal", level: "基础", demo: ScrollRevealDemo, tags: ["intersection", "fade-in"], desc: "元素进入视口才播放入场动画。用 IntersectionObserver，比监听 scroll 更省。", points: ["只触发一次，已显示的不再隐藏。", "不同方向的初始位移带来节奏。"], a11y: ["prefers-reduced-motion 下直接显示。"], code: `const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && show(e.target)), { threshold: 0.3 });` }),
    item({ id: "stack-cards", title: "堆叠卡片", en: "Sticky Stack", level: "进阶", demo: StackCardsDemo, tags: ["sticky", "apple"], desc: "纯 CSS：每张卡 position: sticky，top 依次递增，滚动时后一张盖住前一张。", code: `<div className="sticky" style={{ top: 12 + i * 14 }}>…</div>` }),
    item({ id: "infinite", title: "无限滚动", en: "Infinite Scroll", level: "进阶", demo: InfiniteDemo, tags: ["feed", "pagination"], desc: "滚动接近底部时加载下一批，底部显示 loading。", points: ["距离底部 < 60px 预加载。", "用 loading 标志防止重复请求。", "大量数据请配合虚拟列表。"], a11y: ["提供“加载更多”按钮作为替代，并保持页脚可达。"], code: `if (el.scrollHeight - el.scrollTop - el.clientHeight < 60) loadMore();` }),
    item({ id: "drag-sort", title: "拖拽排序", en: "Drag to Reorder", level: "进阶", demo: DragSortDemo, tags: ["sortable", "dnd"], desc: "拖过其它项时即时重排，被拖项高亮半透明。", points: ["onDragEnter 时交换位置，并更新当前拖动索引。"], a11y: ["提供“上移 / 下移”按钮作为键盘替代。"], code: `const l = [...list]; const [x] = l.splice(from, 1); l.splice(to, 0, x);` }),
    item({ id: "confetti", title: "纸屑庆祝", en: "Confetti", level: "基础", demo: ConfettiDemo, tags: ["celebrate", "canvas"], desc: "任务完成、支付成功时的情绪奖励。Canvas 粒子带重力和阻尼，结束自动清理。", points: ["全屏 canvas pointer-events: none。", "尊重 prefers-reduced-motion，直接跳过。"], code: `confetti(x, y, 140); // src/lib/confetti.ts` }),
    item({ id: "swipe-delete", title: "左滑删除", en: "Swipe to Delete", level: "进阶", demo: SwipeDeleteDemo, tags: ["gesture", "mobile"], desc: "移动端经典手势：向左拖出红色删除区，过半松手即删除并收起。", points: ["touch-action: pan-y，保留竖向滚动。", "删除后用 grid-rows 动画收起，列表不跳。"], a11y: ["同时提供按钮或菜单作为非手势方式。"], code: `if (dx < -90) { setGone(true); setTimeout(remove, 320); } else setDx(0);` }),
    item({ id: "theme-reveal", title: "主题切换转场", en: "Circular Reveal", level: "高级", demo: ThemeReveal, tags: ["view-transition", "clip-path"], desc: "点击位置作为圆心，新主题以圆形扩散覆盖旧主题。本站右上角的主题按钮用的是 View Transitions API 的真实版本。", points: ["clip-path: circle(0 at x y) → circle(R at x y)。", "R 取圆心到四角的最大距离才能完全覆盖。"], code: `clipPath: ["circle(0px at x y)", "circle(" + R + "px at x y)"]` }),
    item({ id: "clock", title: "模拟时钟", en: "Analog Clock", level: "进阶", demo: ClockDemo, tags: ["svg", "time"], desc: "SVG + rotate。秒针用毫秒平滑运动，时针随分钟微移。", points: ["时针角度 = (时 % 12 + 分/60) × 30°。", "刻度每 5 格加粗加长。"], code: `<line transform={"rotate(" + s * 6 + " 100 100)"} />` }),
    item({ id: "gallery", title: "伸缩画廊", en: "Expanding Gallery", level: "基础", demo: GalleryDemo, tags: ["accordion", "flex"], desc: "悬停的面板 flex-grow 变大，其余缩小。纯 flex 过渡，无需计算宽度。", code: `className={active ? "flex-[4]" : "flex-1"} style={{ transition: "all .5s" }}` }),
    item({ id: "word-scroll", title: "滚动逐字点亮", en: "Scroll Word Highlight", level: "进阶", demo: WordScrollDemo, tags: ["scrollytelling"], desc: "滚动进度映射到文字透明度：读到哪、亮到哪。", points: ["进度 p = scrollTop / (scrollHeight − clientHeight)。", "第 i 个字亮起条件：i / n < p × 1.15。"], code: `color: i / n < p * 1.15 ? "#fff" : "rgba(255,255,255,.18)"` }),
    item({ id: "split-pane", title: "可拖拽分栏", en: "Resizable Panes", level: "进阶", demo: SplitDemo, tags: ["resizer", "ide"], desc: "拖拽分隔条调整两栏比例，限制在 15%–85%；键盘左右键微调。", a11y: ["分隔条 role=separator，可聚焦，方向键可调。"], code: `<div role="separator" tabIndex={0} onKeyDown={(e) => e.key === "ArrowLeft" && setW(w - 3)} />` }),
    item({ id: "noise", title: "噪点纹理", en: "Noise Texture", level: "基础", demo: NoiseDemo, tags: ["grain", "texture"], desc: "在渐变上叠一层 SVG feTurbulence 噪点，消除色带，增加胶片质感。", points: ["data-URI SVG，无需图片资源。", "浅色用 multiply，深色用 screen。"], code: `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" /></filter>` }),
    item({ id: "search-highlight", title: "搜索高亮", en: "Search Highlight", level: "基础", demo: HighlightDemo, tags: ["mark", "find"], desc: "用 split(正则) 的捕获分组，把匹配片段包进 <mark>。", points: ["先转义用户输入中的正则特殊字符。", "split 带括号时，奇数下标就是匹配项。"], a11y: ["使用语义化的 mark 元素。"], code: `text.split(new RegExp("(" + escape(q) + ")", "gi")).map((p, i) => (i % 2 ? <mark>{p}</mark> : p))` }),
    item({ id: "glitch", title: "故障文字", en: "Glitch Text", level: "进阶", isNew: true, bare: true, demo: GlitchDemo, tags: ["cyberpunk", "clip-path"], desc: "三层同样的文字：主层白色，青、红两层用不同的 clip-path 动画随机裁剪并位移。", points: ["mix-blend-mode: screen 让色彩叠加出色散。", "副本加 aria-hidden，避免读屏重复朗读。"], code: `@keyframes glitch1 { 25% { clip-path: inset(40% 0 40% 0); transform: translate(3px) } }` }),
    item({ id: "wave-text", title: "波浪文字", en: "Wave Text", level: "基础", isNew: true, demo: WaveTextDemo, tags: ["stagger", "letters"], desc: "把文字拆成单个字符，每个字符的动画延迟递增，形成波浪。", points: ["animation-delay: i × 70ms。", "inline-block 才能 transform；空格需 whitespace-pre。"], code: `{text.split("").map((c, i) => <span style={{ animation: "wave 1.4s " + i * 0.07 + "s infinite" }}>{c}</span>)}` }),
    item({ id: "rolling-text", title: "翻滚悬停文字", en: "Rolling Hover Text", level: "进阶", isNew: true, demo: RollingTextDemo, tags: ["link", "hover"], desc: "每个字符是一个裁剪窗口，里面叠两份字，悬停时整体上滚，逐字错开延迟。", points: ["窗口高度固定 1.3em + overflow-hidden。", "第二份字绝对定位在下方，颜色用强调色。"], code: `group-hover:-translate-y-full /* 每字 transition-delay: i × 25ms */` }),
    item({ id: "morph-words", title: "文字变形切换", en: "Morphing Words", level: "进阶", isNew: true, demo: MorphWordsDemo, tags: ["blur", "crossfade"], desc: "所有词叠放在同一个 grid 单元格中，当前词清晰，其余模糊缩小并透明，切换时像“融化”。", points: ["grid + col-start-1 row-start-1 叠放，容器宽度由最宽的词撑开。", "filter: blur() + opacity + scale 同步过渡。"], code: `style={{ opacity: on ? 1 : 0, filter: on ? "blur(0)" : "blur(14px)", transform: on ? "scale(1)" : "scale(.8)" }}` }),
    item({ id: "svg-draw", title: "SVG 手写动画", en: "SVG Path Draw", level: "进阶", isNew: true, demo: SvgDrawDemo, tags: ["stroke", "signature"], desc: "描边从无到有被“画”出来。适合签名、Logo、插画入场。", points: ["pathLength=1 归一化，免去 getTotalLength()。", "dasharray = 1，dashoffset 1 → 0。", "多条路径用 animation-delay 串联。"], code: `<path pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 2s forwards" }} />` }),
    item({ id: "gradient-text", title: "渐变流光文字", en: "Gradient Text", level: "基础", isNew: true, demo: GradientTextDemo, tags: ["background-clip"], desc: "background-clip: text 让渐变只显示在字形内，并让背景位置缓慢移动形成流光。", points: ["渐变首尾同色，循环才无缝。", "渐变色取自强调色，换主题色自动联动。"], code: `.text-gradient { background: linear-gradient(100deg, A, B, A) 0 0 / 200%; -webkit-background-clip: text; color: transparent; }` }),
    item({ id: "elastic", title: "弹性按压", en: "Elastic Press", level: "基础", isNew: true, demo: ElasticDemo, tags: ["spring", "bounce"], desc: "按下时快速缩小，松开时用过冲曲线（y 值 > 1）弹回，质感像真实按键。", points: ["按下 150ms 线性；松开 700ms cubic-bezier(.34,2.2,.64,1)。"], code: `transition: s === 1 ? "transform .7s cubic-bezier(.34,2.2,.64,1)" : "transform .15s"` }),
  ],
};
