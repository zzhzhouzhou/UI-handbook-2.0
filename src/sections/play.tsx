import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Gamepad2, Pause, Play as PlayIcon, RotateCcw, Download, Eraser, PaintBucket, Pencil, Trash2, Shuffle } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Range, Seg } from "../components/ui";
import { cn } from "../utils/cn";
import { clamp, useInterval, useLocalStorage, useVisible } from "../lib/hooks";
import { confetti } from "../lib/confetti";

/* ---------- 贪吃蛇 ---------- */
type P = { x: number; y: number };
const N = 16;
const rndFood = (s: P[]): P => { for (;;) { const f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; if (!s.some((p) => p.x === f.x && p.y === f.y)) return f; } };
const snakeInit = () => { const s = [{ x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 }]; return { s, food: rndFood(s), dead: false, score: 0 }; };
function SnakeDemo() {
  const [g, setG] = useState(snakeInit);
  const [run, setRun] = useState(false);
  const [best, setBest] = useLocalStorage("hb-snake", 0);
  const dir = useRef<P>({ x: 1, y: 0 });
  const queued = useRef<P>({ x: 1, y: 0 });
  const box = useRef<HTMLDivElement>(null);
  const turn = useCallback((x: number, y: number) => { if (x !== -dir.current.x || y !== -dir.current.y) queued.current = { x, y }; }, []);
  useInterval(() => {
    setG((p) => {
      if (p.dead) return p;
      dir.current = queued.current;
      const h = { x: p.s[0].x + dir.current.x, y: p.s[0].y + dir.current.y };
      if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || p.s.slice(0, -1).some((q) => q.x === h.x && q.y === h.y)) { setRun(false); setBest((b) => Math.max(b, p.score)); return { ...p, dead: true }; }
      const eat = h.x === p.food.x && h.y === p.food.y;
      const s = [h, ...p.s]; if (!eat) s.pop();
      return { s, food: eat ? rndFood(s) : p.food, dead: false, score: p.score + (eat ? 1 : 0) };
    });
  }, run ? Math.max(70, 150 - g.score * 4) : null);
  const start = () => { if (g.dead) { setG(snakeInit()); dir.current = { x: 1, y: 0 }; queued.current = { x: 1, y: 0 }; } setRun(true); box.current?.focus(); };
  const key = (e: React.KeyboardEvent) => { const m: Record<string, [number, number]> = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] }; const v = m[e.key]; if (v) { e.preventDefault(); turn(...v); if (!run && !g.dead) setRun(true); } if (e.key === " ") { e.preventDefault(); run ? setRun(false) : start(); } };
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div ref={box} tabIndex={0} onKeyDown={key} className="relative outline-none focus-visible:ring-2 focus-visible:ring-accent">
        <div className="grid overflow-hidden rounded-xl border-2 border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900" style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, width: 288, height: 288 }}>
          {Array.from({ length: N * N }, (_, i) => { const x = i % N, y = Math.floor(i / N); const idx = g.s.findIndex((p) => p.x === x && p.y === y); const food = g.food.x === x && g.food.y === y; return <div key={i} className={cn("m-px rounded-[3px]", idx === 0 ? "bg-accent" : idx > 0 ? "bg-accent/60" : food ? "scale-75 rounded-full bg-rose-500" : (x + y) % 2 ? "bg-zinc-200/50 dark:bg-zinc-800/50" : "")} />; })}
        </div>
        {(!run) && <div className="absolute inset-0 grid place-items-center rounded-xl bg-black/40 text-center text-white backdrop-blur-[2px]"><div><p className="text-xl font-bold">{g.dead ? "Game Over" : "贪吃蛇"}</p>{g.dead && <p className="text-sm opacity-80">得分 {g.score}</p>}<Btn variant="accent" className="mt-3" onClick={start}>{g.dead ? "再来一局" : "开始"}</Btn></div></div>}
      </div>
      <div className="space-y-4 text-sm"><div><p className="text-xs text-zinc-500">得分</p><p className="text-3xl font-bold tabular-nums">{g.score}</p></div><div><p className="text-xs text-zinc-500">最高分</p><p className="text-xl font-semibold tabular-nums">{best}</p></div>
        <div className="grid w-28 grid-cols-3 gap-1">{[["", 0, 0], ["↑", 0, -1], ["", 0, 0], ["←", -1, 0], ["↓", 0, 1], ["→", 1, 0]].map(([l, x, y], i) => l ? <button key={i} aria-label={l as string} onClick={() => { turn(x as number, y as number); if (!run) start(); }} className="grid h-9 place-items-center rounded-lg bg-zinc-100 text-lg active:bg-accent active:text-accent-fg dark:bg-zinc-800">{l}</button> : <span key={i} />)}</div>
        <p className="text-xs text-zinc-500">方向键 / WASD · 空格暂停</p></div>
    </div>
  );
}

