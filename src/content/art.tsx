import { useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { Section } from "@/types";
import { Btn, Seg, Range, Switch, Caption, useLoop } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useInView, cssVar, clamp } from "@/lib/hooks";

/* ================= 构图 ================= */
const PHI = 1.618;
function Composition() {
  const [ov, setOv] = useState("thirds");
  const W = 480, H = 300;
  const guides = () => {
    if (ov === "thirds") return <g stroke="var(--fg)" strokeOpacity=".5" strokeDasharray="4 4"><line x1={W / 3} x2={W / 3} y1="0" y2={H} /><line x1={(W * 2) / 3} x2={(W * 2) / 3} y1="0" y2={H} /><line y1={H / 3} y2={H / 3} x1="0" x2={W} /><line y1={(H * 2) / 3} y2={(H * 2) / 3} x1="0" x2={W} /><circle cx={W / 3} cy={H / 3} r="5" fill="var(--fg)" /><circle cx={(W * 2) / 3} cy={H / 3} r="5" fill="var(--fg)" /><circle cx={W / 3} cy={(H * 2) / 3} r="5" fill="var(--fg)" /><circle cx={(W * 2) / 3} cy={(H * 2) / 3} r="5" fill="var(--fg)" /></g>;
    if (ov === "golden") {
      // golden rectangles + spiral
      let x = 0, y = 0, w = W, h = W / PHI, d = "";
      const segs: string[] = [];
      let dir = 0;
      const rects: React.ReactElement[] = [];
      d = `M${x},${y + h}`;
      for (let i = 0; i < 8; i++) {
        const s = Math.min(w, h);
        rects.push(<rect key={i} x={x} y={y} width={w} height={h} fill="none" stroke="var(--fg)" strokeOpacity=".3" />);
        if (dir === 0) { segs.push(`A${s},${s} 0 0 1 ${x + s},${y}`); x += s; w -= s; }
        else if (dir === 1) { segs.push(`A${s},${s} 0 0 1 ${x + w},${y + s}`); y += s; h -= s; }
        else if (dir === 2) { segs.push(`A${s},${s} 0 0 1 ${x + w - s},${y + h}`); w -= s; }
        else { segs.push(`A${s},${s} 0 0 1 ${x},${y + h - s}`); h -= s; }
        dir = (dir + 1) % 4;
      }
      return <g transform={`translate(0 ${(H - W / PHI) / 2})`}>{rects}<path d={d + segs.join("")} fill="none" stroke="var(--fg)" strokeWidth="2" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 1.8s var(--ease) forwards" }} /></g>;
    }
    if (ov === "diag") return <g stroke="var(--fg)" strokeOpacity=".5" strokeDasharray="4 4"><line x1="0" y1="0" x2={W} y2={H} /><line x1={W} y1="0" x2="0" y2={H} /><line x1="0" y1={H} x2={W} y2="0" /></g>;
    return null;
  };
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_220px]">
      <div className="overflow-hidden rounded-xl border border-line bg-soft2">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full">
          <rect width={W} height={H} fill="var(--soft2)" />
          <circle cx={W / 3} cy={H / 3} r="46" fill="var(--fg)" />
          <rect x={(W * 2) / 3 - 10} y={H * 0.55} width="110" height="6" fill="var(--fg)" />
          <rect x={(W * 2) / 3 - 10} y={H * 0.62} width="70" height="6" fill="var(--fg)" opacity=".4" />
          <line x1="0" x2={W} y1={(H * 2) / 3} y2={(H * 2) / 3} stroke="var(--fg)" strokeWidth="1" opacity=".25" />
          <rect x="30" y={(H * 2) / 3 + 14} width="40" height="40" fill="none" stroke="var(--fg)" />
          {guides()}
        </svg>
      </div>
      <div className="space-y-5">
        <Seg className="w-full" value={ov} onChange={setOv} options={[{ value: "none", label: "无" }, { value: "thirds", label: "三分" }, { value: "golden", label: "黄金" }, { value: "diag", label: "对角" }]} />
        <p className="text-[13px] text-mute">{{ none: "没有辅助线时，构图靠直觉。", thirds: "三分法：把主体放在四个交点上，比正中央更有张力。", golden: "黄金螺旋：每次切去一个正方形，剩余矩形依然是 1 : 1.618。", diag: "对角线构图：视线沿对角线运动，画面更有动势。" }[ov]}</p>
        <div className="font-mono text-xs text-dim">φ = (1 + √5) / 2 ≈ 1.618</div>
      </div>
    </div>
  );
}

