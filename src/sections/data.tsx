import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, ArrowUpDown, BarChart3, Check, ChevronDown, ChevronLeft, ChevronRight, Circle, Database, File, Folder, FolderOpen, Search, Send, TrendingDown, TrendingUp, Zap, Crown, Shuffle } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Kbd, Switch, inputCls } from "../components/ui";
import { cn } from "../utils/cn";
import { clamp, useCopy, useInterval } from "../lib/hooks";

/* seeded random */
const rng = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function CardDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-28 overflow-hidden bg-gradient-to-br from-accent to-pink-400"><div className="h-full w-full bg-[radial-gradient(circle_at_30%_30%,white/30,transparent_60%)] transition duration-500 group-hover:scale-125" /></div>
        <div className="p-4"><span className="text-xs font-medium text-accent">设计</span><h4 className="mt-1 font-semibold">悬停上浮卡片</h4><p className="mt-1 text-sm text-zinc-500">图片放大、卡片上浮、阴影加深。</p></div>
      </div>
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent"><Zap className="h-5 w-5" /></div><h4 className="font-semibold">功能卡片</h4><p className="mt-1 text-sm text-zinc-500">图标 + 标题 + 描述，是营销页最常见的结构。</p><a className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">了解更多 <ArrowRight className="h-4 w-4" /></a></div>
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 p-4 text-white dark:bg-zinc-100 dark:text-zinc-900"><div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/60 blur-2xl" /><p className="relative text-xs opacity-60">本月营收</p><p className="relative mt-1 text-3xl font-bold tracking-tight">¥128,430</p><p className="relative mt-2 text-xs text-emerald-400">▲ 12.5% 较上月</p></div>
    </div>
  );
}

type Row = { id: number; name: string; role: string; status: "在线" | "离线" | "忙碌"; score: number };
const NAMES = ["张伟", "王芳", "李娜", "刘洋", "陈静", "杨磊", "赵敏", "黄强", "周杰", "吴丹", "徐涛", "孙悦"];
const ROWS: Row[] = NAMES.map((n, i) => ({ id: i, name: n, role: ["设计师", "工程师", "产品", "运营"][i % 4], status: (["在线", "离线", "忙碌"] as const)[i % 3], score: 60 + ((i * 37) % 40) }));
function TableDemo() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: keyof Row; d: 1 | -1 } | null>(null);
  const [sel, setSel] = useState<number[]>([]);
  const [page, setPage] = useState(0);
  const rows = useMemo(() => { let r = ROWS.filter((x) => (x.name + x.role).includes(q)); if (sort) r = [...r].sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : -1) * sort.d); return r; }, [q, sort]);
  const per = 5; const pages = Math.max(1, Math.ceil(rows.length / per)); const cur = rows.slice(page * per, page * per + per);
  const th = (k: keyof Row, l: string) => <th className="px-3 py-2.5 text-left font-medium"><button onClick={() => setSort(sort?.k === k ? { k, d: sort.d === 1 ? -1 : 1 } : { k, d: 1 })} className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-white">{l}{sort?.k === k ? (sort.d === 1 ? <ArrowUp className="h-3 w-3 text-accent" /> : <ArrowDown className="h-3 w-3 text-accent" />) : <ArrowUpDown className="h-3 w-3 opacity-40" />}</button></th>;
  const sc = { 在线: "bg-emerald-500", 离线: "bg-zinc-400", 忙碌: "bg-amber-500" };
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3"><div className="relative w-56"><Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" /><input className={cn(inputCls, "h-9 pl-9")} placeholder="筛选姓名 / 职位" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} /></div><span className="text-xs text-zinc-500">已选 {sel.length} 项</span></div>
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-900"><tr><th className="w-10 px-3"><input type="checkbox" aria-label="全选" className="accent-[var(--accent)]" checked={cur.length > 0 && cur.every((r) => sel.includes(r.id))} onChange={(e) => setSel(e.target.checked ? [...new Set([...sel, ...cur.map((r) => r.id)])] : sel.filter((i) => !cur.some((r) => r.id === i)))} /></th>{th("name", "姓名")}{th("role", "职位")}{th("status", "状态")}{th("score", "评分")}</tr></thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {cur.map((r) => <tr key={r.id} className={cn("transition hover:bg-zinc-50 dark:hover:bg-zinc-800/40", sel.includes(r.id) && "bg-accent-soft/60")}><td className="px-3"><input type="checkbox" aria-label={"选择" + r.name} className="accent-[var(--accent)]" checked={sel.includes(r.id)} onChange={() => setSel(sel.includes(r.id) ? sel.filter((i) => i !== r.id) : [...sel, r.id])} /></td><td className="px-3 py-2.5 font-medium">{r.name}</td><td className="px-3 text-zinc-500">{r.role}</td><td className="px-3"><span className="inline-flex items-center gap-1.5"><span className={cn("h-1.5 w-1.5 rounded-full", sc[r.status])} />{r.status}</span></td><td className="px-3"><span className="inline-flex items-center gap-2"><span className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><span className="block h-full rounded-full bg-accent" style={{ width: r.score + "%" }} /></span><span className="tabular-nums text-xs">{r.score}</span></span></td></tr>)}
            {!cur.length && <tr><td colSpan={5} className="py-10 text-center text-zinc-400">无匹配数据</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-2 text-xs text-zinc-500"><span>第 {page + 1} / {pages} 页</span><button disabled={page === 0} onClick={() => setPage(page - 1)} className="rounded-md p-1 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"><ChevronLeft className="h-4 w-4" /></button><button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="rounded-md p-1 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"><ChevronRight className="h-4 w-4" /></button></div>
    </div>
  );
}

