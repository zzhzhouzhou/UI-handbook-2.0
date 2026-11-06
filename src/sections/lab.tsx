import { useEffect, useMemo, useRef, useState } from "react";
import { FlaskConical, Play, RefreshCw, ArrowLeftRight, Shuffle } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Copyable, Range, Seg } from "../components/ui";
import { CodeBlock } from "../components/Doc";
import { cn } from "../utils/cn";
import { clamp } from "../lib/hooks";
import { contrast, hexToRgb, hslToRgb, rgbToHex, rgbToHsl, rgbToOklch, shade } from "../lib/color";
import { useApp } from "../lib/store";

const Out = ({ code, file = "output.css" }: { code: string; file?: string }) => <div className="mt-4"><CodeBlock code={code} file={file} /></div>;
const Color = ({ label, v, set }: { label: string; v: string; set: (s: string) => void }) => (
  <label className="flex items-center justify-between gap-3 text-xs text-zinc-500">{label}
    <span className="flex items-center gap-2"><input value={v} onChange={(e) => set(e.target.value)} className="h-8 w-24 rounded-md border border-zinc-300 bg-transparent px-2 font-mono text-xs text-zinc-900 outline-none focus:border-accent dark:border-zinc-700 dark:text-zinc-100" /><input type="color" value={hexToRgb(v) ? rgbToHex(...hexToRgb(v)!) : "#000000"} onChange={(e) => set(e.target.value)} className="h-8 w-8 cursor-pointer rounded-md border-0 bg-transparent p-0" /></span>
  </label>
);