function Balance() {
  const [it, setIt] = useState([{ x: 120, y: 90, r: 38 }, { x: 300, y: 120, r: 22 }, { x: 420, y: 70, r: 14 }]);
  const drag = useRef(-1);
  const box = useRef<HTMLDivElement>(null);
  const tw = it.reduce((a, b) => a + b.r * b.r, 0);
  const cx = it.reduce((a, b) => a + b.x * b.r * b.r, 0) / tw, cy = it.reduce((a, b) => a + b.y * b.r * b.r, 0) / tw;
  const off = Math.hypot(cx - 240, cy - 100);
  return (
    <div>
      <div ref={box} className="relative h-[200px] touch-none overflow-hidden rounded-xl border border-line bg-bg" onPointerMove={(e) => { if (drag.current < 0) return; const r = box.current!.getBoundingClientRect(); setIt(it.map((p, i) => (i === drag.current ? { ...p, x: clamp(e.clientX - r.left, 0, r.width), y: clamp(e.clientY - r.top, 0, r.height) } : p))); }} onPointerUp={() => (drag.current = -1)} onPointerLeave={() => (drag.current = -1)}>
        <div className="absolute inset-y-0 left-1/2 w-px bg-line2" /><div className="absolute inset-x-0 top-1/2 h-px bg-line2" />
        {it.map((p, i) => <div key={i} onPointerDown={(e) => { drag.current = i; (e.target as HTMLElement).setPointerCapture(e.pointerId); }} className="absolute cursor-grab rounded-full bg-inv active:cursor-grabbing" style={{ left: p.x - p.r, top: p.y - p.r, width: p.r * 2, height: p.r * 2 }} />)}
        <div className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg bg-bg transition-all" style={{ left: cx, top: cy }}><span className="absolute -inset-3 animate-[ping_2s_infinite] rounded-full border border-fg/40" /></div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-mute"><span>拖动圆形：面积 = 视觉重量，空心圆点是重心。</span><span className="font-mono">偏离中心 <span className="text-fg">{off.toFixed(0)}px</span> · {off < 24 ? "平衡" : off < 60 ? "轻微失衡" : "明显失衡"}</span></div>
    </div>
  );
}