function AccordionDemo() {
  const [open, setOpen] = useState<number | null>(0);
  const qa = [["什么是设计令牌？", "设计令牌是把颜色、间距、字体等设计决策抽象成可复用的变量，让设计与代码保持一致。"], ["为什么只动画 transform？", "transform 与 opacity 由合成器处理，不触发布局与绘制，因此最流畅。"], ["如何做高度动画？", "使用 grid-template-rows 在 0fr 与 1fr 之间过渡，可以对 auto 高度做动画。"]];
  return (
    <div className="max-w-lg divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
      {qa.map(([q, a], i) => (
        <div key={i}>
          <h4><button aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between px-4 py-3.5 text-left text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800/40">{q}<ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform duration-300", open === i && "rotate-180 text-accent")} /></button></h4>
          <div className={cn("grid transition-all duration-300", open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><div className="overflow-hidden"><p className="px-4 pb-4 text-sm leading-relaxed text-zinc-500">{a}</p></div></div>
        </div>
      ))}
    </div>
  );
}

function TimelineDemo() {
  const ev = [["v2.0 发布", "全新设计系统上线", "今天", true], ["Beta 测试", "收集 120 条反馈", "3 天前", true], ["原型评审", "通过评审，进入开发", "上周", false], ["项目启动", "组建团队", "上月", false]] as const;
  return (
    <ol className="relative ml-3 max-w-md border-l border-zinc-200 dark:border-zinc-800">
      {ev.map(([t, d, time, cur], i) => <li key={t} className="anim-fade-up mb-6 ml-6 last:mb-0" style={{ animationDelay: i * 90 + "ms" }}>
        <span className={cn("absolute -left-[7px] mt-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-950", cur ? "bg-accent ring-4 ring-accent/20" : "bg-zinc-300 dark:bg-zinc-600")} />
        <p className="text-xs text-zinc-400">{time}</p><h4 className="text-sm font-semibold">{t}</h4><p className="text-sm text-zinc-500">{d}</p>
      </li>)}
    </ol>
  );
}

function Spark({ data, color = "var(--accent)", h = 40 }: { data: number[]; color?: string; h?: number }) {
  const mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => [(i / (data.length - 1)) * 100, h - 4 - ((v - mn) / (mx - mn || 1)) * (h - 8)]);
  const d = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  return <svg viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" className="h-10 w-full overflow-visible"><path d={d + ` L100,${h} L0,${h} Z`} fill={color} opacity="0.12" /><path d={d} fill="none" stroke={color} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" /></svg>;
}
function MetricsDemo() {
  const r = rng(7);
  const M = [["访问量", "48,293", "+12.4%", true], ["转化率", "3.82%", "+0.6%", true], ["跳出率", "41.2%", "-2.1%", false], ["客单价", "¥286", "-4.3%", false]] as const;
  const data = useMemo(() => M.map(() => Array.from({ length: 14 }, () => 20 + r() * 60)), []);
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {M.map(([l, v, c, up], i) => <div key={l} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><p className="text-xs text-zinc-500">{l}</p><div className="mt-1 flex items-baseline justify-between"><span className="text-2xl font-bold tracking-tight">{v}</span><span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", up ? "text-emerald-600" : "text-red-500")}>{up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{c}</span></div><div className="mt-3"><Spark data={data[i]} color={up ? "#10b981" : "#ef4444"} /></div></div>)}
    </div>
  );
}

function CodeKbdDemo() {
  const { copied, copy } = useCopy();
  const code = `const greet = (name: string) => {\n  return "Hello, " + name;\n};`;
  return (
    <div className="space-y-5">
      <div className="max-w-md overflow-hidden rounded-xl bg-zinc-900 text-sm text-zinc-200">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-zinc-400"><span>greet.ts</span><button onClick={() => copy(code)} className="inline-flex items-center gap-1 hover:text-white">{copied ? <><Check className="h-3 w-3" />已复制</> : "复制"}</button></div>
        <pre className="overflow-auto p-4 text-[13px] leading-relaxed"><span className="text-violet-400">const</span> greet = (name: <span className="text-sky-300">string</span>) =&gt; {"{"}{"\n"}  <span className="text-violet-400">return</span> <span className="text-emerald-300">"Hello, "</span> + name;{"\n"}{"}"};</pre>
      </div>
      <p className="text-sm text-zinc-500">按 <Kbd>⌘</Kbd> <Kbd>K</Kbd> 打开命令面板，<Kbd>Shift</Kbd> + <Kbd>?</Kbd> 查看快捷键，<Kbd>Esc</Kbd> 关闭。行内代码如 <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-[13px] text-accent dark:bg-zinc-800">useState()</code>。</p>
    </div>
  );
}

type TNode = { n: string; c?: TNode[] };
const TREE: TNode[] = [{ n: "src", c: [{ n: "components", c: [{ n: "Button.tsx" }, { n: "Modal.tsx" }, { n: "Tabs.tsx" }] }, { n: "hooks", c: [{ n: "useToggle.ts" }] }, { n: "App.tsx" }, { n: "main.tsx" }] }, { n: "public", c: [{ n: "logo.svg" }] }, { n: "package.json" }];
function TreeNode({ node, depth, sel, setSel }: { node: TNode; depth: number; sel: string; setSel: (s: string) => void }) {
  const [open, setOpen] = useState(depth === 0);
  const dir = !!node.c;
  return (
    <li role="treeitem" aria-expanded={dir ? open : undefined}>
      <button onClick={() => { if (dir) setOpen(!open); setSel(node.n); }} className={cn("flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800", sel === node.n && "bg-accent-soft text-accent")} style={{ paddingLeft: depth * 16 + 6 }}>
        {dir ? <ChevronRight className={cn("h-3.5 w-3.5 transition", open && "rotate-90")} /> : <span className="w-3.5" />}{dir ? (open ? <FolderOpen className="h-4 w-4 text-amber-500" /> : <Folder className="h-4 w-4 text-amber-500" />) : <File className="h-4 w-4 text-zinc-400" />}{node.n}
      </button>
      {dir && <div className={cn("grid transition-all duration-200", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><ul role="group" className="min-h-0 overflow-hidden">{node.c!.map((c) => <TreeNode key={c.n} node={c} depth={depth + 1} sel={sel} setSel={setSel} />)}</ul></div>}
    </li>
  );
}
function TreeDemo() { const [sel, setSel] = useState(""); return <ul role="tree" className="max-w-xs rounded-xl border border-zinc-200 p-2 dark:border-zinc-800">{TREE.map((n) => <TreeNode key={n.n} node={n} depth={0} sel={sel} setSel={setSel} />)}</ul>; }

function KanbanDemo() {
  const [cols, setCols] = useState<Record<string, string[]>>({ 待办: ["调研竞品", "撰写 PRD", "设计线框"], 进行中: ["开发登录页"], 已完成: ["搭建项目"] });
  const [drag, setDrag] = useState<{ t: string; from: string } | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const drop = (to: string) => { if (!drag || drag.from === to) return; setCols({ ...cols, [drag.from]: cols[drag.from].filter((x) => x !== drag.t), [to]: [...cols[to], drag.t] }); setDrag(null); setOver(null); };
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Object.entries(cols).map(([k, v]) => (
        <div key={k} onDragOver={(e) => { e.preventDefault(); setOver(k); }} onDragLeave={() => setOver(null)} onDrop={() => drop(k)} className={cn("min-h-44 rounded-xl p-2 transition", over === k ? "bg-accent-soft ring-2 ring-accent/40" : "bg-zinc-100/80 dark:bg-zinc-900")}>
          <h4 className="mb-2 flex items-center justify-between px-1.5 text-xs font-semibold text-zinc-500">{k}<span className="rounded-full bg-zinc-200 px-1.5 dark:bg-zinc-800">{v.length}</span></h4>
          <div className="space-y-2">{v.map((t) => <div key={t} draggable onDragStart={() => setDrag({ t, from: k })} onDragEnd={() => { setDrag(null); setOver(null); }} className={cn("cursor-grab rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-sm transition active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800", drag?.t === t && "opacity-40")}>{t}</div>)}</div>
        </div>
      ))}
    </div>
  );
}

function ChatDemo() {
  const [msgs, setMsgs] = useState([{ me: false, t: "你好！有什么可以帮你的？" }, { me: true, t: "想了解一下聊天气泡怎么设计" }]);
  const [v, setV] = useState("");
  const [typing, setTyping] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { const el = end.current?.parentElement; if (el) el.scrollTop = el.scrollHeight; }, [msgs, typing]);
  const send = () => { if (!v.trim()) return; setMsgs((m) => [...m, { me: true, t: v }]); setV(""); setTyping(true); setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { me: false, t: "好问题！自己的消息靠右用强调色，对方的靠左用中性灰；连续消息合并圆角。" }]); }, 1400); };
  return (
    <div className="max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="h-60 space-y-2 overflow-auto p-4">
        {msgs.map((m, i) => <div key={i} className={cn("anim-fade-up flex", m.me && "justify-end")}><span className={cn("max-w-[78%] rounded-2xl px-3.5 py-2 text-sm", m.me ? "rounded-br-md bg-accent text-accent-fg" : "rounded-bl-md bg-zinc-100 dark:bg-zinc-800")}>{m.t}</span></div>)}
        {typing && <div className="flex"><span className="flex gap-1 rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-3 dark:bg-zinc-800">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-zinc-400" style={{ animation: `dot 1.2s ${i * 0.18}s infinite` }} />)}</span></div>}
        <div ref={end} />
      </div>
      <div className="flex gap-2 border-t border-zinc-200 p-2 dark:border-zinc-800"><input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="输入消息…" className="h-10 flex-1 rounded-full bg-zinc-100 px-4 text-sm outline-none dark:bg-zinc-800" /><button aria-label="发送" onClick={send} className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-fg"><Send className="h-4 w-4" /></button></div>
    </div>
  );
}

