import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Star, Heart, Moon, Sun, Zap, Cloud, Check, X, Trash2, Shuffle, Gamepad2, ArrowRight } from "lucide-react";
import type { Section } from "@/types";
import { Btn, Seg, Range, Kbd, Caption, useLoop } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useInView, useLocal, cssVar, clamp } from "@/lib/hooks";

const Stat = ({ k, v }: { k: string; v: React.ReactNode }) => <div className="text-center"><div className="label">{k}</div><div className="font-mono text-xl tabular-nums">{v}</div></div>;

/* ---------- snake ---------- */
function Snake() {
  const N = 18, S = 20;
  const cv = useRef<HTMLCanvasElement>(null);
  const g = useRef({ snake: [[9, 9], [8, 9], [7, 9]] as number[][], dir: [1, 0], q: [] as number[][], food: [13, 9], acc: 0 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useLocal("hb-snake", 0);
  const [st, setSt] = useState<"idle" | "run" | "pause" | "over">("idle");
  const [ref, vis] = useInView<HTMLDivElement>();
  const draw = () => {
    const c = cv.current!, ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, N * S, N * S);
    ctx.strokeStyle = cssVar("--line"); ctx.lineWidth = 1;
    for (let i = 1; i < N; i++) { ctx.beginPath(); ctx.moveTo(i * S, 0); ctx.lineTo(i * S, N * S); ctx.moveTo(0, i * S); ctx.lineTo(N * S, i * S); ctx.stroke(); }
    ctx.strokeStyle = cssVar("--fg"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(g.current.food[0] * S + S / 2, g.current.food[1] * S + S / 2, S / 3, 0, 7); ctx.stroke();
    ctx.fillStyle = cssVar("--fg");
    g.current.snake.forEach(([x, y], i) => { ctx.globalAlpha = i === 0 ? 1 : Math.max(0.35, 1 - i * 0.03); ctx.beginPath(); ctx.roundRect(x * S + 1.5, y * S + 1.5, S - 3, S - 3, i === 0 ? 6 : 4); ctx.fill(); });
    ctx.globalAlpha = 1;
  };
  const reset = () => { g.current = { snake: [[9, 9], [8, 9], [7, 9]], dir: [1, 0], q: [], food: [13, 9], acc: 0 }; setScore(0); draw(); };
  useEffect(draw, []);
  const turn = (dx: number, dy: number) => { const q = g.current.q; const last = q.length ? q[q.length - 1] : g.current.dir; if (last[0] === -dx && last[1] === -dy) return; if (last[0] === dx && last[1] === dy) return; if (q.length < 3) q.push([dx, dy]); };
  const start = () => { if (st === "over" || st === "idle") reset(); setSt("run"); wrap.current?.focus(); };
  const step = () => {
    const s = g.current; if (s.q.length) s.dir = s.q.shift()!;
    const h = [s.snake[0][0] + s.dir[0], s.snake[0][1] + s.dir[1]];
    if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || s.snake.some(([x, y]) => x === h[0] && y === h[1])) { setSt("over"); setBest((b) => Math.max(b, s.snake.length - 3)); return; }
    s.snake.unshift(h);
    if (h[0] === s.food[0] && h[1] === s.food[1]) { setScore(s.snake.length - 3); do { s.food = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; } while (s.snake.some(([x, y]) => x === s.food[0] && y === s.food[1])); } else s.snake.pop();
  };
  useLoop((_, dt) => { const s = g.current; s.acc += dt; const iv = Math.max(70, 150 - 4 * (s.snake.length - 3)); while (s.acc > iv) { s.acc -= iv; step(); } draw(); }, vis && st === "run");
  const wrap = useRef<HTMLDivElement>(null);
  const ts = useRef<[number, number] | null>(null);
  return (
    <div ref={ref} className="flex flex-col items-center gap-5">
      <div ref={wrap} tabIndex={0} className="relative touch-none rounded-xl border border-line2 bg-bg outline-none focus-visible:ring-2 focus-visible:ring-fg"
        onKeyDown={(e) => { const m: Record<string, number[]> = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] }; if (m[e.key]) { e.preventDefault(); if (st === "run") turn(m[e.key][0], m[e.key][1]); else if (st === "idle") start(); } if (e.key === " ") { e.preventDefault(); st === "run" ? setSt("pause") : start(); } }}
        onPointerDown={(e) => (ts.current = [e.clientX, e.clientY])} onPointerUp={(e) => { if (!ts.current) return; const dx = e.clientX - ts.current[0], dy = e.clientY - ts.current[1]; if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) Math.abs(dx) > Math.abs(dy) ? turn(Math.sign(dx), 0) : turn(0, Math.sign(dy)); ts.current = null; }}>
        <canvas ref={cv} width={N * S} height={N * S} className="block rounded-xl" style={{ width: N * S, height: N * S }} />
        {st !== "run" && <div className="glass absolute inset-0 grid place-items-center rounded-xl"><div className="text-center"><div className="text-lg font-semibold">{st === "over" ? "游戏结束" : st === "pause" ? "已暂停" : "贪吃蛇"}</div>{st === "over" && <div className="mt-1 text-sm text-mute">得分 {score}</div>}<Btn className="mt-4" onClick={start}><Play size={14} />{st === "pause" ? "继续" : st === "over" ? "再来一局" : "开始"}</Btn></div></div>}
      </div>
      <div className="flex gap-10"><Stat k="得分" v={score} /><Stat k="最高" v={best} /></div>
      <div className="text-xs text-mute">方向键 / WASD · 空格暂停 · 触屏可滑动</div>
    </div>
  );
}