/* ---------- 2048 ---------- */
type G4 = number[][];
const slide = (row: number[]) => { const a = row.filter(Boolean); let gain = 0; for (let i = 0; i < a.length - 1; i++) if (a[i] === a[i + 1]) { a[i] *= 2; gain += a[i]; a.splice(i + 1, 1); } while (a.length < 4) a.push(0); return { row: a, gain }; };
const addTile = (g: G4) => { const e: [number, number][] = []; g.forEach((r, i) => r.forEach((v, j) => !v && e.push([i, j]))); if (!e.length) return g; const [i, j] = e[Math.floor(Math.random() * e.length)]; const n = g.map((r) => [...r]); n[i][j] = Math.random() < 0.9 ? 2 : 4; return n; };
const newG = () => addTile(addTile(Array.from({ length: 4 }, () => Array(4).fill(0))));
const T2048: Record<number, string> = { 0: "bg-zinc-200/60 dark:bg-zinc-800/60", 2: "bg-amber-50 text-zinc-700", 4: "bg-amber-100 text-zinc-700", 8: "bg-orange-300 text-white", 16: "bg-orange-400 text-white", 32: "bg-orange-500 text-white", 64: "bg-red-500 text-white", 128: "bg-yellow-400 text-white", 256: "bg-yellow-500 text-white", 512: "bg-lime-500 text-white", 1024: "bg-emerald-500 text-white", 2048: "bg-accent text-accent-fg" };
function Game2048() {
  const [g, setG] = useState<G4>(newG);
  const [score, setScore] = useState(0);
  const touch = useRef<P | null>(null);
  const move = (dir: "l" | "r" | "u" | "d") => {
    let gain = 0;
    const rot = (m: G4) => m[0].map((_, j) => m.map((r) => r[j]));
    let m = g.map((r) => [...r]);
    if (dir === "u" || dir === "d") m = rot(m);
    m = m.map((r) => { const rr = dir === "r" || dir === "d" ? [...r].reverse() : r; const s = slide(rr); gain += s.gain; return dir === "r" || dir === "d" ? s.row.reverse() : s.row; });
    if (dir === "u" || dir === "d") m = rot(m);
    if (JSON.stringify(m) === JSON.stringify(g)) return;
    setScore((s) => s + gain); setG(addTile(m));
  };
  const over = useMemo(() => !g.some((r, i) => r.some((v, j) => !v || (j < 3 && v === r[j + 1]) || (i < 3 && v === g[i + 1][j]))), [g]);
  const key = (e: React.KeyboardEvent) => { const m: Record<string, "l" | "r" | "u" | "d"> = { ArrowLeft: "l", ArrowRight: "r", ArrowUp: "u", ArrowDown: "d" }; if (m[e.key]) { e.preventDefault(); move(m[e.key]); } };
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div tabIndex={0} onKeyDown={key} className="relative touch-none rounded-2xl bg-zinc-300 p-2 outline-none focus-visible:ring-2 focus-visible:ring-accent dark:bg-zinc-700" onPointerDown={(e) => (touch.current = { x: e.clientX, y: e.clientY })} onPointerUp={(e) => { if (!touch.current) return; const dx = e.clientX - touch.current.x, dy = e.clientY - touch.current.y; touch.current = null; if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return; move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "r" : "l") : dy > 0 ? "d" : "u"); }}>
        <div className="grid grid-cols-4 gap-2">{g.flat().map((v, i) => <div key={i} className={cn("grid h-16 w-16 place-items-center rounded-lg text-xl font-extrabold transition-colors sm:h-[72px] sm:w-[72px]", T2048[v] ?? "bg-zinc-900 text-white", v > 1000 && "text-base")}>{v ? <span key={v} className="anim-pop">{v}</span> : ""}</div>)}</div>
        {over && <div className="absolute inset-0 grid place-items-center rounded-2xl bg-black/50 text-white"><div className="text-center"><p className="text-xl font-bold">没有可移动的格子了</p></div></div>}
      </div>
      <div className="space-y-3"><div><p className="text-xs text-zinc-500">分数</p><p className="text-3xl font-bold tabular-nums">{score}</p></div><Btn variant="outline" size="sm" onClick={() => { setG(newG()); setScore(0); }}><RotateCcw className="h-4 w-4" />重开</Btn><p className="max-w-[10rem] text-xs text-zinc-500">点击棋盘后用方向键；触屏可滑动。</p></div>
    </div>
  );
}

