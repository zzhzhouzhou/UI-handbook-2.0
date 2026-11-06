import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, Play, ArrowLeftRight, Shuffle } from "lucide-react";
import type { Section } from "@/types";
import { Btn, Seg, Range, Caption } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useCopy, clamp } from "@/lib/hooks";
import { contrast, grayHex, hexToRgb } from "@/lib/color";

export function CodeOut({ code, className }: { code: string; className?: string }) {
  const [done, copy] = useCopy();
  return (
    <div className={cn("relative rounded-lg border border-line bg-bg", className)}>
      <pre className="overflow-x-auto p-3 pr-12 text-[12px] leading-relaxed text-mute whitespace-pre-wrap break-all">{code}</pre>
      <button aria-label="复制代码" onClick={() => copy(code)} className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md border border-line2 bg-bg text-mute transition-colors hover:text-fg">{done ? <Check size={13} /> : <Copy size={13} />}</button>
    </div>
  );
}

/* ---------- easing editor ---------- */
function EaseEditor() {
  const [p, setP] = useState([0.34, 1.56, 0.64, 1]);
  const [n, setN] = useState(0);
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef(-1);
  const X = (x: number) => 70 + x * 160, Y = (y: number) => 230 - y * 160;
  const toVal = (e: React.PointerEvent) => {
    const pt = svg.current!.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const q = pt.matrixTransform(svg.current!.getScreenCTM()!.inverse());
    return [clamp((q.x - 70) / 160, 0, 1), clamp((230 - q.y) / 160, -0.5, 1.5)];
  };
  const move = (e: React.PointerEvent) => { if (drag.current < 0) return; const [x, y] = toVal(e); const a = [...p]; a[drag.current * 2] = +x.toFixed(2); a[drag.current * 2 + 1] = +y.toFixed(2); setP(a); };
  const css = `cubic-bezier(${p.join(", ")})`;
  useEffect(() => { const t = setInterval(() => setN((x) => x + 1), 2200); return () => clearInterval(t); }, []);
  const presets: [string, number[]][] = [["ease-out", [0, 0, 0.2, 1]], ["ease-in-out", [0.4, 0, 0.2, 1]], ["expo-out", [0.16, 1, 0.3, 1]], ["spring", [0.34, 1.56, 0.64, 1]], ["anticipate", [0.7, -0.4, 0.3, 1.4]]];
  return (
    <div className="grid gap-8 md:grid-cols-[300px_1fr]">
      <svg ref={svg} viewBox="0 -10 300 320" className="w-full touch-none rounded-xl border border-line bg-bg" onPointerMove={move} onPointerUp={() => (drag.current = -1)}>
        <rect x="70" y="70" width="160" height="160" fill="none" stroke="var(--line2)" />
        <line x1={X(0)} y1={Y(0)} x2={X(1)} y2={Y(1)} stroke="var(--line2)" strokeDasharray="3 3" />
        <line x1={X(0)} y1={Y(0)} x2={X(p[0])} y2={Y(p[1])} stroke="var(--fg)" strokeOpacity=".4" />
        <line x1={X(1)} y1={Y(1)} x2={X(p[2])} y2={Y(p[3])} stroke="var(--fg)" strokeOpacity=".4" />
        <path d={`M${X(0)},${Y(0)} C${X(p[0])},${Y(p[1])} ${X(p[2])},${Y(p[3])} ${X(1)},${Y(1)}`} fill="none" stroke="var(--fg)" strokeWidth="2.5" />
        {[0, 1].map((i) => <g key={i}><circle cx={X(p[i * 2])} cy={Y(p[i * 2 + 1])} r="16" fill="transparent" className="cursor-grab" onPointerDown={(e) => { drag.current = i; (e.target as Element).setPointerCapture(e.pointerId); }} /><circle cx={X(p[i * 2])} cy={Y(p[i * 2 + 1])} r="6" fill={i ? "var(--fg)" : "var(--bg)"} stroke="var(--fg)" strokeWidth="2" pointerEvents="none" /></g>)}
        <circle cx={X(0)} cy={Y(0)} r="3" fill="var(--fg)" /><circle cx={X(1)} cy={Y(1)} r="3" fill="var(--fg)" />
      </svg>
      <div className="space-y-5">
        <div className="relative h-10 rounded-full bg-soft2 [container-type:inline-size]"><div key={n} className="absolute left-1 top-1 h-8 w-8 rounded-full bg-inv" style={{ animation: `slideBall 1.2s ${css} both` }} /></div>
        <div className="flex flex-wrap gap-2">{presets.map(([t, v]) => <button key={t} onClick={() => { setP(v); setN((x) => x + 1); }} className="rounded-full border border-line2 px-3 py-1 text-xs text-mute transition-colors hover:border-fg hover:text-fg">{t}</button>)}</div>
        <CodeOut code={`transition-timing-function: ${css};`} />
        <Btn variant="outline" size="sm" onClick={() => setN((x) => x + 1)}><Play size={13} />重播</Btn>
        <p className="text-xs text-mute">拖动两个控制点。x 必须在 [0,1]，y 可以超出区间形成“过冲”回弹。</p>
      </div>
    </div>
  );
}