function HeatmapDemo() {
  const data = useMemo(() => { const r = rng(42); return Array.from({ length: 26 * 7 }, () => { const x = r(); return x < 0.35 ? 0 : x < 0.6 ? 1 : x < 0.8 ? 2 : x < 0.93 ? 3 : 4; }); }, []);
  const cl = ["bg-zinc-100 dark:bg-zinc-800", "bg-accent/25", "bg-accent/50", "bg-accent/75", "bg-accent"];
  const [hv, setHv] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto pb-1"><div className="grid grid-flow-col grid-rows-7 gap-1" style={{ width: "max-content" }}>{data.map((v, i) => <span key={i} onMouseEnter={() => setHv(i)} onMouseLeave={() => setHv(null)} className={cn("h-3.5 w-3.5 rounded-[3px] transition hover:scale-150 hover:ring-1 hover:ring-zinc-900/40", cl[v])} />)}</div></div>
      <div className="flex items-center justify-between text-xs text-zinc-500"><span>{hv !== null ? `第 ${Math.floor(hv / 7) + 1} 周 · 周${"日一二三四五六"[hv % 7]} · ${data[hv] * 3} 次贡献` : "悬停查看详情"}</span><span className="flex items-center gap-1">少 {cl.map((c, i) => <span key={i} className={cn("h-3 w-3 rounded-sm", c)} />)} 多</span></div>
    </div>
  );
}

function CarouselDemo() {
  const slides = ["from-violet-500 to-fuchsia-500", "from-sky-500 to-emerald-400", "from-amber-400 to-rose-500", "from-indigo-500 to-cyan-400"];
  const [i, setI] = useState(0);
  const [dx, setDx] = useState(0);
  const sx = useRef<number | null>(null);
  const [auto, setAuto] = useState(true);
  useInterval(() => setI((v) => (v + 1) % slides.length), auto && sx.current === null ? 3500 : null);
  return (
    <div className="max-w-xl" onMouseEnter={() => setAuto(false)} onMouseLeave={() => setAuto(true)}>
      <div className="relative overflow-hidden rounded-2xl" onPointerDown={(e) => { sx.current = e.clientX; }} onPointerMove={(e) => sx.current !== null && setDx(e.clientX - sx.current)} onPointerUp={() => { if (dx < -50) setI(Math.min(i + 1, slides.length - 1)); else if (dx > 50) setI(Math.max(i - 1, 0)); sx.current = null; setDx(0); }} onPointerLeave={() => { sx.current = null; setDx(0); }}>
        <div className="flex touch-pan-y select-none" style={{ transform: `translateX(calc(${-i * 100}% + ${dx}px))`, transition: sx.current === null ? "transform .5s cubic-bezier(.32,.72,0,1)" : "none" }}>
          {slides.map((g, k) => <div key={k} className={cn("grid h-44 w-full shrink-0 place-items-center bg-gradient-to-br text-4xl font-bold text-white", g)}>{k + 1}</div>)}
        </div>
        <button aria-label="上一张" onClick={() => setI((i + slides.length - 1) % slides.length)} className="glass absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full"><ChevronLeft className="h-4 w-4" /></button>
        <button aria-label="下一张" onClick={() => setI((i + 1) % slides.length)} className="glass absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full"><ChevronRight className="h-4 w-4" /></button>
      </div>
      <div className="mt-3 flex justify-center gap-1.5">{slides.map((_, k) => <button key={k} aria-label={`第 ${k + 1} 张`} onClick={() => setI(k)} className={cn("h-1.5 rounded-full transition-all", i === k ? "w-6 bg-accent" : "w-1.5 bg-zinc-300 dark:bg-zinc-700")} />)}</div>
    </div>
  );
}