/* ---------- life ---------- */
function Life() {
  const W = 44, H = 22, S = 12;
  const cv = useRef<HTMLCanvasElement>(null);
  const grid = useRef(new Uint8Array(W * H));
  const [gen, setGen] = useState(0);
  const [run, setRun] = useState(true);
  const [spd, setSpd] = useState(8);
  const acc = useRef(0);
  const [ref, vis] = useInView<HTMLDivElement>();
  const paint = useRef<number | null>(null);
  const seedGlider = () => { grid.current.fill(0); [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2], [20, 8], [21, 8], [22, 8], [21, 9], [22, 7]].forEach(([x, y]) => (grid.current[(y + 4) * W + x + 4] = 1)); setGen(0); };
  const draw = () => {
    const c = cv.current!, ctx = c.getContext("2d")!; ctx.clearRect(0, 0, W * S, H * S);
    ctx.fillStyle = cssVar("--line");
    for (let x = 0; x <= W; x++) ctx.fillRect(x * S, 0, 1, H * S); for (let y = 0; y <= H; y++) ctx.fillRect(0, y * S, W * S, 1);
    ctx.fillStyle = cssVar("--fg");
    for (let i = 0; i < W * H; i++) if (grid.current[i]) ctx.fillRect((i % W) * S + 2, Math.floor(i / W) * S + 2, S - 3, S - 3);
  };
  const step = () => { const g = grid.current, n = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { let c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) c += g[((y + dy + H) % H) * W + ((x + dx + W) % W)]; const a = g[y * W + x]; n[y * W + x] = c === 3 || (a && c === 2) ? 1 : 0; } grid.current = n; setGen((x) => x + 1); };
  useEffect(() => { seedGlider(); draw(); }, []);
  useLoop((_, dt) => { if (run) { acc.current += dt; const iv = 1000 / spd; while (acc.current > iv) { acc.current -= iv; step(); } } draw(); }, vis);
  const at = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); const x = Math.floor(((e.clientX - r.left) / r.width) * W), y = Math.floor(((e.clientY - r.top) / r.height) * H); return clamp(y, 0, H - 1) * W + clamp(x, 0, W - 1); };
  return (
    <div ref={ref} className="space-y-4">
      <div className="overflow-x-auto"><canvas ref={cv} width={W * S} height={H * S} className="mx-auto block touch-none cursor-crosshair rounded-xl border border-line2 bg-bg" style={{ width: W * S, height: H * S }}
        onPointerDown={(e) => { const i = at(e); paint.current = grid.current[i] ? 0 : 1; grid.current[i] = paint.current; (e.target as HTMLElement).setPointerCapture(e.pointerId); }} onPointerMove={(e) => { if (paint.current != null) grid.current[at(e)] = paint.current; }} onPointerUp={() => (paint.current = null)} /></div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Btn variant="outline" size="sm" onClick={() => setRun(!run)}>{run ? <><Pause size={13} />暂停</> : <><Play size={13} />继续</>}</Btn>
        <Btn variant="outline" size="sm" onClick={() => { grid.current = Uint8Array.from({ length: W * H }, () => (Math.random() < 0.28 ? 1 : 0)); setGen(0); }}><Shuffle size={13} />随机</Btn>
        <Btn variant="outline" size="sm" onClick={() => { grid.current.fill(0); setGen(0); }}><Trash2 size={13} />清空</Btn>
        <Btn variant="outline" size="sm" onClick={seedGlider}><RotateCcw size={13} />滑翔机</Btn>
        <Range className="w-36" label="速度" value={spd} min={1} max={30} onChange={setSpd} fmt={(v) => v + "/s"} />
        <span className="font-mono text-xs text-mute">第 {gen} 代</span>
      </div>
    </div>
  );
}