/* ---------- spring ---------- */
function simulate(k: number, c: number, m: number) {
  const dt = 1 / 120, out: number[] = [];
  let x = 0, v = 0;
  for (let t = 0; t < 2.4; t += dt) { const a = (-k * (x - 1) - c * v) / m; v += a * dt; x += v * dt; out.push(x); }
  return out;
}
function Spring() {
  const [k, setK] = useState(170);
  const [c, setC] = useState(14);
  const [m, setM] = useState(1);
  const ball = useRef<HTMLDivElement>(null);
  const s = useMemo(() => simulate(k, c, m), [k, c, m]);
  const zeta = c / (2 * Math.sqrt(k * m));
  const path = s.map((v, i) => `${i ? "L" : "M"}${(i / (s.length - 1)) * 400},${130 - clamp(v, -0.5, 2) * 80}`).join(" ");
  const play = () => { const e = ball.current; if (!e) return; const w = (e.parentElement!.clientWidth - 48); e.animate(s.filter((_, i) => i % 3 === 0).map((v) => ({ transform: `translateX(${v * w}px)` })), { duration: 2400, easing: "linear" }); };
  useEffect(play, [s]);
  const lin = `linear(${s.filter((_, i) => i % 12 === 0).map((v) => +v.toFixed(3)).join(", ")}, 1)`;
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="space-y-5">
        <Range label="刚度 stiffness" value={k} min={20} max={400} onChange={setK} />
        <Range label="阻尼 damping" value={c} min={1} max={40} onChange={setC} />
        <Range label="质量 mass" value={m} min={0.3} max={3} step={0.1} onChange={setM} fmt={(v) => v.toFixed(1)} />
        <div className="rounded-lg border border-line bg-bg p-3 text-xs"><div className="flex justify-between"><span className="text-mute">阻尼比 ζ</span><span className="font-mono">{zeta.toFixed(2)}</span></div><div className="mt-1 text-mute">{zeta < 0.95 ? "欠阻尼 · 会回弹" : zeta < 1.05 ? "临界阻尼" : "过阻尼 · 缓慢逼近"}</div></div>
      </div>
      <div className="space-y-4">
        <svg viewBox="0 0 400 160" className="w-full rounded-xl border border-line bg-bg"><line x1="0" x2="400" y1="50" y2="50" stroke="var(--line2)" strokeDasharray="3 3" /><line x1="0" x2="400" y1="130" y2="130" stroke="var(--line)" /><path d={path} fill="none" stroke="var(--fg)" strokeWidth="2" /></svg>
        <div className="relative h-12 rounded-full bg-soft2 px-1"><div ref={ball} className="absolute left-1 top-1 h-10 w-10 rounded-full bg-inv" /></div>
        <div className="flex items-center gap-3"><Btn variant="outline" size="sm" onClick={play}><Play size={13} />播放</Btn><span className="text-xs text-mute">会同步生成可直接使用的 CSS linear()</span></div>
        <CodeOut code={`transition: transform 1.2s ${lin};`} />
      </div>
    </div>
  );
}