function Whitespace() {
  const [v, setV] = useState(40);
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="space-y-4"><Range label="留白率" value={v} min={4} max={72} onChange={setV} fmt={(x) => x + "%"} /><p className="text-xs text-mute">{v < 16 ? "拥挤：信息都在抢注意力。" : v < 48 ? "舒适：有呼吸，也有信息量。" : "奢侈：品牌感强，但信息密度低。"}</p></div>
      <div className="grid aspect-[4/3] place-items-center rounded-xl border border-line bg-white p-0 text-neutral-950">
        <div className="relative h-full w-full overflow-hidden transition-all duration-300" style={{ padding: `${v * 0.55}%` }}>
          <div className="flex h-full flex-col justify-between transition-all" style={{ gap: v * 0.2 }}>
            <div className="font-mono uppercase tracking-widest" style={{ fontSize: 9 }}>Issue 08 / Design</div>
            <div className="font-semibold leading-none tracking-tight transition-all" style={{ fontSize: `clamp(14px, ${22 - v * 0.2}px, 40px)` }}>少，但是更好</div>
            <div className="max-w-[28ch] text-neutral-500" style={{ fontSize: 9, lineHeight: 1.6 }}>Less, but better. 去掉不必要的，让必要的得以呼吸。</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Opposites() {
  const P: [string, string, (on: boolean) => React.ReactNode][] = [
    ["大 / 小", "尺寸", (o) => <div className="rounded-full bg-inv transition-all duration-500" style={{ width: o ? 18 : 64, height: o ? 18 : 64 }} />],
    ["明 / 暗", "明度", (o) => <div className="h-14 w-14 rounded-lg border border-fg transition-colors duration-500" style={{ background: o ? "var(--bg)" : "var(--fg)" }} />],
    ["疏 / 密", "密度", (o) => <div className="flex gap-1.5 transition-all duration-500" style={{ gap: o ? 3 : 12 }}>{[0, 1, 2, 3].map((i) => <span key={i} className="h-14 w-1 rounded-full bg-fg" />)}</div>],
    ["曲 / 直", "形态", (o) => <div className="h-14 w-14 bg-inv transition-all duration-500" style={{ borderRadius: o ? 0 : 28 }} />],
    ["粗 / 细", "线重", (o) => <div className="h-14 w-14 rounded-full border-fg transition-all duration-500" style={{ borderWidth: o ? 1 : 8 }} />],
    ["动 / 静", "节奏", (o) => <div className="h-4 w-4 rounded-full bg-inv transition-transform duration-700" style={{ transform: `translateX(${o ? 22 : -22}px) rotate(${o ? 180 : 0}deg)`, transitionTimingFunction: "var(--spring)" }} />],
  ];
  const Tile = ({ t, d, r }: { t: string; d: string; r: (o: boolean) => React.ReactNode }) => {
    const [o, setO] = useState(false);
    return <button onMouseEnter={() => setO(true)} onMouseLeave={() => setO(false)} onFocus={() => setO(true)} onBlur={() => setO(false)} className="group flex h-40 flex-col items-center justify-between rounded-2xl border border-line bg-bg p-4 transition-colors hover:border-fg"><span className="label">{d}</span><span className="grid flex-1 place-items-center">{r(o)}</span><span className="text-[13px] font-medium">{t}</span></button>;
  };
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{P.map(([t, d, r]) => <Tile key={t} t={t} d={d} r={r} />)}</div>;
}

/* ================= 生成艺术 ================= */
function Flow() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [ref, vis] = useInView<HTMLDivElement>();
  const ps = useRef<{ x: number; y: number }[]>([]);
  const [seed, setSeed] = useState(0);
  const t = useRef(0);
  useEffect(() => {
    const c = cv.current!; const w = c.clientWidth, h = c.clientHeight;
    ps.current = Array.from({ length: 500 }, () => ({ x: Math.random() * w, y: Math.random() * h }));
    const ctx = c.getContext("2d")!; const dpr = Math.min(2, devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = cssVar("--bg"); ctx.fillRect(0, 0, w, h);
  }, [seed]);
  useLoop((_, dt) => {
    const c = cv.current!, ctx = c.getContext("2d")!, w = c.clientWidth, h = c.clientHeight;
    t.current += dt * 0.0003;
    ctx.globalAlpha = 0.045; ctx.fillStyle = cssVar("--bg"); ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 0.5; ctx.strokeStyle = cssVar("--fg"); ctx.lineWidth = 0.8;
    for (const p of ps.current) {
      const a = (Math.sin(p.x * 0.006 + t.current * 2) + Math.cos(p.y * 0.008 - t.current) + Math.sin((p.x + p.y) * 0.004)) * Math.PI * 0.9;
      const nx = p.x + Math.cos(a) * 1.4, ny = p.y + Math.sin(a) * 1.4;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
      p.x = nx; p.y = ny;
      if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) { p.x = Math.random() * w; p.y = Math.random() * h; }
    }
  }, vis);
  return (
    <div ref={ref} className="relative overflow-hidden rounded-xl border border-line bg-bg"><canvas ref={cv} className="block h-72 w-full" /><button onClick={() => setSeed(seed + 1)} aria-label="重新生成" className="absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-lg border border-line2 bg-bg px-3 text-xs hover:bg-soft2"><RefreshCw size={12} />重新生成</button></div>
  );
}

function Halftone() {
  const cv = useRef<HTMLCanvasElement>(null);
  const [ref, vis] = useInView<HTMLDivElement>();
  const m = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, on: false });
  useLoop((t) => {
    const c = cv.current!, ctx = c.getContext("2d")!, w = c.clientWidth, h = c.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
    if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    const k = m.current;
    if (!k.on) { k.tx = 0.5 + Math.cos(t / 1800) * 0.3; k.ty = 0.5 + Math.sin(t / 1300) * 0.25; }
    k.x += (k.tx - k.x) * 0.08; k.y += (k.ty - k.y) * 0.08;
    ctx.fillStyle = cssVar("--fg");
    const s = 14;
    for (let y = s / 2; y < h; y += s) for (let x = s / 2; x < w; x += s) {
      const d = Math.hypot((x / w - k.x) * (w / h), y / h - k.y);
      const v = clamp(1 - d * 1.35, 0, 1);
      ctx.beginPath(); ctx.arc(x, y, (s / 2) * Math.pow(v, 0.8) * 1.05 + 0.4, 0, Math.PI * 2); ctx.fill();
    }
  }, vis);
  return <div ref={ref} className="overflow-hidden rounded-xl border border-line bg-bg" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); m.current.tx = (e.clientX - r.left) / r.width; m.current.ty = (e.clientY - r.top) / r.height; m.current.on = true; }} onPointerLeave={() => (m.current.on = false)}><canvas ref={cv} className="block h-64 w-full" /></div>;
}

