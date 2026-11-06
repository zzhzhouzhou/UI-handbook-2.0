import { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw, Trash2, GripVertical, Loader2, Layers, Box as BoxIcon, MousePointer2, Sparkles } from "lucide-react";
import type { Section } from "@/types";
import { Btn, Seg, Row, useCountUp, useLoop } from "@/components/ui";
import { DotField } from "@/components/DotField";
import { cn } from "@/utils/cn";
import { useInView, clamp, lerp, cssVar } from "@/lib/hooks";

/* ================= TEXT ================= */
function Typewriter() {
  const words = ["构建出色的交互", "打磨每一个细节", "让界面会说话", "克制而有力量"];
  const [i, setI] = useState(0);
  const [n, setN] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i];
    const t = setTimeout(() => {
      if (!del) { if (n < w.length) setN(n + 1); else setTimeout(() => setDel(true), 1100); }
      else if (n > 0) setN(n - 1); else { setDel(false); setI((i + 1) % words.length); }
    }, del ? 45 : 110);
    return () => clearTimeout(t);
  }, [n, del, i]);
  return <div className="py-8 text-center text-3xl font-semibold tracking-tight sm:text-4xl" aria-label={words[i]}>{words[i].slice(0, n)}<span className="ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-fg" style={{ animation: "caret 1s steps(1) infinite" }} /></div>;
}

function Scramble() {
  const target = "DESIGN IS ORDER 设计即秩序";
  const [txt, setTxt] = useState(target);
  const [k, setK] = useState(0);
  useEffect(() => {
    const chars = "!<>-_\\/[]{}—=+*^?#01";
    let f = 0;
    const id = setInterval(() => {
      f++;
      setTxt(target.split("").map((c, i) => (c === " " ? " " : i < f / 2 ? c : chars[Math.floor(Math.random() * chars.length)])).join(""));
      if (f / 2 >= target.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [k]);
  return <div className="space-y-5 py-6 text-center"><div className="font-mono text-2xl font-medium tracking-wide sm:text-3xl">{txt}</div><Btn variant="outline" size="sm" onClick={() => setK(k + 1)}><RefreshCw size={13} />重新解码</Btn></div>;
}

function Counters() {
  const [ref, inV] = useInView<HTMLDivElement>({ once: true });
  const a = useCountUp(12800, inV), b = useCountUp(98.6, inV), c = useCountUp(240, inV);
  const [num, setNum] = useState(2048);
  const digits = String(num).padStart(5, "0").split("").map(Number);
  return (
    <div ref={ref} className="space-y-10">
      <div className="grid grid-cols-3 gap-4 text-center">
        {[[Math.round(a).toLocaleString(), "用户"], [b.toFixed(1) + "%", "满意度"], [Math.round(c) + "ms", "响应"]].map(([v, l]) => <div key={l}><div className="text-3xl font-semibold tabular-nums tracking-tight sm:text-5xl">{v}</div><div className="mt-1 text-xs text-mute">{l}</div></div>)}
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1 rounded-xl bg-inv p-2 text-invfg">
          {digits.map((d, i) => <div key={i} className="h-[1.3em] w-9 overflow-hidden text-3xl font-semibold leading-[1.3em]"><div className="transition-transform duration-700" style={{ transform: `translateY(${-d * 1.3}em)`, transitionDelay: `${i * 60}ms`, transitionTimingFunction: "cubic-bezier(.34,1.2,.64,1)" }}>{Array.from({ length: 10 }, (_, n) => <div key={n} className="h-[1.3em] text-center">{n}</div>)}</div></div>)}
        </div>
        <Btn variant="outline" size="sm" onClick={() => setNum(Math.floor(Math.random() * 99999))}>翻牌</Btn>
      </div>
    </div>
  );
}

function WaveRoll() {
  const w = "Hello, Wave! 你好，波浪";
  const r = "悬停翻滚文字";
  return (
    <div className="space-y-10 py-4 text-center">
      <div className="text-3xl font-semibold tracking-tight sm:text-4xl">{w.split("").map((c, i) => <span key={i} className="inline-block whitespace-pre" style={{ animation: `wave 1.6s ease-in-out ${i * 0.08}s infinite` }}>{c}</span>)}</div>
      <div className="group inline-flex cursor-default text-4xl font-semibold tracking-tight">
        {r.split("").map((c, i) => <span key={i} className="relative inline-block h-[1.3em] overflow-hidden leading-[1.3em]"><span className="block transition-transform duration-500 group-hover:-translate-y-full" style={{ transitionDelay: `${i * 25}ms`, transitionTimingFunction: "var(--ease)" }}>{c}</span><span className="absolute left-0 top-full block text-mute transition-transform duration-500 group-hover:-translate-y-full" style={{ transitionDelay: `${i * 25}ms`, transitionTimingFunction: "var(--ease)" }}>{c}</span></span>)}
      </div>
    </div>
  );
}

function Morph() {
  const W = ["灵感", "代码", "设计", "体验"];
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((x) => (x + 1) % W.length), 2000); return () => clearInterval(t); }, []);
  return (
    <div className="flex items-center justify-center gap-3 py-8 text-4xl font-semibold tracking-tight sm:text-5xl">
      <span>把</span>
      <span className="grid"><>{W.map((w, k) => <span key={w} className="col-start-1 row-start-1 transition-all duration-700" style={{ opacity: k === i ? 1 : 0, filter: k === i ? "blur(0)" : "blur(12px)", transform: k === i ? "scale(1)" : "scale(.85)" }}>{w}</span>)}</></span>
      <span>变成现实</span>
    </div>
  );
}

function Marquee() {
  const row = (items: string[], rev = false, dur = 32) => (
    <div className="overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)" }}>
      <div className="flex w-max gap-3 hover:[animation-play-state:paused]" style={{ animation: `marquee ${dur}s linear infinite ${rev ? "reverse" : ""}` }}>
        {[...items, ...items].map((t, i) => <span key={i} className="rounded-full border border-line2 px-5 py-2 text-sm text-mute">{t}</span>)}
      </div>
    </div>
  );
  const a = ["设计系统", "交互动效", "无障碍", "极致性能", "排版", "栅格", "色彩", "组件库", "令牌"];
  const b = ["Typography", "Spacing", "Motion", "Hierarchy", "Contrast", "Rhythm", "Grid", "Whitespace"];
  return <div className="space-y-3 py-4">{row(a)}{row(b, true, 38)}</div>;
}