/* ---------- shadow ---------- */
function ShadowGen() {
  const [n, setN] = useState(5);
  const [y, setY] = useState(32);
  const [b, setB] = useState(48);
  const [o, setO] = useState(0.18);
  const [dk, setDk] = useState(false);
  const layers = Array.from({ length: n }, (_, i) => { const r = Math.pow(2, i) / Math.pow(2, n - 1); return `0 ${+(y * r).toFixed(1)}px ${+(b * r).toFixed(1)}px rgb(0 0 0 / ${+(o / n).toFixed(3)})`; });
  const css = layers.join(",\n    ");
  const single = `0 ${y}px ${b}px rgb(0 0 0 / ${o})`;
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="space-y-5">
        <Range label="层数" value={n} min={1} max={7} onChange={setN} />
        <Range label="最大垂直偏移" value={y} min={0} max={80} onChange={setY} fmt={(v) => `${v}px`} />
        <Range label="最大模糊" value={b} min={0} max={120} onChange={setB} fmt={(v) => `${v}px`} />
        <Range label="总不透明度" value={o} min={0.02} max={0.5} step={0.01} onChange={setO} fmt={(v) => v.toFixed(2)} />
        <label className="flex items-center gap-2 text-xs text-mute"><input type="checkbox" checked={dk} onChange={(e) => setDk(e.target.checked)} />深色背景预览</label>
      </div>
      <div className="space-y-4">
        <div className={cn("grid grid-cols-2 gap-6 rounded-xl p-8", dk ? "bg-[#161616]" : "bg-soft2")}>
          {[["单层", single], ["分层", layers.join(",")]].map(([t, s]) => <div key={t} className="grid h-32 place-items-center rounded-2xl bg-white text-xs text-neutral-500" style={{ boxShadow: s }}>{t}阴影</div>)}
        </div>
        <CodeOut code={`box-shadow:\n    ${css};`} />
      </div>
    </div>
  );
}

/* ---------- contrast ---------- */
function ContrastLab() {
  const [fg, setFg] = useState(90);
  const [bg, setBg] = useState(250);
  const f = grayHex(fg), b = grayHex(bg);
  const c = contrast(f, b);
  const T = [["AA 正文", 4.5], ["AA 大字", 3], ["AAA 正文", 7], ["AAA 大字", 4.5]] as [string, number][];
  return (
    <div className="grid gap-8 md:grid-cols-[260px_1fr]">
      <div className="space-y-5">
        <Range label={`前景 ${f}`} value={fg} min={0} max={255} onChange={setFg} />
        <Range label={`背景 ${b}`} value={bg} min={0} max={255} onChange={setBg} />
        <Btn variant="outline" size="sm" onClick={() => { setFg(bg); setBg(fg); }}><ArrowLeftRight size={13} />交换</Btn>
        <div className="font-mono text-4xl font-semibold tabular-nums tracking-tight">{c.toFixed(2)}<span className="text-lg text-dim"> : 1</span></div>
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border border-line p-6 transition-colors" style={{ background: b, color: f }}>
          <div className="text-3xl font-semibold tracking-tight">大标题 Large Text</div>
          <p className="mt-2 text-[14px]">正文示例：对比度不足会让低视力用户、强光下的用户读不清。</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {T.map(([t, th]) => { const ok = c >= th; return <div key={t} className={cn("rounded-lg border p-3 text-xs", ok ? "border-fg" : "border-line2 text-dim")}><div className="flex items-center justify-between">{t}{ok ? <Check size={13} /> : <span className="font-mono">×</span>}</div><div className="mt-1 font-mono text-[11px] text-mute">≥ {th}</div></div>; })}
        </div>
      </div>
    </div>
  );
}

