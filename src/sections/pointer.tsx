import { useEffect, useMemo, useRef, useState } from "react";
import { Cpu, MousePointer2, Play, Pause, Sparkles, Shield, Rocket } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Range } from "../components/ui";
import { cn } from "../utils/cn";
import { clamp, lerp, useRaf, useVisible } from "../lib/hooks";

/* ---------- 画布舞台 ---------- */
type Mouse = { x: number; y: number; inside: boolean; down: boolean };
interface Api { ctx: CanvasRenderingContext2D; w: number; h: number; mouse: React.MutableRefObject<Mouse>; dark: boolean; hue: number }
function CanvasStage({ height = 280, init, className }: { height?: number; init: (a: Api) => (dt: number, t: number) => void; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<Mouse>({ x: -999, y: -999, inside: false, down: false });
  const visRef = useRef(true);
  visRef.current = useVisible();
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let raf = 0, last = performance.now(), step: (dt: number, t: number) => void;
    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = c.clientWidth, h = c.clientHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const hue = +getComputedStyle(document.documentElement).getPropertyValue("--accent-h") || 268;
      step = init({ ctx, w, h, mouse, dark: document.documentElement.classList.contains("dark"), hue });
    };
    setup();
    const ro = new ResizeObserver(setup); ro.observe(c);
    const loop = (t: number) => { if (visRef.current) step(Math.min(t - last, 50), t); last = t; raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const mo = new MutationObserver(setup); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); mo.disconnect(); };
  }, [init]);
  const set = (e: React.PointerEvent, inside = true) => { const r = ref.current!.getBoundingClientRect(); mouse.current.x = e.clientX - r.left; mouse.current.y = e.clientY - r.top; mouse.current.inside = inside; };
  return <canvas ref={ref} className={cn("block w-full touch-none", className)} style={{ height }} onPointerMove={(e) => set(e)} onPointerDown={(e) => { set(e); mouse.current.down = true; }} onPointerUp={() => (mouse.current.down = false)} onPointerLeave={(e) => { set(e, false); mouse.current.down = false; mouse.current.x = -999; mouse.current.y = -999; }} />;
}

function useMouseVars() {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => { const r = ref.current!.getBoundingClientRect(); ref.current!.style.setProperty("--x", e.clientX - r.left + "px"); ref.current!.style.setProperty("--y", e.clientY - r.top + "px"); };
  return { ref, onMove };
}

/* ---------- 1 背景随鼠标 ---------- */
function BgFollowDemo() {
  const { ref, onMove } = useMouseVars();
  return (
    <div ref={ref} onMouseMove={onMove} className="relative grid h-64 place-items-center overflow-hidden bg-zinc-950 text-white [--x:50%] [--y:50%]">
      <div className="absolute inset-0 transition-opacity" style={{ background: "radial-gradient(420px circle at var(--x) var(--y), color-mix(in oklab, var(--accent) 55%, transparent), transparent 60%)" }} />
      <div className="bg-grid absolute inset-0 opacity-40" />
      <p className="relative text-center text-2xl font-bold tracking-tight">移动鼠标<br /><span className="text-sm font-normal text-white/50">光晕会跟随你</span></p>
    </div>
  );
}

/* ---------- 2 视差 ---------- */
function ParallaxDemo() {
  const [p, setP] = useState({ x: 0, y: 0 });
  const L = [[0.02, "🌙", "top-6 left-[15%] text-5xl"], [0.05, "☁️", "top-14 right-[18%] text-6xl"], [0.1, "⛰️", "bottom-4 left-[20%] text-8xl"], [0.18, "🌲", "bottom-2 right-[22%] text-7xl"], [0.3, "🐦", "top-20 left-[48%] text-3xl"]] as const;
  return (
    <div className="relative h-64 overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-700 to-orange-300" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 }); }} onMouseLeave={() => setP({ x: 0, y: 0 })}>
      {L.map(([d, e, c], i) => <span key={i} className={cn("absolute select-none transition-transform duration-200 ease-out", c)} style={{ transform: `translate(${-p.x * d * 300}px, ${-p.y * d * 200}px)` }}>{e}</span>)}
      <p className="absolute inset-x-0 top-3 text-center text-xs text-white/70">不同深度的图层移动幅度不同，产生纵深感</p>
    </div>
  );
}

/* ---------- 3 音乐律动 ---------- */
function AudioBarsDemo() {
  const [on, setOn] = useState(true);
  const bars = useMemo(() => Array.from({ length: 28 }, (_, i) => ({ d: 0.6 + ((i * 37) % 10) / 10, delay: -((i * 13) % 10) / 10 })), []);
  return (
    <div className="flex items-center gap-6">
      <button onClick={() => setOn(!on)} aria-label={on ? "暂停" : "播放"} className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/30">{on ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
      <div className="flex h-16 flex-1 items-center gap-[3px]">{bars.map((b, i) => <span key={i} className="h-full flex-1 origin-center rounded-full bg-gradient-to-t from-accent to-pink-400" style={{ animation: `bar ${b.d}s ${b.delay}s ease-in-out infinite`, animationPlayState: on ? "running" : "paused" }} />)}</div>
    </div>
  );
}