function Draw() {
  const [k, setK] = useState(0);
  const P = [
    "M20 120 C 40 20, 90 20, 90 80 S 60 150, 100 100 S 170 30, 190 90 S 240 150, 290 60",
    "M310 100 m -48 0 a 48 48 0 1 0 96 0 a 48 48 0 1 0 -96 0",
    "M30 170 L 380 170",
  ];
  return (
    <div className="text-center">
      <svg key={k} viewBox="0 0 400 190" className="mx-auto w-full max-w-lg" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {P.map((d, i) => <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: `draw ${i === 0 ? 2.2 : 1.2}s ${i * 0.9}s var(--ease) forwards` }} />)}
      </svg>
      <Btn variant="outline" size="sm" onClick={() => setK(k + 1)}><RefreshCw size={13} />重新书写</Btn>
    </div>
  );
}

function Glitch() {
  const t = "GLITCH 故障";
  return (
    <div className="grid place-items-center py-8">
      <div className="relative cursor-default text-5xl font-bold tracking-tight sm:text-6xl">
        <span className="relative">{t}</span>
        <span aria-hidden className="absolute inset-0 text-mute" style={{ animation: "glitchA 2.4s steps(1) infinite" }}>{t}</span>
        <span aria-hidden className="absolute inset-0 text-dim" style={{ animation: "glitchB 1.8s steps(1) infinite" }}>{t}</span>
      </div>
    </div>
  );
}

