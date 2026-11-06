import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp, ArrowDown, ArrowUpRight, ArrowDownRight, ChevronDown, ChevronRight, ChevronLeft, Folder, FolderOpen, FileText, Search, Check, Minus, Plus, Send, Zap, Shield, Layers, RefreshCw, ArrowUpDown, Users, Activity, GripVertical,
} from "lucide-react";
import type { Section } from "@/types";
import { Btn, Seg, Kbd, Row } from "@/components/ui";
import { cn } from "@/utils/cn";
import { clamp, useInterval } from "@/lib/hooks";

/* ---------- cards ---------- */
function Cards() {
  const F = [[Zap, "即时响应", "每个操作都在 100ms 内给出反馈。"], [Shield, "默认安全", "权限、审计与加密开箱即用。"], [Layers, "可组合", "小而专注的模块，自由拼装。"]];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {F.map(([I, t, d]: any, i) => (
        <article key={t} className="group relative cursor-pointer overflow-hidden rounded-2xl border border-line bg-bg p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-line2 hover:shadow-pop">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-soft2 transition-colors duration-300 group-hover:bg-inv group-hover:text-invfg"><I size={18} /></div>
          <h4 className="mt-6 font-semibold tracking-tight">{t}</h4>
          <p className="mt-1.5 text-[13px] text-mute">{d}</p>
          <div className="mt-5 flex items-center gap-1 text-xs text-mute transition-all duration-300 group-hover:gap-2 group-hover:text-fg">了解更多<ArrowUpRight size={13} /></div>
          <span className="absolute right-4 top-4 font-mono text-[11px] text-dim">0{i + 1}</span>
        </article>
      ))}
    </div>
  );
}