/* ---------- 4 磁性按钮 ---------- */
function MagneticDemo() {
  const ref = useRef<HTMLButtonElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div className="grid h-52 place-items-center" onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height / 2; const dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy); if (d < 110) setT({ x: dx * 0.35, y: dy * 0.35 }); else setT({ x: 0, y: 0 }); }} onMouseLeave={() => setT({ x: 0, y: 0 })}>
      <button ref={ref} className="rounded-full bg-zinc-900 px-8 py-4 font-semibold text-white shadow-xl transition-transform duration-200 ease-out dark:bg-white dark:text-zinc-900" style={{ transform: `translate(${t.x}px, ${t.y}px)` }}><span className="inline-block transition-transform duration-200" style={{ transform: `translate(${t.x * 0.3}px, ${t.y * 0.3}px)` }}>靠近我</span></button>
    </div>
  );
}

/* ---------- 5 倾斜卡片 ---------- */
function TiltDemo() {
  const [s, setS] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, on: false });
  return (
    <div className="grid place-items-center py-6 [perspective:900px]">
      <div onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; setS({ rx: (0.5 - py) * 22, ry: (px - 0.5) * 26, gx: px * 100, gy: py * 100, on: true }); }} onMouseLeave={() => setS({ rx: 0, ry: 0, gx: 50, gy: 50, on: false })}
        className="relative h-44 w-72 overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-fuchsia-500 to-orange-400 p-5 text-white shadow-2xl" style={{ transform: `rotateX(${s.rx}deg) rotateY(${s.ry}deg) scale(${s.on ? 1.04 : 1})`, transition: s.on ? "transform .1s" : "transform .5s cubic-bezier(.32,.72,0,1)" }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${s.gx}% ${s.gy}%, rgba(255,255,255,.45), transparent 55%)` }} />
        <Sparkles className="relative h-7 w-7" /><p className="relative mt-10 text-xl font-bold">Tilt Card</p><p className="relative text-xs opacity-80">perspective + rotateX / rotateY + 高光</p>
      </div>
    </div>
  );
}

/* ---------- 6 边框聚光 ---------- */
function SpotBorderDemo() {
  const box = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => { box.current!.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => { const r = c.getBoundingClientRect(); c.style.setProperty("--x", e.clientX - r.left + "px"); c.style.setProperty("--y", e.clientY - r.top + "px"); }); };
  const cards = [[Cpu, "高性能"], [Shield, "更安全"], [Rocket, "更快速"]] as const;
  return (
    <div ref={box} onMouseMove={move} className="grid gap-3 bg-zinc-950 p-5 sm:grid-cols-3">
      {cards.map(([I, t]) => (
        <div key={t} data-card className="group relative rounded-2xl bg-white/10 p-px [--x:-999px] [--y:-999px]" style={{ background: "radial-gradient(220px circle at var(--x) var(--y), var(--accent), rgb(255 255 255 / 0.08) 70%)" }}>
          <div className="relative h-full overflow-hidden rounded-[calc(var(--radius-2xl)-1px)] bg-zinc-900 p-5 text-white"><div className="absolute inset-0 opacity-0 transition group-hover:opacity-100" style={{ background: "radial-gradient(200px circle at var(--x) var(--y), rgb(255 255 255 / 0.08), transparent 70%)" }} /><I className="relative mb-3 h-6 w-6 text-accent" /><h4 className="relative font-semibold">{t}</h4><p className="relative mt-1 text-sm text-white/50">边框随鼠标位置被点亮。</p></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- 7 自定义光标 ---------- */
function CursorDemo() {
  const box = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const m = useRef({ x: 0, y: 0, rx: 0, ry: 0, big: false, show: false });
  useRaf(() => { const s = m.current; s.rx = lerp(s.rx, s.x, 0.18); s.ry = lerp(s.ry, s.y, 0.18); if (dot.current) dot.current.style.transform = `translate(${s.x}px,${s.y}px) translate(-50%,-50%)`; if (ring.current) { ring.current.style.transform = `translate(${s.rx}px,${s.ry}px) translate(-50%,-50%) scale(${s.big ? 1.9 : 1})`; ring.current.style.opacity = s.show ? "1" : "0"; } });
  return (
    <div ref={box} className="relative grid h-56 cursor-none place-items-center overflow-hidden bg-zinc-100 dark:bg-zinc-900" onMouseMove={(e) => { const r = box.current!.getBoundingClientRect(); m.current.x = e.clientX - r.left; m.current.y = e.clientY - r.top; m.current.show = true; m.current.big = !!(e.target as HTMLElement).closest("[data-hover]"); }} onMouseLeave={() => (m.current.show = false)}>
      <div className="flex gap-3"><button data-hover className="cursor-none rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">悬停我</button><button data-hover className="cursor-none rounded-full border border-zinc-400 px-5 py-2.5 text-sm font-medium">再来一个</button></div>
      <div ref={ring} className="pointer-events-none absolute left-0 top-0 h-8 w-8 rounded-full border-2 border-accent opacity-0 transition-[opacity] duration-200" style={{ mixBlendMode: "normal" }} />
      <div ref={dot} className="pointer-events-none absolute left-0 top-0 h-2 w-2 rounded-full bg-accent" />
    </div>
  );
}

/* ---------- 8 粒子连线 ---------- */
const network = ({ ctx, w, h, mouse, dark, hue }: Api) => {
  const n = Math.round((w * h) / 9000);
  const ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 }));
  const col = `hsl(${hue} 85% ${dark ? 70 : 50}%`;
  return () => {
    ctx.clearRect(0, 0, w, h);
    const mm = mouse.current;
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
      const dx = p.x - mm.x, dy = p.y - mm.y, d = Math.hypot(dx, dy);
      if (d < 120 && d > 0) { p.x += (dx / d) * 0.8; p.y += (dy / d) * 0.8; }
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fillStyle = col + ")"; ctx.fill();
    }
    for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { const d = Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y); if (d < 100) { ctx.strokeStyle = col + " / " + (1 - d / 100) * 0.5 + ")"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); } }
    if (mm.inside) for (const p of ps) { const d = Math.hypot(p.x - mm.x, p.y - mm.y); if (d < 150) { ctx.strokeStyle = col + " / " + (1 - d / 150) * 0.7 + ")"; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mm.x, mm.y); ctx.stroke(); } }
  };
};
function NetworkDemo() { return <CanvasStage height={300} init={network} />; }

/* ---------- 9 涟漪 ---------- */
function RippleDemo() {
  const [rs, setRs] = useState<{ id: number; x: number; y: number }[]>([]);
  const id = useRef(0);
  return (
    <div className="flex flex-wrap gap-4">
      {["bg-accent text-accent-fg", "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"].map((c, k) => (
        <button key={k} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); const i = ++id.current; setRs((x) => [...x, { id: i, x: e.clientX - r.left, y: e.clientY - r.top }]); setTimeout(() => setRs((x) => x.filter((y) => y.id !== i)), 650); }} className={cn("relative h-12 overflow-hidden rounded-xl px-8 text-sm font-semibold", c)}>
          点击产生涟漪
          {k === 0 && rs.map((r) => <span key={r.id} className="pointer-events-none absolute h-24 w-24 rounded-full bg-white/50" style={{ left: r.x - 48, top: r.y - 48, animation: "ripple .65s ease-out forwards" }} />)}
          {k === 1 && rs.map((r) => <span key={r.id} className="pointer-events-none absolute h-24 w-24 rounded-full bg-accent/50" style={{ left: r.x - 48, top: r.y - 48, animation: "ripple .65s ease-out forwards" }} />)}
        </button>
      ))}
    </div>
  );
}

/* ---------- 10 旋钮 ---------- */
function KnobDemo() {
  const [v, setV] = useState(40);
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => { const r = ref.current!.getBoundingClientRect(); let a = (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI + 90; if (a > 180) a -= 360; a = clamp(a, -135, 135); setV(Math.round(((a + 135) / 270) * 100)); };
  const ang = -135 + (v / 100) * 270;
  return (
    <div className="flex items-center gap-8">
      <div ref={ref} role="slider" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} tabIndex={0} onKeyDown={(e) => { if (e.key === "ArrowUp" || e.key === "ArrowRight") setV(Math.min(100, v + 2)); if (e.key === "ArrowDown" || e.key === "ArrowLeft") setV(Math.max(0, v - 2)); }} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e); }} onPointerMove={(e) => e.buttons && move(e)} className="relative h-28 w-28 cursor-grab touch-none rounded-full bg-gradient-to-b from-zinc-100 to-zinc-300 shadow-[0_10px_30px_rgba(0,0,0,.2),inset_0_2px_4px_#fff] outline-none focus-visible:ring-4 focus-visible:ring-accent/30 dark:from-zinc-700 dark:to-zinc-900">
        {Array.from({ length: 11 }, (_, i) => <span key={i} className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2" style={{ transform: `translateX(-50%) rotate(${-135 + i * 27}deg)` }}><span className={cn("absolute -top-3 left-0 block h-2 w-0.5 rounded", -135 + i * 27 <= ang ? "bg-accent" : "bg-zinc-300 dark:bg-zinc-700")} /></span>)}
        <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white to-zinc-200 shadow-md dark:from-zinc-600 dark:to-zinc-800" style={{ transform: `rotate(${ang}deg)` }}><span className="absolute left-1/2 top-1.5 h-4 w-1 -translate-x-1/2 rounded bg-accent" /></div>
      </div>
      <div><p className="text-4xl font-bold tabular-nums">{v}</p><p className="text-xs text-zinc-500">拖动旋转 · 方向键微调</p></div>
    </div>
  );
}

/* ---------- 11 毛玻璃 ---------- */
function GlassDemo() {
  const [b, setB] = useState(16);
  return (
    <div className="relative grid h-64 place-items-center overflow-hidden rounded-xl bg-zinc-900">
      <span className="anim-float absolute left-[12%] top-[15%] h-28 w-28 rounded-full bg-pink-500" /><span className="anim-float absolute bottom-[10%] right-[15%] h-36 w-36 rounded-full bg-accent [animation-delay:-2s]" /><span className="anim-float absolute right-[40%] top-[10%] h-20 w-20 rounded-full bg-amber-400 [animation-delay:-4s]" />
      <div className="relative w-72 rounded-2xl border border-white/30 bg-white/15 p-5 text-white shadow-2xl" style={{ backdropFilter: `blur(${b}px) saturate(160%)` }}>
        <p className="text-xs opacity-70">GLASSMORPHISM</p><h4 className="mt-1 text-lg font-semibold">毛玻璃卡片</h4><p className="mt-1 text-sm opacity-80">backdrop-filter 模糊背后的色块。</p>
        <div className="mt-4"><Range label="blur" value={b} onChange={setB} min={0} max={32} unit="px" /></div>
      </div>
    </div>
  );
}

/* ---------- 12 边框光束 ---------- */
function BorderBeamDemo() {
  return (
    <div className="grid place-items-center gap-6 py-4 sm:grid-cols-2">
      <div className="relative overflow-hidden rounded-2xl p-[2px]"><span className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spinSlow_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_70%,var(--accent)_90%,transparent_100%)]" /><div className="relative rounded-[14px] bg-white px-8 py-6 text-center dark:bg-zinc-900"><b>旋转光束</b><p className="text-xs text-zinc-500">conic-gradient + rotate</p></div></div>
      <div className="relative overflow-hidden rounded-2xl p-[2px]"><span className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2 animate-[spinSlow_4s_linear_infinite] bg-[conic-gradient(from_0deg,#f43f5e,#f59e0b,#10b981,#06b6d4,#8b5cf6,#f43f5e)]" /><div className="relative rounded-[14px] bg-white px-8 py-6 text-center dark:bg-zinc-900"><b>彩虹边框</b><p className="text-xs text-zinc-500">全色环渐变</p></div></div>
    </div>
  );
}

/* ---------- 13 流动渐变 ---------- */
function FlowGradientDemo() {
  return (
    <div className="relative grid h-56 place-items-center overflow-hidden text-white" style={{ background: "linear-gradient(120deg,#6d4aff,#ec4899,#f59e0b,#10b981,#06b6d4,#6d4aff)", backgroundSize: "300% 300%", animation: "holo 8s linear infinite" }}>
      <div className="noise absolute inset-0" /><p className="relative text-3xl font-extrabold tracking-tight drop-shadow">Flowing Gradient</p>
    </div>
  );
}

/* ---------- 新增：极光 ---------- */
function AuroraDemo() {
  return (
    <div className="relative grid h-64 place-items-center overflow-hidden bg-zinc-950 text-white">
      {[["bg-violet-500", "-left-10 top-0", "0s"], ["bg-cyan-400", "right-0 top-10", "-5s"], ["bg-pink-500", "bottom-0 left-1/3", "-9s"], ["bg-emerald-400", "-bottom-10 right-10", "-13s"]].map(([c, p, d], i) => <span key={i} className={cn("absolute h-64 w-64 rounded-full opacity-50 mix-blend-screen blur-[70px]", c, p)} style={{ animation: `aurora 18s ${d} ease-in-out infinite` }} />)}
      <div className="bg-dots absolute inset-0 opacity-50" /><p className="relative text-4xl font-black tracking-tight">Aurora</p>
    </div>
  );
}

/* ---------- 新增：点阵排斥 ---------- */
const dotRepel = ({ ctx, w, h, mouse, dark, hue }: Api) => {
  const gap = 20; const cols = Math.ceil(w / gap), rows = Math.ceil(h / gap);
  const dots = Array.from({ length: cols * rows }, (_, i) => ({ ox: (i % cols) * gap + gap / 2, oy: Math.floor(i / cols) * gap + gap / 2, x: 0, y: 0, vx: 0, vy: 0 }));
  dots.forEach((d) => { d.x = d.ox; d.y = d.oy; });
  return () => {
    ctx.clearRect(0, 0, w, h); const m = mouse.current;
    for (const d of dots) {
      const dx = d.x - m.x, dy = d.y - m.y, dist = Math.hypot(dx, dy);
      if (dist < 90 && dist > 0) { const f = (90 - dist) / 90; d.vx += (dx / dist) * f * 3; d.vy += (dy / dist) * f * 3; }
      d.vx += (d.ox - d.x) * 0.08; d.vy += (d.oy - d.y) * 0.08; d.vx *= 0.82; d.vy *= 0.82; d.x += d.vx; d.y += d.vy;
      const disp = Math.hypot(d.x - d.ox, d.y - d.oy); const t = Math.min(disp / 25, 1);
      ctx.fillStyle = t > 0.05 ? `hsl(${hue + t * 80} 90% ${dark ? 65 : 55}%)` : dark ? "rgba(255,255,255,.25)" : "rgba(0,0,0,.25)";
      ctx.beginPath(); ctx.arc(d.x, d.y, 1.6 + t * 2.4, 0, 7); ctx.fill();
    }
  };
};
function DotRepelDemo() { return <CanvasStage height={280} init={dotRepel} />; }

/* ---------- 新增：星空穿梭 ---------- */
const starfield = ({ ctx, w, h, mouse }: Api) => {
  const S = Array.from({ length: 220 }, () => ({ x: (Math.random() - 0.5) * w * 2, y: (Math.random() - 0.5) * h * 2, z: Math.random() * w }));
  let speed = 2;
  return () => {
    const m = mouse.current;
    speed = lerp(speed, m.down ? 22 : m.inside ? 9 : 3, 0.06);
    ctx.fillStyle = "rgba(5,5,15,0.35)"; ctx.fillRect(0, 0, w, h);
    for (const s of S) {
      const pz = s.z; s.z -= speed; if (s.z < 1) { s.x = (Math.random() - 0.5) * w * 2; s.y = (Math.random() - 0.5) * h * 2; s.z = w; continue; }
      const k = 220 / s.z, pk = 220 / pz; const x = w / 2 + s.x * k, y = h / 2 + s.y * k, px = w / 2 + s.x * pk, py = h / 2 + s.y * pk;
      ctx.strokeStyle = `rgba(255,255,255,${Math.min(1, 1 - s.z / w + 0.2)})`; ctx.lineWidth = Math.max(0.4, (1 - s.z / w) * 2.4);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    }
  };
};
function StarfieldDemo() { return <div className="relative bg-[#05050f]"><CanvasStage height={280} init={starfield} /><p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-xs text-white/50">悬停加速 · 按住曲速</p></div>; }

/* ---------- 新增：全息卡片 ---------- */
function HoloDemo() {
  const [s, setS] = useState({ x: 50, y: 50, on: false });
  return (
    <div className="grid place-items-center py-6 [perspective:900px]">
      <div onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setS({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, on: true }); }} onMouseLeave={() => setS({ x: 50, y: 50, on: false })}
        className="relative h-64 w-44 overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl" style={{ transform: s.on ? `rotateY(${(s.x - 50) / 4}deg) rotateX(${-(s.y - 50) / 4}deg)` : "none", transition: s.on ? "transform .1s" : "transform .5s" }}>
        <div className="absolute inset-0 grid place-items-center text-7xl">🦄</div>
        <div className="absolute inset-0 mix-blend-color-dodge" style={{ backgroundImage: "repeating-linear-gradient(110deg,#ff0080 0%,#ff8c00 10%,#40e0d0 20%,#8a2be2 30%,#ff0080 40%)", backgroundSize: "300% 100%", backgroundPosition: `${s.x * 2}% 50%`, opacity: s.on ? 0.55 : 0.2, transition: "opacity .3s" }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at ${s.x}% ${s.y}%, rgba(255,255,255,.55), transparent 45%)`, mixBlendMode: "overlay" }} />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white"><b className="text-sm">Holo Unicorn</b><p className="text-[10px] opacity-60">★ ULTRA RARE</p></div>
      </div>
    </div>
  );
}