/* ================= POINTER ================= */
function Spotlight() {
  const [p, setP] = useState({ x: -200, y: -200 });
  const ref = useRef<HTMLDivElement>(null);
  const txt = "隐藏的内容只在光标附近显示。适合做彩蛋、聚焦引导与神秘感。";
  return (
    <div ref={ref} className="relative h-56 overflow-hidden rounded-xl border border-line bg-bg" onPointerMove={(e) => { const r = ref.current!.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top }); }} onPointerLeave={() => setP({ x: -300, y: -300 })}>
      <div className="stage-grid absolute inset-0 opacity-70" />
      <div className="absolute inset-0 grid place-items-center p-10 text-center text-2xl font-semibold leading-snug text-fg/10">{txt}</div>
      <div className="absolute inset-0 grid place-items-center p-10 text-center text-2xl font-semibold leading-snug" style={{ maskImage: `radial-gradient(circle 110px at ${p.x}px ${p.y}px, #000 0%, transparent 100%)`, WebkitMaskImage: `radial-gradient(circle 110px at ${p.x}px ${p.y}px, #000 0%, transparent 100%)` }}>{txt}</div>
    </div>
  );
}

function Tilt() {
  const [r, setR] = useState({ x: 0, y: 0, gx: 50, gy: 50, on: false });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="grid place-items-center py-4" style={{ perspective: 900 }}>
      <div ref={ref} onPointerMove={(e) => { const b = ref.current!.getBoundingClientRect(); const px = (e.clientX - b.left) / b.width, py = (e.clientY - b.top) / b.height; setR({ x: (0.5 - py) * 18, y: (px - 0.5) * 22, gx: px * 100, gy: py * 100, on: true }); }} onPointerLeave={() => setR({ x: 0, y: 0, gx: 50, gy: 50, on: false })}
        className="relative h-52 w-80 overflow-hidden rounded-2xl bg-inv p-6 text-invfg" style={{ transform: `rotateX(${r.x}deg) rotateY(${r.y}deg)`, transition: r.on ? "transform .1s linear" : "transform .6s var(--ease)", transformStyle: "preserve-3d", boxShadow: "0 30px 60px -20px rgb(0 0 0 / .4)" }}>
        <div className="flex items-center justify-between"><Sparkles size={20} /><span className="font-mono text-[11px] opacity-50">NO. 0001</span></div>
        <div className="absolute bottom-6 left-6" style={{ transform: "translateZ(40px)" }}><div className="text-2xl font-semibold tracking-tight">形色场</div><div className="mt-1 text-xs opacity-60">UI Handbook · Member</div></div>
        <div className="pointer-events-none absolute inset-0 transition-opacity duration-300" style={{ opacity: r.on ? 1 : 0, background: `radial-gradient(circle at ${r.gx}% ${r.gy}%, rgb(255 255 255 / .22), transparent 55%)` }} />
      </div>
    </div>
  );
}

function Cube() {
  const [rot, setRot] = useState({ x: -20, y: 30 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [idle, setIdle] = useState(true);
  const [ref, vis] = useInView<HTMLDivElement>();
  useLoop((_, dt) => { if (idle && !drag.current) setRot((r) => ({ ...r, y: r.y + dt * 0.03 })); }, vis);
  const faces = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"];
  const S = 84;
  return (
    <div ref={ref} className="grid h-64 touch-none place-items-center" style={{ perspective: 700 }}
      onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; setIdle(false); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; drag.current = { x: e.clientX, y: e.clientY }; setRot((r) => ({ x: clamp(r.x - dy * 0.5, -90, 90), y: r.y + dx * 0.5 })); }}
      onPointerUp={() => { drag.current = null; }}>
      <div className="relative cursor-grab active:cursor-grabbing" style={{ width: S * 2, height: S * 2, transformStyle: "preserve-3d", transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}>
        {faces.map((f, i) => <div key={i} className="absolute left-1/2 top-1/2 grid place-items-center border border-fg/70 bg-bg/80 text-3xl font-semibold backdrop-blur-[1px]" style={{ width: S * 2, height: S * 2, marginLeft: -S, marginTop: -S, transform: `${f} translateZ(${S}px)`, background: i % 2 ? "color-mix(in oklab, var(--soft2) 85%, transparent)" : undefined }}>{i + 1}</div>)}
      </div>
    </div>
  );
}

function FlipCards() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {[["速度", "100ms 内响应"], ["质量", "像素级对齐"], ["克制", "去掉多余装饰"], ["一致", "同一套令牌"]].map(([a, b], i) => (
        <button key={a} className="group h-36 text-left [perspective:800px]">
          <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]" style={{ transitionTimingFunction: "var(--ease)" }}>
            <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-line2 bg-bg p-4 [backface-visibility:hidden]"><span className="font-mono text-[11px] text-dim">0{i + 1}</span><span className="text-xl font-semibold">{a}</span></div>
            <div className="absolute inset-0 flex items-end rounded-2xl bg-inv p-4 text-[13px] text-invfg [backface-visibility:hidden] [transform:rotateY(180deg)]">{b}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function Trail() {
  const cv = useRef<HTMLCanvasElement>(null);
  const pts = useRef<{ x: number; y: number; t: number }[]>([]);
  const [ref, vis] = useInView<HTMLDivElement>();
  useLoop((t) => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    const dpr = Math.min(2, devicePixelRatio || 1), w = c.clientWidth, h = c.clientHeight;
    if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    pts.current = pts.current.filter((p) => t - p.t < 700);
    ctx.strokeStyle = cssVar("--fg"); ctx.lineCap = "round";
    for (let i = 1; i < pts.current.length; i++) { const a = pts.current[i - 1], b = pts.current[i]; const life = 1 - (t - b.t) / 700; ctx.globalAlpha = life; ctx.lineWidth = 1 + life * 9; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  }, vis);
  return (
    <div ref={ref} className="relative h-56 overflow-hidden rounded-xl border border-line bg-bg" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); pts.current.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }); }}>
      <canvas ref={cv} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-dim"><MousePointer2 size={14} className="mr-2" />在此移动光标</div>
    </div>
  );
}