/* ---------- ramp ---------- */
function Ramp() {
  const [n, setN] = useState(11);
  const [gamma, setGamma] = useState(1);
  const [lo, setLo] = useState(4);
  const [hi, setHi] = useState(98);
  const steps = Array.from({ length: n }, (_, i) => { const t = Math.pow(i / (n - 1), gamma); return grayHex(((hi - (hi - lo) * t) / 100) * 255); });
  const [done, copy] = useCopy();
  const css = `:root {\n${steps.map((h, i) => `  --gray-${i === 0 ? 50 : i === n - 1 ? 950 : i * 100}: ${h};`).join("\n")}\n}`;
  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-4">
        <Range label="级数" value={n} min={5} max={16} onChange={setN} />
        <Range label="曲线 gamma" value={gamma} min={0.6} max={1.8} step={0.05} onChange={setGamma} fmt={(v) => v.toFixed(2)} />
        <Range label="最深 L" value={lo} min={0} max={30} onChange={setLo} fmt={(v) => v + "%"} />
        <Range label="最浅 L" value={hi} min={70} max={100} onChange={setHi} fmt={(v) => v + "%"} />
      </div>
      <div className="flex h-24 overflow-hidden rounded-xl border border-line2">{steps.map((h, i) => <button key={i} onClick={() => copy(h)} title={h} className="group relative flex-1 transition-[flex-grow] duration-300 hover:grow-[2]" style={{ background: h }}><span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[9px] opacity-0 transition-opacity group-hover:opacity-100" style={{ color: i < n / 2 ? "#000" : "#fff" }}>{h.slice(1, 3)}</span></button>)}</div>
      <div className="relative"><pre className="max-h-48 overflow-auto rounded-lg border border-line bg-bg p-3 text-[12px] text-mute">{css}</pre><button onClick={() => copy(css)} className="absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-md border border-line2 bg-bg px-2 text-xs text-mute hover:text-fg">{done ? <Check size={12} /> : <Copy size={12} />}{done ? "已复制" : "复制"}</button></div>
    </div>
  );
}

/* ---------- blob ---------- */
function Blob() {
  const [v, setV] = useState([60, 40, 60, 40, 40, 60, 40, 60]);
  const [auto, setAuto] = useState(true);
  useEffect(() => { if (!auto) return; const t = setInterval(() => setV(Array.from({ length: 8 }, () => 30 + Math.round(Math.random() * 40))), 2200); return () => clearInterval(t); }, [auto]);
  const r = `${v.slice(0, 4).map((x) => x + "%").join(" ")} / ${v.slice(4).map((x) => x + "%").join(" ")}`;
  const names = ["左上 H", "右上 H", "右下 H", "左下 H", "左上 V", "右上 V", "右下 V", "左下 V"];
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_260px]">
      <div className="grid place-items-center rounded-xl border border-line bg-bg py-8"><div className="h-52 w-52 bg-inv" style={{ borderRadius: r, transition: "border-radius 2s cubic-bezier(.4,0,.2,1)" }} /></div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">{v.map((x, i) => <Range key={i} label={names[i]} value={x} min={10} max={90} onChange={(n) => { setAuto(false); setV(v.map((y, j) => (j === i ? n : y))); }} fmt={(z) => z + "%"} />)}</div>
        <div className="flex gap-2"><Btn variant="outline" size="sm" onClick={() => setAuto(!auto)}>{auto ? "停止" : "自动变形"}</Btn><Btn variant="outline" size="sm" onClick={() => { setAuto(false); setV(Array.from({ length: 8 }, () => 30 + Math.round(Math.random() * 40))); }}><Shuffle size={13} />随机</Btn></div>
        <CodeOut code={`border-radius: ${r};`} />
      </div>
    </div>
  );
}