/* ---------- memory ---------- */
const MI = [Star, Heart, Moon, Sun, Zap, Cloud];
function Memory() {
  const mk = () => [...MI.keys(), ...MI.keys()].sort(() => Math.random() - 0.5);
  const [cards, setCards] = useState(mk);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const click = (i: number) => {
    if (open.length === 2 || open.includes(i) || done.includes(i)) return;
    const o = [...open, i]; setOpen(o);
    if (o.length === 2) { setMoves((m) => m + 1); if (cards[o[0]] === cards[o[1]]) setTimeout(() => { setDone((d) => [...d, ...o]); setOpen([]); }, 450); else setTimeout(() => setOpen([]), 900); }
  };
  const win = done.length === cards.length;
  return (
    <div className="mx-auto max-w-sm">
      <div className="grid grid-cols-4 gap-2.5">
        {cards.map((c, i) => { const I = MI[c]; const on = open.includes(i) || done.includes(i); return (
          <button key={i} onClick={() => click(i)} aria-label={on ? "已翻开" : "未翻开的牌"} className="aspect-square [perspective:600px]">
            <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]" style={{ transform: on ? "rotateY(180deg)" : "none" }}>
              <div className="absolute inset-0 grid place-items-center rounded-xl border border-line2 bg-soft2 [backface-visibility:hidden]"><span className="h-1.5 w-1.5 rounded-full bg-dim" /></div>
              <div className={cn("absolute inset-0 grid place-items-center rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]", done.includes(i) ? "bg-inv text-invfg" : "border border-fg bg-bg")}><I size={24} /></div>
            </div>
          </button>); })}
      </div>
      <div className="mt-5 flex items-center justify-between text-sm"><span className="text-mute">步数 <span className="font-mono text-fg">{moves}</span> · 已配对 <span className="font-mono text-fg">{done.length / 2}/6</span></span><Btn variant="outline" size="sm" onClick={() => { setCards(mk()); setOpen([]); setDone([]); setMoves(0); }}><Shuffle size={13} />重洗</Btn></div>
      {win && <div className="anim-fade-up mt-4 rounded-xl bg-inv p-3 text-center text-sm text-invfg">完成！共用 {moves} 步</div>}
    </div>
  );
}