function DotsDemo() {
  return <div className="relative h-60 overflow-hidden rounded-xl border border-line bg-bg"><DotField className="absolute inset-0 h-full w-full" spacing={20} /><div className="pointer-events-none absolute inset-0 grid place-items-center text-xs text-mute">移动光标，点阵会被推开并放大</div></div>;
}

function Gallery() {
  const P = (i: number) => (
    <svg viewBox="0 0 200 200" className="h-full w-full" preserveAspectRatio="xMidYMid slice"><rect width="200" height="200" fill={i % 2 ? "#0a0a0a" : "#ececec"} />
      <g fill="none" stroke={i % 2 ? "#f4f4f4" : "#0a0a0a"} strokeWidth="1.2">
        {i === 0 && Array.from({ length: 10 }).map((_, k) => <circle key={k} cx="100" cy="100" r={10 + k * 12} />)}
        {i === 1 && Array.from({ length: 16 }).map((_, k) => <line key={k} x1={k * 14} y1="0" x2={200 - k * 14} y2="200" />)}
        {i === 2 && Array.from({ length: 8 }).map((_, k) => <rect key={k} x={20 + k * 8} y={20 + k * 8} width={160 - k * 16} height={160 - k * 16} />)}
        {i === 3 && Array.from({ length: 12 }).map((_, k) => <path key={k} d={`M0 ${k * 17} Q100 ${k * 17 + 40} 200 ${k * 17}`} />)}
        {i === 4 && <><circle cx="70" cy="100" r="50" fill="#f4f4f4" /><circle cx="130" cy="100" r="50" /></>}
      </g>
    </svg>
  );
  return <div className="flex h-60 gap-2">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="min-w-0 grow cursor-pointer overflow-hidden rounded-xl border border-line transition-[flex-grow] duration-500 hover:grow-[4]" style={{ transitionTimingFunction: "var(--ease)" }}>{P(i)}</div>)}</div>;
}

function Goo() {
  const box = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 150, y: 100 });
  const [ref, vis] = useInView<HTMLDivElement>();
  const pos = useRef(Array.from({ length: 7 }, () => ({ x: 150, y: 100 })));
  const els = useRef<(HTMLDivElement | null)[]>([]);
  useLoop(() => {
    pos.current.forEach((p, i) => { const tgt = i === 0 ? mouse.current : pos.current[i - 1]; p.x = lerp(p.x, tgt.x, 0.28); p.y = lerp(p.y, tgt.y, 0.28); const e = els.current[i]; if (e) e.style.transform = `translate(${p.x - 24}px,${p.y - 24}px) scale(${1 - i * 0.11})`; });
  }, vis);
  return (
    <div ref={ref}>
      <svg className="absolute h-0 w-0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" /><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" /></filter></defs></svg>
      <div ref={box} onPointerMove={(e) => { const r = box.current!.getBoundingClientRect(); mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top }; }} className="relative h-56 overflow-hidden rounded-xl border border-line bg-bg">
        <div className="absolute inset-0 text-fg" style={{ filter: "url(#goo)" }}>{pos.current.map((_, i) => <div key={i} ref={(el) => { els.current[i] = el; }} className="absolute left-0 top-0 h-12 w-12 rounded-full bg-current" />)}</div>
        <div className="pointer-events-none absolute bottom-3 right-4 text-xs text-dim">液态融合 · 移动光标</div>
      </div>
    </div>
  );
}