/* ---------- clip ---------- */
const SHAPES: [string, string][] = [
  ["方形", "0 0,50 0,100 0,100 50,100 100,50 100,0 100,0 50"], ["菱形", "50 0,75 25,100 50,75 75,50 100,25 75,0 50,25 25"], ["三角", "50 0,75 50,100 100,75 100,50 100,25 100,0 100,25 50"],
  ["八边", "30 0,70 0,100 30,100 70,70 100,30 100,0 70,0 30"], ["箭头", "0 35,55 35,55 10,100 50,55 90,55 65,0 65,0 50"], ["火花", "50 0,60 40,100 50,60 60,50 100,40 60,0 50,40 40"],
];
function Clip() {
  const [i, setI] = useState(1);
  const poly = SHAPES[i][1].split(",").map((p) => p.replace(" ", "% ") + "%").join(", ");
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_220px]">
      <div className="grid place-items-center rounded-xl border border-line bg-bg py-8"><div className="h-52 w-52 bg-inv" style={{ clipPath: `polygon(${poly})`, transition: "clip-path .6s var(--ease)" }} /></div>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">{SHAPES.map(([t], k) => <button key={t} onClick={() => setI(k)} className={cn("rounded-lg border py-2 text-xs transition-colors", k === i ? "border-fg bg-inv text-invfg" : "border-line2 text-mute hover:border-fg")}>{t}</button>)}</div>
        <CodeOut code={`clip-path: polygon(${poly});`} />
        <p className="text-xs text-mute">过渡要求 polygon 顶点数一致，所以所有形状都用 8 个点描述。</p>
      </div>
    </div>
  );
}

/* ---------- grid gen ---------- */
function GridGen() {
  const [cols, setCols] = useState(4);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(10);
  const [mode, setMode] = useState("fixed");
  const tpl = mode === "fixed" ? `repeat(${cols}, 1fr)` : "repeat(auto-fill, minmax(120px, 1fr))";
  const count = mode === "fixed" ? cols * rows : 12;
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="space-y-5">
        <Seg value={mode} onChange={setMode} options={[{ value: "fixed", label: "固定列" }, { value: "auto", label: "自适应" }]} />
        {mode === "fixed" && <><Range label="列" value={cols} min={1} max={8} onChange={setCols} /><Range label="行" value={rows} min={1} max={6} onChange={setRows} /></>}
        <Range label="间距" value={gap} min={0} max={32} onChange={setGap} fmt={(v) => v + "px"} />
      </div>
      <div className="space-y-4">
        <div className="grid rounded-xl border border-line bg-bg p-3" style={{ gridTemplateColumns: tpl, gap }}>
          {Array.from({ length: count }).map((_, i) => <div key={i} className={cn("grid h-14 place-items-center rounded-md font-mono text-xs", i === 0 ? "bg-inv text-invfg" : "bg-soft2 text-mute")} style={i === 0 && mode === "auto" ? { gridColumn: "span 2" } : undefined}>{i + 1}</div>)}
        </div>
        <CodeOut code={`display: grid;\ngrid-template-columns: ${tpl};\ngap: ${gap}px;`} />
      </div>
    </div>
  );
}