/* ---------- reaction ---------- */
function Reaction() {
  const [s, setS] = useState<"idle" | "wait" | "go" | "early" | "res">("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useLocal("hb-react", 0);
  const t0 = useRef(0), to = useRef<number>(0);
  const click = () => {
    if (s === "idle" || s === "early" || s === "res") { setS("wait"); to.current = window.setTimeout(() => { t0.current = performance.now(); setS("go"); }, 1200 + Math.random() * 2800); }
    else if (s === "wait") { clearTimeout(to.current); setS("early"); }
    else { const d = Math.round(performance.now() - t0.current); setMs(d); setBest(best ? Math.min(best, d) : d); setS("res"); }
  };
  useEffect(() => () => clearTimeout(to.current), []);
  const T = { idle: ["点击开始", "看到亮起立即点击"], wait: ["等待亮起…", "别急"], go: ["现在！", "点！"], early: ["太早了", "点击再来一次"], res: [`${ms} ms`, "点击再来一次"] }[s];
  return (
    <div className="mx-auto max-w-md">
      <button onClick={click} className={cn("grid h-48 w-full select-none place-items-center rounded-2xl border transition-colors duration-150", s === "go" ? "border-fg bg-inv text-invfg" : s === "wait" ? "border-line2 bg-soft2" : "border-line2 bg-bg hover:bg-soft")}>
        <div className="text-center"><div className="text-4xl font-semibold tracking-tight tabular-nums">{T[0]}</div><div className="mt-1 text-sm opacity-60">{T[1]}</div></div>
      </button>
      <div className="mt-4 flex justify-center gap-10"><Stat k="最佳" v={best ? best + " ms" : "—"} /><Stat k="人类平均" v="≈250 ms" /></div>
    </div>
  );
}

/* ---------- gray challenge ---------- */
function GrayChallenge() {
  const [lv, setLv] = useState(1);
  const [best, setBest] = useLocal("hb-gray", 0);
  const [over, setOver] = useState(false);
  const [seed, setSeed] = useState(0);
  const n = Math.min(8, 2 + Math.floor((lv + 1) / 2));
  const d = Math.max(2.2, 16 - 1.1 * lv);
  const base = 40 + ((seed * 37) % 30);
  const odd = (seed * 7919) % (n * n);
  const pick = (i: number) => { if (over) return; if (i === odd) { setLv(lv + 1); setSeed(seed + 1 + lv); } else { setOver(true); setBest(Math.max(best, lv - 1)); } };
  return (
    <div className="mx-auto max-w-xs">
      <div className="mb-4 flex items-center justify-between text-sm"><span className="text-mute">关卡 <span className="font-mono text-fg">{lv}</span></span><span className="text-mute">最佳 <span className="font-mono text-fg">{best}</span></span></div>
      <div className={cn("grid gap-1.5", over && "opacity-50")} style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {Array.from({ length: n * n }).map((_, i) => <button key={i} aria-label="色块" onClick={() => pick(i)} className="aspect-square rounded-md transition-transform hover:scale-95" style={{ background: `hsl(0 0% ${i === odd ? base + d : base}%)`, outline: over && i === odd ? "2px solid var(--fg)" : undefined, outlineOffset: 2 }} />)}
      </div>
      {over ? <div className="mt-4 text-center"><div className="mb-2 text-sm">点错了！到达第 {lv} 关</div><Btn onClick={() => { setLv(1); setOver(false); setSeed(0); }}>重新开始</Btn></div> : <p className="mt-4 text-center text-xs text-mute">找出明度略有不同的那一块。差距会越来越小。</p>}
    </div>
  );
}

/* ---------- quiz ---------- */
const BANK: [string, string[], number, string][] = [
  ["正文文字与背景的 WCAG AA 最低对比度是？", ["3:1", "4.5:1", "7:1", "2:1"], 1, "AA 正文 ≥ 4.5:1，大字 ≥ 3:1，AAA 正文 ≥ 7:1。"],
  ["移动端可点击元素的推荐最小尺寸？", ["24px", "32px", "44px", "20px"], 2, "Apple HIG 推荐 44pt，Material 推荐 48dp。"],
  ["做高度从 0 到 auto 的动画，现代做法是？", ["JS 测量 scrollHeight", "grid-rows 0fr→1fr", "max-height: 9999px", "display 过渡"], 1, "grid-template-rows 在 0fr 与 1fr 之间过渡，可对 auto 高度做动画，无需 JS。"],
  ["哪两个 CSS 属性做动画性能最好？", ["width / height", "top / left", "transform / opacity", "margin / padding"], 2, "它们由合成器处理，不触发布局与绘制。"],
  ["键盘焦点环应该使用哪个伪类？", [":focus", ":focus-visible", ":active", ":hover"], 1, ":focus-visible 只在键盘导航时显示焦点环。"],
  ["嵌套圆角的正确关系是？", ["内 = 外", "内 = 外 − 内边距", "内 = 外 + 内边距", "内 = 外 × 2"], 1, "内圆角 = 外圆角 − 内边距，视觉上才同心。"],
  ["prefers-reduced-motion 的目的是？", ["省电", "照顾对动效敏感的用户", "加快加载", "兼容旧浏览器"], 1, "前庭障碍用户可能因动效感到眩晕或不适。"],
  ["设计令牌（Design Token）主要解决什么？", ["打包体积", "设计决策的统一与复用", "网络请求", "图片压缩"], 1, "把颜色、间距、字体等决策抽象为变量。"],
];
function Quiz() {
  const mk = () => [...BANK].sort(() => Math.random() - 0.5).slice(0, 6);
  const [qs, setQs] = useState(mk);
  const [i, setI] = useState(0);
  const [sel, setSel] = useState(-1);
  const [score, setScore] = useState(0);
  const fin = i >= qs.length;
  if (fin) return <div className="mx-auto max-w-sm py-6 text-center"><div className="font-mono text-6xl font-semibold tabular-nums">{score}<span className="text-2xl text-dim">/{qs.length}</span></div><div className="mt-3 text-[14px] text-mute">{score === qs.length ? "满分！你是 UI 大师" : score >= 4 ? "很不错，继续保持" : "再翻翻手册，多练练"}</div><Btn className="mt-5" onClick={() => { setQs(mk()); setI(0); setSel(-1); setScore(0); }}>再测一次</Btn></div>;
  const [q, o, a, why] = qs[i];
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-5 flex items-center gap-3"><div className="h-0.5 flex-1 rounded bg-line2"><div className="h-0.5 rounded bg-fg transition-all duration-500" style={{ width: (i / qs.length) * 100 + "%" }} /></div><span className="font-mono text-xs text-mute">{i + 1}/{qs.length}</span></div>
      <h4 className="text-lg font-semibold tracking-tight">{q}</h4>
      <div className="mt-5 space-y-2">
        {o.map((t, k) => { const done = sel >= 0; const right = k === a; return (
          <button key={t} disabled={done} onClick={() => { setSel(k); if (k === a) setScore(score + 1); }} className={cn("flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-[14px] transition-all disabled:cursor-default", !done && "border-line2 hover:border-fg", done && right && "border-fg bg-soft2", done && sel === k && !right && "anim-shake border-dashed border-fg/50 text-dim line-through", done && !right && sel !== k && "border-line text-dim")}>
            {t}{done && right && <Check size={15} />}{done && sel === k && !right && <X size={15} />}
          </button>); })}
      </div>
      {sel >= 0 && <div className="anim-fade-up mt-4 rounded-xl bg-soft2 p-4 text-[13px] text-mute" style={{ animationDuration: ".3s" }}><span className="font-medium text-fg">{sel === a ? "回答正确。" : "回答错误。"}</span> {why}<div className="mt-3"><Btn size="sm" onClick={() => { setI(i + 1); setSel(-1); }}>{i + 1 === qs.length ? "查看结果" : "下一题"}<ArrowRight size={13} /></Btn></div></div>}
    </div>
  );
}