/* ================= SCROLL / GESTURE ================= */
function ScrollReveal() {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const els = box.current!.querySelectorAll(".reveal");
    els.forEach((e) => e.classList.remove("in"));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { root: box.current, threshold: 0.2 });
    els.forEach((e) => io.observe(e));
    box.current!.scrollTop = 0;
    return () => io.disconnect();
  }, [k]);
  return (
    <div>
      <div ref={box} className="h-64 space-y-4 overflow-y-auto rounded-xl border border-line bg-bg p-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="reveal flex items-center gap-4 rounded-xl border border-line p-4" style={{ transform: i % 2 ? undefined : undefined }}><span className="font-mono text-xs text-dim">0{i + 1}</span><div><div className="text-sm font-medium">区块 {i + 1}</div><div className="text-xs text-mute">进入视口时淡入 + 位移</div></div></div>)}
      </div>
      <div className="mt-3"><Btn variant="outline" size="sm" onClick={() => setK(k + 1)}><RefreshCw size={13} />重置</Btn></div>
    </div>
  );
}

function StackCards() {
  const T = [["01", "研究"], ["02", "定义"], ["03", "设计"], ["04", "交付"]];
  return (
    <div className="h-72 overflow-y-auto rounded-xl border border-line bg-soft p-4">
      {T.map(([n, t], i) => <div key={n} className="sticky mb-4 grid h-40 content-between rounded-2xl border border-line2 p-5 shadow-soft" style={{ top: 12 + i * 14, background: i === 3 ? "var(--inv)" : "var(--bg)", color: i === 3 ? "var(--invfg)" : "var(--fg)" }}><span className="font-mono text-xs opacity-50">{n}</span><span className="text-2xl font-semibold tracking-tight">{t}</span></div>)}
      <div className="h-24" />
    </div>
  );
}

function LitText() {
  const t = "好的设计是尽可能少的设计。它不是装饰，而是让产品在不被察觉的地方，把每一件事做对。向下滚动，文字会随阅读进度被逐字点亮。";
  const [p, setP] = useState(0);
  return (
    <div className="h-64 overflow-y-auto rounded-xl border border-line bg-bg" onScroll={(e) => { const c = e.currentTarget; setP(c.scrollTop / (c.scrollHeight - c.clientHeight)); }}>
      <div className="h-[560px]"><div className="sticky top-0 grid h-64 place-items-center p-8"><p className="text-2xl font-semibold leading-snug tracking-tight">{t.split("").map((c, i) => <span key={i} style={{ opacity: i / t.length < p * 1.15 ? 1 : 0.14, transition: "opacity .25s" }}>{c}</span>)}</p></div></div>
    </div>
  );
}

function Parallax() {
  const [s, setS] = useState(0);
  return (
    <div className="h-64 overflow-y-auto rounded-xl border border-line bg-bg" onScroll={(e) => setS(e.currentTarget.scrollTop)}>
      <div className="relative h-[640px] overflow-hidden">
        <div className="sticky top-0 h-64 overflow-hidden">
          <div className="absolute left-[10%] top-8 h-40 w-40 rounded-full border border-fg/30" style={{ transform: `translateY(${-s * 0.15}px)` }} />
          <div className="absolute right-[12%] top-24 h-24 w-24 rounded-full bg-fg/10" style={{ transform: `translateY(${-s * 0.45}px)` }} />
          <div className="absolute left-[45%] top-40 h-px w-48 bg-fg/40" style={{ transform: `translateY(${-s * 0.7}px)` }} />
          <div className="absolute inset-0 grid place-items-center"><div className="text-center" style={{ transform: `translateY(${-s * 0.3}px)`, opacity: 1 - s / 240 }}><div className="text-4xl font-semibold tracking-tight">视差层次</div><div className="mt-1 text-xs text-mute">不同速度 = 不同深度</div></div></div>
        </div>
      </div>
    </div>
  );
}