function Truchet() {
  const [seed, setSeed] = useState(1);
  const [s, setS] = useState(48);
  const [kind, setKind] = useState("arc");
  const W = 480, H = 240;
  const tiles = useMemo(() => { let a = seed * 9301; const r = () => (a = (a * 9301 + 49297) % 233280) / 233280; const cols = Math.ceil(W / s), rows = Math.ceil(H / s); return Array.from({ length: cols * rows }, () => r() > 0.5); }, [seed, s]);
  const cols = Math.ceil(W / s);
  const h = s / 2;
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_200px]">
      <div className="cursor-pointer overflow-hidden rounded-xl border border-line bg-bg" onClick={() => setSeed(seed + 1)}>
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" fill="none" stroke="var(--fg)" strokeWidth={Math.max(2, s / 12)} strokeLinecap="round">
          {tiles.map((f, i) => { const x = (i % cols) * s, y = Math.floor(i / cols) * s; return <g key={i} transform={`translate(${x} ${y})`}>{kind === "arc" ? (f ? <path d={`M${h},0 A${h},${h} 0 0 1 0,${h} M${s},${h} A${h},${h} 0 0 0 ${h},${s}`} /> : <path d={`M${h},0 A${h},${h} 0 0 0 ${s},${h} M0,${h} A${h},${h} 0 0 1 ${h},${s}`} />) : (f ? <line x1="0" y1="0" x2={s} y2={s} /> : <line x1={s} y1="0" x2="0" y2={s} />)}</g>; })}
        </svg>
      </div>
      <div className="space-y-5">
        <Seg value={kind} onChange={setKind} options={[{ value: "arc", label: "弧线" }, { value: "line", label: "斜线" }]} />
        <Range label="瓦片大小" value={s} min={24} max={80} step={4} onChange={setS} fmt={(v) => v + "px"} />
        <Btn variant="outline" size="sm" onClick={() => setSeed(seed + 1)}><RefreshCw size={13} />重新生成</Btn>
        <p className="text-xs text-mute">一个瓦片、两种朝向，随机拼贴即得无穷图案。点击画布也可重生成。</p>
      </div>
    </div>
  );
}

function Moire() {
  const [a, setA] = useState(6);
  const [dx, setDx] = useState(14);
  const [kind, setKind] = useState("circle");
  const set = (rot: number, off: number) => kind === "circle"
    ? Array.from({ length: 36 }).map((_, i) => <circle key={i} cx={200 + off} cy="130" r={6 + i * 7} />)
    : Array.from({ length: 70 }).map((_, i) => <line key={i} x1={-200 + i * 12 + off} y1="-100" x2={-200 + i * 12 + off} y2="360" transform={`rotate(${rot} 200 130)`} />);
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_220px]">
      <div className="overflow-hidden rounded-xl border border-line bg-bg"><svg viewBox="0 0 400 260" className="block w-full" fill="none" stroke="var(--fg)" strokeWidth="1"><g>{set(0, 0)}</g><g opacity=".9">{set(a, kind === "circle" ? dx : 0)}</g></svg></div>
      <div className="space-y-5">
        <Seg value={kind} onChange={setKind} options={[{ value: "circle", label: "同心圆" }, { value: "line", label: "直线" }]} />
        {kind === "circle" ? <Range label="偏移" value={dx} min={0} max={60} onChange={setDx} fmt={(v) => v + "px"} /> : <Range label="旋转" value={a} min={0} max={20} step={0.25} onChange={setA} fmt={(v) => v + "°"} />}
        <p className="text-xs text-mute">两组规则图形轻微错位，就会涌现出新的节律——莫尔条纹。</p>
      </div>
    </div>
  );
}