function CompareDemo() {
  const [x, setX] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const Scene = ({ f }: { f?: string }) => <div className="absolute inset-0" style={{ filter: f }}><div className="absolute inset-0 bg-gradient-to-b from-orange-300 via-rose-400 to-indigo-700" /><div className="absolute left-[62%] top-[30%] h-16 w-16 rounded-full bg-yellow-200 shadow-[0_0_60px_20px_rgba(254,240,138,.7)]" /><svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-2/5"><path d="M0 40V22L15 10 28 24 45 6 62 26 80 12 100 28V40Z" fill="#1e1b4b" /><path d="M0 40V30L20 20 40 32 60 22 80 33 100 26V40Z" fill="#0f0d2e" /></svg></div>;
  const mv = (e: React.PointerEvent) => { const r = box.current!.getBoundingClientRect(); setX(clamp(((e.clientX - r.left) / r.width) * 100, 0, 100)); };
  return (
    <div ref={box} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); mv(e); }} onPointerMove={(e) => e.buttons && mv(e)} className="relative h-56 max-w-xl cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl">
      <Scene />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}><Scene f="grayscale(1) contrast(.8) brightness(.9)" /></div>
      <span className="absolute left-3 top-3 rounded bg-black/50 px-2 py-0.5 text-xs text-white">Before</span><span className="absolute right-3 top-3 rounded bg-black/50 px-2 py-0.5 text-xs text-white">After</span>
      <div className="absolute inset-y-0 w-0.5 bg-white shadow" style={{ left: x + "%" }}><span className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-zinc-700 shadow-lg"><ChevronLeft className="h-3 w-3" /><ChevronRight className="-ml-1 h-3 w-3" /></span></div>
    </div>
  );
}

function MasonryDemo() {
  const r = rng(3);
  const hs = useMemo(() => Array.from({ length: 12 }, () => 80 + Math.floor(r() * 120)), []);
  const g = ["from-violet-400 to-fuchsia-400", "from-sky-400 to-cyan-300", "from-amber-300 to-orange-400", "from-emerald-400 to-teal-300", "from-rose-400 to-pink-300"];
  return <div className="columns-2 gap-3 sm:columns-3 md:columns-4">{hs.map((h, i) => <div key={i} className={cn("mb-3 grid break-inside-avoid place-items-center rounded-xl bg-gradient-to-br text-sm font-semibold text-white/90 transition hover:scale-[1.03]", g[i % 5])} style={{ height: h }}>{i + 1}</div>)}</div>;
}

function DescListDemo() {
  const rows = [["姓名", "林小夕"], ["邮箱", "lin@example.com"], ["角色", "高级设计师"], ["加入时间", "2024-03-18"], ["状态", "● 在线"]];
  return <dl className="max-w-md divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">{rows.map(([k, v]) => <div key={k} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm"><dt className="text-zinc-500">{k}</dt><dd className="col-span-2 font-medium">{v}</dd></div>)}</dl>;
}

function QuoteDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <blockquote className="border-l-4 border-accent pl-5"><p className="text-lg font-medium leading-relaxed">“设计不只是外观和感觉，设计是它如何运作。”</p><footer className="mt-2 text-sm text-zinc-500">— 史蒂夫·乔布斯</footer></blockquote>
      <blockquote className="relative rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900"><span className="absolute -top-3 left-5 font-serif text-6xl leading-none text-accent">“</span><p className="pt-3 text-sm leading-relaxed">极简不是缺少，而是恰到好处。去掉所有多余的东西，剩下的每一件都应有存在的理由。</p><footer className="mt-3 flex items-center gap-2 text-xs text-zinc-500"><span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-fg">D</span>Dieter Rams</footer></blockquote>
    </div>
  );
}