/* ---------- 新增：3D 立方体 ---------- */
function CubeDemo() {
  const [r, setR] = useState({ x: -20, y: 30 });
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [auto, setAuto] = useState(true);
  useRaf(() => { if (auto && !drag.current) setR((v) => ({ x: v.x, y: v.y + 0.5 })); });
  const faces = [["translateZ(80px)", "from-violet-500 to-fuchsia-500", "前"], ["rotateY(180deg) translateZ(80px)", "from-sky-500 to-cyan-400", "后"], ["rotateY(90deg) translateZ(80px)", "from-amber-400 to-orange-500", "右"], ["rotateY(-90deg) translateZ(80px)", "from-emerald-500 to-teal-400", "左"], ["rotateX(90deg) translateZ(80px)", "from-rose-500 to-pink-400", "上"], ["rotateX(-90deg) translateZ(80px)", "from-indigo-500 to-blue-400", "下"]];
  return (
    <div className="grid place-items-center py-4 [perspective:700px]" onPointerDown={(e) => { drag.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={(e) => { if (!drag.current) return; const dx = e.clientX - drag.current.x, dy = e.clientY - drag.current.y; drag.current = { x: e.clientX, y: e.clientY }; setR((v) => ({ x: clamp(v.x - dy * 0.6, -90, 90), y: v.y + dx * 0.6 })); }} onPointerUp={() => (drag.current = null)}>
      <div className="relative h-40 w-40 cursor-grab touch-none [transform-style:preserve-3d] active:cursor-grabbing" style={{ transform: `rotateX(${r.x}deg) rotateY(${r.y}deg)` }}>
        {faces.map(([t, g, n]) => <div key={n} className={cn("absolute inset-0 grid place-items-center rounded-lg border border-white/30 bg-gradient-to-br text-3xl font-black text-white/90 opacity-90", g)} style={{ transform: t }}>{n}</div>)}
      </div>
      <button onClick={() => setAuto(!auto)} className="mt-10 text-xs text-zinc-500 underline">{auto ? "停止自转" : "开始自转"} · 拖动旋转</button>
    </div>
  );
}

/* ---------- 新增：手电筒 ---------- */
function FlashlightDemo() {
  const [p, setP] = useState({ x: -200, y: -200 });
  return (
    <div className="relative grid h-64 cursor-none select-none place-items-center overflow-hidden bg-zinc-950" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setP({ x: e.clientX - r.left, y: e.clientY - r.top }); }} onMouseLeave={() => setP({ x: -200, y: -200 })}>
      <p className="px-8 text-center text-xs leading-loose text-white/10">在黑暗中，用光去找答案。在黑暗中，用光去找答案。在黑暗中，用光去找答案。</p>
      <div className="absolute inset-0 grid place-items-center bg-zinc-950" style={{ WebkitMaskImage: `radial-gradient(circle 110px at ${p.x}px ${p.y}px, black 0%, black 40%, transparent 100%)`, maskImage: `radial-gradient(circle 110px at ${p.x}px ${p.y}px, black 0%, black 40%, transparent 100%)` }}>
        <div className="text-center"><p className="text-5xl">🔦</p><h4 className="mt-2 text-3xl font-black text-white">SECRET</h4><p className="mt-1 text-sm text-amber-300">你找到了隐藏的内容！</p></div>
      </div>
    </div>
  );
}