/* ---------- 生命游戏 ---------- */
const LW = 40, LH = 22, CS = 14;
function LifeDemo() {
  const [cells, setCells] = useState<Uint8Array>(() => { const a = new Uint8Array(LW * LH); [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]].forEach(([x, y]) => (a[(y + 3) * LW + x + 4] = 1)); return a; });
  const [run, setRun] = useState(true);
  const [gen, setGen] = useState(0);
  const [speed, setSpeed] = useState(120);
  const cv = useRef<HTMLCanvasElement>(null);
  const paint = useRef<number | null>(null);
  useInterval(() => {
    setCells((c) => { const n = new Uint8Array(c.length); for (let y = 0; y < LH; y++) for (let x = 0; x < LW; x++) { let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) s += c[((y + dy + LH) % LH) * LW + ((x + dx + LW) % LW)]; n[y * LW + x] = s === 3 || (s === 2 && c[y * LW + x]) ? 1 : 0; } return n; });
    setGen((g) => g + 1);
  }, run ? speed : null);
  useEffect(() => {
    const c = cv.current!, ctx = c.getContext("2d")!; const dark = document.documentElement.classList.contains("dark");
    const h = +getComputedStyle(document.documentElement).getPropertyValue("--accent-h") || 268;
    ctx.clearRect(0, 0, c.width, c.height);
    for (let i = 0; i < cells.length; i++) { const x = i % LW, y = Math.floor(i / LW); ctx.fillStyle = cells[i] ? `hsl(${h} 85% ${dark ? 68 : 52}%)` : (x + y) % 2 ? (dark ? "#1c1c20" : "#f1f1f3") : (dark ? "#18181b" : "#f6f6f8"); ctx.fillRect(x * CS + 1, y * CS + 1, CS - 2, CS - 2); }
  }, [cells]);
  const at = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); const x = Math.floor(((e.clientX - r.left) / r.width) * LW), y = Math.floor(((e.clientY - r.top) / r.height) * LH); return clamp(y, 0, LH - 1) * LW + clamp(x, 0, LW - 1); };
  const set = (i: number, v: number) => setCells((c) => { if (c[i] === v) return c; const n = new Uint8Array(c); n[i] = v; return n; });
  return (
    <div className="space-y-3">
      <canvas ref={cv} width={LW * CS} height={LH * CS} className="w-full max-w-2xl touch-none cursor-crosshair rounded-xl border border-zinc-200 dark:border-zinc-800" onPointerDown={(e) => { const i = at(e); paint.current = cells[i] ? 0 : 1; set(i, paint.current); e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={(e) => paint.current !== null && set(at(e), paint.current)} onPointerUp={() => (paint.current = null)} />
      <div className="flex flex-wrap items-center gap-3"><Btn size="sm" variant="accent" onClick={() => setRun(!run)}>{run ? <><Pause className="h-4 w-4" />暂停</> : <><PlayIcon className="h-4 w-4" />继续</>}</Btn><Btn size="sm" variant="outline" onClick={() => { setCells(Uint8Array.from({ length: LW * LH }, () => (Math.random() < 0.25 ? 1 : 0))); setGen(0); }}><Shuffle className="h-4 w-4" />随机</Btn><Btn size="sm" variant="outline" onClick={() => { setCells(new Uint8Array(LW * LH)); setGen(0); }}>清空</Btn><div className="w-40"><Range label="间隔" value={speed} onChange={setSpeed} min={30} max={400} unit="ms" /></div><span className="text-xs text-zinc-500">第 {gen} 代 · 存活 {cells.reduce((a, b) => a + b, 0)}</span></div>
      <p className="text-xs text-zinc-500">康威生命游戏：点击或拖动绘制细胞。规则：邻居 =3 诞生，=2 维持，其余死亡。</p>
    </div>
  );
}

/* ---------- 记忆翻牌 ---------- */
function MemoryDemo() {
  const mk = () => [..."🎨🧩🚀🎧🌈🔥🍀🎲"].flatMap((e, i) => [{ id: i * 2, e }, { id: i * 2 + 1, e }]).sort(() => Math.random() - 0.5);
  const [cards, setCards] = useState(mk);
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const flip = (id: number) => {
    if (open.length === 2 || open.includes(id) || done.includes(cards.find((c) => c.id === id)!.e)) return;
    const o = [...open, id]; setOpen(o);
    if (o.length === 2) { setMoves((m) => m + 1); const [a, b] = o.map((i) => cards.find((c) => c.id === i)!); if (a.e === b.e) { setTimeout(() => { setDone((d) => { const n = [...d, a.e]; if (n.length === 8) confetti(); return n; }); setOpen([]); }, 450); } else setTimeout(() => setOpen([]), 900); }
  };
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="grid grid-cols-4 gap-2.5">{cards.map((c) => { const up = open.includes(c.id) || done.includes(c.e); return <button key={c.id} aria-label={up ? c.e : "未翻开的牌"} onClick={() => flip(c.id)} className="h-16 w-16 [perspective:600px] sm:h-[72px] sm:w-[72px]"><span className="relative block h-full w-full transition-transform duration-500 [transform-style:preserve-3d]" style={{ transform: up ? "rotateY(180deg)" : "none" }}><span className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent to-pink-500 [backface-visibility:hidden]" /><span className={cn("absolute inset-0 grid place-items-center rounded-xl border bg-white text-3xl [backface-visibility:hidden] [transform:rotateY(180deg)] dark:bg-zinc-800", done.includes(c.e) ? "border-emerald-400" : "border-zinc-200 dark:border-zinc-700")}>{c.e}</span></span></button>; })}</div>
      <div className="space-y-3"><div><p className="text-xs text-zinc-500">步数</p><p className="text-3xl font-bold tabular-nums">{moves}</p></div><p className="text-xs text-zinc-500">已配对 {done.length} / 8</p><Btn size="sm" variant="outline" onClick={() => { setCards(mk()); setOpen([]); setDone([]); setMoves(0); }}><RotateCcw className="h-4 w-4" />重洗</Btn></div>
    </div>
  );
}

/* ---------- 打字测速 ---------- */
const SENT = ["设计系统让团队用同一种语言沟通。", "好的动效应当被感受到，而不是被注意到。", "把可访问性放在第一位，所有人都能受益。", "Make it work, make it right, make it fast."];
function TypingDemo() {
  const [si, setSi] = useState(0);
  const [v, setV] = useState("");
  const [t0, setT0] = useState<number | null>(null);
  const [res, setRes] = useState<{ wpm: number; acc: number } | null>(null);
  const [best, setBest] = useLocalStorage("hb-wpm", 0);
  const text = SENT[si];
  const on = (s: string) => {
    if (res) return; if (!t0) setT0(performance.now()); setV(s);
    if (s.length >= text.length) { const min = (performance.now() - (t0 ?? performance.now())) / 60000 || 0.0001; const ok = s.split("").filter((c, i) => c === text[i]).length; const cpm = text.length / min; const wpm = Math.round(/[a-z]/i.test(text) ? (text.length / 5) / min : cpm / 2); setRes({ wpm, acc: Math.round((ok / text.length) * 100) }); setBest((b) => Math.max(b, wpm)); if (ok === text.length) confetti(window.innerWidth / 2, window.innerHeight / 2, 50); }
  };
  const reset = (n = (si + 1) % SENT.length) => { setSi(n); setV(""); setT0(null); setRes(null); };
  return (
    <div className="max-w-xl space-y-4">
      <p className="rounded-xl bg-zinc-100 p-4 text-lg leading-relaxed dark:bg-zinc-900">{text.split("").map((c, i) => <span key={i} className={cn(i < v.length ? (v[i] === c ? "text-emerald-600 dark:text-emerald-400" : "rounded bg-red-200 text-red-600 dark:bg-red-500/30") : i === v.length ? "border-b-2 border-accent" : "text-zinc-400")}>{c}</span>)}</p>
      <input autoComplete="off" value={v} disabled={!!res} onChange={(e) => on(e.target.value)} placeholder="在此输入上面的句子…" className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 dark:border-zinc-700 dark:bg-zinc-900" />
      <div className="flex items-center gap-4 text-sm">{res ? <><span className="text-2xl font-bold text-accent">{res.wpm} WPM</span><span>准确率 {res.acc}%</span></> : <span className="text-zinc-500">开始输入即计时</span>}<span className="ml-auto text-xs text-zinc-500">最佳 {best}</span><Btn size="sm" variant="outline" onClick={() => reset()}>换一句</Btn></div>
    </div>
  );
}

/* ---------- 反应测试 ---------- */
function ReactionDemo() {
  const [st, setSt] = useState<"idle" | "wait" | "go" | "early" | "done">("idle");
  const [ms, setMs] = useState(0);
  const [best, setBest] = useLocalStorage("hb-react", 0);
  const t = useRef(0); const to = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (to.current) clearTimeout(to.current); }, []);
  const click = () => {
    if (st === "idle" || st === "early" || st === "done") { setSt("wait"); to.current = setTimeout(() => { t.current = performance.now(); setSt("go"); }, 1200 + Math.random() * 2800); }
    else if (st === "wait") { if (to.current) clearTimeout(to.current); setSt("early"); }
    else { const d = Math.round(performance.now() - t.current); setMs(d); setSt("done"); setBest(best ? Math.min(best, d) : d); }
  };
  const M = { idle: ["bg-accent", "点击开始", "看到绿色立刻点击"], wait: ["bg-rose-500", "等待变绿…", "别急！"], go: ["bg-emerald-500", "点！", ""], early: ["bg-amber-500", "太早了 😅", "点击重试"], done: ["bg-accent", `${ms} ms`, "点击再来一次"] } as const;
  return (
    <div className="max-w-md space-y-2"><button onClick={click} className={cn("grid h-48 w-full select-none place-items-center rounded-2xl text-white shadow-lg transition-colors duration-100 active:scale-[0.99]", M[st][0])}><span><span className="block text-center text-4xl font-black">{M[st][1]}</span><span className="block text-center text-sm opacity-80">{M[st][2]}</span></span></button><p className="text-xs text-zinc-500">最佳成绩：{best ? best + " ms" : "—"}（人类平均约 250ms）</p></div>
  );
}

/* ---------- 像素画板 ---------- */
const PAL = ["#18181b", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#ffffff"];
function PixelDemo() {
  const S = 16;
  const [px, setPx] = useState<string[]>(() => Array(S * S).fill(""));
  const [col, setCol] = useState(PAL[7]);
  const [tool, setTool] = useState<"pen" | "erase" | "fill">("pen");
  const down = useRef(false);
  const apply = (i: number) => {
    if (tool === "fill") { const target = px[i]; if (target === col) return; const n = [...px]; const st = [i]; while (st.length) { const k = st.pop()!; if (n[k] !== target) continue; n[k] = col; const x = k % S, y = Math.floor(k / S); if (x > 0) st.push(k - 1); if (x < S - 1) st.push(k + 1); if (y > 0) st.push(k - S); if (y < S - 1) st.push(k + S); } setPx(n); return; }
    setPx((p) => { const v = tool === "erase" ? "" : col; if (p[i] === v) return p; const n = [...p]; n[i] = v; return n; });
  };
  const hit = (e: React.PointerEvent) => { const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null; const i = el?.dataset.i; if (i !== undefined) apply(+i); };
  const exp = () => { const c = document.createElement("canvas"); c.width = c.height = S * 16; const x = c.getContext("2d")!; px.forEach((p, i) => { if (p) { x.fillStyle = p; x.fillRect((i % S) * 16, Math.floor(i / S) * 16, 16, 16); } }); const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = "pixel-art.png"; a.click(); };
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="grid touch-none select-none overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700" style={{ gridTemplateColumns: `repeat(${S}, 1fr)`, width: 320, height: 320 }} onPointerDown={(e) => { down.current = true; hit(e); }} onPointerMove={(e) => down.current && tool !== "fill" && hit(e)} onPointerUp={() => (down.current = false)} onPointerLeave={() => (down.current = false)}>
        {px.map((p, i) => <div key={i} data-i={i} className={cn((Math.floor(i / S) + (i % S)) % 2 ? "bg-zinc-100 dark:bg-zinc-800" : "bg-white dark:bg-zinc-900")} style={p ? { background: p } : undefined} />)}
      </div>
      <div className="space-y-4"><Seg value={tool} onChange={setTool} options={[{ value: "pen", label: <Pencil className="h-3.5 w-3.5" /> }, { value: "erase", label: <Eraser className="h-3.5 w-3.5" /> }, { value: "fill", label: <PaintBucket className="h-3.5 w-3.5" /> }]} />
        <div className="grid grid-cols-5 gap-1.5">{PAL.map((c) => <button key={c} aria-label={c} onClick={() => { setCol(c); if (tool === "erase") setTool("pen"); }} className={cn("h-8 w-8 rounded-lg ring-1 ring-black/10 transition hover:scale-110", col === c && "ring-2 ring-accent ring-offset-2 ring-offset-white dark:ring-offset-zinc-950")} style={{ background: c }} />)}</div>
        <div className="flex gap-2"><Btn size="sm" variant="outline" onClick={() => setPx(Array(S * S).fill(""))}><Trash2 className="h-4 w-4" />清空</Btn><Btn size="sm" variant="accent" onClick={exp}><Download className="h-4 w-4" />导出 PNG</Btn></div></div>
    </div>
  );
}

/* ---------- 物理小球 ---------- */
function PhysicsDemo() {
  const ref = useRef<HTMLCanvasElement>(null);
  const balls = useRef<{ x: number; y: number; vx: number; vy: number; r: number; c: string }[]>([]);
  const [g, setG] = useState(0.35);
  const gr = useRef(g); gr.current = g;
  const mouse = useRef({ x: -999, y: -999 });
  const vis = useRef(true); vis.current = useVisible();
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!; let raf = 0; let w = 0, h = 0;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    if (!balls.current.length) for (let i = 0; i < 14; i++) balls.current.push({ x: 60 + Math.random() * 400, y: 30 + Math.random() * 100, vx: (Math.random() - 0.5) * 4, vy: 0, r: 12 + Math.random() * 18, c: `hsl(${Math.random() * 360} 80% 60%)` });
    const loop = () => {
      if (!vis.current) { raf = requestAnimationFrame(loop); return; }
      ctx.clearRect(0, 0, w, h); const B = balls.current;
      for (const b of B) {
        b.vy += gr.current; b.x += b.vx; b.y += b.vy;
        const dx = b.x - mouse.current.x, dy = b.y - mouse.current.y, d = Math.hypot(dx, dy); if (d < b.r + 40 && d > 0) { b.vx += (dx / d) * 1.2; b.vy += (dy / d) * 1.2; }
        if (b.x < b.r) { b.x = b.r; b.vx *= -0.85; } if (b.x > w - b.r) { b.x = w - b.r; b.vx *= -0.85; }
        if (b.y > h - b.r) { b.y = h - b.r; b.vy *= -0.8; b.vx *= 0.99; if (Math.abs(b.vy) < 0.6) b.vy = 0; } if (b.y < b.r) { b.y = b.r; b.vy *= -0.8; }
      }
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) { const a = B[i], b = B[j]; const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.r + b.r; if (d < min && d > 0) { const nx = dx / d, ny = dy / d, ov = (min - d) / 2; a.x -= nx * ov; a.y -= ny * ov; b.x += nx * ov; b.y += ny * ov; const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (rv < 0) { const m1 = a.r * a.r, m2 = b.r * b.r, j2 = (-1.8 * rv) / (1 / m1 + 1 / m2); a.vx -= (j2 / m1) * nx; a.vy -= (j2 / m1) * ny; b.vx += (j2 / m2) * nx; b.vy += (j2 / m2) * ny; } } }
      for (const b of B) { const gr2 = ctx.createRadialGradient(b.x - b.r / 3, b.y - b.r / 3, 1, b.x, b.y, b.r); gr2.addColorStop(0, "#fff8"); gr2.addColorStop(0.4, b.c); gr2.addColorStop(1, b.c); ctx.fillStyle = gr2; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 7); ctx.fill(); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  const pos = (e: React.PointerEvent) => { const r = ref.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  return (
    <div className="space-y-3">
      <canvas ref={ref} className="h-72 w-full cursor-pointer touch-none rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900" onPointerMove={(e) => (mouse.current = pos(e))} onPointerLeave={() => (mouse.current = { x: -999, y: -999 })} onPointerDown={(e) => { const p = pos(e); if (balls.current.length < 80) balls.current.push({ ...p, vx: (Math.random() - 0.5) * 8, vy: -4 - Math.random() * 6, r: 10 + Math.random() * 20, c: `hsl(${Math.random() * 360} 80% 60%)` }); }} />
      <div className="flex flex-wrap items-center gap-3"><div className="w-44"><Range label="重力" value={g} onChange={setG} min={-0.2} max={1} step={0.05} /></div><Btn size="sm" variant="outline" onClick={() => balls.current.forEach((b) => { b.vy -= 12 + Math.random() * 8; b.vx += (Math.random() - 0.5) * 10; })}>🌪 震动</Btn><Btn size="sm" variant="outline" onClick={() => (balls.current = [])}>清空</Btn><span className="text-xs text-zinc-500">点击生成小球 · 鼠标会推开小球 · 弹性碰撞按质量计算</span></div>
    </div>
  );
}

/* ---------- 烟花 ---------- */
function FireworksDemo() {
  const ref = useRef<HTMLCanvasElement>(null);
  const S = useRef({ rockets: [] as { x: number; y: number; ty: number; vy: number; h: number }[], ps: [] as { x: number; y: number; vx: number; vy: number; l: number; h: number }[] });
  const launch = (x?: number, y?: number) => { const c = ref.current!; S.current.rockets.push({ x: x ?? 40 + Math.random() * (c.clientWidth - 80), y: c.clientHeight, ty: y ?? 30 + Math.random() * c.clientHeight * 0.4, vy: -7 - Math.random() * 2, h: Math.random() * 360 }); };
  const vis = useRef(true); vis.current = useVisible();
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!; let raf = 0, w = 0, h = 0, last = 0;
    const size = () => { const d = Math.min(devicePixelRatio || 1, 2); w = c.clientWidth; h = c.clientHeight; c.width = w * d; c.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    size(); const ro = new ResizeObserver(size); ro.observe(c);
    const loop = (t: number) => {
      if (!vis.current) { raf = requestAnimationFrame(loop); return; }
      if (t - last > 900) { launch(); last = t; }
      ctx.fillStyle = "rgba(5,5,16,.2)"; ctx.fillRect(0, 0, w, h);
      const s = S.current;
      s.rockets = s.rockets.filter((r) => { r.y += r.vy; ctx.fillStyle = `hsl(${r.h} 100% 80%)`; ctx.fillRect(r.x, r.y, 2, 6); if (r.y <= r.ty) { for (let i = 0; i < 70; i++) { const a = Math.random() * 7, sp = Math.random() * 5; s.ps.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, l: 1, h: r.h + Math.random() * 40 }); } return false; } return true; });
      s.ps = s.ps.filter((p) => { p.vy += 0.06; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.l -= 0.011; if (p.l <= 0) return false; ctx.fillStyle = `hsl(${p.h} 100% 60% / ${p.l})`; ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 7); ctx.fill(); return true; });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <div className="relative"><canvas ref={ref} className="block h-72 w-full cursor-crosshair bg-[#050510]" onPointerDown={(e) => { const r = ref.current!.getBoundingClientRect(); launch(e.clientX - r.left, e.clientY - r.top); }} /><p className="pointer-events-none absolute bottom-2 w-full text-center text-xs text-white/40">点击夜空放烟花</p></div>;
}

/* ---------- UI 小测验 ---------- */
const QUIZ: [string, string[], number, string][] = [
  ["正文文字与背景的 WCAG AA 最低对比度是？", ["3:1", "4.5:1", "7:1", "10:1"], 1, "AA 正文 ≥ 4.5:1，大字 ≥ 3:1，AAA 正文 ≥ 7:1。"],
  ["移动端可点击元素的推荐最小尺寸？", ["24px", "32px", "44px", "64px"], 2, "Apple HIG 推荐 44pt，Material 推荐 48dp。"],
  ["做高度从 0 到 auto 的动画，现代做法是？", ["transition: height", "grid-template-rows 0fr→1fr", "JS 测量 scrollHeight", "max-height: 9999px"], 1, "grid-rows 0fr→1fr 可对 auto 高度做动画，无需 JS。"],
  ["哪两个 CSS 属性做动画性能最好？", ["width / height", "top / left", "transform / opacity", "margin / padding"], 2, "它们由合成器处理，不触发布局与绘制。"],
  ["键盘焦点环应该使用哪个伪类？", [":focus", ":focus-visible", ":active", ":hover"], 1, ":focus-visible 只在键盘导航时显示焦点环。"],
  ["设计令牌（Design Token）主要解决什么？", ["打包体积", "设计决策的统一与复用", "SEO", "网络请求"], 1, "把颜色、间距、字体等决策抽象为变量。"],
  ["嵌套圆角的正确关系是？", ["内 = 外", "内 = 外 − 内边距", "内 = 外 + 内边距", "内 = 外 × 2"], 1, "内圆角 = 外圆角 − 内边距，视觉上才同心。"],
  ["遵循 prefers-reduced-motion 的目的是？", ["省电", "照顾对动效敏感的用户", "加快加载", "兼容旧浏览器"], 1, "前庭障碍用户可能因动效感到眩晕或不适。"],
];
function QuizDemo() {
  const [qs] = useState(() => [...QUIZ].sort(() => Math.random() - 0.5).slice(0, 6));
  const [i, setI] = useState(0); const [pick, setPick] = useState<number | null>(null); const [score, setScore] = useState(0);
  const fin = i >= qs.length;
  useEffect(() => { if (fin && score >= qs.length - 1) confetti(); }, [fin]);
  if (fin) return <div className="mx-auto max-w-sm text-center"><p className="text-6xl">{score === qs.length ? "🏆" : score >= 4 ? "🎉" : "📚"}</p><p className="mt-2 text-3xl font-bold">{score} / {qs.length}</p><p className="mt-1 text-sm text-zinc-500">{score === qs.length ? "满分！你是 UI 大师" : score >= 4 ? "很不错，继续保持" : "再翻翻手册，多练练"}</p><Btn className="mt-4" variant="accent" onClick={() => { setI(0); setScore(0); setPick(null); }}>再测一次</Btn></div>;
  const [q, opts, ans, why] = qs[i];
  return (
    <div className="max-w-lg space-y-4">
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-accent transition-all" style={{ width: (i / qs.length) * 100 + "%" }} /></div>
      <p className="text-xs text-zinc-500">第 {i + 1} / {qs.length} 题</p><h4 className="text-lg font-semibold leading-snug">{q}</h4>
      <div className="grid gap-2">{opts.map((o, k) => <button key={k} disabled={pick !== null} onClick={() => { setPick(k); if (k === ans) setScore(score + 1); }} className={cn("rounded-xl border px-4 py-3 text-left text-sm transition", pick === null ? "border-zinc-200 hover:border-accent hover:bg-accent-soft dark:border-zinc-700" : k === ans ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : k === pick ? "anim-shake border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300" : "border-zinc-200 opacity-50 dark:border-zinc-800")}>{String.fromCharCode(65 + k)}. {o}</button>)}</div>
      {pick !== null && <div className="anim-fade-up flex items-center justify-between gap-3 rounded-xl bg-zinc-100 p-3 text-sm dark:bg-zinc-900"><span>{pick === ans ? "✅ " : "❌ "}{why}</span><Btn size="sm" variant="primary" onClick={() => { setI(i + 1); setPick(null); }}>{i + 1 >= qs.length ? "查看结果" : "下一题"}</Btn></div>}
    </div>
  );
}

/* ---------- 番茄钟 ---------- */
function PomodoroDemo() {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const total = mode === "focus" ? 25 * 60 : 5 * 60;
  const [left, setLeft] = useState(total);
  const [run, setRun] = useState(false);
  const [fast, setFast] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => setLeft(total), [total]);
  useInterval(() => setLeft((l) => { if (l <= 1) { setRun(false); if (mode === "focus") { setN((x) => x + 1); confetti(); } return 0; } return l - (fast ? 60 : 1); }), run ? 1000 : null);
  const R = 70, C = 2 * Math.PI * R; const mm = String(Math.floor(Math.max(left, 0) / 60)).padStart(2, "0"), ss = String(Math.max(left, 0) % 60).padStart(2, "0");
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="relative h-48 w-48"><svg viewBox="0 0 160 160" className="-rotate-90"><circle cx="80" cy="80" r={R} fill="none" strokeWidth="8" className="stroke-zinc-200 dark:stroke-zinc-800" /><circle cx="80" cy="80" r={R} fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - left / total)} className={cn("transition-[stroke-dashoffset] duration-1000 ease-linear", mode === "focus" ? "stroke-accent" : "stroke-emerald-500")} /></svg><div className="absolute inset-0 grid place-items-center text-center"><div><p className="font-mono text-4xl font-bold tabular-nums">{mm}:{ss}</p><p className="text-xs text-zinc-500">{mode === "focus" ? "专注" : "休息"}</p></div></div></div>
      <div className="space-y-3"><Seg value={mode} onChange={(m) => { setMode(m); setRun(false); }} options={[{ value: "focus", label: "专注 25" }, { value: "break", label: "休息 5" }]} /><div className="flex gap-2"><Btn variant="accent" onClick={() => setRun(!run)}>{run ? "暂停" : "开始"}</Btn><Btn variant="outline" onClick={() => { setRun(false); setLeft(total); }}>重置</Btn></div><label className="flex items-center gap-2 text-xs text-zinc-500"><input type="checkbox" checked={fast} onChange={(e) => setFast(e.target.checked)} className="accent-[var(--accent)]" />演示加速（60×）</label><p className="text-xs text-zinc-500">已完成 {n} 个番茄 🍅</p></div>
    </div>
  );
}