function Infinite() {
  const [n, setN] = useState(10);
  const [load, setLoad] = useState(false);
  const more = () => { if (load || n >= 60) return; setLoad(true); setTimeout(() => { setN((x) => x + 8); setLoad(false); }, 700); };
  return (
    <div className="h-64 overflow-y-auto rounded-xl border border-line bg-bg p-3" onScroll={(e) => { const c = e.currentTarget; if (c.scrollHeight - c.scrollTop - c.clientHeight < 60) more(); }}>
      <div className="space-y-2">{Array.from({ length: n }).map((_, i) => <div key={i} className="anim-fade-up flex items-center gap-3 rounded-lg border border-line px-4 py-3 text-[13px]" style={{ animationDuration: ".3s" }}><span className="font-mono text-[11px] text-dim">{String(i + 1).padStart(2, "0")}</span>动态条目 {i + 1}</div>)}</div>
      <div className="grid h-12 place-items-center text-xs text-mute">{n >= 60 ? "已经到底了" : load ? <Loader2 size={16} className="animate-spin" /> : "滚动到底部加载更多"}</div>
    </div>
  );
}

function SortList() {
  const [items, setItems] = useState(["需求评审", "视觉设计", "前端开发", "测试验收", "发布上线"]);
  const [d, setD] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-sm space-y-2">
      {items.map((t, i) => <div key={t} draggable onDragStart={() => setD(i)} onDragEnd={() => setD(null)} onDragOver={(e) => e.preventDefault()} onDragEnter={() => { if (d == null || d === i) return; const a = [...items]; const [m] = a.splice(d, 1); a.splice(i, 0, m); setItems(a); setD(i); }} className={cn("flex cursor-grab items-center gap-3 rounded-xl border border-line bg-bg px-4 py-3 text-[13px] transition-all", d === i && "scale-[1.02] border-fg opacity-50")}><GripVertical size={14} className="text-dim" /><span className="font-mono text-[11px] text-dim">{i + 1}</span>{t}</div>)}
    </div>
  );
}