/* ---------- metrics ---------- */
function Spark({ d, up }: { d: number[]; up: boolean }) {
  const mx = Math.max(...d), mn = Math.min(...d);
  const pts = d.map((v, i) => `${(i / (d.length - 1)) * 100},${30 - ((v - mn) / (mx - mn || 1)) * 28 - 1}`).join(" ");
  return <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-full"><polyline points={pts} fill="none" stroke={up ? "var(--fg)" : "var(--dim)"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 1.2s var(--ease) forwards" }} /></svg>;
}
function Metrics() {
  const M = [["本月营收", "¥128,430", "+12.5%", true, [3, 5, 4, 7, 6, 9, 8, 12, 11, 14]], ["活跃用户", "24,891", "+4.1%", true, [5, 6, 6, 7, 6, 8, 9, 9, 10, 11]], ["跳出率", "32.4%", "−2.3%", false, [9, 8, 9, 7, 8, 6, 7, 5, 6, 5]], ["客单价", "¥86.20", "−0.8%", false, [8, 9, 8, 9, 7, 8, 7, 7, 6, 6]]];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {M.map(([t, v, c, up, d]: any) => (
        <div key={t} className="rounded-2xl border border-line bg-bg p-4">
          <div className="text-xs text-mute">{t}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{v}</div>
          <div className={cn("mt-1 inline-flex items-center gap-1 text-xs", up ? "text-fg" : "text-mute")}>{up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{c}</div>
          <div className="mt-3"><Spark d={d} up={up} /></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- table ---------- */
const ROWS = [["张伟", "设计师", "在线", 92], ["王芳", "工程师", "忙碌", 88], ["李娜", "产品经理", "在线", 95], ["刘洋", "工程师", "离线", 76], ["陈静", "设计师", "在线", 81], ["杨磊", "运营", "忙碌", 69], ["赵敏", "工程师", "在线", 90], ["黄强", "设计师", "离线", 73], ["周杰", "产品经理", "在线", 85], ["吴丹", "运营", "忙碌", 78], ["徐涛", "工程师", "在线", 97], ["孙悦", "设计师", "离线", 64]] as [string, string, string, number][];
function Table() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ k: number; d: 1 | -1 } | null>(null);
  const [sel, setSel] = useState<string[]>([]);
  const [pg, setPg] = useState(0);
  const per = 5;
  const rows = useMemo(() => {
    let r = ROWS.filter((x) => (x[0] + x[1]).includes(q));
    if (sort) r = [...r].sort((a, b) => (a[sort.k] > b[sort.k] ? 1 : -1) * sort.d);
    return r;
  }, [q, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / per));
  const cur = rows.slice(pg * per, pg * per + per);
  const allOn = cur.length > 0 && cur.every((r) => sel.includes(r[0]));
  const toggleSort = (k: number) => setSort(!sort || sort.k !== k ? { k, d: 1 } : sort.d === 1 ? { k, d: -1 } : null);
  const heads = ["姓名", "职位", "状态", "评分"];
  const box = (on: boolean, mid = false) => <span className={cn("grid h-4 w-4 place-items-center rounded border", on || mid ? "border-fg bg-inv text-invfg" : "border-line2")}>{mid ? <Minus size={10} /> : on ? <Check size={10} strokeWidth={3} /> : null}</span>;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg">
      <div className="flex items-center gap-3 border-b border-line p-3">
        <div className="relative max-w-56 flex-1"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" /><input value={q} onChange={(e) => { setQ(e.target.value); setPg(0); }} placeholder="筛选姓名 / 职位" className="h-8 w-full rounded-lg border border-line2 bg-bg pl-8 pr-3 text-xs outline-none focus:border-fg" /></div>
        <span className="ml-auto font-mono text-xs text-mute">{sel.length ? `已选 ${sel.length} 项` : `${rows.length} 条`}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead><tr className="border-b border-line bg-soft text-xs text-mute">
            <th className="w-10 p-3"><button aria-label="全选" onClick={() => setSel(allOn ? sel.filter((s) => !cur.some((r) => r[0] === s)) : [...new Set([...sel, ...cur.map((r) => r[0])])])}>{box(allOn, !allOn && cur.some((r) => sel.includes(r[0])))}</button></th>
            {heads.map((h, i) => <th key={h} className="p-3 font-medium" aria-sort={sort?.k === i ? (sort.d === 1 ? "ascending" : "descending") : "none"}><button onClick={() => toggleSort(i)} className="inline-flex items-center gap-1 hover:text-fg">{h}{sort?.k === i ? (sort.d === 1 ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : <ArrowUpDown size={11} className="opacity-40" />}</button></th>)}
          </tr></thead>
          <tbody>
            {cur.map((r) => (
              <tr key={r[0]} className={cn("border-b border-line transition-colors last:border-0 hover:bg-soft", sel.includes(r[0]) && "bg-soft2")}>
                <td className="p-3"><button aria-label={`选择 ${r[0]}`} onClick={() => setSel(sel.includes(r[0]) ? sel.filter((s) => s !== r[0]) : [...sel, r[0]])}>{box(sel.includes(r[0]))}</button></td>
                <td className="p-3 font-medium"><span className="mr-2 inline-grid h-6 w-6 place-items-center rounded-full bg-soft2 text-[11px]">{r[0][0]}</span>{r[0]}</td>
                <td className="p-3 text-mute">{r[1]}</td>
                <td className="p-3"><span className="inline-flex items-center gap-1.5 text-xs"><span className={cn("h-1.5 w-1.5 rounded-full", r[2] === "在线" ? "bg-fg" : r[2] === "忙碌" ? "bg-fg/50" : "bg-dim")} />{r[2]}</span></td>
                <td className="p-3 font-mono tabular-nums">{r[3]}</td>
              </tr>
            ))}
            {!cur.length && <tr><td colSpan={5} className="p-10 text-center text-xs text-mute">无匹配数据</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-line p-3 text-xs text-mute"><span>第 {pg + 1} / {pages} 页</span><div className="flex gap-1"><button aria-label="上一页" disabled={pg === 0} onClick={() => setPg(pg - 1)} className="grid h-7 w-7 place-items-center rounded-md border border-line2 hover:bg-soft2 disabled:opacity-30"><ChevronLeft size={13} /></button><button aria-label="下一页" disabled={pg >= pages - 1} onClick={() => setPg(pg + 1)} className="grid h-7 w-7 place-items-center rounded-md border border-line2 hover:bg-soft2 disabled:opacity-30"><ChevronRight size={13} /></button></div></div>
    </div>
  );
}

/* ---------- accordion / timeline ---------- */
function Accordion() {
  const Q = [["什么是设计令牌？", "设计令牌把颜色、间距、字体等设计决策抽象成可复用的变量，让设计与代码保持一致。"], ["为什么只动画 transform？", "transform 与 opacity 由合成器处理，不触发布局与绘制，因此最流畅。"], ["如何做高度动画？", "使用 grid-template-rows 在 0fr 与 1fr 之间过渡，可以对 auto 高度做动画。"]];
  const [o, setO] = useState(0);
  return (
    <div className="mx-auto max-w-xl divide-y divide-line border-y border-line">
      {Q.map(([q, a], i) => (
        <div key={q}>
          <button aria-expanded={o === i} onClick={() => setO(o === i ? -1 : i)} className="flex w-full items-center justify-between py-4 text-left text-[14px] font-medium">{q}<ChevronDown size={16} className={cn("text-mute transition-transform duration-300", o === i && "rotate-180")} /></button>
          <div className={cn("grid transition-[grid-template-rows] duration-300", o === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><div className="overflow-hidden"><p className="pb-4 text-[13px] text-mute">{a}</p></div></div>
        </div>
      ))}
    </div>
  );
}
function Timeline() {
  const T = [["v2.0 发布", "全新设计系统上线", "今天"], ["Beta 测试", "收集 120 条反馈", "3 天前"], ["原型评审", "通过评审，进入开发", "上周"], ["项目启动", "组建团队", "上月"]];
  return (
    <ol className="mx-auto max-w-md">
      {T.map(([t, d, w], i) => (
        <li key={t} className="relative flex gap-4 pb-8 last:pb-0" style={{ animation: `fadeUp .6s ${i * 90}ms var(--ease) both` }}>
          {i < T.length - 1 && <span className="absolute bottom-0 left-[7px] top-4 w-px bg-line2" />}
          <span className={cn("relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2", i === 0 ? "border-fg bg-inv ring-4 ring-fg/10" : "border-line2 bg-bg")} />
          <div><div className="flex items-baseline gap-3"><span className="text-[14px] font-medium">{t}</span><span className="font-mono text-[11px] text-dim">{w}</span></div><div className="text-[13px] text-mute">{d}</div></div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- charts ---------- */
const LD = [32, 40, 36, 52, 48, 66, 58, 74, 70, 88, 80, 96];
function Charts() {
  const [t, setT] = useState("line");
  const [h, setH] = useState<number | null>(null);
  const [k, setK] = useState(0);
  const W = 520, H = 200, P = 24;
  const x = (i: number) => P + (i / (LD.length - 1)) * (W - P * 2);
  const y = (v: number) => H - P - (v / 100) * (H - P * 2);
  const path = LD.map((v, i) => { if (i === 0) return `M${x(0)},${y(v)}`; const cx = (x(i - 1) + x(i)) / 2; return `C${cx},${y(LD[i - 1])} ${cx},${y(v)} ${x(i)},${y(v)}`; }).join(" ");
  const seg = [[42, "设计"], [28, "开发"], [18, "运营"], [12, "其他"]] as [number, string][];
  const R = 70, C = 2 * Math.PI * R;
  let off = 0;
  const radar = [["速度", 80], ["质量", 92], ["成本", 60], ["体验", 88], ["稳定", 74]] as [string, number][];
  const rp = (i: number, v: number) => { const a = (i / 5) * Math.PI * 2 - Math.PI / 2; return [130 + Math.cos(a) * v * 0.9, 110 + Math.sin(a) * v * 0.9]; };
  return (
    <div>
      <div className="mb-5 flex items-center justify-between"><Seg value={t} onChange={(v) => { setT(v); setK((x) => x + 1); }} options={[{ value: "line", label: "折线" }, { value: "bar", label: "柱状" }, { value: "donut", label: "环形" }, { value: "radar", label: "雷达" }]} /><button aria-label="重播" onClick={() => setK(k + 1)} className="grid h-8 w-8 place-items-center rounded-lg text-mute hover:bg-soft2"><RefreshCw size={14} /></button></div>
      <div className="rounded-xl border border-line bg-bg p-4">
        {t === "line" && (
          <svg key={k} viewBox={`0 0 ${W} ${H}`} className="w-full" onMouseLeave={() => setH(null)} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W; setH(clamp(Math.round(((px - P) / (W - P * 2)) * (LD.length - 1)), 0, LD.length - 1)); }}>
            {[0, 25, 50, 75, 100].map((g) => <line key={g} x1={P} x2={W - P} y1={y(g)} y2={y(g)} stroke="var(--line)" />)}
            <path d={path + ` L${x(11)},${H - P} L${x(0)},${H - P}Z`} fill="var(--fg)" opacity=".05" />
            <path d={path} fill="none" stroke="var(--fg)" strokeWidth="1.8" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 1.4s var(--ease) forwards" }} />
            {h != null && <g><line x1={x(h)} x2={x(h)} y1={P / 2} y2={H - P} stroke="var(--fg)" strokeDasharray="3 3" opacity=".4" /><circle cx={x(h)} cy={y(LD[h])} r="4" fill="var(--bg)" stroke="var(--fg)" strokeWidth="2" /><rect x={clamp(x(h) - 28, 0, W - 56)} y={y(LD[h]) - 32} width="56" height="22" rx="6" fill="var(--fg)" /><text x={clamp(x(h), 28, W - 28)} y={y(LD[h]) - 17} textAnchor="middle" fontSize="11" fill="var(--bg)" fontFamily="var(--font-mono)">{h + 1}月 · {LD[h]}</text></g>}
            {LD.map((_, i) => <text key={i} x={x(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--dim)" fontFamily="var(--font-mono)">{i + 1}</text>)}
          </svg>
        )}
        {t === "bar" && <div key={k} className="flex h-[200px] items-end gap-2 px-2 pb-5">{LD.map((v, i) => <div key={i} className="group relative flex-1"><div className="origin-bottom rounded-t bg-fg/80 transition-colors group-hover:bg-fg" style={{ height: v * 1.6, animation: `growY .8s ${i * 50}ms var(--ease) both` }} /><span className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] text-dim">{i + 1}</span><span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100" style={{ top: 160 - v * 1.6 - 26 + 0 }}>{v}</span></div>)}</div>}
        {t === "donut" && (
          <div key={k} className="flex flex-wrap items-center justify-center gap-10 py-3">
            <svg width="190" height="190" viewBox="0 0 190 190" className="-rotate-90">
              {seg.map(([v], i) => { const len = (v / 100) * C; const o = off; off += len; return <circle key={i} cx="95" cy="95" r={R} fill="none" stroke="var(--fg)" strokeOpacity={1 - i * 0.26} strokeWidth="22" strokeDasharray={`${len - 2} ${C}`} strokeDashoffset={-o} style={{ animation: `fadeIn .6s ${i * 0.15}s both` }} />; })}
            </svg>
            <ul className="space-y-2 text-[13px]">{seg.map(([v, n], i) => <li key={n} className="flex items-center gap-3"><span className="h-2.5 w-2.5 rounded-sm bg-fg" style={{ opacity: 1 - i * 0.26 }} />{n}<span className="ml-auto pl-6 font-mono tabular-nums text-mute">{v}%</span></li>)}</ul>
          </div>
        )}
        {t === "radar" && (
          <svg key={k} viewBox="0 0 260 220" className="mx-auto w-full max-w-sm">
            {[30, 60, 90].map((r) => <polygon key={r} points={radar.map((_, i) => rp(i, r).join(",")).join(" ")} fill="none" stroke="var(--line2)" />)}
            {radar.map((_, i) => <line key={i} x1="130" y1="110" x2={rp(i, 100)[0]} y2={rp(i, 100)[1]} stroke="var(--line)" />)}
            <polygon points={radar.map(([, v], i) => rp(i, v).join(",")).join(" ")} fill="var(--fg)" fillOpacity=".1" stroke="var(--fg)" strokeWidth="1.6" style={{ transformOrigin: "130px 110px", animation: "scaleIn .8s var(--ease) both" }} />
            {radar.map(([n], i) => <text key={n} x={rp(i, 112)[0]} y={rp(i, 112)[1] + 3} textAnchor="middle" fontSize="11" fill="var(--mute)">{n}</text>)}
          </svg>
        )}
      </div>
    </div>
  );
}

/* ---------- tree ---------- */
type Node = { n: string; c?: Node[] };
const TREE: Node[] = [{ n: "src", c: [{ n: "components", c: [{ n: "Button.tsx" }, { n: "Input.tsx" }, { n: "Modal.tsx" }] }, { n: "hooks", c: [{ n: "useTheme.ts" }] }, { n: "App.tsx" }] }, { n: "public", c: [{ n: "logo.svg" }] }, { n: "package.json" }];
function TreeNode({ node, depth, sel, setSel }: { node: Node; depth: number; sel: string; setSel: (s: string) => void }) {
  const [o, setO] = useState(depth === 0);
  const folder = !!node.c;
  return (
    <div>
      <button onClick={() => { folder ? setO(!o) : setSel(node.n); }} className={cn("flex h-8 w-full items-center gap-2 rounded-md pr-2 text-left text-[13px] transition-colors hover:bg-soft2", sel === node.n && "bg-soft2 font-medium")} style={{ paddingLeft: 8 + depth * 16 }}>
        {folder ? <ChevronRight size={13} className={cn("shrink-0 text-dim transition-transform", o && "rotate-90")} /> : <span className="w-[13px]" />}
        {folder ? (o ? <FolderOpen size={14} /> : <Folder size={14} />) : <FileText size={14} className="text-mute" />}{node.n}
      </button>
      {folder && <div className={cn("grid transition-[grid-template-rows] duration-300", o ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}><div className="overflow-hidden">{node.c!.map((c) => <TreeNode key={c.n} node={c} depth={depth + 1} sel={sel} setSel={setSel} />)}</div></div>}
    </div>
  );
}
function Tree() {
  const [sel, setSel] = useState("Button.tsx");
  return <div className="mx-auto max-w-xs rounded-xl border border-line bg-bg p-2">{TREE.map((n) => <TreeNode key={n.n} node={n} depth={0} sel={sel} setSel={setSel} />)}</div>;
}

/* ---------- kanban ---------- */
function Kanban() {
  const [cols, setCols] = useState<Record<string, string[]>>({ 待办: ["撰写 PRD", "设计线框"], 进行中: ["开发登录页"], 完成: ["搭建项目"] });
  const [drag, setDrag] = useState<{ t: string; from: string } | null>(null);
  const [over, setOver] = useState("");
  const drop = (to: string) => { if (!drag || drag.from === to) return; setCols({ ...cols, [drag.from]: cols[drag.from].filter((x) => x !== drag.t), [to]: [...cols[to], drag.t] }); };
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {Object.entries(cols).map(([c, items]) => (
        <div key={c} onDragOver={(e) => { e.preventDefault(); setOver(c); }} onDragLeave={() => setOver("")} onDrop={() => { drop(c); setOver(""); setDrag(null); }} className={cn("min-h-44 rounded-xl border bg-soft p-2.5 transition-colors", over === c && drag?.from !== c ? "border-fg bg-soft2" : "border-line")}>
          <div className="mb-2.5 flex items-center justify-between px-1 text-xs font-medium">{c}<span className="font-mono text-dim">{items.length}</span></div>
          <div className="space-y-2">
            {items.map((t) => <div key={t} draggable onDragStart={() => setDrag({ t, from: c })} onDragEnd={() => setDrag(null)} className={cn("flex cursor-grab items-center gap-2 rounded-lg border border-line bg-bg p-3 text-[13px] transition-all active:cursor-grabbing hover:border-line2 hover:shadow-soft", drag?.t === t && "opacity-40")}><GripVertical size={13} className="text-dim" />{t}</div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- heatmap ---------- */
function Heatmap() {
  const cells = useMemo(() => { let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; return Array.from({ length: 52 * 7 }, (_, i) => { const w = Math.floor(i / 7); const v = r() * (0.4 + (w / 52) * 0.8); return v < 0.35 ? 0 : v < 0.55 ? 1 : v < 0.75 ? 2 : v < 0.95 ? 3 : 4; }); }, []);
  const [tip, setTip] = useState("悬停查看详情");
  const lv = [0, 18, 38, 62, 100];
  return (
    <div>
      <div className="overflow-x-auto pb-2"><div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">{cells.map((v, i) => <div key={i} onMouseEnter={() => setTip(`第 ${Math.floor(i / 7) + 1} 周 · 周${"日一二三四五六"[i % 7]} · ${v * 3} 次贡献`)} className="h-3 w-3 rounded-[3px] border border-line transition-transform hover:scale-150" style={{ background: v ? `color-mix(in oklab, var(--fg) ${lv[v]}%, var(--bg))` : "var(--soft2)" }} />)}</div></div>
      <div className="mt-3 flex items-center justify-between text-xs text-mute"><span className="font-mono">{tip}</span><span className="flex items-center gap-1.5">少{lv.map((l, i) => <span key={i} className="h-3 w-3 rounded-[3px] border border-line" style={{ background: l ? `color-mix(in oklab, var(--fg) ${l}%, var(--bg))` : "var(--soft2)" }} />)}多</span></div>
    </div>
  );
}

/* ---------- carousel / compare ---------- */
function Art({ i, dark }: { i: number; dark?: boolean }) {
  const fg = dark ? "#f4f4f4" : "#0a0a0a", bg = dark ? "#0a0a0a" : "#f4f4f4";
  return (
    <svg viewBox="0 0 400 240" className="h-full w-full" preserveAspectRatio="xMidYMid slice"><rect width="400" height="240" fill={bg} />
      {i === 0 && <g fill="none" stroke={fg}>{Array.from({ length: 14 }).map((_, k) => <circle key={k} cx="200" cy="120" r={12 + k * 14} strokeWidth="1" opacity={1 - k * 0.06} />)}</g>}
      {i === 1 && <g fill={fg}>{Array.from({ length: 12 }).map((_, k) => <rect key={k} x={20 + k * 31} y={240 - (30 + ((k * 37) % 150))} width="22" height={30 + ((k * 37) % 150)} />)}</g>}
      {i === 2 && <g stroke={fg} strokeWidth="1.2">{Array.from({ length: 30 }).map((_, k) => <line key={k} x1={k * 14} y1="0" x2={400 - k * 14} y2="240" />)}</g>}
      {i === 3 && <g fill={fg}><circle cx="140" cy="120" r="70" /><rect x="210" y="50" width="130" height="140" fill="none" stroke={fg} strokeWidth="2" /></g>}
    </svg>
  );
}
function Carousel() {
  const [i, setI] = useState(0);
  const [dx, setDx] = useState(0);
  const sx = useRef<number | null>(null);
  const [hov, setHov] = useState(false);
  const N = 4;
  useInterval(() => setI((x) => (x + 1) % N), hov || sx.current != null ? null : 3500);
  return (
    <div className="mx-auto max-w-xl" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="relative aspect-[5/3] touch-pan-y select-none overflow-hidden rounded-xl border border-line"
        onPointerDown={(e) => { sx.current = e.clientX; }} onPointerMove={(e) => sx.current != null && setDx(e.clientX - sx.current)}
        onPointerUp={() => { if (Math.abs(dx) > 50) setI((i + (dx < 0 ? 1 : -1) + N) % N); sx.current = null; setDx(0); }} onPointerLeave={() => { sx.current = null; setDx(0); }}>
        <div className="flex h-full" style={{ transform: `translateX(calc(${-i * 100}% + ${dx}px))`, transition: sx.current != null ? "none" : "transform .6s var(--ease)" }}>{Array.from({ length: N }).map((_, k) => <div key={k} className="h-full w-full shrink-0"><Art i={k} /></div>)}</div>
        <button aria-label="上一张" onClick={() => setI((i + N - 1) % N)} className="glass absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line2"><ChevronLeft size={16} /></button>
        <button aria-label="下一张" onClick={() => setI((i + 1) % N)} className="glass absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line2"><ChevronRight size={16} /></button>
      </div>
      <div className="mt-4 flex justify-center gap-1.5">{Array.from({ length: N }).map((_, k) => <button key={k} aria-label={`第 ${k + 1} 张`} onClick={() => setI(k)} className={cn("h-1.5 rounded-full transition-all duration-300", k === i ? "w-6 bg-fg" : "w-1.5 bg-line2")} />)}</div>
    </div>
  );
}
function Compare() {
  const [p, setP] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const set = (cx: number) => { const r = ref.current!.getBoundingClientRect(); setP(clamp(((cx - r.left) / r.width) * 100, 0, 100)); };
  return (
    <div ref={ref} className="relative mx-auto aspect-[5/3] max-w-xl cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-line" onPointerDown={(e) => { drag.current = true; set(e.clientX); }} onPointerMove={(e) => drag.current && set(e.clientX)} onPointerUp={() => (drag.current = false)} onPointerLeave={() => (drag.current = false)}>
      <div className="absolute inset-0"><Art i={3} /></div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - p}% 0 0)` }}><Art i={3} dark /></div>
      <div className="absolute inset-y-0 w-px bg-white mix-blend-difference" style={{ left: p + "%" }} />
      <div className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line2 bg-bg shadow-soft" style={{ left: p + "%" }}><ChevronLeft size={12} /><ChevronRight size={12} /></div>
      <span className="absolute left-3 top-3 rounded bg-bg px-1.5 py-0.5 font-mono text-[10px]">DARK</span><span className="absolute right-3 top-3 rounded bg-inv px-1.5 py-0.5 font-mono text-[10px] text-invfg">LIGHT</span>
    </div>
  );
}

/* ---------- bento / rank / virtual / chat ---------- */
function Bento() {
  return (
    <div className="grid auto-rows-[110px] grid-cols-2 gap-3 md:grid-cols-4">
      <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl bg-inv p-5 text-invfg"><div className="text-xs opacity-60">总览</div><div className="mt-2 text-4xl font-semibold tracking-tight">98.2%</div><div className="mt-1 text-[13px] opacity-60">全年可用性</div><div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full border border-invfg/20 transition-transform duration-700 group-hover:scale-125" /><div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full border border-invfg/30 transition-transform duration-700 group-hover:scale-125" /></div>
      <div className="rounded-2xl border border-line bg-bg p-4"><Users size={16} /><div className="mt-5 text-xl font-semibold">4 位</div><div className="text-xs text-mute">成员在线</div></div>
      <div className="rounded-2xl border border-line bg-soft2 p-4"><Activity size={16} /><div className="mt-5 text-xl font-semibold">1.2k</div><div className="text-xs text-mute">今日请求</div></div>
      <div className="col-span-2 flex items-center justify-between rounded-2xl border border-line bg-bg p-4"><div><div className="text-[13px] font-medium">专业版</div><div className="mt-0.5 text-xs text-mute">无限项目 · 优先支持</div></div><Btn size="sm">升级</Btn></div>
    </div>
  );
}

function Rank() {
  const [d, setD] = useState([["林夕", 92], ["王小明", 85], ["陈默", 77], ["周周", 70], ["李白", 64]] as [string, number][]);
  const order = [...d].sort((a, b) => b[1] - a[1]);
  return (
    <div className="mx-auto max-w-sm">
      <div className="relative" style={{ height: order.length * 48 }}>
        {d.map(([n, v]) => { const r = order.findIndex((x) => x[0] === n); return (
          <div key={n} className="absolute inset-x-0 flex h-10 items-center gap-3 rounded-lg border border-line bg-bg px-3 text-[13px]" style={{ transform: `translateY(${r * 48}px)`, transition: "transform .7s cubic-bezier(.34,1.3,.64,1)" }}>
            <span className="w-4 font-mono text-[11px] text-dim">{r + 1}</span><span className="w-14">{n}</span>
            <div className="h-1 flex-1 rounded bg-soft2"><div className="h-1 rounded bg-fg transition-all duration-700" style={{ width: v + "%" }} /></div><span className="w-8 text-right font-mono tabular-nums">{v}</span>
          </div>); })}
      </div>
      <Btn className="mt-4" variant="outline" size="sm" onClick={() => setD(d.map(([n]) => [n, Math.round(30 + Math.random() * 70)]))}><RefreshCw size={13} />随机刷新分数</Btn>
    </div>
  );
}

function Virtual() {
  const N = 10000, H = 36, VH = 260;
  const [st, setSt] = useState(0);
  const s = Math.max(0, Math.floor(st / H) - 3), e = Math.min(N, Math.ceil((st + VH) / H) + 3);
  return (
    <div>
      <div className="h-[260px] overflow-auto rounded-xl border border-line bg-bg" onScroll={(e) => setSt(e.currentTarget.scrollTop)}>
        <div style={{ height: N * H, position: "relative" }}>
          {Array.from({ length: e - s }, (_, i) => s + i).map((i) => <div key={i} className="absolute inset-x-0 flex items-center gap-3 border-b border-line px-4 text-[13px]" style={{ top: i * H, height: H }}><span className="w-14 font-mono text-[11px] text-dim">#{String(i + 1).padStart(5, "0")}</span>列表项 {i + 1}</div>)}
        </div>
      </div>
      <div className="mt-3 font-mono text-xs text-mute">共 {N.toLocaleString()} 条 · 实际渲染 DOM 节点：<span className="text-fg">{e - s}</span></div>
    </div>
  );
}

function Chat() {
  const [m, setM] = useState([["them", "你好！有什么可以帮你的？"], ["me", "想了解一下聊天气泡怎么设计"], ["them", "自己的消息靠右用深色，对方的靠左用浅灰；连续消息合并圆角。"]] as [string, string][]);
  const [v, setV] = useState("");
  const [typing, setTyping] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { box.current?.scrollTo({ top: 9999, behavior: "smooth" }); }, [m, typing]);
  const send = () => { if (!v.trim()) return; setM([...m, ["me", v]]); setV(""); setTyping(true); setTimeout(() => { setTyping(false); setM((x) => [...x, ["them", "收到。好的设计是尽可能少的设计。"]]); }, 1400); };
  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-line bg-bg">
      <div ref={box} className="h-64 space-y-2 overflow-y-auto p-4" aria-live="polite">
        {m.map(([w, t], i) => <div key={i} className={cn("anim-fade-up flex", w === "me" && "justify-end")} style={{ animationDuration: ".3s" }}><div className={cn("max-w-[80%] px-3.5 py-2 text-[13px]", w === "me" ? "rounded-2xl rounded-br-md bg-inv text-invfg" : "rounded-2xl rounded-bl-md bg-soft2")}>{t}</div></div>)}
        {typing && <div className="flex"><div className="flex gap-1 rounded-2xl rounded-bl-md bg-soft2 px-3.5 py-3">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-mute" style={{ animation: `dotpulse 1.2s ${i * 0.15}s infinite` }} />)}</div></div>}
      </div>
      <div className="flex gap-2 border-t border-line p-3"><input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="输入消息…" className="h-9 flex-1 rounded-lg border border-line2 bg-bg px-3 text-[13px] outline-none focus:border-fg" /><Btn size="icon" aria-label="发送" onClick={send}><Send size={14} /></Btn></div>
    </div>
  );
}

const _u = [Kbd, Row, Plus];
void _u;

export const data: Section[] = [
  {
    id: "data", group: "components", title: "数据展示", en: "Data Display",
    desc: "数据展示的目标是“让信息被看懂”：排序、过滤、分层、对比。",
    blocks: [
      { id: "d-cards", title: "卡片", desc: "内容的基本容器。悬停上浮 + 阴影加深传达“可点击”。", tips: ["整张卡片可点击时，用 ::after 伪元素撑满，避免嵌套 a。"], render: () => <Cards /> },
      { id: "d-metric", title: "指标卡片与迷你图", desc: "一个大数字 + 变化趋势 + 迷你折线。上升与下降同时用图标表达，不只靠颜色。", render: () => <Metrics /> },
      { id: "d-table", title: "数据表格", desc: "排序（三态）、筛选、多选、分页四件套。", tips: ["th 使用 aria-sort；复选框要有 aria-label。"], render: () => <Table /> },
      { id: "d-acc", title: "手风琴", desc: "折叠次要内容。高度动画用 grid-rows 0fr → 1fr，无需 JS 测量。", render: () => <Accordion /> },
      { id: "d-time", title: "时间线", desc: "按时间顺序展示事件。当前节点带光环，列表依次淡入。", render: () => <Timeline /> },
      { id: "d-chart", title: "SVG 图表", desc: "不引入图表库，手写四种基础图表。折线带悬停十字线。", tips: ["折线用三次贝塞尔平滑：控制点取相邻 x 的中点。", "图表需配文字摘要，不只靠颜色区分系列。"], render: () => <Charts /> },
      { id: "d-tree", title: "树形视图", desc: "递归组件 + 缩进，折叠同样使用 grid-rows 动画。", render: () => <Tree /> },
      { id: "d-kanban", title: "看板拖放", desc: "原生 HTML5 拖放，无需任何库。", render: () => <Kanban /> },
      { id: "d-heat", title: "日历热力图", desc: "用 5 级明度展示一年的活跃度，GitHub 贡献图风格。", render: () => <Heatmap /> },
      { id: "d-carousel", title: "轮播", desc: "支持按钮、圆点、拖拽与自动播放（悬停暂停）。", render: () => <Carousel /> },
      { id: "d-compare", title: "对比滑块", desc: "拖动分割线对比深浅两版。两层叠放，上层用 clip-path 裁剪。", render: () => <Compare /> },
      { id: "d-bento", title: "便当格布局", desc: "用大小不一的方块组织信息，层次分明。", render: () => <Bento /> },
      { id: "d-rank", title: "动态排行榜", desc: "排名变化时每一行平滑滑向新位置——改 translateY，而不是替换 DOM。", render: () => <Rank /> },
      { id: "d-virtual", title: "虚拟滚动", desc: "一万条数据只渲染可视区域内的十几个节点。", render: () => <Virtual /> },
      { id: "d-chat", title: "聊天气泡", desc: "自己靠右深色，对方靠左浅灰；“正在输入”三点动画。", render: () => <Chat /> },
    ],
  },
];
void Zap;