/* ---------- 色感挑战 ---------- */
function ColorSenseDemo() {
  const [lv, setLv] = useState(0); const [over, setOver] = useState(false); const [best, setBest] = useLocalStorage("hb-color", 0);
  const round = useMemo(() => { const n = Math.min(2 + Math.floor(lv / 2), 7); return { n, odd: Math.floor(Math.random() * n * n), h: Math.floor(Math.random() * 360), d: Math.max(2.5, 16 - lv * 1.1) }; }, [lv]);
  const click = (i: number) => { if (over) return; if (i === round.odd) setLv(lv + 1); else { setOver(true); setBest(Math.max(best, lv)); } };
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${round.n}, 1fr)`, width: 280, height: 280 }}>{Array.from({ length: round.n ** 2 }, (_, i) => <button key={i} aria-label="色块" onClick={() => click(i)} className="rounded-lg transition active:scale-95" style={{ background: `hsl(${round.h} 70% ${i === round.odd ? 55 + round.d : 55}%)` }} />)}</div>
      <div className="space-y-3"><div><p className="text-xs text-zinc-500">关卡</p><p className="text-3xl font-bold tabular-nums">{lv}</p></div><p className="text-xs text-zinc-500">最佳：{best}</p>{over && <div className="anim-fade-up"><p className="text-sm font-medium text-red-500">点错了！</p><Btn size="sm" variant="accent" className="mt-2" onClick={() => { setLv(0); setOver(false); }}>重新开始</Btn></div>}<p className="max-w-[12rem] text-xs text-zinc-500">找出与众不同的那一块。色差会越来越小——设计师的“眼力”测试。</p></div>
    </div>
  );
}

/* ---------- Konami 彩蛋 ---------- */
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
function KonamiDemo() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const h = (e: Event) => setIdx((e as CustomEvent<number>).detail); window.addEventListener("hb-konami", h); return () => window.removeEventListener("hb-konami", h); }, []);
  const L = ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"];
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-zinc-500">在页面任意位置依次按下经典秘籍：</p>
      <div className="flex flex-wrap justify-center gap-2">{L.map((l, i) => <kbd key={i} className={cn("grid h-10 w-10 place-items-center rounded-lg border-b-4 font-mono text-lg font-bold transition-all", i < idx ? "-translate-y-1 border-accent bg-accent text-accent-fg" : "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800")}>{l}</kbd>)}</div>
      <p className="text-xs text-zinc-500">{idx >= 10 ? "🎉 彩蛋已触发！" : `已输入 ${idx} / 10 · 全站已开启监听，成功后触发彩虹主题 + 烟花`}</p>
      <Btn size="sm" variant="outline" onClick={() => window.dispatchEvent(new Event("hb-konami-fire"))}>直接触发彩蛋</Btn>
    </div>
  );
}
export { KONAMI };

export const play: Section = {
  id: "play", title: "游戏与彩蛋", en: "Playground & Easter Eggs", group: "2.0 新增", icon: Gamepad2, hue: 340,
  blurb: "学累了？玩一会儿。每个小游戏都是一个交互知识点的缩影：键盘事件、Canvas 循环、状态机、碰撞检测、指针手势……顺便还藏了几个彩蛋。",
  items: [
    item({ id: "game-snake", title: "贪吃蛇", en: "Snake", level: "进阶", isNew: true, demo: SnakeDemo, h: 360, tags: ["game", "keyboard", "grid"], desc: "最经典的键盘小游戏：网格 + 定时器 + 方向队列。方向键 / WASD 控制，按钮支持触屏。", points: ["用 ref 存方向队列，避免一个 tick 内连按两次造成掉头自杀。", "速度随分数递增：interval = max(70, 150 − 4 × score)。", "容器 tabIndex=0 并只在聚焦时拦截方向键，不劫持页面滚动。"], code: `useInterval(step, run ? Math.max(70, 150 - score * 4) : null);` }),
    item({ id: "game-2048", title: "2048", en: "2048", level: "高级", isNew: true, demo: Game2048, tags: ["game", "swipe", "matrix"], desc: "矩阵滑动合并。所有方向都归约成“向左滑一行”：转置 / 反转后复用同一函数。", points: ["slide(row)：去零 → 相邻相等合并 → 补零。", "上下 = 转置 → 左右 → 转置回来。", "指针位移 > 24px 判定为一次滑动手势。"], code: `const slide = (row) => { const a = row.filter(Boolean); /* 合并相邻相等 */ };` }),
    item({ id: "game-life", title: "生命游戏", en: "Conway's Game of Life", level: "高级", isNew: true, demo: LifeDemo, tags: ["canvas", "automata", "simulation"], desc: "三条简单规则涌现出复杂世界。点击 / 拖动绘制，默认有一只“滑翔机”。", points: ["环形边界：(x + dx + W) % W。", "Uint8Array 存储，比对象数组快一个数量级。", "拖动绘制：第一格的状态决定整条笔划是“画”还是“擦”。"], code: `n[i] = s === 3 || (s === 2 && c[i]) ? 1 : 0;` }),
    item({ id: "game-memory", title: "记忆翻牌", en: "Memory Match", level: "基础", isNew: true, demo: MemoryDemo, tags: ["game", "flip", "3d"], desc: "3D 翻牌 + 配对判定。锁定第三张牌的点击，直到前两张结算。", points: ["open 数组长度为 2 时拒绝新的翻牌。", "不匹配 900ms 后翻回，匹配 450ms 后锁定。"], code: `if (open.length === 2 || open.includes(id)) return;` }),
    item({ id: "game-typing", title: "打字测速", en: "Typing Test", level: "基础", isNew: true, demo: TypingDemo, tags: ["game", "wpm", "input"], desc: "逐字对比：正确变绿、错误标红、当前字下划线。完成后给出 WPM 与准确率。", points: ["第一次输入才开始计时。", "WPM = 字符数 / 5 / 分钟（中文按每词 2 字估算）。"], code: `const wpm = (text.length / 5) / minutes;` }),
    item({ id: "game-reaction", title: "反应速度", en: "Reaction Test", level: "基础", isNew: true, demo: ReactionDemo, tags: ["game", "timer"], desc: "等待变绿后点击，测量毫秒级反应时间。提前点击算犯规。", points: ["随机 1.2–4 秒的延迟，防止预判。", "performance.now() 精度高于 Date.now()。", "最佳成绩存 localStorage。"], code: `const ms = Math.round(performance.now() - start);` }),
    item({ id: "game-pixel", title: "像素画板", en: "Pixel Editor", level: "进阶", isNew: true, demo: PixelDemo, h: 360, tags: ["draw", "flood-fill", "export"], desc: "16×16 画板：画笔、橡皮、油漆桶（栈式洪水填充），可导出 PNG。", points: ["pointermove 里用 elementFromPoint 命中格子，同时兼容触屏。", "洪水填充用显式栈，避免递归爆栈。", "导出：离屏 canvas 逐格 fillRect → toDataURL。"], code: `const a = document.createElement("a"); a.href = canvas.toDataURL("image/png"); a.download = "pixel.png"; a.click();` }),
    item({ id: "game-physics", title: "物理小球", en: "Ball Physics", level: "高级", isNew: true, bare: true, demo: () => <div className="p-5"><PhysicsDemo /></div>, tags: ["canvas", "collision", "physics"], desc: "重力、墙壁反弹、圆与圆的弹性碰撞（按质量分配冲量），鼠标靠近会推开小球。", points: ["重叠修正：沿法线各退 (min − d) / 2。", "冲量 j = −(1 + e)·v_rel / (1/m1 + 1/m2)。", "质量 ∝ r²，大球更“重”。"], code: `const j = (-1.8 * rv) / (1 / m1 + 1 / m2); a.vx -= (j / m1) * nx;` }),
    item({ id: "game-fireworks", title: "烟花", en: "Fireworks", level: "进阶", isNew: true, bare: true, demo: FireworksDemo, tags: ["canvas", "particles"], desc: "火箭上升到目标高度后爆炸成 70 个带重力与阻尼的粒子。点击夜空即刻发射。", points: ["半透明黑色填充形成拖尾（不 clearRect）。", "粒子寿命递减决定 alpha。"], code: `ctx.fillStyle = "rgba(5,5,16,.2)"; ctx.fillRect(0, 0, w, h); // 拖尾` }),
    item({ id: "game-quiz", title: "UI 小测验", en: "UI Quiz", level: "基础", isNew: true, demo: QuizDemo, tags: ["quiz", "learn"], desc: "从题库随机抽 6 题检验学习成果，答完即时讲解，满分放礼花。", points: ["选完后锁定选项，用颜色 + 抖动反馈对错。", "反馈区含“为什么”，才是真正的学习。"], a11y: ["正确 / 错误同时有文字符号（✅ ❌），不只靠颜色。"], code: `const [q, opts, ans, why] = qs[i];` }),
    item({ id: "game-pomodoro", title: "番茄钟", en: "Pomodoro", level: "基础", isNew: true, demo: PomodoroDemo, tags: ["timer", "productivity"], desc: "25 分钟专注 + 5 分钟休息。环形进度条线性递减，完成时庆祝。", points: ["stroke-dashoffset 的 transition 设为 1s linear，与秒级更新对齐。", "演示加速开关方便体验结束效果。"], code: `strokeDashoffset={C * (1 - left / total)}` }),
    item({ id: "game-color", title: "色感挑战", en: "Color Sense", level: "基础", isNew: true, demo: ColorSenseDemo, tags: ["game", "color", "hsl"], desc: "N×N 色块里藏着一块亮度略有不同的，找出来！关卡越高格子越多、色差越小。", points: ["用 HSL 只改明度，感知差异最容易控制。", "色差 d = max(2.5, 16 − 1.1 × level)。"], code: `background: "hsl(" + h + " 70% " + (i === odd ? 55 + d : 55) + "%)"` }),
    item({ id: "easter-konami", title: "Konami 秘籍", en: "Konami Code", level: "基础", isNew: true, demo: KonamiDemo, tags: ["easter egg", "彩蛋", "hidden"], desc: "↑↑↓↓←→←→BA —— 1986 年的经典秘籍。全站监听，成功后触发彩虹主题与烟花。", points: ["维护一个“已匹配到第几位”的指针，错一位就归零。", "忽略输入框里的按键，避免正常输入时误触发。"], code: `if (e.key === KONAMI[i]) i++; else i = e.key === KONAMI[0] ? 1 : 0;` }),
  ],
};