function Grain() {
  const [o, setO] = useState(0.35);
  const [f, setF] = useState(0.8);
  const bg = "radial-gradient(circle at 30% 30%, #6a6a6a 0%, #1a1a1a 55%, #0a0a0a 100%)";
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Caption>无噪点</Caption><div className="h-52 rounded-xl" style={{ background: bg }} /></div>
        <div><Caption>噪点叠加</Caption><div className="relative h-52 overflow-hidden rounded-xl" style={{ background: bg }}><svg className="absolute inset-0 h-full w-full" style={{ mixBlendMode: "overlay", opacity: o }}><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency={f} numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#grain)" /></svg></div></div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2"><Range label="噪点强度" value={o} min={0} max={1} step={0.05} onChange={setO} fmt={(v) => v.toFixed(2)} /><Range label="颗粒频率" value={f} min={0.2} max={1.5} step={0.05} onChange={setF} fmt={(v) => v.toFixed(2)} /></div>
      <p className="text-xs text-mute">本站唯一保留的“渐变”：用在大面积暗部时，叠一层灰度噪点可消除色带，并增加胶片质感。</p>
    </div>
  );
}

/* ================= 版式 / 流派 ================= */
function Poster({ k }: { k: string }) {
  const base = "relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-line2";
  if (k === "swiss") return (
    <div className={cn(base, "bg-white text-black")}>
      <div className="absolute inset-0 grid grid-cols-6 gap-0 opacity-[.07]">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="border-r border-black" />)}</div>
      <div className="absolute left-5 top-5 text-[10px] font-medium leading-tight">Internationale<br />Typographische<br />Gestaltung</div>
      <div className="absolute left-5 top-1/3 text-[88px] font-bold leading-[.8] tracking-tighter">Aa</div>
      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between"><div className="h-14 w-14 rounded-full bg-black" /><div className="text-right text-[10px] leading-tight">No.<br /><span className="text-3xl font-bold tracking-tighter">01</span></div></div>
    </div>
  );
  if (k === "bauhaus") return (
    <div className={cn(base, "bg-[#ececec] text-black")}>
      <svg viewBox="0 0 300 400" className="absolute inset-0 h-full w-full"><rect width="300" height="400" fill="#ececec" /><circle cx="110" cy="130" r="80" fill="#0a0a0a" /><rect x="150" y="150" width="120" height="120" fill="#8a8a8a" /><polygon points="40,360 140,220 140,360" fill="#fff" stroke="#0a0a0a" strokeWidth="4" /><line x1="0" y1="300" x2="300" y2="40" stroke="#0a0a0a" strokeWidth="4" /><rect x="190" y="310" width="80" height="14" fill="#0a0a0a" /><rect x="190" y="334" width="50" height="14" fill="#0a0a0a" /></svg>
      <div className="absolute right-4 top-4 text-[10px] font-bold uppercase tracking-widest">Bauhaus<br />1919</div>
    </div>
  );
  if (k === "brutal") return (
    <div className={cn(base, "border-2 border-black bg-[#d8d8d8] font-mono text-black")}>
      <div className="absolute inset-4 border-2 border-black bg-white p-3"><div className="text-[34px] font-black uppercase leading-[.9]">RAW<br />UI</div><div className="mt-3 text-[10px] uppercase leading-tight">没有圆角。没有阴影。<br />只有结构。</div></div>
      <div className="absolute bottom-8 left-8 border-2 border-black bg-white px-4 py-2 text-xs font-bold shadow-[5px_5px_0_#000]">ENTER →</div>
    </div>
  );
  if (k === "minimal") return (
    <div className={cn(base, "bg-white text-neutral-900")}>
      <div className="absolute left-8 top-8 text-[9px] uppercase tracking-[.3em] text-neutral-400">Silence</div>
      <div className="absolute left-8 top-1/2 h-px w-10 bg-neutral-900" />
      <div className="absolute bottom-8 left-8 text-xs leading-relaxed text-neutral-500">少，但是更好。<br />Less, but better.</div>
      <div className="absolute right-8 top-8 h-1.5 w-1.5 rounded-full bg-neutral-900" />
    </div>
  );
  return (
    <div className={cn(base, "grid place-items-center bg-[#e4e4e4]")}>
      <div className="grid gap-5">
        <div className="mx-auto h-24 w-24 rounded-[28px] bg-[#e4e4e4] shadow-[8px_8px_16px_#c2c2c2,-8px_-8px_16px_#ffffff]" />
        <div className="mx-auto h-12 w-44 rounded-2xl bg-[#e4e4e4] shadow-[inset_5px_5px_10px_#c2c2c2,inset_-5px_-5px_10px_#ffffff]" />
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e4e4e4] text-xs text-neutral-500 shadow-[5px_5px_10px_#c2c2c2,-5px_-5px_10px_#ffffff]">On</div>
      </div>
    </div>
  );
}
function Styles() {
  const S: [string, string, string, string[], string][] = [
    ["swiss", "瑞士国际主义", "Swiss Style · 1950s", ["网格", "无衬线", "不对称", "客观"], "以严格的网格、清晰的层级与无衬线字体，追求信息传达的客观与秩序。"],
    ["bauhaus", "包豪斯", "Bauhaus · 1919", ["几何", "形式即功能", "原色/黑白", "构成"], "圆、方、三角三种基本形的构成。形式服从功能，艺术与工业合一。"],
    ["brutal", "粗野主义", "Brutalism", ["粗线框", "硬阴影", "等宽", "裸露"], "拒绝修饰，把结构直接暴露。粗边框、硬阴影、直角——个性强烈。"],
    ["minimal", "极简主义", "Minimalism", ["留白", "克制", "单一焦点", "静"], "只保留必要。大量留白让每个元素都被认真对待。"],
    ["neu", "新拟态", "Neumorphism", ["双阴影", "同色", "柔和", "低对比"], "同色背景上的明暗双阴影塑造凸起与凹陷。对比度低，仅宜装饰。"],
  ];
  const [k, setK] = useState("swiss");
  const cur = S.find((s) => s[0] === k)!;
  return (
    <div className="grid gap-8 md:grid-cols-[240px_1fr]">
      <div key={k} className="anim-fade-up mx-auto w-full max-w-[240px]" style={{ animationDuration: ".4s" }}><Poster k={k} /></div>
      <div>
        <div className="flex flex-wrap gap-2">{S.map(([id, t]) => <button key={id} onClick={() => setK(id)} className={cn("rounded-full border px-3.5 py-1.5 text-[13px] transition-colors", k === id ? "border-fg bg-inv text-invfg" : "border-line2 text-mute hover:border-fg hover:text-fg")}>{t}</button>)}</div>
        <div key={k + "t"} className="anim-fade-up mt-8" style={{ animationDuration: ".4s" }}>
          <div className="label">{cur[2]}</div>
          <h4 className="mt-2 text-3xl font-semibold tracking-tight">{cur[1]}</h4>
          <p className="mt-3 max-w-md text-[14px] text-mute">{cur[4]}</p>
          <div className="mt-5 flex flex-wrap gap-2">{cur[3].map((t) => <span key={t} className="rounded-md border border-line2 px-2 py-1 font-mono text-[11px] text-mute">{t}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

function TypePoster() {
  const [txt, setTxt] = useState("形色场");
  const [lay, setLay] = useState("stack");
  const [size, setSize] = useState(96);
  const t = txt || " ";
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="space-y-5">
        <label className="block"><div className="mb-1.5 text-xs text-mute">文字</div><input value={txt} maxLength={8} onChange={(e) => setTxt(e.target.value)} className="h-10 w-full rounded-lg border border-line2 bg-bg px-3 text-[14px] outline-none focus:border-fg" /></label>
        <Seg className="w-full" value={lay} onChange={setLay} options={[{ value: "stack", label: "堆叠" }, { value: "outline", label: "描边" }, { value: "vertical", label: "竖排" }, { value: "repeat", label: "重复" }]} />
        <Range label="字号" value={size} min={40} max={160} onChange={setSize} fmt={(v) => v + "px"} />
      </div>
      <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-xl border border-line2 bg-inv text-invfg">
        {lay === "stack" && <div className="text-center font-bold leading-[.85] tracking-tighter" style={{ fontSize: size }}>{t}<div className="mt-3 font-mono text-[10px] font-normal uppercase tracking-[.4em] opacity-50">Typography</div></div>}
        {lay === "outline" && <div className="font-bold tracking-tighter" style={{ fontSize: size, WebkitTextStroke: "1.5px var(--invfg)", color: "transparent" }}>{t}</div>}
        {lay === "vertical" && <div className="font-bold leading-none tracking-widest" style={{ fontSize: size * 0.6, writingMode: "vertical-rl" }}>{t}</div>}
        {lay === "repeat" && <div className="absolute inset-0 flex flex-col justify-center overflow-hidden font-bold leading-[.8] tracking-tighter" style={{ fontSize: size * 0.55 }}>{[1, 0.6, 0.35, 0.18, 0.08].map((o, i) => <div key={i} className="whitespace-nowrap" style={{ opacity: o, transform: `translateX(${i * -24}px)` }}>{(t + " ").repeat(8)}</div>)}</div>}
      </div>
    </div>
  );
}

/* ================= 感知 ================= */
function Gestalt() {
  const [gx, setGx] = useState(26);
  const [shape, setShape] = useState(true);
  const [gap, setGap] = useState(70);
  const [inv, setInv] = useState(false);
  const vase = useMemo(() => { const L: string[] = [], R: string[] = []; for (let y = 0; y <= 200; y += 5) { const w = 22 + 28 * Math.sin((y / 200) * Math.PI * 2.4 + 0.6) * 0.8 + 18 * Math.sin((y / 200) * Math.PI); L.push(`${100 - w},${y}`); R.unshift(`${100 + w},${y}`); } return [...L, ...R].join(" "); }, []);
  const C = 2 * Math.PI * 38;
  const Card = ({ t, d, children, ctl }: any) => <div className="flex flex-col rounded-2xl border border-line bg-bg p-4"><div className="grid h-40 place-items-center">{children}</div><div className="mt-3"><div className="text-[13px] font-medium">{t}</div><div className="text-xs text-mute">{d}</div></div><div className="mt-3">{ctl}</div></div>;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card t="接近性" d="距离近的元素被视为一组。" ctl={<Range label="水平间距" value={gx} min={6} max={30} onChange={setGx} fmt={(v) => v + "px"} />}>
        <div className="grid transition-all duration-300" style={{ gridTemplateColumns: "repeat(6, 8px)", columnGap: gx, rowGap: 8 }}>{Array.from({ length: 24 }).map((_, i) => <span key={i} className="h-2 w-2 rounded-full bg-fg" />)}</div>
      </Card>
      <Card t="相似性" d="形状相似的元素被视为一类。" ctl={<div className="flex items-center justify-between text-xs text-mute">统一形状<Switch checked={!shape} onChange={(v) => setShape(!v)} label="统一形状" /></div>}>
        <div className="grid grid-cols-6 gap-2">{Array.from({ length: 24 }).map((_, i) => { const sq = shape && ((i >= 6 && i < 12) || (i >= 18 && i < 24)); return <span key={i} className={cn("h-4 w-4 bg-fg transition-all duration-300", sq ? "rounded-none" : "rounded-full")} />; })}</div>
      </Card>
      <Card t="闭合性" d="大脑会自动补全缺口。" ctl={<Range label="缺口" value={gap} min={0} max={180} onChange={setGap} fmt={(v) => v + "°"} />}>
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="var(--fg)" strokeWidth="5" strokeLinecap="round"><circle cx="50" cy="50" r="38" strokeDasharray={`${C * (1 - gap / 360) * 0.5} ${C * (gap / 360) * 0.5 + C * (1 - gap / 360) * 0.5} `} transform="rotate(-90 50 50)" style={{ strokeDasharray: `${C * (1 - gap / 360)} ${C}` }} /></svg>
      </Card>
      <Card t="图与底" d="同一幅图，花瓶或侧脸。" ctl={<div className="flex items-center justify-between text-xs text-mute">反转<Switch checked={inv} onChange={setInv} label="反转" /></div>}>
        <svg width="100" height="140" viewBox="0 0 200 200" className="overflow-visible"><rect x="0" y="0" width="200" height="200" fill={inv ? "var(--bg)" : "var(--fg)"} stroke="var(--fg)" className="transition-all duration-300" /><polygon points={vase} fill={inv ? "var(--fg)" : "var(--bg)"} className="transition-all duration-300" /></svg>
      </Card>
    </div>
  );
}

function Simultaneous() {
  const [bridge, setBridge] = useState(false);
  const L = [10, 70, 130, 190, 245];
  return (
    <div>
      <div className="relative flex overflow-hidden rounded-xl border border-line2">
        {L.map((l) => <div key={l} className="grid h-40 flex-1 place-items-center" style={{ background: `rgb(${l},${l},${l})` }}><div className="h-14 w-14" style={{ background: "#808080" }} /></div>)}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 transition-opacity duration-300" style={{ background: "#808080", opacity: bridge ? 1 : 0 }} />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-mute"><span>五个中心方块都是同一个灰 #808080，但周围越亮，看起来越暗。</span><span className="flex items-center gap-2">连接验证<Switch checked={bridge} onChange={setBridge} label="连接验证" /></span></div>
    </div>
  );
}

function Optical() {
  const [on, setOn] = useState(true);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-10 rounded-xl border border-line bg-bg py-10">
        <div className="text-center"><div className="mx-auto h-16 w-16 bg-inv" /><div className="mt-3 label">方形 64</div></div>
        <div className="text-center"><div className="mx-auto rounded-full bg-inv transition-all duration-300" style={{ width: on ? 70 : 64, height: on ? 70 : 64, margin: on ? "-3px auto" : "0 auto" }} /><div className="mt-3 label">圆形 {on ? "70（+9%）" : "64"}</div></div>
        <div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-inv text-invfg"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300" style={{ transform: on ? "translateX(2px)" : "none" }}><path d="M6 3l15 9-15 9z" /></svg></div><div className="mt-3 label">播放图标 {on ? "右移 2px" : "几何居中"}</div></div>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-mute"><span>几何上相等的形状，视觉上并不相等。圆形需要略大，三角形需要偏移。</span><span className="flex items-center gap-2">光学校正<Switch checked={on} onChange={setOn} label="光学校正" /></span></div>
    </div>
  );
}

export const art: Section[] = [
  {
    id: "composition", group: "art", title: "构图与比例", en: "Composition",
    desc: "界面也是一幅画。构图、重心与留白，决定了第一眼的秩序感。",
    blocks: [
      { id: "a-comp", title: "三分法与黄金分割", desc: "切换辅助线，观察主体的落点与画面的动线。", render: () => <Composition /> },
      { id: "a-balance", title: "视觉重量与平衡", desc: "面积越大越重。拖动圆形，让重心回到画面中央，或故意制造不平衡。", render: () => <Balance /> },
      { id: "a-white", title: "留白的尺度", desc: "同一份内容，在不同留白率下呈现出截然不同的性格。", render: () => <Whitespace /> },
      { id: "a-opp", title: "六组对比", desc: "艺术设计的基本语汇：大小、明暗、疏密、曲直、粗细、动静。悬停切换。", render: () => <Opposites /> },
    ],
  },
  {
    id: "generative", group: "art", title: "生成艺术", en: "Generative Art",
    desc: "用规则而非手绘创作：几条简单的数学规则，涌现出复杂而克制的图案。",
    blocks: [
      { id: "g-flow", title: "流场", desc: "500 个粒子沿着正弦合成的向量场移动，半透明背景形成拖尾。", render: () => <Flow /> },
      { id: "g-half", title: "半调圆点", desc: "圆点半径由到焦点的距离决定。移动指针改变焦点。", render: () => <Halftone /> },
      { id: "g-truchet", title: "Truchet 拼贴", desc: "一个瓦片、两种朝向，随机拼贴即得无穷图案。", render: () => <Truchet /> },
      { id: "g-moire", title: "莫尔条纹", desc: "两组规则图形轻微错位，涌现出新的节律。", render: () => <Moire /> },
      { id: "g-grain", title: "噪点颗粒", desc: "feTurbulence 叠加灰度噪点，消除色带，增加质感。", render: () => <Grain /> },
    ],
  },
  {
    id: "style", group: "art", title: "版式与流派", en: "Layout & Styles",
    desc: "读懂前人的语言，再决定自己的取舍。五种设计流派，同一套黑白灰。",
    blocks: [
      { id: "s-styles", title: "设计流派", desc: "点击切换，对比五种风格的构成方式与关键词。", render: () => <Styles /> },
      { id: "s-poster", title: "文字海报", desc: "输入一个词，选择版式。字体本身就是图形。", render: () => <TypePoster /> },
    ],
  },
  {
    id: "perception", group: "art", title: "视觉感知", en: "Perception",
    desc: "眼睛会“骗”人，大脑会“补全”。理解感知规律，才能设计出“看起来对”的界面。",
    blocks: [
      { id: "p-gestalt", title: "格式塔四原则", desc: "接近、相似、闭合、图底——大脑组织视觉信息的基本规则。", render: () => <Gestalt /> },
      { id: "p-simul", title: "同时对比", desc: "同一个灰，在不同背景上看起来不同。", tips: ["不要只在白底上挑灰色，要在真实背景上检查。"], render: () => <Simultaneous /> },
      { id: "p-optical", title: "光学校正", desc: "几何相等 ≠ 视觉相等。圆形略大、播放三角偏移，是图标设计的基本功。", render: () => <Optical /> },
    ],
  },
];