/* ---------- konami ---------- */
const SEQ = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
function Konami() {
  const [n, setN] = useState(0);
  const [on, setOn] = useState(false);
  const idx = useRef(0);
  const fire = () => { window.dispatchEvent(new Event("hb:egg")); setOn((x) => !x); };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName)) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === SEQ[idx.current]) { idx.current++; setN(idx.current); if (idx.current === SEQ.length) { idx.current = 0; setTimeout(() => setN(0), 800); fire(); } } else { idx.current = k === SEQ[0] ? 1 : 0; setN(idx.current); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const label = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"];
  return (
    <div className="text-center">
      <div className="mb-6 flex flex-wrap justify-center gap-2">{label.map((l, i) => <span key={i} className={cn("kbd !h-10 !min-w-10 !text-sm transition-all duration-200", i < n && "!border-fg !bg-inv !text-invfg")}>{l}</span>)}</div>
      <p className="text-[13px] text-mute">在页面任意位置依次按下经典秘籍。全站已开启监听，成功后切换反色主题。</p>
      <Btn className="mt-5" variant="outline" size="sm" onClick={fire}><Gamepad2 size={14} />{on ? "关闭彩蛋" : "直接触发彩蛋"}</Btn>
    </div>
  );
}

const _u = [Seg, Kbd, Caption];
void _u;

export const games: Section[] = [
  {
    id: "games", group: "games", title: "游戏与彩蛋", en: "Games",
    desc: "学累了？玩一会儿。每个小游戏都是一个交互知识点的缩影：键盘事件、Canvas、状态机、3D 翻转。",
    blocks: [
      { id: "gm-snake", title: "贪吃蛇", desc: "网格 + 定时器 + 方向队列。方向键 / WASD 控制，触屏可滑动。", tips: ["用队列缓存方向，避免一个 tick 内连按造成掉头自杀。", "速度随分数递增：interval = max(70, 150 − 4 × score)。", "容器 tabIndex=0，只在聚焦时拦截方向键。"], render: () => <Snake /> },
      { id: "gm-life", title: "生命游戏", desc: "三条简单规则涌现出复杂世界。点击或拖动绘制细胞。", tips: ["环形边界：(x + dx + W) % W。", "Uint8Array 存储，比对象数组快一个数量级。"], render: () => <Life /> },
      { id: "gm-memory", title: "记忆翻牌", desc: "3D 翻牌 + 配对判定。锁定第三张牌，直到前两张结算。", render: () => <Memory /> },
      { id: "gm-react", title: "反应速度", desc: "等待亮起后点击，测量毫秒级反应时间。提前点击算犯规。", tips: ["performance.now() 精度高于 Date.now()。"], render: () => <Reaction /> },
      { id: "gm-gray", title: "灰度挑战", desc: "N×N 色块里藏着一块明度略有不同的。关卡越高，差距越小。设计师的“眼力”测试。", render: () => <GrayChallenge /> },
      { id: "gm-quiz", title: "UI 小测验", desc: "从题库随机抽 6 题检验学习成果，答完即时讲解。", render: () => <Quiz /> },
      { id: "gm-konami", title: "Konami 彩蛋", desc: "↑↑↓↓←→←→BA —— 1986 年的经典秘籍。成功后全站反色。", render: () => <Konami /> },
    ],
  },
];
void Star; void Heart;