/* ---------- 1 缓动曲线编辑器 ---------- */
const PRESETS: [string, number[]][] = [["ease", [0.25, 0.1, 0.25, 1]], ["ease-out", [0, 0, 0.2, 1]], ["ease-in-out", [0.4, 0, 0.2, 1]], ["iOS 抽屉", [0.32, 0.72, 0, 1]], ["back-out", [0.34, 1.56, 0.64, 1]], ["expo-out", [0.16, 1, 0.3, 1]], ["circ-in", [0.55, 0, 1, 0.45]]];
function EasingLab() {
  const [p, setP] = useState([0.34, 1.56, 0.64, 1]);
  const [on, setOn] = useState(false);
  const [drag, setDrag] = useState<0 | 1 | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const px = (x: number) => 30 + x * 200, py = (y: number) => 250 - y * 200;
  const move = (e: React.PointerEvent) => {
    if (drag === null) return;
    const r = svg.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) * (260 / r.width) - 30) / 200, y = (250 - ((e.clientY - r.top) * (440 / r.height) - 60)) / 200;
    const n = [...p]; n[drag * 2] = +clamp(x, 0, 1).toFixed(2); n[drag * 2 + 1] = +clamp(y, -0.5, 1.5).toFixed(2); setP(n);
  };
  const css = `cubic-bezier(${p.join(", ")})`;
  return (
    <div className="grid gap-6 md:grid-cols-[260px_1fr]">
      <svg ref={svg} viewBox="0 -60 260 440" className="w-full max-w-[260px] touch-none select-none" onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
        <rect x="30" y="50" width="200" height="200" className="fill-zinc-100 stroke-zinc-300 dark:fill-zinc-900 dark:stroke-zinc-700" />
        <line x1="30" y1="250" x2="230" y2="50" className="stroke-zinc-300 dark:stroke-zinc-700" strokeDasharray="4" />
        <line x1={px(0)} y1={py(0)} x2={px(p[0])} y2={py(p[1])} stroke="#ec4899" strokeWidth="2" /><line x1={px(1)} y1={py(1)} x2={px(p[2])} y2={py(p[3])} stroke="var(--accent)" strokeWidth="2" />
        <path d={`M${px(0)},${py(0)} C${px(p[0])},${py(p[1])} ${px(p[2])},${py(p[3])} ${px(1)},${py(1)}`} fill="none" className="stroke-zinc-900 dark:stroke-white" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx={px(p[0])} cy={py(p[1])} r="9" fill="#ec4899" className="cursor-grab" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(0); }} />
        <circle cx={px(p[2])} cy={py(p[3])} r="9" fill="var(--accent)" className="cursor-grab" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(1); }} />
      </svg>
      <div className="space-y-5">
        <div className="flex flex-wrap gap-1.5">{PRESETS.map(([n, v]) => <button key={n} onClick={() => setP(v)} className={cn("rounded-full border px-3 py-1 text-xs transition", p.join() === v.join() ? "border-accent bg-accent-soft text-accent" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700")}>{n}</button>)}</div>
        <div className="relative h-12 rounded-full bg-zinc-200/70 [container-type:inline-size] dark:bg-zinc-800"><div className="absolute left-1 top-1 h-10 w-10 rounded-full bg-gradient-to-br from-accent to-pink-500 shadow-lg" style={{ transform: `translateX(${on ? "calc(100cqw - 48px)" : "0px"})`, transition: `transform 1000ms ${css}` }} /></div>
        <Btn variant="accent" onClick={() => setOn(!on)}><Play className="h-4 w-4" />{on ? "往回播放" : "播放 1s"}</Btn>
        <Copyable text={css} className="block rounded-lg bg-zinc-100 px-3 py-2 text-left text-sm dark:bg-zinc-800">{css}</Copyable>
      </div>
    </div>
  );
}

/* ---------- 2 弹簧物理 ---------- */
function SpringLab() {
  const [k, setK] = useState(180);
  const [c, setC] = useState(14);
  const [m, setM] = useState(1);
  const [on, setOn] = useState(false);
  const pts = useMemo(() => { const out: number[] = []; let x = 0, v = 0; const dt = 1 / 120; for (let i = 0; i < 360; i++) { const a = (-k * (x - 1) - c * v) / m; v += a * dt; x += v * dt; if (i % 3 === 0) out.push(x); } return out; }, [k, c, m]);
  const mx = Math.max(1.2, ...pts), mn = Math.min(0, ...pts);
  const path = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * 300},${100 - ((v - mn) / (mx - mn)) * 90 - 5}`).join(" ");
  const lin = `linear(${pts.filter((_, i) => i % 2 === 0).map((v) => +v.toFixed(3)).join(", ")}, 1)`;
  const zeta = c / (2 * Math.sqrt(k * m));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Range label="刚度 stiffness" value={k} onChange={setK} min={20} max={500} />
        <Range label="阻尼 damping" value={c} onChange={setC} min={1} max={50} />
        <Range label="质量 mass" value={m} onChange={setM} min={0.3} max={4} step={0.1} />
        <p className="text-xs text-zinc-500">阻尼比 ζ = {zeta.toFixed(2)} · {zeta < 1 ? "欠阻尼（会回弹）" : zeta === 1 ? "临界阻尼" : "过阻尼（缓慢逼近）"}</p>
        <div className="flex flex-wrap gap-1.5">{[["轻快", 300, 20, 1], ["果冻", 120, 6, 1], ["沉稳", 100, 26, 1.5], ["硬朗", 400, 40, 1]].map(([n, a, b, d]) => <button key={n as string} onClick={() => { setK(a as number); setC(b as number); setM(d as number); }} className="rounded-full border border-zinc-300 px-3 py-1 text-xs hover:border-accent dark:border-zinc-700">{n}</button>)}</div>
      </div>
      <div className="space-y-4">
        <svg viewBox="0 0 300 100" className="h-28 w-full rounded-lg bg-zinc-100 dark:bg-zinc-900"><line x1="0" x2="300" y1={100 - ((1 - mn) / (mx - mn)) * 90 - 5} y2={100 - ((1 - mn) / (mx - mn)) * 90 - 5} className="stroke-zinc-300 dark:stroke-zinc-700" strokeDasharray="4" /><path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.5" /></svg>
        <div className="relative h-12 rounded-full bg-zinc-200/70 [container-type:inline-size] dark:bg-zinc-800"><div className="absolute left-1 top-1 h-10 w-10 rounded-full bg-gradient-to-br from-accent to-pink-500 shadow-lg" style={{ transform: `translateX(${on ? "calc(100cqw - 48px)" : "0px"})`, transition: `transform 1.2s ${lin}` }} /></div>
        <Btn variant="accent" onClick={() => setOn(!on)}><Play className="h-4 w-4" />播放</Btn>
      </div>
      <div className="md:col-span-2"><Out file="spring.css" code={`/* CSS linear() 采样自弹簧曲线 */\ntransition: transform 1.2s ${lin.slice(0, 120)}…);`} /></div>
    </div>
  );
}

/* ---------- 3 阴影生成器 ---------- */
function ShadowLab() {
  const [n, setN] = useState(4); const [y, setY] = useState(24); const [b, setB] = useState(40); const [o, setO] = useState(0.12); const [dark, setDark] = useState(false);
  const layers = Array.from({ length: n }, (_, i) => { const t = Math.pow(2, i + 1) / Math.pow(2, n); return `0 ${Math.ceil(y * t)}px ${Math.ceil(b * t)}px rgb(0 0 0 / ${(o / n * 1.5).toFixed(3)})`; });
  const sh = layers.join(",\n    ");
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4"><Range label="层数" value={n} onChange={setN} min={1} max={6} /><Range label="最大垂直偏移" value={y} onChange={setY} min={0} max={80} unit="px" /><Range label="最大模糊" value={b} onChange={setB} min={0} max={120} unit="px" /><Range label="总不透明度" value={o} onChange={setO} min={0.02} max={0.4} step={0.01} /><label className="flex items-center gap-2 text-xs text-zinc-500"><input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="accent-[var(--accent)]" />深色背景预览</label></div>
      <div className={cn("grid place-items-center rounded-2xl p-10", dark ? "bg-zinc-900" : "bg-zinc-100")}><div className={cn("grid h-32 w-48 place-items-center rounded-2xl text-sm font-medium", dark ? "bg-zinc-800 text-white" : "bg-white")} style={{ boxShadow: layers.join(",") }}>{n} 层柔和阴影</div></div>
      <div className="md:col-span-2"><Out code={`box-shadow:\n    ${sh};`} /></div>
    </div>
  );
}

/* ---------- 4 渐变生成器 ---------- */
function GradientLab() {
  const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
  const [ang, setAng] = useState(135);
  const [cs, setCs] = useState(["#6d4aff", "#ec4899", "#f59e0b"]);
  const css = `${type}-gradient(${type === "radial" ? "circle at center" : type === "conic" ? `from ${ang}deg` : ang + "deg"}, ${cs.join(", ")})`;
  const rand = () => setCs(Array.from({ length: 3 }, () => rgbToHex(...hslToRgb(Math.random() * 360, 75, 58))));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Seg value={type} onChange={setType} options={[{ value: "linear", label: "线性" }, { value: "radial", label: "径向" }, { value: "conic", label: "锥形" }]} />
        {type !== "radial" && <Range label="角度" value={ang} onChange={setAng} min={0} max={360} unit="°" />}
        {cs.map((c, i) => <Color key={i} label={`色标 ${i + 1}`} v={c} set={(v) => setCs(cs.map((x, j) => (j === i ? v : x)))} />)}
        <Btn variant="outline" size="sm" onClick={rand}><Shuffle className="h-4 w-4" />随机配色</Btn>
      </div>
      <div className="h-56 rounded-2xl shadow-inner" style={{ background: css }} />
      <div className="md:col-span-2"><Out code={`background: ${css};`} /></div>
    </div>
  );
}

/* ---------- 5 拟物 ---------- */
function NeuLab() {
  const [bg, setBg] = useState("#e6e9ef"); const [d, setD] = useState(12); const [bl, setBl] = useState(28); const [it, setIt] = useState(0.25); const [r, setR] = useState(24);
  const [shape, setShape] = useState<"flat" | "pressed" | "concave" | "convex">("flat");
  const lt = shade(bg, it * 1.6), dk = shade(bg, -it);
  const grad = shape === "concave" ? `linear-gradient(145deg, ${shade(bg, -0.06)}, ${shade(bg, 0.06)})` : shape === "convex" ? `linear-gradient(145deg, ${shade(bg, 0.06)}, ${shade(bg, -0.06)})` : bg;
  const shadow = `${shape === "pressed" ? "inset " : ""}${d}px ${d}px ${bl}px ${dk}, ${shape === "pressed" ? "inset " : ""}-${d}px -${d}px ${bl}px ${lt}`;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4"><Seg value={shape} onChange={setShape} options={[{ value: "flat", label: "平面" }, { value: "pressed", label: "凹陷" }, { value: "concave", label: "凹面" }, { value: "convex", label: "凸面" }]} /><Color label="底色" v={bg} set={setBg} /><Range label="距离" value={d} onChange={setD} min={2} max={30} unit="px" /><Range label="模糊" value={bl} onChange={setBl} min={4} max={60} unit="px" /><Range label="强度" value={it} onChange={setIt} min={0.05} max={0.5} step={0.01} /><Range label="圆角" value={r} onChange={setR} min={0} max={80} unit="px" /></div>
      <div className="grid place-items-center rounded-2xl p-8" style={{ background: bg }}><div className="grid h-40 w-40 place-items-center text-sm font-medium text-zinc-600" style={{ background: grad, borderRadius: r, boxShadow: shadow }}>Neumorphism</div></div>
      <div className="md:col-span-2"><Out code={`background: ${grad};\nborder-radius: ${r}px;\nbox-shadow: ${shadow};`} /></div>
    </div>
  );
}

/* ---------- 6 对比度 ---------- */
function ContrastLab() {
  const [fg, setFg] = useState("#6d4aff"); const [bg, setBg] = useState("#ffffff");
  const a = hexToRgb(fg), b = hexToRgb(bg);
  const ratio = a && b ? contrast(a, b) : 1;
  const B = ({ ok, l }: { ok: boolean; l: string }) => <span className={cn("rounded-md px-2.5 py-1 text-xs font-semibold", ok ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300")}>{ok ? "✓" : "✗"} {l}</span>;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4"><Color label="前景（文字）" v={fg} set={setFg} /><Color label="背景" v={bg} set={setBg} /><Btn variant="outline" size="sm" onClick={() => { setFg(bg); setBg(fg); }}><ArrowLeftRight className="h-4 w-4" />交换</Btn>
        <div><p className="text-5xl font-extrabold tabular-nums tracking-tight">{ratio.toFixed(2)}<span className="text-xl text-zinc-400"> : 1</span></p><div className="mt-3 flex flex-wrap gap-2"><B ok={ratio >= 4.5} l="AA 正文 4.5" /><B ok={ratio >= 3} l="AA 大字 3" /><B ok={ratio >= 7} l="AAA 正文 7" /><B ok={ratio >= 4.5} l="AAA 大字 4.5" /></div></div></div>
      <div className="space-y-3 rounded-2xl p-6 ring-1 ring-black/10" style={{ background: bg, color: fg }}><p className="text-2xl font-bold">大标题 Large Text</p><p className="text-sm leading-relaxed">正文示例：对比度不足会让低视力用户、强光下的用户读不清。WCAG 要求正文至少 4.5:1。</p><button className="rounded-lg px-4 py-2 text-sm font-semibold" style={{ background: fg, color: bg }}>按钮</button></div>
    </div>
  );
}

/* ---------- 7 色板生成 ---------- */
const LS = [0.97, 0.93, 0.87, 0.79, 0.7, 0.62, 0.55, 0.47, 0.4, 0.33, 0.26];
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
function PaletteLab() {
  const { hue, setHue } = useApp();
  const [ch, setCh] = useState(0.2);
  const cols = LS.map((l) => `oklch(${l} ${(ch * Math.min(1, (1 - Math.abs(l - 0.6) * 1.1))).toFixed(3)} ${hue})`);
  const css = `@theme {\n${cols.map((c, i) => `  --color-brand-${STEPS[i]}: ${c};`).join("\n")}\n}`;
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2"><Range label="色相 Hue（同步全站主色）" value={hue} onChange={setHue} min={0} max={360} /><Range label="饱和度 Chroma" value={ch} onChange={setCh} min={0.02} max={0.3} step={0.01} /></div>
      <div className="grid grid-cols-11 overflow-hidden rounded-xl ring-1 ring-black/10">{cols.map((c, i) => <Copyable key={i} text={`brand-${STEPS[i]}: ${c}`} className="grid h-24 place-items-end p-1 text-[10px]"><span className="block h-full w-full" style={{ background: c }} /></Copyable>)}</div>
      <div className="grid grid-cols-11 text-center text-[10px] text-zinc-500">{STEPS.map((s) => <span key={s}>{s}</span>)}</div>
      <Out code={css} />
    </div>
  );
}

/* ---------- 8 流式字号 ---------- */
function FluidLab() {
  const [min, setMin] = useState(18); const [max, setMax] = useState(48); const [vmin, setVmin] = useState(360); const [vmax, setVmax] = useState(1200); const [vw, setVw] = useState(720);
  const slope = (max - min) / (vmax - vmin); const inter = min - slope * vmin;
  const clampCss = `clamp(${min / 16}rem, ${(inter / 16).toFixed(3)}rem + ${(slope * 100).toFixed(3)}vw, ${max / 16}rem)`;
  const cur = clamp(inter + slope * vw, min, max);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2"><Range label="最小字号" value={min} onChange={setMin} min={12} max={32} unit="px" /><Range label="最大字号" value={max} onChange={setMax} min={24} max={96} unit="px" /><Range label="最小视口" value={vmin} onChange={setVmin} min={320} max={600} unit="px" /><Range label="最大视口" value={vmax} onChange={setVmax} min={800} max={1920} unit="px" /></div>
      <Range label="模拟视口宽度" value={vw} onChange={setVw} min={320} max={1600} unit="px" />
      <div className="overflow-hidden rounded-xl border border-dashed border-zinc-300 p-5 dark:border-zinc-700" style={{ width: Math.min(vw, 1000) / 1000 * 100 + "%", minWidth: 220 }}><p className="font-extrabold leading-tight tracking-tight" style={{ fontSize: cur }}>流式排版</p><p className="mt-1 text-xs text-zinc-500">当前 {cur.toFixed(1)}px</p></div>
      <Out code={`font-size: ${clampCss};`} />
    </div>
  );
}

/* ---------- 9 Blob 圆角 ---------- */
function BlobLab() {
  const [v, setV] = useState([60, 40, 30, 70, 60, 30, 70, 40]);
  const [anim, setAnim] = useState(false);
  const css = `${v[0]}% ${v[1]}% ${v[2]}% ${v[3]}% / ${v[4]}% ${v[5]}% ${v[6]}% ${v[7]}%`;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">{v.map((x, i) => <Range key={i} label={["左上 H", "右上 H", "右下 H", "左下 H", "左上 V", "右上 V", "右下 V", "左下 V"][i]} value={x} onChange={(n) => setV(v.map((y, j) => (j === i ? n : y)))} min={10} max={90} unit="%" />)}<div className="flex gap-2"><Btn size="sm" variant="outline" onClick={() => setV(Array.from({ length: 8 }, () => 25 + Math.floor(Math.random() * 50)))}><Shuffle className="h-4 w-4" />随机</Btn><Btn size="sm" variant={anim ? "accent" : "outline"} onClick={() => setAnim(!anim)}>{anim ? "停止" : "自动变形"}</Btn></div></div>
      <div className="grid place-items-center"><div className="h-56 w-56 bg-gradient-to-br from-accent via-fuchsia-500 to-amber-400 shadow-2xl shadow-accent/30" style={anim ? { animation: "blob 8s ease-in-out infinite" } : { borderRadius: css, transition: "border-radius .3s" }} /></div>
      <div className="md:col-span-2"><Out code={`border-radius: ${css};`} /></div>
    </div>
  );
}

/* ---------- 10 滤镜 ---------- */
function FilterLab() {
  const D = { blur: 0, brightness: 100, contrast: 100, saturate: 100, hue: 0, gray: 0, sepia: 0, invert: 0 };
  const [f, setF] = useState(D);
  const css = `blur(${f.blur}px) brightness(${f.brightness}%) contrast(${f.contrast}%) saturate(${f.saturate}%) hue-rotate(${f.hue}deg) grayscale(${f.gray}%) sepia(${f.sepia}%) invert(${f.invert}%)`;
  const P: [string, typeof D][] = [["原图", D], ["复古", { ...D, sepia: 60, contrast: 110, brightness: 95, saturate: 130 }], ["黑白", { ...D, gray: 100, contrast: 120 }], ["梦幻", { ...D, blur: 1.5, brightness: 110, saturate: 140, hue: 20 }], ["赛博", { ...D, hue: 180, saturate: 200, contrast: 120 }]];
  const S = (k: keyof typeof D, l: string, mn: number, mx: number, u: string) => <Range key={k} label={l} value={f[k]} onChange={(n) => setF({ ...f, [k]: n })} min={mn} max={mx} unit={u} />;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3"><div className="flex flex-wrap gap-1.5">{P.map(([n, v]) => <button key={n} onClick={() => setF(v)} className="rounded-full border border-zinc-300 px-3 py-1 text-xs hover:border-accent dark:border-zinc-700">{n}</button>)}</div>{S("blur", "模糊", 0, 10, "px")}{S("brightness", "亮度", 0, 200, "%")}{S("contrast", "对比度", 0, 200, "%")}{S("saturate", "饱和度", 0, 300, "%")}{S("hue", "色相旋转", 0, 360, "°")}{S("gray", "灰度", 0, 100, "%")}{S("sepia", "褐色", 0, 100, "%")}{S("invert", "反相", 0, 100, "%")}</div>
      <div className="relative h-72 overflow-hidden rounded-2xl" style={{ filter: css }}>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-orange-200 to-amber-100" /><div className="absolute right-10 top-8 h-14 w-14 rounded-full bg-yellow-200 shadow-[0_0_40px_10px_#fde68a]" />
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-3/5"><path d="M0 60V30L18 14 34 34 52 8 72 36 88 20 100 32V60Z" fill="#4c1d95" /><path d="M0 60V42L22 28 44 44 66 30 100 46V60Z" fill="#059669" /></svg>
      </div>
      <div className="md:col-span-2"><Out code={`filter: ${css};`} /></div>
    </div>
  );
}

/* ---------- 11 色彩转换 ---------- */
function ConverterLab() {
  const [hex, setHex] = useState("#6d4aff");
  const rgb = hexToRgb(hex);
  const rows = rgb ? [["HEX", rgbToHex(...rgb).toUpperCase()], ["RGB", `rgb(${rgb.join(", ")})`], ["HSL", (() => { const [h, s, l] = rgbToHsl(...rgb); return `hsl(${h} ${s}% ${l}%)`; })()], ["OKLCH", (() => { const [l, c, h] = rgbToOklch(...rgb); return `oklch(${l} ${c} ${h})`; })()]] : [];
  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <div className="space-y-3"><div className="h-28 rounded-2xl ring-1 ring-black/10" style={{ background: rgb ? hex : "transparent" }} /><Color label="颜色" v={hex} set={setHex} /></div>
      <div className="space-y-2">{rows.map(([k, v]) => <div key={k} className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"><span className="w-16 text-xs font-semibold text-zinc-400">{k}</span><Copyable text={v} className="text-sm" /></div>)}{!rgb && <p className="text-sm text-red-500">请输入有效的 HEX（如 #6d4aff）</p>}<p className="text-xs text-zinc-500">点击数值复制。OKLCH 感知均匀，适合生成色阶。</p></div>
    </div>
  );
}

/* ---------- 12 clip-path ---------- */
const SHAPES: [string, string][] = [["三角形", "50% 0%, 0% 100%, 100% 100%"], ["菱形", "50% 0%, 100% 50%, 50% 100%, 0% 50%"], ["六边形", "25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%"], ["五角星", "50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%"], ["箭头", "0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%"], ["十字", "35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%"], ["斜切", "0 0, 100% 0, 100% 75%, 0 100%"], ["气泡", "0 0, 100% 0, 100% 75%, 75% 75%, 50% 100%, 50% 75%, 0 75%"]];
function ClipLab() {
  const [i, setI] = useState(2);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="grid grid-cols-4 gap-2">{SHAPES.map(([n, p], k) => <button key={n} onClick={() => setI(k)} className={cn("grid aspect-square place-items-center rounded-xl border text-[11px] transition", i === k ? "border-accent bg-accent-soft text-accent" : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800")}><span className="mb-1 h-8 w-8 bg-current" style={{ clipPath: `polygon(${p})` }} />{n}</button>)}</div>
      <div className="grid place-items-center"><div className="h-52 w-52 bg-gradient-to-br from-accent to-pink-500 transition-[clip-path] duration-500" style={{ clipPath: `polygon(${SHAPES[i][1]})` }} /></div>
      <div className="md:col-span-2"><Out code={`clip-path: polygon(${SHAPES[i][1]});`} /></div>
    </div>
  );
}

/* ---------- 13 动画游乐场 ---------- */
const ANIMS: Record<string, string> = {
  bounce: "0%,100%{transform:translateY(0)}50%{transform:translateY(-40px)}", pulse: "0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.25);opacity:.6}", shake: "0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-14px)}40%,80%{transform:translateX(14px)}", spin: "to{transform:rotate(360deg)}",
  wobble: "0%,100%{transform:rotate(0)}25%{transform:rotate(-12deg)}75%{transform:rotate(12deg)}", flip: "0%{transform:perspective(400px) rotateY(0)}100%{transform:perspective(400px) rotateY(360deg)}", rubber: "0%{transform:scale(1,1)}30%{transform:scale(1.3,.7)}50%{transform:scale(.8,1.2)}70%{transform:scale(1.1,.9)}100%{transform:scale(1,1)}",
};
function AnimLab() {
  const [name, setName] = useState("bounce"); const [dur, setDur] = useState(1000); const [ease, setEase] = useState("ease-in-out"); const [iter, setIter] = useState(1); const [k, setK] = useState(0);
  useEffect(() => setK((x) => x + 1), [name, dur, ease, iter]);
  const rule = `animation: ${name} ${dur}ms ${ease} ${iter === 0 ? "infinite" : iter};`;
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4"><div className="flex flex-wrap gap-1.5">{Object.keys(ANIMS).map((n) => <button key={n} onClick={() => setName(n)} className={cn("rounded-full border px-3 py-1 text-xs", name === n ? "border-accent bg-accent-soft text-accent" : "border-zinc-300 dark:border-zinc-700")}>{n}</button>)}</div><Range label="时长" value={dur} onChange={setDur} min={200} max={3000} step={100} unit="ms" /><Range label="次数（0 = 无限）" value={iter} onChange={setIter} min={0} max={5} /><Seg value={ease} onChange={setEase} options={["linear", "ease-in-out", "ease-out", "steps(6)"].map((v) => ({ value: v, label: v }))} className="flex-wrap" /><Btn variant="accent" onClick={() => setK(k + 1)}><RefreshCw className="h-4 w-4" />重播</Btn></div>
      <div className="grid h-56 place-items-center rounded-2xl bg-zinc-100 dark:bg-zinc-900"><style>{`@keyframes lab-${name}{${ANIMS[name]}}`}</style><div key={k} className="h-20 w-20 rounded-2xl bg-gradient-to-br from-accent to-pink-500 shadow-xl" style={{ animation: `lab-${name} ${dur}ms ${ease} ${iter === 0 ? "infinite" : iter}` }} /></div>
      <div className="md:col-span-2"><Out code={`@keyframes ${name} {\n  ${ANIMS[name].replace(/\}/g, "}\n ").replace(/\{/g, " { ").trim()}\n}\n.box { ${rule} }`} /></div>
    </div>
  );
}

/* ---------- 14 Grid 生成器 ---------- */
function GridLab() {
  const [cols, setCols] = useState(3); const [rows, setRows] = useState(2); const [gap, setGap] = useState(12); const [mode, setMode] = useState<"fr" | "auto">("fr"); const [span, setSpan] = useState(true);
  const tpl = mode === "fr" ? `repeat(${cols}, 1fr)` : "repeat(auto-fill, minmax(100px, 1fr))";
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3"><Range label="列" value={cols} onChange={setCols} min={1} max={6} /><Range label="行" value={rows} onChange={setRows} min={1} max={5} /><Range label="间距" value={gap} onChange={setGap} min={0} max={32} unit="px" /></div>
      <div className="flex flex-wrap items-center gap-4"><Seg value={mode} onChange={setMode} options={[{ value: "fr", label: "固定列 fr" }, { value: "auto", label: "auto-fill 自适应" }]} /><label className="flex items-center gap-2 text-xs text-zinc-500"><input type="checkbox" checked={span} onChange={(e) => setSpan(e.target.checked)} className="accent-[var(--accent)]" />首格跨 2×2</label></div>
      <div className="grid rounded-xl border border-dashed border-zinc-300 p-3 dark:border-zinc-700" style={{ gridTemplateColumns: tpl, gap }}>{Array.from({ length: mode === "fr" ? cols * rows : 12 }, (_, i) => <div key={i} className="grid h-14 place-items-center rounded-lg bg-accent/15 text-xs font-semibold text-accent" style={i === 0 && span && cols > 1 && rows > 1 ? { gridColumn: "span 2", gridRow: "span 2", height: "auto" } : undefined}>{i + 1}</div>)}</div>
      <Out code={`.grid {\n  display: grid;\n  grid-template-columns: ${tpl};\n  gap: ${gap}px;\n}${span ? "\n.grid > :first-child { grid-column: span 2; grid-row: span 2; }" : ""}`} />
    </div>
  );
}

/* ---------- 15 令牌导出 ---------- */
function TokenExportLab() {
  const { hue, radius, font } = useApp();
  const [fmt, setFmt] = useState<"css" | "tw" | "json">("css");
  const ff = { sans: '"Inter", system-ui, sans-serif', serif: '"Noto Serif SC", serif', mono: '"JetBrains Mono", monospace' }[font];
  const code = fmt === "css"
    ? `:root {\n  --accent-h: ${hue};\n  --accent: oklch(0.56 0.23 ${hue});\n  --accent-soft: oklch(0.96 0.035 ${hue});\n  --radius: ${(radius * 0.75).toFixed(2)}rem;\n  --font-sans: ${ff};\n}\n.dark {\n  --accent: oklch(0.73 0.17 ${hue});\n  --accent-soft: oklch(0.32 0.08 ${hue} / 0.45);\n}`
    : fmt === "tw"
      ? `@theme {\n  --color-accent: oklch(0.56 0.23 ${hue});\n  --radius-xl: ${(radius * 0.75).toFixed(2)}rem;\n  --radius-2xl: ${radius.toFixed(2)}rem;\n  --font-sans: ${ff};\n}`
      : JSON.stringify({ color: { accent: { light: `oklch(0.56 0.23 ${hue})`, dark: `oklch(0.73 0.17 ${hue})` } }, radius: { xl: `${(radius * 0.75).toFixed(2)}rem`, "2xl": `${radius.toFixed(2)}rem` }, font: { sans: ff } }, null, 2);
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-500">这里导出的是<b className="text-zinc-900 dark:text-zinc-100">当前站点正在使用的令牌</b>。试着在右下角「外观」面板里调节主色、圆角、字体，再回来看输出。</p>
      <Seg value={fmt} onChange={setFmt} options={[{ value: "css", label: "CSS 变量" }, { value: "tw", label: "Tailwind @theme" }, { value: "json", label: "JSON" }]} />
      <CodeBlock code={code} file={fmt === "json" ? "tokens.json" : "tokens.css"} />
    </div>
  );
}

export const lab: Section = {
  id: "lab", title: "设计实验室", en: "Design Lab", group: "2.0 新增", icon: FlaskConical, hue: 160,
  blurb: "不止是看，还要“调”。这里是 15 个可交互的设计工具：拖动手柄、拉滑块，实时得到可直接复制的 CSS——缓动曲线、弹簧、阴影、渐变、色板、对比度、流式字号……",
  items: [
    item({ id: "lab-easing", title: "缓动曲线编辑器", en: "Cubic-bezier Editor", level: "进阶", isNew: true, demo: EasingLab, tags: ["easing", "bezier", "贝塞尔"], desc: "拖动两个控制点设计自己的 cubic-bezier，实时在滑轨上预览，一键复制。", points: ["控制点 x 必须在 [0,1]，y 可以超出形成“过冲”（回弹）。", "粉色手柄控制起点切线，主色手柄控制终点切线。"], code: `transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);` }),
    item({ id: "lab-spring", title: "弹簧物理", en: "Spring Physics", level: "高级", isNew: true, demo: SpringLab, tags: ["spring", "physics", "linear()"], desc: "调节刚度、阻尼、质量，实时绘制位移曲线，并用 CSS linear() 函数把物理弹簧变成纯 CSS 动画。", points: ["a = (−k(x−1) − c·v) / m，半隐式欧拉积分。", "阻尼比 ζ = c / 2√(km)：<1 回弹，≥1 不回弹。", "linear() 接受任意采样点，把 JS 弹簧“烘焙”成 CSS。"], code: `transition: transform 1.2s linear(0, 0.2, 0.7, 1.1, 1.02, 1);` }),
    item({ id: "lab-shadow", title: "分层阴影生成器", en: "Layered Shadow", level: "进阶", isNew: true, demo: ShadowLab, tags: ["shadow", "box-shadow", "阴影"], desc: "单层阴影看起来“脏”。叠 4–6 层、距离与模糊指数增长的阴影，才有真实光照的柔和渐变。", points: ["第 i 层 = 最大值 × 2^i / 2^n。", "总不透明度均分，避免叠加过黑。"], code: `box-shadow: 0 3px 5px rgb(0 0 0 / .05), 0 12px 20px rgb(0 0 0 / .05), 0 24px 40px rgb(0 0 0 / .05);` }),
    item({ id: "lab-gradient", title: "渐变生成器", en: "Gradient Maker", level: "基础", isNew: true, demo: GradientLab, tags: ["gradient", "渐变"], desc: "线性 / 径向 / 锥形三种渐变，三个色标 + 角度，支持随机配色灵感。", code: `background: linear-gradient(135deg, #6d4aff, #ec4899, #f59e0b);` }),
    item({ id: "lab-neu", title: "拟物（Neumorphism）生成器", en: "Neumorphism", level: "进阶", isNew: true, demo: NeuLab, tags: ["soft ui", "拟态"], desc: "同色背景 + 一明一暗两道阴影 = 凸起或凹陷的“软塑料”质感。", points: ["亮面阴影用底色向白混合，暗面向黑混合。", "对比度极低，仅用于装饰，不用于关键控件。"], a11y: ["拟物风格对比度很差，不要用于需要识别边界的表单。"], code: `box-shadow: 12px 12px 28px #c4c7cc, -12px -12px 28px #ffffff;` }),
    item({ id: "lab-contrast", title: "对比度检测器", en: "WCAG Contrast Checker", level: "基础", isNew: true, demo: ContrastLab, tags: ["a11y", "wcag", "对比度"], desc: "输入前景和背景色，按 WCAG 2.1 公式计算对比度，并给出 AA / AAA 达标情况。", points: ["相对亮度 L = 0.2126R + 0.7152G + 0.0722B（线性化后）。", "对比度 = (L1 + 0.05) / (L2 + 0.05)。", "正文 AA ≥ 4.5，大字 AA ≥ 3，AAA 正文 ≥ 7。"], code: `const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);` }),
    item({ id: "lab-palette", title: "OKLCH 色板生成", en: "Palette Generator", level: "进阶", isNew: true, demo: PaletteLab, tags: ["oklch", "色板", "tailwind"], desc: "给定色相，用 OKLCH 生成 11 级色阶（50–950），明度均匀递减，可直接导出为 Tailwind @theme。", points: ["OKLCH 感知均匀：同样的 L 差在任何色相上看起来差别一致。", "两端降低 chroma，避免高明度 / 低明度下溢出色域。", "调节色相会同步全站主色——立刻看到整个设计系统变色。"], code: `@theme {\n  --color-brand-500: oklch(0.62 0.2 268);\n}` }),
    item({ id: "lab-fluid", title: "流式字号 clamp()", en: "Fluid Typography", level: "进阶", isNew: true, demo: FluidLab, tags: ["clamp", "responsive", "流式"], desc: "让字号随视口平滑缩放，无需断点。输入最小 / 最大字号与视口范围，自动算出 clamp()。", points: ["slope = (max − min) / (vmax − vmin)；intercept = min − slope × vmin。", "写成 rem + vw 组合，尊重用户的默认字号设置。"], code: `font-size: clamp(1.125rem, 0.75rem + 1.5vw, 3rem);` }),
    item({ id: "lab-blob", title: "Blob 圆角编辑器", en: "Organic Blob", level: "进阶", isNew: true, demo: BlobLab, tags: ["border-radius", "blob"], desc: "border-radius 支持水平 / 垂直各四个值：8 个滑块就能捏出有机形状，还能自动变形。", points: ["语法：h1 h2 h3 h4 / v1 v2 v3 v4。", "用 border-radius 动画（而非 SVG path）实现 morph，性能好。"], code: `border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;` }),
    item({ id: "lab-filter", title: "CSS 滤镜实验", en: "Filter Playground", level: "基础", isNew: true, demo: FilterLab, tags: ["filter", "滤镜"], desc: "八种 filter 叠加，附带复古 / 黑白 / 梦幻 / 赛博预设。", points: ["filter 顺序会影响结果。", "backdrop-filter 同理，但作用于元素背后。"], code: `filter: sepia(60%) contrast(110%) brightness(95%) saturate(130%);` }),
    item({ id: "lab-color", title: "色彩格式转换", en: "Color Converter", level: "基础", isNew: true, demo: ConverterLab, tags: ["hex", "rgb", "hsl", "oklch"], desc: "HEX ⇄ RGB ⇄ HSL ⇄ OKLCH，一键复制。", points: ["HSL 方便手调，OKLCH 方便生成色阶。"], code: `const [L, C, H] = rgbToOklch(r, g, b);` }),
    item({ id: "lab-clip", title: "clip-path 形状库", en: "Clip-path Shapes", level: "基础", isNew: true, demo: ClipLab, tags: ["polygon", "shape"], desc: "八种常用多边形，点击即切换，切换时形状平滑过渡（点数相同才能过渡）。", points: ["过渡要求 polygon 顶点数一致。"], code: `clip-path: polygon(50% 0%, 0% 100%, 100% 100%);` }),
    item({ id: "lab-anim", title: "动画游乐场", en: "Keyframes Playground", level: "基础", isNew: true, demo: AnimLab, tags: ["animation", "keyframes"], desc: "挑一个预设，调时长、次数和缓动，实时重播并生成 @keyframes 代码。", code: `animation: bounce 1000ms ease-in-out infinite;` }),
    item({ id: "lab-grid", title: "Grid 布局生成器", en: "Grid Generator", level: "基础", isNew: true, demo: GridLab, tags: ["grid", "layout", "布局"], desc: "调列数、行数、间距；或切换为 auto-fill + minmax 的自适应模式。支持首格跨 2×2。", points: ["auto-fill + minmax 无需媒体查询即可响应式。"], code: `grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));` }),
    item({ id: "lab-tokens", title: "设计令牌导出", en: "Token Export", level: "进阶", isNew: true, demo: TokenExportLab, tags: ["tokens", "export", "导出"], desc: "把你在「外观」面板中调好的主色、圆角、字体，导出为 CSS 变量、Tailwind @theme 或 JSON，直接带进你的项目。", code: `:root { --accent-h: 268; --accent: oklch(0.56 0.23 268); }` }),
  ],
};