function VirtualDemo() {
  const N = 10000, H = 40, V = 280;
  const [top, setTop] = useState(0);
  const s = Math.max(0, Math.floor(top / H) - 3), e = Math.min(N, Math.ceil((top + V) / H) + 3);
  return (
    <div>
      <p className="mb-2 text-xs text-zinc-500">共 {N.toLocaleString()} 条 · 实际渲染 DOM 节点：<b className="text-accent">{e - s}</b></p>
      <div className="overflow-auto rounded-xl border border-zinc-200 dark:border-zinc-800" style={{ height: V }} onScroll={(ev) => setTop(ev.currentTarget.scrollTop)}>
        <div style={{ height: N * H, position: "relative" }}>
          {Array.from({ length: e - s }, (_, k) => { const i = s + k; return <div key={i} className="absolute inset-x-0 flex items-center gap-3 border-b border-zinc-100 px-4 text-sm dark:border-zinc-800/70" style={{ top: i * H, height: H }}><span className="w-14 font-mono text-xs text-zinc-400">#{i + 1}</span>列表项 {i + 1}</div>; })}
        </div>
      </div>
    </div>
  );
}

function TransferDemo() {
  const [L, setL] = useState(["选项 1", "选项 2", "选项 3", "选项 4", "选项 5"]);
  const [R, setR] = useState<string[]>([]);
  const [sl, setSl] = useState<string[]>([]);
  const move = (dir: "r" | "l") => { const from = dir === "r" ? L : R; const mv = from.filter((x) => sl.includes(x)); if (dir === "r") { setL(L.filter((x) => !mv.includes(x))); setR([...R, ...mv]); } else { setR(R.filter((x) => !mv.includes(x))); setL([...L, ...mv]); } setSl([]); };
  const Box = ({ t, list }: { t: string; list: string[] }) => <div className="w-40 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"><div className="border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">{t} · {list.length}</div><ul className="h-40 overflow-auto p-1">{list.map((x) => <li key={x}><label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"><input type="checkbox" className="accent-[var(--accent)]" checked={sl.includes(x)} onChange={() => setSl(sl.includes(x) ? sl.filter((y) => y !== x) : [...sl, x])} />{x}</label></li>)}</ul></div>;
  return <div className="flex items-center gap-3"><Box t="源列表" list={L} /><div className="flex flex-col gap-2"><Btn size="sm" variant="outline" aria-label="移到右侧" onClick={() => move("r")}><ChevronRight className="h-4 w-4" /></Btn><Btn size="sm" variant="outline" aria-label="移到左侧" onClick={() => move("l")}><ChevronLeft className="h-4 w-4" /></Btn></div><Box t="目标列表" list={R} /></div>;
}

/* ---------- 新增：图表 ---------- */
function ChartsDemo() {
  const [kind, setKind] = useState<"line" | "bar" | "donut" | "radar">("line");
  const [hv, setHv] = useState<number | null>(null);
  const data = [32, 45, 38, 62, 55, 78, 70, 92, 84, 105, 98, 120];
  const mx = 130;
  const W = 480, Hh = 180, pad = 24;
  const x = (i: number) => pad + (i / (data.length - 1)) * (W - pad * 2);
  const y = (v: number) => Hh - 20 - (v / mx) * (Hh - 40);
  const smooth = data.map((v, i) => { if (!i) return `M${x(0)},${y(v)}`; const cx = (x(i - 1) + x(i)) / 2; return `C${cx},${y(data[i - 1])} ${cx},${y(v)} ${x(i)},${y(v)}`; }).join(" ");
  const parts = [["设计", 35, "#8b5cf6"], ["开发", 28, "#06b6d4"], ["产品", 22, "#f59e0b"], ["运营", 15, "#ec4899"]] as const;
  const radar = [["速度", 80], ["质量", 90], ["成本", 55], ["体验", 85], ["稳定", 70]] as const;
  const C = 2 * Math.PI * 40;
  let acc = 0;
  const rp = (i: number, v: number) => { const a = (Math.PI * 2 * i) / radar.length - Math.PI / 2; return [100 + Math.cos(a) * v * 0.8, 100 + Math.sin(a) * v * 0.8]; };
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">{(["line", "bar", "donut", "radar"] as const).map((k) => <button key={k} onClick={() => setKind(k)} className={cn("rounded-md px-3 py-1 text-xs font-medium", kind === k ? "bg-white shadow-sm dark:bg-zinc-600" : "text-zinc-500")}>{{ line: "折线", bar: "柱状", donut: "环形", radar: "雷达" }[k]}</button>)}</div>
      <div key={kind} className="anim-fade-up max-w-xl">
        {kind === "line" && (
          <div className="relative" onMouseLeave={() => setHv(null)}>
            <svg viewBox={`0 0 ${W} ${Hh}`} className="w-full" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W; setHv(clamp(Math.round(((px - pad) / (W - pad * 2)) * (data.length - 1)), 0, data.length - 1)); }}>
              <defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity="0.35" /><stop offset="1" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
              {[0, 1, 2, 3].map((i) => <line key={i} x1={pad} x2={W - pad} y1={20 + i * 40} y2={20 + i * 40} className="stroke-zinc-200 dark:stroke-zinc-800" strokeDasharray="3 4" />)}
              <path d={smooth + ` L${x(11)},${Hh - 20} L${x(0)},${Hh - 20}Z`} fill="url(#ar)" />
              <path d={smooth} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 1.2s ease-out forwards" }} />
              {hv !== null && <g><line x1={x(hv)} x2={x(hv)} y1={10} y2={Hh - 20} className="stroke-zinc-300 dark:stroke-zinc-600" /><circle cx={x(hv)} cy={y(data[hv])} r="5" fill="var(--accent)" stroke="white" strokeWidth="2" /></g>}
              {data.map((_, i) => <text key={i} x={x(i)} y={Hh - 5} textAnchor="middle" className="fill-zinc-400 text-[9px]">{i + 1}月</text>)}
            </svg>
            {hv !== null && <div className="pointer-events-none absolute -translate-x-1/2 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs text-white dark:bg-white dark:text-zinc-900" style={{ left: (x(hv) / W) * 100 + "%", top: 0 }}>{hv + 1} 月 · <b>{data[hv]}</b></div>}
          </div>
        )}
        {kind === "bar" && <div className="flex h-44 items-end gap-2 border-b border-zinc-200 dark:border-zinc-800">{data.map((v, i) => <div key={i} className="group relative flex-1"><div className="origin-bottom rounded-t-md bg-accent/80 transition hover:bg-accent" style={{ height: (v / mx) * 170, animation: `growY .7s ${i * 40}ms cubic-bezier(.32,.72,0,1) both` }} /><span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-1.5 text-[10px] text-white opacity-0 group-hover:opacity-100 dark:bg-white dark:text-zinc-900">{v}</span></div>)}<style>{`@keyframes growY{from{transform:scaleY(0)}}`}</style></div>}
        {kind === "donut" && (
          <div className="flex items-center gap-8">
            <div className="relative h-44 w-44"><svg viewBox="0 0 100 100" className="-rotate-90">{parts.map(([n, v, c], i) => { const len = (v / 100) * C; const el = <circle key={n} cx="50" cy="50" r="40" fill="none" stroke={c} strokeWidth={hv === i ? 16 : 12} strokeDasharray={`${len - 1.5} ${C}`} strokeDashoffset={-acc} className="cursor-pointer transition-all duration-300" onMouseEnter={() => setHv(i)} onMouseLeave={() => setHv(null)} />; acc += len; return el; })}</svg><div className="absolute inset-0 grid place-items-center text-center"><div><p className="text-2xl font-bold">{hv !== null ? parts[hv][1] + "%" : "100%"}</p><p className="text-xs text-zinc-500">{hv !== null ? parts[hv][0] : "占比"}</p></div></div></div>
            <ul className="space-y-2 text-sm">{parts.map(([n, v, c], i) => <li key={n} onMouseEnter={() => setHv(i)} onMouseLeave={() => setHv(null)} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: c }} />{n}<span className="ml-2 text-zinc-400">{v}%</span></li>)}</ul>
          </div>
        )}
        {kind === "radar" && <svg viewBox="0 0 200 200" className="mx-auto h-56 w-56">{[25, 50, 75, 100].map((l) => <polygon key={l} points={radar.map((_, i) => rp(i, l).join(",")).join(" ")} fill="none" className="stroke-zinc-200 dark:stroke-zinc-800" />)}{radar.map((_, i) => <line key={i} x1="100" y1="100" x2={rp(i, 100)[0]} y2={rp(i, 100)[1]} className="stroke-zinc-200 dark:stroke-zinc-800" />)}<polygon points={radar.map(([, v], i) => rp(i, v).join(",")).join(" ")} fill="var(--accent)" fillOpacity="0.25" stroke="var(--accent)" strokeWidth="2" />{radar.map(([n, v], i) => <g key={n}><circle cx={rp(i, v)[0]} cy={rp(i, v)[1]} r="3.5" fill="var(--accent)" /><text x={rp(i, 118)[0]} y={rp(i, 118)[1]} textAnchor="middle" dominantBaseline="middle" className="fill-zinc-500 text-[9px]">{n}</text></g>)}</svg>}
      </div>
    </div>
  );
}

function LeaderboardDemo() {
  const [rows, setRows] = useState([["林夕", 920], ["Alex", 870], ["王小明", 810], ["Sophie", 760], ["陈默", 700], ["Jack", 640]] as [string, number][]);
  const bump = () => setRows((r) => r.map(([n, s]) => [n, Math.max(100, s + Math.round((Math.random() - 0.4) * 220))] as [string, number]));
  const sorted = [...rows].sort((a, b) => b[1] - a[1]);
  const mx = Math.max(...rows.map((r) => r[1]));
  return (
    <div className="max-w-md space-y-3">
      <Btn variant="accent" onClick={bump}><Shuffle className="h-4 w-4" />随机刷新分数</Btn>
      <div className="relative" style={{ height: rows.length * 52 }}>
        {rows.map(([n, s]) => { const rank = sorted.findIndex((x) => x[0] === n); return (
          <div key={n} className="absolute inset-x-0 flex h-11 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 shadow-sm transition-transform duration-700 [transition-timing-function:cubic-bezier(0.34,1.3,0.64,1)] dark:border-zinc-800 dark:bg-zinc-900" style={{ transform: `translateY(${rank * 52}px)` }}>
            <span className={cn("grid h-6 w-6 place-items-center rounded-full text-xs font-bold", rank === 0 ? "bg-amber-400 text-white" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800")}>{rank === 0 ? <Crown className="h-3.5 w-3.5" /> : rank + 1}</span>
            <span className="w-16 text-sm font-medium">{n}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"><span className="block h-full rounded-full bg-accent transition-all duration-700" style={{ width: (s / mx) * 100 + "%" }} /></span>
            <span className="w-10 text-right text-sm tabular-nums">{s}</span>
          </div>); })}
      </div>
    </div>
  );
}

function BentoDemo() {
  const T = "overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900";
  return (
    <div className="grid auto-rows-[110px] grid-cols-2 gap-3 sm:grid-cols-4">
      <div className={cn(T, "col-span-2 row-span-2 relative bg-gradient-to-br from-accent to-pink-500 text-white dark:from-accent dark:to-pink-500")}><p className="text-xs opacity-80">FEATURED</p><h4 className="mt-1 text-2xl font-bold leading-tight">便当格<br />Bento Grid</h4><p className="mt-2 max-w-[14rem] text-sm opacity-80">用大小不一的方块组织信息，层次分明。</p><div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-white/20" /></div>
      <div className={T}><p className="text-xs text-zinc-500">用户</p><p className="mt-1 text-3xl font-bold">12.4k</p><Spark data={[3, 5, 4, 7, 6, 9, 8, 12]} h={30} /></div>
      <div className={cn(T, "grid place-items-center")}><span className="text-4xl">🚀</span></div>
      <div className={cn(T, "col-span-2 flex items-center gap-3")}><div className="flex -space-x-2">{["bg-violet-500", "bg-sky-500", "bg-amber-500", "bg-emerald-500"].map((c) => <span key={c} className={cn("h-9 w-9 rounded-full ring-2 ring-white dark:ring-zinc-900", c)} />)}</div><div className="text-sm"><b>团队协作</b><p className="text-xs text-zinc-500">4 位成员在线</p></div></div>
      <div className={cn(T, "col-span-2 flex items-center gap-4 sm:col-span-1")}><BarChart3 className="h-8 w-8 text-accent" /><b className="text-sm">数据分析</b></div>
      <div className={cn(T, "col-span-2")}><div className="flex items-end gap-1.5">{[40, 65, 50, 80, 60, 95, 75].map((h, i) => <span key={i} className="flex-1 rounded bg-accent/70" style={{ height: h * 0.5 }} />)}</div></div>
    </div>
  );
}

function PricingDemo() {
  const [yr, setYr] = useState(true);
  const plans = [["入门版", 0, 0, ["1 个项目", "社区支持"]], ["专业版", 29, 24, ["无限项目", "优先支持", "团队协作", "高级分析"]], ["企业版", 99, 82, ["SSO 登录", "专属经理", "SLA 保障"]]] as const;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 text-sm"><span className={yr ? "text-zinc-400" : "font-medium"}>按月</span><Switch checked={yr} onChange={setYr} label="按年付费" /><span className={yr ? "font-medium" : "text-zinc-400"}>按年 <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">省 17%</span></span></div>
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map(([n, m, y, fs], i) => (
          <div key={n} className={cn("relative rounded-2xl p-px", i === 1 ? "bg-gradient-to-b from-accent to-pink-500 shadow-xl shadow-accent/20" : "bg-zinc-200 dark:bg-zinc-800")}>
            <div className="h-full rounded-[calc(var(--radius-2xl)-1px)] bg-white p-5 dark:bg-zinc-900">
              {i === 1 && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-semibold text-accent-fg">最受欢迎</span>}
              <h4 className="font-semibold">{n}</h4>
              <p className="mt-2 flex items-baseline gap-1"><span key={String(yr)} className="anim-fade-up text-4xl font-bold tracking-tight">¥{yr ? y : m}</span><span className="text-sm text-zinc-500">/月</span></p>
              <ul className="mt-4 space-y-2 text-sm">{fs.map((f) => <li key={f} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300"><Check className="h-4 w-4 text-accent" />{f}</li>)}</ul>
              <Btn className="mt-5 w-full" variant={i === 1 ? "accent" : "outline"}>选择{n}</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const data: Section = {
  id: "data", title: "数据展示", en: "Data Display", group: "组件", icon: Database, hue: 190,
  blurb: "数据展示的目标是“让信息被看懂”：排序、过滤、分层、对比。这一章从最朴素的卡片到可交互图表、虚拟列表。",
  items: [
    item({ id: "card", title: "卡片", en: "Card", level: "基础", demo: CardDemo, tags: ["panel"], desc: "内容的基本容器。通过边框、阴影和留白区分层级，悬停上浮传达“可点击”。", points: ["整张卡片可点击时，用 ::after 伪元素撑满，避免嵌套 a。", "悬停：translateY(-4px) + 阴影加深。"], code: `<div className="rounded-2xl border bg-white transition hover:-translate-y-1 hover:shadow-xl" />` }),
    item({ id: "table", title: "数据表格", en: "Data Table", level: "进阶", demo: TableDemo, tags: ["grid", "sort"], desc: "排序、筛选、多选、分页四件套。数据密集场景的核心。", points: ["排序三态：升序 → 降序 → 原序。", "表头全选只作用于当前页。", "窄屏外层 overflow-x-auto。"], a11y: ["th 用 aria-sort；复选框要有 aria-label。"], code: `const rows = useMemo(() => data.filter(match).sort(by(sort)), [data, q, sort]);` }),
    item({ id: "accordion", title: "手风琴", en: "Accordion", level: "基础", demo: AccordionDemo, tags: ["collapse", "faq"], desc: "折叠次要内容，FAQ 的标配。高度动画用 grid-rows 0fr→1fr。", points: ["不需要 JS 测量 scrollHeight。"], a11y: ["标题内放 button，设置 aria-expanded。"], code: `<div className={open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} style={{ display: "grid", transition: "all .3s" }}>
  <div className="overflow-hidden">…</div>
</div>` }),
    item({ id: "timeline", title: "时间线", en: "Timeline", level: "基础", demo: TimelineDemo, tags: ["history"], desc: "按时间顺序展示事件。当前节点用强调色和光环。", points: ["列表依次淡入，延迟 90ms。"], code: `<ol className="border-l"><li className="ml-6"><span className="absolute -left-[7px] rounded-full" /></li></ol>` }),
    item({ id: "metrics", title: "指标卡片 / 迷你图", en: "Metric & Sparkline", level: "进阶", demo: MetricsDemo, tags: ["kpi", "dashboard"], desc: "一个大数字 + 变化趋势 + 迷你折线。仪表盘首屏的标准配置。", points: ["上升绿、下降红，同时配箭头图标，不只靠颜色。", "迷你图 preserveAspectRatio=none + non-scaling-stroke 随容器拉伸而线宽不变。"], code: `<svg viewBox="0 0 100 40" preserveAspectRatio="none"><path vectorEffect="non-scaling-stroke" /></svg>` }),
    item({ id: "code-kbd", title: "代码块 / Kbd", en: "Code & Keyboard", level: "基础", demo: CodeKbdDemo, tags: ["pre", "shortcut"], desc: "展示代码与快捷键。键帽用底部加粗的边框模拟按键厚度。", code: `<kbd className="rounded border border-b-2 px-1.5 font-mono text-xs">⌘</kbd>` }),
    item({ id: "tree", title: "树形视图", en: "Tree View", level: "进阶", demo: TreeDemo, tags: ["file", "nested"], desc: "层级数据：文件目录、组织架构。递归组件 + 缩进。", points: ["缩进 = depth × 16px。", "折叠同样用 grid-rows 动画。"], a11y: ["role=tree / treeitem / group；aria-expanded。"], code: `function Node({ n, depth }) { return <li>…{open && n.children.map((c) => <Node n={c} depth={depth + 1} />)}</li>; }` }),
    item({ id: "kanban", title: "看板拖放", en: "Kanban DnD", level: "高级", demo: KanbanDemo, tags: ["drag", "drop"], desc: "跨列拖拽卡片。使用原生 HTML5 Drag & Drop，无需任何库。", points: ["列容器 onDragOver 必须 preventDefault。", "被拖卡片半透明，目标列高亮。", "复杂场景（排序动画、触屏）请用 @dnd-kit。"], a11y: ["提供键盘替代方案（如菜单“移动到…”）。"], code: `<div draggable onDragStart={() => setDrag(card)} />
<div onDragOver={(e) => e.preventDefault()} onDrop={() => move(drag, col)} />` }),
    item({ id: "chat", title: "聊天气泡", en: "Chat Bubbles", level: "进阶", demo: ChatDemo, tags: ["message"], desc: "自己靠右强调色，对方靠左中性灰；“正在输入…”三点动画。", points: ["气泡一角收圆角（rounded-br-md）指向发送者。", "新消息后滚动到底部。"], a11y: ["消息列表 aria-live=polite。"], code: `<span className={me ? "rounded-br-md bg-accent" : "rounded-bl-md bg-zinc-100"} />` }),
    item({ id: "heatmap", title: "日历热力图", en: "Contribution Heatmap", level: "进阶", demo: HeatmapDemo, tags: ["github"], desc: "用 5 级颜色深浅展示一年的活跃度，GitHub 贡献图风格。", points: ["grid-flow-col + grid-rows-7 自然按“列=周”排布。"], code: `<div className="grid grid-flow-col grid-rows-7 gap-1" />` }),
    item({ id: "carousel", title: "轮播", en: "Carousel", level: "进阶", demo: CarouselDemo, tags: ["slider"], desc: "支持按钮、圆点、拖拽滑动和自动播放（悬停暂停）。", points: ["拖动时关闭 transition，松手后才恢复。", "距离超过 50px 才翻页。", "圆点当前项拉长为胶囊。"], a11y: ["自动播放必须可暂停；提供上一张/下一张按钮。"], code: `style={{ transform: "translateX(calc(" + -i * 100 + "% + " + dx + "px))" }}` }),
    item({ id: "compare", title: "图片对比滑块", en: "Before / After", level: "高级", demo: CompareDemo, tags: ["image", "diff"], desc: "拖动分割线对比处理前后。两层叠放，上层用 clip-path 裁剪。", points: ["clip-path: inset(0 X% 0 0) 随滑块更新。", "整个容器监听指针，点击任意位置即可跳转。"], code: `<div style={{ clipPath: "inset(0 " + (100 - x) + "% 0 0)" }}><Before /></div>` }),
    item({ id: "masonry", title: "瀑布流", en: "Masonry", level: "基础", demo: MasonryDemo, tags: ["pinterest"], desc: "高度不等的卡片自然错落。最简单的实现是 CSS columns。", points: ["break-inside: avoid 防止卡片被截断。", "缺点：顺序按列排列。需要按行序时用 JS 分列。"], code: `<div className="columns-2 gap-3 md:columns-4"><div className="mb-3 break-inside-avoid" /></div>` }),
    item({ id: "desc-list", title: "描述列表", en: "Description List", level: "基础", demo: DescListDemo, tags: ["dl", "detail"], desc: "键值对信息展示：详情页、个人资料。", a11y: ["用语义化的 dl / dt / dd。"], code: `<dl><div className="grid grid-cols-3"><dt /><dd className="col-span-2" /></div></dl>` }),
    item({ id: "quote", title: "引用块", en: "Blockquote", level: "基础", demo: QuoteDemo, tags: ["pull quote"], desc: "突出引文：左侧竖线或大引号两种风格。", a11y: ["使用 blockquote + footer / cite。"], code: `<blockquote className="border-l-4 border-accent pl-5">…</blockquote>` }),
    item({ id: "virtual-list", title: "虚拟滚动列表", en: "Virtual List", level: "高级", demo: VirtualDemo, tags: ["performance", "window"], desc: "一万条数据只渲染可视区域内的十几个节点。长列表性能的救星。", points: ["总高度占位 N × H，只渲染 [start, end) 区间。", "上下各多渲染 3 行缓冲，避免白屏。", "生产环境建议 @tanstack/react-virtual。"], code: `const start = Math.floor(scrollTop / H) - 3;
const end = Math.ceil((scrollTop + viewH) / H) + 3;` }),
    item({ id: "transfer", title: "穿梭框", en: "Transfer", level: "进阶", demo: TransferDemo, tags: ["shuttle"], desc: "在两个列表间批量移动项目：权限分配、字段选择。", code: `setR([...R, ...L.filter((x) => selected.includes(x))]);` }),
    item({ id: "charts", title: "SVG 图表", en: "Charts", level: "高级", isNew: true, demo: ChartsDemo, tags: ["line", "bar", "donut", "radar", "chart"], desc: "不引入图表库，手写四种基础图表：折线（带悬停十字线）、柱状（逐根生长）、环形、雷达。", points: ["折线用三次贝塞尔平滑：控制点取相邻点 x 的中点。", "描边动画：pathLength=1 + strokeDashoffset。", "环形：每段 strokeDasharray = 弧长，strokeDashoffset 负累计偏移。", "雷达：极坐标 (cos, sin) 转直角坐标。"], a11y: ["图表需配文字摘要或数据表，不只靠颜色区分系列。"], code: `const cx = (x(i - 1) + x(i)) / 2;
d += "C" + cx + "," + y(prev) + " " + cx + "," + y(v) + " " + x(i) + "," + y(v);` }),
    item({ id: "leaderboard", title: "动态排行榜", en: "Animated Leaderboard", level: "高级", isNew: true, demo: LeaderboardDemo, tags: ["flip", "reorder", "rank"], desc: "排名变化时每一行平滑滑向新位置——不是替换 DOM，而是改 translateY。", points: ["每行绝对定位，位置 = rank × 行高 → transform。", "稳定的 key 让 React 保持节点，浏览器负责过渡。", "弹性曲线让名次交换更有活力。"], code: `<div key={name} style={{ transform: "translateY(" + rank * 52 + "px)", transition: "transform .7s" }} />` }),
    item({ id: "bento", title: "便当格布局", en: "Bento Grid", level: "进阶", isNew: true, demo: BentoDemo, tags: ["grid", "layout"], desc: "Apple 风格的发布页布局：大小不一的圆角方块，每块承载一个独立卖点。", points: ["grid + auto-rows 固定行高，col-span / row-span 控制大小。", "保持间距与圆角一致，统一感来自规则而非内容。"], code: `<div className="grid auto-rows-[110px] grid-cols-4 gap-3">
  <div className="col-span-2 row-span-2" />
</div>` }),
    item({ id: "pricing", title: "定价卡片", en: "Pricing Cards", level: "进阶", isNew: true, demo: PricingDemo, tags: ["plan", "saas"], desc: "三档方案 + 月/年切换。推荐方案用渐变边框和“最受欢迎”徽章强调。", points: ["渐变边框：外层 p-px 渐变背景，内层白底圆角 -1px。", "价格切换时数字用 key 重新入场。"], code: `<div className="rounded-2xl bg-gradient-to-b from-accent to-pink-500 p-px"><div className="rounded-[15px] bg-white" /></div>` }),
  ],
};

void Circle; void ArrowRight;