function Swipe() {
  const init = ["午餐 ¥32", "地铁 ¥6", "咖啡 ¥28", "电影 ¥68"];
  const [items, setItems] = useState(init);
  return (
    <div className="mx-auto max-w-sm">
      <div className="space-y-2">{items.map((t) => <SwipeRow key={t} t={t} onDel={() => setItems((x) => x.filter((y) => y !== t))} />)}</div>
      <div className="mt-4 flex items-center justify-between text-xs text-mute"><span>向左拖动 · 过半即删除</span><button className="underline underline-offset-4 hover:text-fg" onClick={() => setItems(init)}>恢复</button></div>
    </div>
  );
}
function SwipeRow({ t, onDel }: { t: string; onDel: () => void }) {
  const [x, setX] = useState(0);
  const [gone, setGone] = useState(false);
  const s = useRef<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const up = () => { if (s.current == null) return; s.current = null; if (-x > ref.current!.clientWidth / 2) { setGone(true); setX(-ref.current!.clientWidth); setTimeout(onDel, 320); } else setX(0); };
  return (
    <div className={cn("grid transition-all duration-300", gone ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr]")}>
      <div className="overflow-hidden"><div ref={ref} className="relative overflow-hidden rounded-xl bg-inv">
        <div className="absolute inset-y-0 right-4 flex items-center gap-1 text-xs text-invfg"><Trash2 size={14} />删除</div>
        <div onPointerDown={(e) => { s.current = e.clientX - x; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }} onPointerMove={(e) => s.current != null && setX(Math.min(0, e.clientX - s.current))} onPointerUp={up} onPointerCancel={up} className="relative flex touch-pan-y select-none items-center rounded-xl border border-line bg-bg px-4 py-3.5 text-[13px]" style={{ transform: `translateX(${x}px)`, transition: s.current == null ? "transform .3s var(--ease)" : "none" }}>{t}</div>
      </div></div>
    </div>
  );
}

function Split() {
  const [p, setP] = useState(40);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  return (
    <div ref={ref} className="relative flex h-56 overflow-hidden rounded-xl border border-line bg-bg" onPointerMove={(e) => { if (!drag.current) return; const r = ref.current!.getBoundingClientRect(); setP(clamp(((e.clientX - r.left) / r.width) * 100, 15, 85)); }} onPointerUp={() => (drag.current = false)} onPointerLeave={() => (drag.current = false)}>
      <div className="grid place-items-center bg-soft text-sm text-mute" style={{ width: p + "%" }}>左栏 {Math.round(p)}%</div>
      <div role="separator" tabIndex={0} aria-valuenow={Math.round(p)} aria-label="拖动调整分栏" onKeyDown={(e) => { if (e.key === "ArrowLeft") setP((v) => clamp(v - 2, 15, 85)); if (e.key === "ArrowRight") setP((v) => clamp(v + 2, 15, 85)); }} onPointerDown={() => (drag.current = true)} className="group relative w-px shrink-0 cursor-col-resize touch-none bg-line2"><span className="absolute inset-y-0 -left-2 w-4" /><span className="absolute left-1/2 top-1/2 h-8 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg transition-transform group-hover:scale-y-125" /></div>
      <div className="grid flex-1 place-items-center text-sm text-mute">右栏 {Math.round(100 - p)}%</div>
    </div>
  );
}

function Shrink() {
  const [s, setS] = useState(0);
  const [pr, setPr] = useState(0);
  return (
    <div className="relative h-64 overflow-hidden rounded-xl border border-line bg-bg">
      <div className={cn("absolute inset-x-0 top-0 z-10 flex items-center border-b px-5 transition-all duration-300", s > 24 ? "glass h-12 border-line" : "h-[72px] border-transparent bg-bg")}><div className={cn("font-semibold tracking-tight transition-all duration-300", s > 24 ? "text-sm" : "text-2xl")}>长文章标题</div><div className="absolute inset-x-0 bottom-0 h-px origin-left bg-fg" style={{ transform: `scaleX(${pr})` }} /></div>
      <div className="h-full overflow-y-auto px-5 pb-6 pt-[84px]" onScroll={(e) => { const c = e.currentTarget; setS(c.scrollTop); setPr(c.scrollTop / (c.scrollHeight - c.clientHeight)); }}>
        {Array.from({ length: 7 }).map((_, i) => <p key={i} className="mb-4 text-[13px] text-mute">第 {i + 1} 段：向下滚动这块区域——头部会缩小并加毛玻璃，同时底部出现阅读进度线。好的长内容页让读者始终知道自己读到了哪里。</p>)}
      </div>
    </div>
  );
}

const _u = [useMemo, Seg, Row, Layers, BoxIcon];
void _u;

export const effects: Section[] = [
  {
    id: "text", group: "effects", title: "文字动效", en: "Text Motion",
    desc: "文字是界面的主体。让它动起来，但每一次动都要有理由。",
    blocks: [
      { id: "x-type", title: "打字机", desc: "逐字输入、停顿、逐字删除、切换下一个词。光标用 steps(1) 闪烁。", tips: ["删除速度快于输入速度，更自然。", "提供静态替代文本，屏幕阅读器读完整句。"], render: () => <Typewriter /> },
      { id: "x-scramble", title: "乱码解码", desc: "文字先随机字符闪烁，再从左到右逐个“解码”。等宽字体防止宽度抖动。", render: () => <Scramble /> },
      { id: "x-count", title: "数字滚动与翻牌", desc: "进入视口时从 0 缓动到目标值；翻牌器把每一位做成垂直滚动的数字列。", tips: ["tabular-nums 防止宽度跳动。"], render: () => <Counters /> },
      { id: "x-wave", title: "波浪与翻滚", desc: "每个字符延迟递增形成波浪；悬停时每个字符上滚，逐字错开。", render: () => <WaveRoll /> },
      { id: "x-morph", title: "文字变形切换", desc: "所有词叠放在同一个 grid 单元格中，当前词清晰，其余模糊缩小并透明。", render: () => <Morph /> },
      { id: "x-marquee", title: "无限跑马灯", desc: "内容复制一份，平移 −50% 无缝循环。悬停暂停，两端渐隐。", render: () => <Marquee /> },
      { id: "x-draw", title: "SVG 手写描边", desc: "路径从无到有被“画”出来。pathLength=1 归一化，免去测量长度。", render: () => <Draw /> },
      { id: "x-glitch", title: "故障文字", desc: "三层同样的文字，两层用不同的 clip-path 动画随机错位。", render: () => <Glitch /> },
    ],
  },
  {
    id: "pointer", group: "effects", title: "指针与空间", en: "Pointer & Space",
    desc: "让界面对指针有感知，并在二维屏幕上搭出三维的深度。",
    blocks: [
      { id: "x-spot", title: "聚光灯", desc: "radial-gradient 作为 mask-image，只在光标附近显示隐藏层。", render: () => <Spotlight /> },
      { id: "x-tilt", title: "3D 倾斜卡片", desc: "根据指针位置旋转卡片，并叠加一层跟随的高光。", render: () => <Tilt /> },
      { id: "x-cube", title: "3D 立方体", desc: "六个面各自 rotate + translateZ。拖动旋转，松开后自转。", render: () => <Cube /> },
      { id: "x-flip", title: "3D 翻转卡", desc: "悬停或聚焦翻到背面。两面都设 backface-visibility: hidden。", tips: ["触屏无 hover，不要把关键信息只放在背面。"], render: () => <FlipCards /> },
      { id: "x-trail", title: "光标拖尾", desc: "记录最近 700ms 的指针轨迹，按年龄决定透明度与线宽。", render: () => <Trail /> },
      { id: "x-dots", title: "点阵场", desc: "Canvas 点阵随指针被推开并放大，仅在可视时运行。本站首屏使用了同一组件。", render: () => <DotsDemo /> },
      { id: "x-gallery", title: "伸缩画廊", desc: "悬停的面板 flex-grow 变大，其余缩小。纯 flex 过渡，无需计算宽度。", render: () => <Gallery /> },
      { id: "x-goo", title: "液态融合", desc: "先高斯模糊，再用 feColorMatrix 提高 alpha 对比，相邻圆形就会像水滴一样融合。", render: () => <Goo /> },
    ],
  },
  {
    id: "scroll", group: "effects", title: "滚动与手势", en: "Scroll & Gesture",
    desc: "滚动联动和手势交互：让页面“活”起来的细节。",
    blocks: [
      { id: "x-reveal", title: "滚动显现", desc: "用 IntersectionObserver，比监听 scroll 更省性能。只触发一次。", render: () => <ScrollReveal /> },
      { id: "x-stack", title: "堆叠卡片", desc: "纯 CSS：每张卡 position: sticky，top 依次递增，后一张盖住前一张。", render: () => <StackCards /> },
      { id: "x-lit", title: "滚动逐字点亮", desc: "滚动进度映射到文字透明度：读到哪、亮到哪。", render: () => <LitText /> },
      { id: "x-parallax", title: "视差层次", desc: "不同图层以不同速度位移，制造景深。", render: () => <Parallax /> },
      { id: "x-shrink", title: "收缩头部与阅读进度", desc: "滚动后头部缩小并加毛玻璃，细线显示阅读进度。用 scaleX 而不是 width。", render: () => <Shrink /> },
      { id: "x-infinite", title: "无限滚动", desc: "接近底部时预加载下一批。大量数据请配合虚拟列表。", render: () => <Infinite /> },
      { id: "x-sort", title: "拖拽排序", desc: "拖过其它项时即时重排。", tips: ["提供“上移 / 下移”按钮作为键盘替代。"], render: () => <SortList /> },
      { id: "x-swipe", title: "左滑删除", desc: "移动端经典手势。过半松手即删除，并用 grid-rows 动画收起。", render: () => <Swipe /> },
      { id: "x-split", title: "可拖拽分栏", desc: "拖拽分隔条调整两栏比例，限制在 15%–85%，键盘左右键可微调。", render: () => <Split /> },
    ],
  },
];