/* ---------- filters ---------- */
function Filters() {
  const [f, setF] = useState({ blur: 0, brightness: 100, contrast: 100, invert: 0, opacity: 100 });
  const css = `blur(${f.blur}px) brightness(${f.brightness}%) contrast(${f.contrast}%) invert(${f.invert}%) opacity(${f.opacity}%)`;
  const set = (k: keyof typeof f) => (v: number) => setF({ ...f, [k]: v });
  const P: [string, typeof f][] = [["原图", { blur: 0, brightness: 100, contrast: 100, invert: 0, opacity: 100 }], ["高反差", { blur: 0, brightness: 105, contrast: 190, invert: 0, opacity: 100 }], ["柔焦", { blur: 3, brightness: 110, contrast: 85, invert: 0, opacity: 100 }], ["底片", { blur: 0, brightness: 100, contrast: 100, invert: 100, opacity: 100 }]];
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_240px]">
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <svg viewBox="0 0 400 240" className="block w-full" style={{ filter: css, transition: "filter .2s" }}><rect width="400" height="240" fill="#f2f2f2" /><circle cx="130" cy="120" r="80" fill="#0a0a0a" /><circle cx="130" cy="120" r="50" fill="#f2f2f2" /><rect x="220" y="40" width="130" height="160" fill="#777" /><rect x="240" y="60" width="90" height="120" fill="none" stroke="#fff" strokeWidth="2" />{Array.from({ length: 8 }).map((_, k) => <line key={k} x1="220" x2="350" y1={50 + k * 20} y2={50 + k * 20} stroke="#0a0a0a" strokeWidth="1" />)}</svg>
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">{P.map(([t, v]) => <button key={t} onClick={() => setF(v)} className="rounded-full border border-line2 px-3 py-1 text-xs text-mute hover:border-fg hover:text-fg">{t}</button>)}</div>
        <Range label="模糊" value={f.blur} min={0} max={10} step={0.5} onChange={set("blur")} fmt={(v) => v + "px"} />
        <Range label="亮度" value={f.brightness} min={0} max={200} onChange={set("brightness")} fmt={(v) => v + "%"} />
        <Range label="对比度" value={f.contrast} min={0} max={250} onChange={set("contrast")} fmt={(v) => v + "%"} />
        <Range label="反相" value={f.invert} min={0} max={100} onChange={set("invert")} fmt={(v) => v + "%"} />
        <Range label="不透明度" value={f.opacity} min={10} max={100} onChange={set("opacity")} fmt={(v) => v + "%"} />
      </div>
    </div>
  );
}

const _u = [Caption, hexToRgb];
void _u;

export const lab: Section[] = [
  {
    id: "lab", group: "lab", title: "设计实验室", en: "Design Lab",
    desc: "不止是看，还要“调”。九个可交互的设计工具：拖动手柄、拉动滑块，实时得到可复制的 CSS。",
    blocks: [
      { id: "lab-ease", title: "缓动曲线编辑器", desc: "拖动两个控制点设计自己的 cubic-bezier，实时预览并复制。", render: () => <EaseEditor /> },
      { id: "lab-spring", title: "弹簧物理", desc: "调节刚度、阻尼、质量，实时绘制位移曲线，并烘焙为 CSS linear()。", tips: ["a = (−k(x−1) − c·v) / m，半隐式欧拉积分。", "阻尼比 ζ = c / 2√(km)：<1 回弹，≥1 不回弹。"], render: () => <Spring /> },
      { id: "lab-shadow", title: "分层阴影生成器", desc: "单层阴影看起来“脏”。叠 4–6 层、距离与模糊指数增长的阴影，才有真实的柔和感。", render: () => <ShadowGen /> },
      { id: "lab-contrast", title: "对比度检测器", desc: "按 WCAG 2.1 公式计算对比度，并给出 AA / AAA 达标情况。", render: () => <ContrastLab /> },
      { id: "lab-ramp", title: "灰阶生成器", desc: "设定级数、曲线与明度范围，一键导出 CSS 变量。", render: () => <Ramp /> },
      { id: "lab-blob", title: "Blob 圆角编辑器", desc: "border-radius 支持水平 / 垂直各四个值：8 个滑块就能捏出有机形状。", render: () => <Blob /> },
      { id: "lab-clip", title: "clip-path 形状库", desc: "六种形状，点击切换，切换时平滑过渡。", render: () => <Clip /> },
      { id: "lab-grid", title: "Grid 布局生成器", desc: "调列数、行数、间距；或切换为 auto-fill + minmax 的自适应模式。", render: () => <GridGen /> },
      { id: "lab-filter", title: "CSS 滤镜实验", desc: "多种 filter 叠加，附带预设。", tips: ["filter 的书写顺序会影响结果。"], render: () => <Filters /> },
    ],
  },
];