/* ---------- 新增：流星 ---------- */
function MeteorDemo() {
  const ms = useMemo(() => Array.from({ length: 16 }, (_, i) => ({ l: (i * 61) % 100, d: ((i * 37) % 50) / 10, t: 2 + ((i * 17) % 40) / 10 })), []);
  return (
    <div className="relative grid h-64 place-items-center overflow-hidden bg-gradient-to-b from-zinc-950 to-indigo-950">
      {ms.map((m, i) => <span key={i} className="absolute top-[-10px] h-0.5 w-0.5 rotate-[215deg] rounded-full bg-white shadow-[0_0_0_1px_#fff2]" style={{ left: m.l + "%", animation: `meteor ${m.t}s ${m.d}s linear infinite` }}><span className="absolute top-1/2 h-px w-20 -translate-y-1/2 bg-gradient-to-r from-white to-transparent" /></span>)}
      <p className="relative text-2xl font-bold text-white">Meteor Shower</p>
    </div>
  );
}

/* ---------- 新增：光标拖尾 ---------- */
const trail = ({ ctx, w, h, mouse, hue }: Api) => {
  const pts: { x: number; y: number; t: number }[] = [];
  return (_dt: number, t: number) => {
    ctx.clearRect(0, 0, w, h); const m = mouse.current;
    if (m.inside) pts.push({ x: m.x, y: m.y, t });
    while (pts.length && t - pts[0].t > 700) pts.shift();
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; const life = 1 - (t - b.t) / 700; ctx.strokeStyle = `hsl(${hue + i * 4} 90% 60% / ${life})`; ctx.lineWidth = 2 + life * 10; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
  };
};
function TrailDemo() { return <div className="relative"><CanvasStage height={240} init={trail} /><p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-zinc-400">在这里挥动鼠标 ✨</p></div>; }

/* ---------- 新增：3D 翻转卡 ---------- */
function FlipCardDemo() {
  const items = [["💡", "创意", "好点子来自对细节的观察"], ["⚡", "速度", "快 100ms，留存高 1%"], ["🎯", "聚焦", "一次只做一件事"]];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(([e, t, d]) => (
        <div key={t} tabIndex={0} className="group h-40 [perspective:800px] focus:outline-none">
          <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus:[transform:rotateY(180deg)]">
            <div className="absolute inset-0 grid place-items-center rounded-2xl border border-zinc-200 bg-white [backface-visibility:hidden] dark:border-zinc-800 dark:bg-zinc-900"><div className="text-center"><p className="text-4xl">{e}</p><p className="mt-1 font-semibold">{t}</p></div></div>
            <div className="absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-accent to-pink-500 p-4 text-center text-sm text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">{d}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- 新增：液态融合 ---------- */
function GooeyDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [m, setM] = useState({ x: 150, y: 100 });
  const t = useRef({ x: 150, y: 100 });
  const [tail, setTail] = useState([{ x: 150, y: 100 }, { x: 150, y: 100 }, { x: 150, y: 100 }, { x: 150, y: 100 }]);
  useRaf(() => { setTail((tl) => { let px = t.current.x, py = t.current.y; return tl.map((p, i) => { const k = 0.28 - i * 0.04; const n = { x: lerp(p.x, px, k), y: lerp(p.y, py, k) }; px = n.x; py = n.y; return n; }); }); });
  void m;
  return (
    <div ref={box} className="relative h-60 overflow-hidden bg-zinc-950" onMouseMove={(e) => { const r = box.current!.getBoundingClientRect(); t.current = { x: e.clientX - r.left, y: e.clientY - r.top }; setM(t.current); }}>
      <svg className="absolute h-0 w-0"><defs><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b" /><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" /></filter></defs></svg>
      <div className="absolute inset-0" style={{ filter: "url(#goo)" }}>
        <span className="absolute h-12 w-12 rounded-full bg-accent" style={{ left: t.current.x - 24, top: t.current.y - 24 }} />
        {tail.map((p, i) => <span key={i} className="absolute rounded-full bg-accent" style={{ left: p.x - (22 - i * 3), top: p.y - (22 - i * 3), width: 44 - i * 6, height: 44 - i * 6 }} />)}
        <span className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </div>
      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs text-white/40">SVG feGaussianBlur + feColorMatrix 阈值 = 粘稠融合</p>
    </div>
  );
}

export const pointer: Section = {
  id: "pointer", title: "指针交互与背景", en: "Pointer & Backgrounds", group: "视觉", icon: MousePointer2, hue: 310,
  blurb: "让界面“看得见你的鼠标”。这一章的效果都很炫，但也都有代价——只在营销页、作品集、空状态里点缀使用，并始终尊重减弱动效偏好。",
  items: [
    item({ id: "bg-follow", title: "背景随鼠标移动", en: "Mouse-follow Glow", level: "进阶", bare: true, demo: BgFollowDemo, tags: ["glow", "radial"], desc: "用 CSS 变量 --x / --y 记录鼠标位置，radial-gradient 在该位置发光。", points: ["直接 style.setProperty，不走 React state，避免每次移动重渲染。", "叠加网格纹理增强质感。"], code: `el.style.setProperty("--x", e.clientX - r.left + "px");
background: radial-gradient(400px circle at var(--x) var(--y), accent, transparent 60%)` }),
    item({ id: "parallax", title: "鼠标视差", en: "Mouse Parallax", level: "进阶", bare: true, demo: ParallaxDemo, tags: ["depth", "layers"], desc: "不同深度的图层以不同比例反向移动，营造空间感。", points: ["位移 = −(鼠标归一化偏移) × 深度系数。", "越靠近观察者，系数越大。"], a11y: ["提供 prefers-reduced-motion 回退：禁用位移。"], code: `transform: "translate(" + -p.x * depth * 300 + "px, " + -p.y * depth * 200 + "px)"` }),
    item({ id: "audio-bars", title: "音乐律动条", en: "Audio Bars", level: "基础", demo: AudioBarsDemo, tags: ["equalizer", "music"], desc: "纯 CSS 的均衡器：每根条用不同的时长与负延迟，看起来随机。", points: ["animation-play-state 控制暂停，不丢失进度。", "transform: scaleY 动画，GPU 友好。"], code: `@keyframes bar { 50% { transform: scaleY(1) } 0%,100% { transform: scaleY(.25) } }` }),
    item({ id: "magnetic", title: "磁性按钮", en: "Magnetic Button", level: "进阶", demo: MagneticDemo, tags: ["attract"], desc: "鼠标靠近时按钮被“吸”过去，内部文字再以更小幅度跟随，产生层次。", points: ["距离阈值内才吸附，离开回弹。", "内层位移 = 外层 × 0.3，制造视差。"], code: `if (dist < 110) setT({ x: dx * 0.35, y: dy * 0.35 });` }),
    item({ id: "tilt", title: "倾斜卡片", en: "3D Tilt Card", level: "进阶", demo: TiltDemo, tags: ["3d", "perspective"], desc: "根据鼠标在卡片内的位置旋转卡片，并叠加跟随的高光。", points: ["父级 perspective，子级 rotateX / rotateY。", "移动时 transition 极短，离开时用长缓动回正。"], code: `rotateX: (0.5 - py) * 22, rotateY: (px - 0.5) * 26` }),
    item({ id: "spot-border", title: "边框聚光卡", en: "Spotlight Border", level: "高级", bare: true, demo: SpotBorderDemo, tags: ["linear", "vercel"], desc: "鼠标靠近时，卡片边框被点亮——Linear / Vercel 风格。外层 1px 内边距就是“边框”。", points: ["外层背景为 radial-gradient，内层盖住中间，只露出 1px 边。", "鼠标坐标需要相对每张卡片单独计算。"], code: `<div className="p-px" style={{ background: "radial-gradient(220px circle at var(--x) var(--y), accent, #fff1)" }}>
  <div className="rounded-[15px] bg-zinc-900" />
</div>` }),
    item({ id: "cursor", title: "自定义光标", en: "Custom Cursor", level: "高级", bare: true, demo: CursorDemo, tags: ["cursor", "follow"], desc: "小圆点即时跟随，外环延迟 lerp 跟随；悬停可交互元素时外环放大。", points: ["lerp(current, target, 0.18) 得到柔和拖尾。", "用 data-hover 属性标记可交互元素。", "只在 hover: hover 且 pointer: fine 的设备上启用。"], a11y: ["不要隐藏系统光标而无替代；不要影响点击命中。"], code: `s.rx = lerp(s.rx, s.x, 0.18);` }),
    item({ id: "network", title: "粒子连线背景", en: "Particle Network", level: "高级", bare: true, demo: NetworkDemo, tags: ["canvas", "particles"], desc: "Canvas 粒子 + 距离连线 + 鼠标排斥与连线。科技感落地页常见背景。", points: ["粒子数量随面积自适应。", "O(n²) 连线，n 控制在 100 以内。", "组件卸载时 cancelAnimationFrame。"], code: `if (dist < 100) { ctx.strokeStyle = "rgba(…, " + (1 - dist / 100) + ")"; ctx.stroke(); }` }),
    item({ id: "ripple", title: "涟漪点击", en: "Ripple", level: "基础", demo: RippleDemo, tags: ["material"], desc: "Material 风格点击反馈：在点击位置生成一个放大并淡出的圆。", points: ["按钮 overflow-hidden；涟漪用绝对定位。", "650ms 后清除节点。"], code: `@keyframes ripple { from { opacity: .35; transform: scale(0) } to { opacity: 0; transform: scale(4) } }` }),
    item({ id: "knob", title: "旋钮", en: "Rotary Knob", level: "高级", demo: KnobDemo, tags: ["dial", "audio"], desc: "圆形拖拽控件：用 atan2 把指针位置转换为角度，限制在 ±135°。", points: ["angle = atan2(dy, dx) + 90°。", "刻度环随值点亮。", "支持键盘方向键。"], a11y: ["role=slider + aria-valuenow，键盘可操作。"], code: `let a = Math.atan2(dy, dx) * 180 / Math.PI + 90; a = clamp(a, -135, 135);` }),
    item({ id: "glass", title: "毛玻璃", en: "Glassmorphism", level: "基础", bare: true, demo: GlassDemo, tags: ["blur", "backdrop"], desc: "半透明白 + backdrop-filter 模糊 + 细白边。背后必须有色彩才有效果。", points: ["背景透明度 10–20%，边框 white/30。", "移动端 backdrop-filter 较耗性能，避免大面积使用。"], code: `<div className="border border-white/30 bg-white/15 backdrop-blur-xl backdrop-saturate-150" />` }),
    item({ id: "beam", title: "边框光束", en: "Border Beam", level: "进阶", demo: BorderBeamDemo, tags: ["conic", "animated border"], desc: "旋转的圆锥渐变藏在边框里，只露出 2px。常用于高亮 CTA 卡片。", points: ["旋转层尺寸 200%，保证旋转时覆盖四角。", "内层盖住中心。"], code: `<span className="absolute w-[200%] aspect-square animate-spin bg-[conic-gradient(transparent_70%,var(--accent),transparent)]" />` }),
    item({ id: "flow-gradient", title: "流动渐变背景", en: "Animated Gradient", level: "基础", bare: true, demo: FlowGradientDemo, tags: ["gradient"], desc: "放大 background-size 并平移 background-position，渐变看起来在流动。叠加噪点更有质感。", code: `background: linear-gradient(120deg, …); background-size: 300% 300%; animation: holo 8s linear infinite;` }),
    item({ id: "aurora", title: "极光背景", en: "Aurora", level: "进阶", isNew: true, bare: true, demo: AuroraDemo, tags: ["blur", "blob"], desc: "几个超大的模糊色块 + mix-blend-mode: screen，缓慢漂移，像极光。", points: ["blur-[70px] 让边缘彻底消失。", "每个色块不同周期与延迟，避免同步。", "放在 -z 层，内容保持高对比。"], code: `<span className="absolute h-64 w-64 rounded-full bg-violet-500 opacity-50 mix-blend-screen blur-[70px]" style={{ animation: "aurora 18s ease-in-out infinite" }} />` }),
    item({ id: "dot-repel", title: "点阵排斥", en: "Dot Grid Repel", level: "高级", isNew: true, bare: true, demo: DotRepelDemo, tags: ["canvas", "spring", "physics"], desc: "网格点受鼠标排斥偏离，再被弹簧拉回原位。位移越大，点越大越亮。", points: ["弹簧：v += (origin − pos) × k；阻尼：v ×= 0.82。", "颜色按位移量 hue 偏移。"], code: `d.vx += (d.ox - d.x) * 0.08; d.vx *= 0.82; d.x += d.vx;` }),
    item({ id: "starfield", title: "星空穿梭", en: "Warp Starfield", level: "高级", isNew: true, bare: true, demo: StarfieldDemo, tags: ["canvas", "3d", "space"], desc: "伪 3D 星空：每颗星有 z 深度，透视投影 x/z；上一帧位置到当前位置画线形成拖尾。按住鼠标进入曲速。", points: ["透视：screen = center + pos × (focal / z)。", "半透明黑色矩形覆盖上一帧，形成残影。", "速度 lerp 平滑过渡。"], code: `const k = 220 / s.z; const x = w / 2 + s.x * k;
ctx.fillStyle = "rgba(5,5,15,.35)"; ctx.fillRect(0, 0, w, h);` }),
    item({ id: "holo", title: "全息卡片", en: "Holographic Card", level: "高级", isNew: true, demo: HoloDemo, tags: ["foil", "pokemon"], desc: "收藏卡片的闪箔效果：彩虹条纹用 color-dodge 混合，背景位置随鼠标移动。", points: ["repeating-linear-gradient + 300% 宽度 + background-position 随 x。", "再叠一层跟随的白色径向高光（overlay）。", "整体带轻微 3D 倾斜。"], code: `mixBlendMode: "color-dodge", backgroundPosition: s.x * 2 + "% 50%"` }),
    item({ id: "cube", title: "3D 立方体", en: "CSS 3D Cube", level: "高级", isNew: true, demo: CubeDemo, tags: ["3d", "transform-style"], desc: "六个面各自 rotate + translateZ，整体 preserve-3d。可拖动旋转或自转。", points: ["translateZ = 边长 / 2。", "拖动更新 rotateX（限制 ±90°）与 rotateY。", "touch-action: none 避免触摸时页面滚动。"], code: `transform: "rotateY(90deg) translateZ(80px)" /* 右面 */` }),
    item({ id: "flashlight", title: "手电筒", en: "Flashlight Reveal", level: "进阶", isNew: true, bare: true, demo: FlashlightDemo, tags: ["mask", "reveal"], desc: "用 radial-gradient 作为 mask-image，只在光标附近显示隐藏层。", points: ["mask 位置用 state 更新（或 CSS 变量）。", "做彩蛋、隐藏内容、聚焦引导都很合适。"], code: `maskImage: "radial-gradient(circle 110px at " + x + "px " + y + "px, black 40%, transparent)"` }),
    item({ id: "meteor", title: "流星雨", en: "Meteor Shower", level: "基础", isNew: true, bare: true, demo: MeteorDemo, tags: ["css", "night"], desc: "纯 CSS：旋转后沿 X 轴平移并淡出，带渐变尾巴。随机延迟让流星错落。", code: `@keyframes meteor { 0% { transform: rotate(215deg) translateX(0); opacity: 1 } 100% { transform: rotate(215deg) translateX(-520px); opacity: 0 } }` }),
    item({ id: "trail", title: "光标拖尾", en: "Cursor Trail", level: "进阶", isNew: true, bare: true, demo: TrailDemo, tags: ["canvas", "draw"], desc: "记录最近 700ms 的指针轨迹，按年龄决定透明度与线宽，色相沿轨迹渐变。", points: ["环形缓冲：push 新点，shift 过期点。", "线宽 = 2 + life × 10，越新越粗。"], code: `ctx.strokeStyle = "hsl(" + (hue + i * 4) + " 90% 60% / " + life + ")"; ctx.lineWidth = 2 + life * 10;` }),
    item({ id: "flip-card", title: "3D 翻转卡", en: "Flip Cards", level: "基础", isNew: true, demo: FlipCardDemo, tags: ["hover", "backface"], desc: "悬停（或聚焦）翻到背面。两面都 backface-visibility: hidden，背面预先转 180°。", a11y: ["触屏无 hover，使用 focus 或点击切换；不要把关键信息只放在背面。"], code: `group-hover:[transform:rotateY(180deg)] [transform-style:preserve-3d]` }),
    item({ id: "gooey", title: "液态融合", en: "Gooey Effect", level: "高级", isNew: true, bare: true, demo: GooeyDemo, tags: ["svg", "filter", "metaball"], desc: "先高斯模糊，再用 feColorMatrix 提高 alpha 对比，相邻圆形就会像水滴一样融合。", points: ["alpha 行 “0 0 0 22 −9” 即阈值化。", "拖尾圆依次 lerp 追前一个，大小递减。"], code: `<feGaussianBlur stdDeviation="9" />
<feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />` }),
  ],
};

void Btn;
