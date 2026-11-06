import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Home, Search, Mail, Calendar, Music, Camera, Settings, Trash2, ChevronRight, ChevronLeft, ChevronDown, MoreHorizontal, Check, X, Bell, Inbox, Users, LayoutDashboard,
  Phone, Play, Pause, SkipForward, Timer, Copy, Scissors, Clipboard, Pencil, Info, AlertTriangle, CheckCircle2, XCircle, Plus, Undo2, Command as CmdIcon, Menu, PanelLeftClose, PanelLeftOpen, Folder, Image as ImageIcon, FileText, ArrowRight,
} from "lucide-react";
import type { Section } from "@/types";
import { Btn, Seg, Range, Kbd, Caption, Row, Floating } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useClickOutside, useInterval, clamp } from "@/lib/hooks";

/* ================= NAVIGATION ================= */
function Navbar() {
  const items = ["产品", "方案", "定价", "文档", "关于"];
  const [hv, setHv] = useState<{ l: number; w: number } | null>(null);
  const [act, setAct] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="mx-auto flex max-w-2xl items-center justify-between rounded-2xl border border-line2 bg-bg px-3 py-2 shadow-soft">
      <div className="flex items-center gap-2 pl-1 text-sm font-semibold"><span className="grid h-6 w-6 place-items-center rounded-md bg-inv text-invfg"><Plus size={13} /></span>形色场</div>
      <div ref={ref} className="relative hidden gap-1 sm:flex" onMouseLeave={() => setHv(null)}>
        <span className="absolute top-0 h-full rounded-lg bg-soft2 transition-all duration-300" style={{ left: hv?.l ?? 0, width: hv?.w ?? 0, opacity: hv ? 1 : 0, transitionTimingFunction: "var(--ease)" }} />
        {items.map((t, i) => (
          <button key={t} onMouseEnter={(e) => setHv({ l: e.currentTarget.offsetLeft, w: e.currentTarget.offsetWidth })} onClick={() => setAct(i)} className={cn("relative px-3.5 py-1.5 text-[13px] transition-colors", act === i ? "font-medium text-fg" : "text-mute hover:text-fg")}>{t}</button>
        ))}
      </div>
      <Btn size="sm">开始使用</Btn>
    </div>
  );
}

function Tabs() {
  const tabs = [["overview", "概览", LayoutDashboard], ["activity", "活动", Inbox], ["settings", "设置", Settings]] as const;
  const [a, setA] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [ind, setInd] = useState({ l: 0, w: 0 });
  useEffect(() => { const e = refs.current[a]!; setInd({ l: e.offsetLeft, w: e.offsetWidth }); }, [a]);
  return (
    <div className="mx-auto max-w-lg">
      <div role="tablist" className="relative flex gap-1 border-b border-line">
        {tabs.map(([k, t, I], i) => (
          <button key={k} ref={(el) => { refs.current[i] = el; }} role="tab" aria-selected={a === i} onClick={() => setA(i)}
            onKeyDown={(e) => { if (e.key === "ArrowRight") setA((a + 1) % 3); if (e.key === "ArrowLeft") setA((a + 2) % 3); }}
            className={cn("flex items-center gap-1.5 px-4 py-2.5 text-[13px] transition-colors", a === i ? "font-medium text-fg" : "text-mute hover:text-fg")}><I size={14} />{t}</button>
        ))}
        <span className="absolute -bottom-px h-0.5 bg-fg transition-all duration-300" style={{ left: ind.l, width: ind.w, transitionTimingFunction: "var(--ease)" }} />
      </div>
      <div key={a} className="anim-fade-up py-6 text-[13px] text-mute" style={{ animationDuration: ".35s" }}>
        {["这里是项目概览：核心指标、最近动态与待办事项。", "活动流：成员的每一次提交、评论与审批都会出现在这里。", "设置：团队、权限、集成与账单。"][a]}
      </div>
    </div>
  );
}

function CrumbPager() {
  const [exp, setExp] = useState(false);
  const [p, setP] = useState(7);
  const N = 20;
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= N; i++) if (i === 1 || i === N || Math.abs(i - p) <= 1) pages.push(i); else if (pages[pages.length - 1] !== "…") pages.push("…");
  return (
    <div className="space-y-8">
      <nav aria-label="面包屑" className="flex items-center gap-1.5 text-[13px] text-mute">
        <Home size={14} />
        <ChevronRight size={13} className="text-dim" />
        {!exp ? <button aria-label="展开隐藏层级" onClick={() => setExp(true)} className="grid h-6 w-6 place-items-center rounded hover:bg-soft2"><MoreHorizontal size={14} /></button> : <>{["设计系统", "组件库"].map((t) => <span key={t} className="anim-scale-in flex items-center gap-1.5"><a className="cursor-pointer hover:text-fg">{t}</a><ChevronRight size={13} className="text-dim" /></span>)}</>}
        <a className="cursor-pointer hover:text-fg">表单</a>
        <ChevronRight size={13} className="text-dim" />
        <span aria-current="page" className="font-medium text-fg">输入框</span>
      </nav>
      <div className="flex flex-wrap items-center gap-1">
        <button aria-label="上一页" disabled={p === 1} onClick={() => setP(p - 1)} className="inline-grid h-9 w-9 place-items-center align-middle rounded-lg border border-line2 hover:bg-soft2 disabled:opacity-30"><ChevronLeft size={14} /></button>
        {pages.map((x, i) => x === "…" ? <span key={i} className="inline-grid h-9 w-9 place-items-center align-middle text-dim">…</span> : <button key={i} aria-current={p === x ? "page" : undefined} onClick={() => setP(x)} className={cn("h-9 min-w-9 rounded-lg px-2 text-[13px] tabular-nums transition-colors", p === x ? "bg-inv text-invfg" : "hover:bg-soft2")}>{x}</button>)}
        <button aria-label="下一页" disabled={p === N} onClick={() => setP(p + 1)} className="inline-grid h-9 w-9 place-items-center align-middle rounded-lg border border-line2 hover:bg-soft2 disabled:opacity-30"><ChevronRight size={14} /></button>
      </div>
    </div>
  );
}

function Steps() {
  const S = ["账号", "资料", "偏好", "完成"];
  const [s, setS] = useState(1);
  return (
    <div className="mx-auto max-w-lg">
      <div className="flex items-start">
        {S.map((t, i) => (
          <div key={t} className={cn("relative flex flex-1 flex-col items-center", i === 0 && "flex-none")} style={i === 0 ? { width: 0 } : undefined}>
            {i > 0 && <div className="absolute right-1/2 top-4 h-px w-full bg-line2"><div className="h-px bg-fg transition-all duration-500" style={{ width: s >= i ? "100%" : 0 }} /></div>}
            <div className={cn("relative z-10 grid h-8 w-8 place-items-center rounded-full border text-xs font-medium transition-all duration-300", i < s ? "border-fg bg-inv text-invfg" : i === s ? "border-fg bg-bg ring-4 ring-fg/10" : "border-line2 bg-bg text-dim")}>{i < s ? <Check size={14} /> : i + 1}</div>
            <div className={cn("mt-2 whitespace-nowrap text-xs", i <= s ? "text-fg" : "text-dim")}>{t}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center gap-2"><Btn variant="outline" size="sm" disabled={s === 0} onClick={() => setS(s - 1)}>上一步</Btn><Btn size="sm" disabled={s === 3} onClick={() => setS(s + 1)}>下一步</Btn></div>
    </div>
  );
}

function SidebarDemo() {
  const [col, setCol] = useState(false);
  const [a, setA] = useState(0);
  const items: [any, string, number?][] = [[LayoutDashboard, "仪表盘"], [Inbox, "收件箱", 5], [Users, "团队"], [Calendar, "日历"], [Settings, "设置"]];
  return (
    <div className="flex h-72 overflow-hidden rounded-xl border border-line2 bg-bg">
      <aside className="flex shrink-0 flex-col border-r border-line p-2 transition-[width] duration-300" style={{ width: col ? 56 : 204, transitionTimingFunction: "var(--ease)" }}>
        <div className="flex h-9 items-center justify-between overflow-hidden px-2 text-sm font-semibold"><span className={cn("whitespace-nowrap transition-opacity", col && "opacity-0")}>工作台</span></div>
        <nav className="mt-2 flex-1 space-y-0.5">
          {items.map(([I, t, n], i) => (
            <button key={t} title={t} onClick={() => setA(i)} className={cn("relative flex h-9 w-full items-center gap-3 overflow-hidden rounded-lg px-2.5 text-[13px] transition-colors", a === i ? "bg-soft2 font-medium text-fg" : "text-mute hover:bg-soft hover:text-fg")}>
              <I size={16} className="shrink-0" />
              <span className={cn("whitespace-nowrap transition-opacity duration-200", col && "opacity-0")}>{t}</span>
              {n && <span className={cn("ml-auto rounded-full bg-inv px-1.5 text-[10px] text-invfg transition-all", col && "absolute right-2 top-1.5 h-2 w-2 p-0 text-[0px]")}>{n}</span>}
            </button>
          ))}
        </nav>
        <button aria-label="收起侧栏" onClick={() => setCol(!col)} className="inline-grid h-9 w-9 place-items-center align-middle rounded-lg text-mute hover:bg-soft2 hover:text-fg">{col ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button>
      </aside>
      <main className="flex-1 p-6 text-[13px] text-mute"><div className="text-lg font-semibold text-fg">{items[a][1]}</div><p className="mt-2">内容区 · 侧栏{col ? "已收起为图标栏" : "已展开"}。</p></main>
    </div>
  );
}

function MenusDemo() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  const [ctx, setCtx] = useState<{ x: number; y: number } | null>(null);
  const [last, setLast] = useState("—");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!ctx) return; const c = () => setCtx(null); window.addEventListener("click", c); window.addEventListener("scroll", c, true); return () => { window.removeEventListener("click", c); window.removeEventListener("scroll", c, true); }; }, [ctx]);
  const M = ({ items, onPick }: { items: [any, string, boolean?][]; onPick: (t: string) => void }) => (
    <div role="menu" className="w-44 rounded-xl border border-line2 bg-bg p-1 shadow-pop anim-scale-in">
      {items.map(([I, t, d]) => <button key={t} role="menuitem" onClick={() => onPick(t)} className={cn("flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] hover:bg-soft2", d && "border-t border-line mt-1 rounded-t-none pt-2.5 font-medium")}><I size={14} />{t}</button>)}
    </div>
  );
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Caption>下拉菜单</Caption>
        <div ref={ref} className="relative inline-block">
          <Btn variant="outline" onClick={() => setOpen(!open)} aria-expanded={open}>账户 <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} /></Btn>
          <Floating anchor={ref} open={open} gap={8}>
            <M onPick={(t) => { setLast(t); setOpen(false); }} items={[[Users, "个人资料"], [Settings, "偏好设置"], [Plus, "邀请成员"], [X, "退出登录", true]]} />
          </Floating>
        </div>
      </div>
      <div>
        <Caption>右键菜单 · 上次：{last}</Caption>
        <div ref={box} onContextMenu={(e) => { e.preventDefault(); const r = box.current!.getBoundingClientRect(); setCtx({ x: Math.min(e.clientX - r.left, r.width - 180), y: Math.min(e.clientY - r.top, r.height - 170) }); }} className="relative grid h-44 select-none place-items-center overflow-hidden rounded-xl border border-dashed border-line2 text-xs text-mute">
          在此区域右键
          {ctx && <div className="absolute z-20" style={{ left: ctx.x, top: ctx.y }} onClick={(e) => e.stopPropagation()}><M onPick={(t) => { setLast(t); setCtx(null); }} items={[[Copy, "复制"], [Scissors, "剪切"], [Clipboard, "粘贴"], [Pencil, "重命名"], [Trash2, "删除", true]]} /></div>}
        </div>
      </div>
    </div>
  );
}

function Dock() {
  const icons = [Home, Search, Mail, Calendar, Music, Camera, Settings, Trash2];
  const [mx, setMx] = useState<number | null>(null);
  const BASE = 44, GAP = 8, PAD = 10;
  return (
    <div className="flex h-36 items-end justify-center pb-2">
      <div onMouseMove={(e) => setMx(e.clientX - e.currentTarget.getBoundingClientRect().left)} onMouseLeave={() => setMx(null)} className="flex items-end rounded-2xl border border-line2 bg-bg shadow-soft" style={{ padding: PAD, gap: GAP }}>
        {icons.map((I, i) => {
          const c = PAD + i * (BASE + GAP) + BASE / 2;
          const s = mx == null ? 1 : 1 + 0.85 * Math.exp(-((mx - c) ** 2) / (2 * 55 ** 2));
          return <button key={i} aria-label={["首页", "搜索", "邮件", "日历", "音乐", "相机", "设置", "回收站"][i]} className="grid place-items-center rounded-xl bg-soft2 text-fg" style={{ width: BASE, height: BASE, transform: `scale(${s})`, transformOrigin: "bottom", transition: mx == null ? "transform .4s var(--spring)" : "none" }}><I size={19} /></button>;
        })}
      </div>
    </div>
  );
}

function Island() {
  const [s, setS] = useState(0);
  const dims = [[130, 36, 18], [300, 64, 32], [300, 84, 36], [200, 56, 28]];
  const [w, h, r] = dims[s];
  const names = ["待机", "来电", "音乐", "计时"];
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="overflow-hidden bg-inv text-invfg transition-all duration-500" style={{ width: w, height: h, borderRadius: r, transitionTimingFunction: "cubic-bezier(.34,1.4,.64,1)" }}>
        <div key={s} className="anim-fade-up flex h-full items-center px-4 text-[13px]" style={{ animationDuration: ".4s", animationDelay: ".1s" }}>
          {s === 0 && <div className="mx-auto h-1.5 w-1.5 rounded-full bg-invfg/50" />}
          {s === 1 && <><div className="inline-grid h-9 w-9 place-items-center align-middle rounded-full bg-invfg/15 text-xs">陈</div><div className="ml-3 leading-tight"><div className="font-medium">陈小明</div><div className="text-[11px] opacity-60">00:42 通话中</div></div><div className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-invfg/15"><Phone size={14} /></div></>}
          {s === 2 && <div className="flex w-full items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-lg bg-invfg/15"><Music size={18} /></div><div className="min-w-0 flex-1 leading-tight"><div className="truncate font-medium">Gymnopédie No.1</div><div className="mt-1.5 flex h-4 items-end gap-0.5">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <span key={i} className="w-[3px] origin-bottom rounded-full bg-invfg" style={{ height: 14, animation: `bar ${0.7 + (i % 3) * 0.2}s ease-in-out ${i * 0.08}s infinite` }} />)}</div></div><Pause size={16} /></div>}
          {s === 3 && <><Timer size={16} /><span className="ml-2 font-mono text-base tabular-nums">04:59</span><span className="ml-auto text-[11px] opacity-60">计时</span></>}
        </div>
      </div>
      <Seg size="sm" value={String(s)} onChange={(v) => setS(+v)} options={names.map((n, i) => ({ value: String(i), label: n }))} />
    </div>
  );
}

function Toc() {
  const secs = ["简介", "安装", "使用", "进阶", "常见问题"];
  const [a, setA] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const onScroll = () => {
    const c = box.current!;
    let cur = 0;
    secs.forEach((_, i) => { const el = c.querySelector<HTMLElement>(`[data-s="${i}"]`)!; if (el.offsetTop - c.scrollTop < 60) cur = i; });
    setA(cur);
  };
  return (
    <div className="grid h-72 grid-cols-[1fr_130px] gap-6 overflow-hidden rounded-xl border border-line bg-bg">
      <div ref={box} onScroll={onScroll} className="relative overflow-y-auto p-6 scroll-smooth">
        {secs.map((s, i) => <section key={s} data-s={i} className="mb-8 min-h-40"><h4 className="text-lg font-semibold">{s}</h4><p className="mt-2 text-[13px] text-mute">这是「{s}」章节的内容。滚动时右侧目录会自动高亮当前所在章节；点击目录项则平滑滚动到对应位置。</p></section>)}
      </div>
      <nav className="relative py-6 pr-4">
        <div className="absolute bottom-6 left-0 top-6 w-px bg-line" />
        <span className="absolute left-0 w-px bg-fg transition-all duration-300" style={{ top: 24 + a * 32, height: 32 }} />
        {secs.map((s, i) => <button key={s} onClick={() => box.current!.scrollTo({ top: box.current!.querySelector<HTMLElement>(`[data-s="${i}"]`)!.offsetTop - 8 })} className={cn("block h-8 w-full pl-4 text-left text-xs transition-colors", a === i ? "font-medium text-fg" : "text-mute hover:text-fg")}>{s}</button>)}
      </nav>
    </div>
  );
}

function CmdTrigger() {
  return (
    <div className="grid place-items-center gap-4 py-6">
      <button onClick={() => window.dispatchEvent(new Event("hb:cmd"))} className="group flex h-11 w-80 max-w-full items-center gap-3 rounded-xl border border-line2 bg-bg px-4 text-[13px] text-dim shadow-soft transition-colors hover:border-fg">
        <Search size={15} />跳转到任意章节…<span className="ml-auto flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span>
      </button>
      <p className="text-xs text-mute">这就是本站使用的命令面板。支持 <Kbd>↑</Kbd> <Kbd>↓</Kbd> 选择，<Kbd>Enter</Kbd> 跳转。</p>
    </div>
  );
}

/* ================= FEEDBACK ================= */
type Toast = { id: number; t: string; k: "ok" | "err" | "info" };
function Toasts() {
  const [list, setList] = useState<Toast[]>([]);
  const id = useRef(0);
  const add = (t: string, k: Toast["k"]) => setList((l) => [...l.slice(-3), { id: ++id.current, t, k }]);
  const icon = { ok: CheckCircle2, err: XCircle, info: Info };
  return (
    <div>
      <Row>
        <Btn variant="outline" onClick={() => add("保存成功", "ok")}>成功</Btn>
        <Btn variant="outline" onClick={() => add("网络异常，请重试", "err")}>错误</Btn>
        <Btn variant="outline" onClick={() => add("有新版本可用", "info")}>信息</Btn>
      </Row>
      <div className="mt-5 flex min-h-36 flex-col items-end justify-end gap-2 rounded-xl border border-dashed border-line2 p-4">
        {list.map((x) => { const I = icon[x.k]; return (
          <div key={x.id} className="anim-fade-up group relative w-72 overflow-hidden rounded-xl border border-line2 bg-bg p-3.5 pr-9 text-[13px] shadow-soft" style={{ animationDuration: ".35s" }}>
            <div className="flex items-center gap-2.5"><I size={16} />{x.t}</div>
            <button aria-label="关闭" onClick={() => setList((l) => l.filter((y) => y.id !== x.id))} className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded text-mute hover:bg-soft2"><X size={13} /></button>
            <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-fg group-hover:[animation-play-state:paused]" style={{ animation: "drain 4s linear forwards" }} onAnimationEnd={() => setList((l) => l.filter((y) => y.id !== x.id))} />
          </div>); })}
        {!list.length && <div className="m-auto text-xs text-dim">点击上方按钮触发 · 悬停暂停倒计时</div>}
      </div>
    </div>
  );
}

function useLock(on: boolean) { useEffect(() => { if (!on) return; const o = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = o; }; }, [on]); }

function Modal() {
  const [open, setOpen] = useState(false);
  const cancel = useRef<HTMLButtonElement>(null);
  useLock(open);
  useEffect(() => { if (!open) return; cancel.current?.focus(); const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open]);
  return (
    <div>
      <Btn variant="danger" onClick={() => setOpen(true)}><Trash2 size={14} />删除项目…</Btn>
      {open && createPortal(
        <div className="fixed inset-0 z-[100] grid place-items-center p-4" style={{ animation: "fadeIn .2s both" }}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div role="dialog" aria-modal="true" className="anim-scale-in relative w-full max-w-sm rounded-2xl border border-line2 bg-bg p-6 shadow-pop">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-soft2"><AlertTriangle size={18} /></div>
            <h4 className="mt-4 text-lg font-semibold tracking-tight">确认删除该项目？</h4>
            <p className="mt-1.5 text-[13px] text-mute">此操作无法撤销，所有相关数据将被永久移除。</p>
            <div className="mt-6 flex justify-end gap-2"><button ref={cancel} onClick={() => setOpen(false)} className="h-9 rounded-lg border border-line2 px-4 text-[13px] hover:bg-soft2">取消</button><Btn onClick={() => setOpen(false)}>确认删除</Btn></div>
          </div>
        </div>, document.body)}
    </div>
  );
}

function Drawers() {
  const [k, setK] = useState<"" | "r" | "b">("");
  const [dy, setDy] = useState(0);
  const sy = useRef<number | null>(null);
  useLock(!!k);
  useEffect(() => { if (!k) return; const h = (e: KeyboardEvent) => e.key === "Escape" && setK(""); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [k]);
  return (
    <div>
      <Row><Btn variant="outline" onClick={() => setK("r")}>右侧抽屉</Btn><Btn variant="outline" onClick={() => { setDy(0); setK("b"); }}>底部面板</Btn></Row>
      {k && createPortal(
        <div className="fixed inset-0 z-[100]" style={{ animation: "fadeIn .2s both" }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setK("")} />
          {k === "r" ? (
            <aside className="absolute inset-y-0 right-0 flex w-80 max-w-full flex-col border-l border-line2 bg-bg shadow-pop" style={{ animation: "slideRight .35s cubic-bezier(.32,.72,0,1) both" }}>
              <div className="flex items-center justify-between border-b border-line p-4"><div className="font-semibold">筛选条件</div><button aria-label="关闭" onClick={() => setK("")} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-soft2"><X size={15} /></button></div>
              <div className="flex-1 space-y-5 p-4 text-[13px]"><label className="block"><div className="mb-1.5 text-xs font-medium">关键词</div><input className="h-9 w-full rounded-lg border border-line2 bg-bg px-3 outline-none focus:border-fg" /></label><div><div className="mb-1.5 text-xs font-medium">状态</div><div className="flex flex-wrap gap-2">{["全部", "进行中", "已完成", "已归档"].map((t, i) => <span key={t} className={cn("rounded-full border px-3 py-1 text-xs", i === 0 ? "border-fg bg-inv text-invfg" : "border-line2 text-mute")}>{t}</span>)}</div></div></div>
              <div className="flex gap-2 border-t border-line p-4"><Btn variant="outline" className="flex-1" onClick={() => setK("")}>重置</Btn><Btn className="flex-1" onClick={() => setK("")}>应用</Btn></div>
            </aside>
          ) : (
            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-lg rounded-t-3xl border border-b-0 border-line2 bg-bg p-5 shadow-pop" style={{ transform: `translateY(${dy}px)`, transition: sy.current == null ? "transform .3s var(--ease)" : "none", animation: dy === 0 ? "slideUp .35s cubic-bezier(.32,.72,0,1) both" : undefined }}>
              <div className="mx-auto mb-4 h-1.5 w-10 cursor-grab touch-none rounded-full bg-line2" onPointerDown={(e) => { sy.current = e.clientY; (e.target as HTMLElement).setPointerCapture(e.pointerId); }} onPointerMove={(e) => sy.current != null && setDy(Math.max(0, e.clientY - sy.current))} onPointerUp={() => { sy.current = null; if (dy > 100) setK(""); else setDy(0); }} />
              <div className="font-semibold">分享到</div>
              <div className="mt-4 grid grid-cols-4 gap-3 pb-4">{[[Copy, "链接"], [Mail, "邮件"], [ImageIcon, "海报"], [FileText, "文档"]].map(([I, t]: any) => <button key={t} className="flex flex-col items-center gap-2 text-xs text-mute hover:text-fg"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-soft2"><I size={18} /></span>{t}</button>)}</div>
              <div className="text-center text-[11px] text-dim">向下拖动手柄超过 100px 关闭</div>
            </div>
          )}
        </div>, document.body)}
    </div>
  );
}

function Alerts() {
  const init = [["info", Info, "系统将于今晚 23:00 进行维护。"], ["ok", CheckCircle2, "你的更改已保存。"], ["warn", AlertTriangle, "存储空间已使用 90%。"], ["err", XCircle, "支付失败，请检查银行卡信息。"]] as const;
  const [shown, setShown] = useState([true, true, true, true]);
  return (
    <div className="space-y-2">
      {init.map(([k, I, t], i) => (
        <div key={k} className={cn("grid transition-all duration-300", shown[i] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div role={k === "err" ? "alert" : "status"} className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 text-[13px]", k === "err" ? "border-fg bg-soft2" : k === "warn" ? "border-dashed border-fg/50" : "border-line2 bg-bg")}>
              <I size={16} /><span className="flex-1">{t}</span>
              <button aria-label="关闭" onClick={() => setShown(shown.map((x, j) => (j === i ? false : x)))} className="text-mute hover:text-fg"><X size={14} /></button>
            </div>
          </div>
        </div>
      ))}
      {!shown.some(Boolean) && <Btn variant="outline" size="sm" onClick={() => setShown([true, true, true, true])}>全部恢复</Btn>}
    </div>
  );
}

function Progress() {
  const [p, setP] = useState(64);
  useInterval(() => setP((x) => (x >= 100 ? 0 : x + 1)), 120);
  const r = 28, c = 2 * Math.PI * r;
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <div><div className="mb-2 flex justify-between text-xs text-mute"><span>线性 · 确定</span><span className="font-mono">{p}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-soft2"><div className="h-full rounded-full bg-fg transition-all" style={{ width: p + "%" }} /></div></div>
        <div><div className="mb-2 text-xs text-mute">线性 · 不定</div><div className="relative h-1.5 overflow-hidden rounded-full bg-soft2"><div className="absolute inset-y-0 w-1/3 rounded-full bg-fg" style={{ animation: "indet 1.4s ease-in-out infinite" }} /></div></div>
        <div><div className="mb-2 text-xs text-mute">分段</div><div className="flex gap-1">{Array.from({ length: 10 }).map((_, i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i < p / 10 ? "bg-fg" : "bg-soft2")} />)}</div></div>
      </div>
      <div className="flex items-center justify-around">
        <div className="relative grid h-[72px] w-[72px] place-items-center"><svg width="72" height="72" viewBox="0 0 72 72" className="-rotate-90"><circle cx="36" cy="36" r={r} fill="none" stroke="var(--line2)" strokeWidth="3" /><circle cx="36" cy="36" r={r} fill="none" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - p / 100)} /></svg><span className="absolute font-mono text-xs tabular-nums">{p}</span></div>
        <svg width="36" height="36" viewBox="0 0 36 36" className="animate-spin" style={{ animationDuration: ".9s" }}><circle cx="18" cy="18" r="14" fill="none" stroke="var(--line2)" strokeWidth="3" /><path d="M18 4a14 14 0 0 1 14 14" fill="none" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" /></svg>
        <div className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2 w-2 rounded-full bg-fg" style={{ animation: `dotpulse 1.2s ${i * 0.15}s infinite` }} />)}</div>
      </div>
    </div>
  );
}

function Skeleton() {
  const [load, setLoad] = useState(true);
  useEffect(() => { if (load) { const t = setTimeout(() => setLoad(false), 2200); return () => clearTimeout(t); } }, [load]);
  return (
    <div className="mx-auto max-w-sm">
      <div className="rounded-2xl border border-line bg-bg p-5">
        {load ? (
          <div className="space-y-4"><div className="flex items-center gap-3"><div className="skeleton h-11 w-11 rounded-full" /><div className="flex-1 space-y-2"><div className="skeleton h-3 w-1/3 rounded" /><div className="skeleton h-3 w-1/2 rounded" /></div></div><div className="skeleton h-32 rounded-xl" /><div className="space-y-2"><div className="skeleton h-3 rounded" /><div className="skeleton h-3 w-4/5 rounded" /></div></div>
        ) : (
          <div className="anim-fade-up space-y-4"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-inv text-sm text-invfg">林</div><div><div className="text-[13px] font-medium">林小夕</div><div className="text-xs text-mute">2 小时前</div></div></div><div className="grid h-32 place-items-center rounded-xl bg-soft2"><ImageIcon size={22} className="text-dim" /></div><p className="text-[13px] text-mute">骨架屏的形状应尽量与真实内容一致，减少加载完成时的布局跳动。</p></div>
        )}
      </div>
      <div className="mt-4 text-center"><Btn variant="outline" size="sm" onClick={() => setLoad(true)}>重新加载</Btn></div>
    </div>
  );
}

function Empty() {
  return (
    <div className="mx-auto max-w-xs py-4 text-center">
      <div className="relative mx-auto mb-5 h-20 w-24">
        <div className="absolute inset-x-2 bottom-0 top-3 -rotate-6 rounded-xl border border-line2 bg-bg" />
        <div className="absolute inset-x-2 bottom-0 top-3 rotate-3 rounded-xl border border-line2 bg-bg" />
        <div className="absolute inset-x-2 bottom-0 top-3 grid place-items-center rounded-xl border border-fg bg-bg"><Inbox size={22} /></div>
      </div>
      <div className="font-semibold">还没有任何消息</div>
      <p className="mt-1 text-[13px] text-mute">新的消息会出现在这里。你也可以主动发起一次对话。</p>
      <Btn className="mt-5"><Plus size={14} />新建对话</Btn>
    </div>
  );
}

function PopTip() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  return (
    <Row className="gap-10">
      <div className="flex gap-2">
        {[[Bell, "通知"], [Settings, "设置"], [Search, "搜索"]].map(([I, t]: any) => (
          <span key={t} className="group relative">
            <button aria-label={t} className="inline-grid h-9 w-9 place-items-center align-middle rounded-lg border border-line2 hover:bg-soft2"><I size={15} /></button>
            <span role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md bg-inv px-2 py-1 text-[11px] text-invfg opacity-0 transition-all delay-100 duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">{t}</span>
          </span>
        ))}
      </div>
      <div ref={ref} className="relative">
        <Btn variant="outline" onClick={() => setOpen(!open)}>使用提示</Btn>
        <Floating anchor={ref} open={open} gap={12}>
          <div className="relative w-60 rounded-xl border border-line2 bg-bg p-4 shadow-pop">
            <span className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t border-line2 bg-bg" />
            <div className="text-[13px] font-medium">快速上手</div>
            <p className="mt-1 text-xs text-mute">Popover 可以承载交互内容，点击外部或按 Esc 关闭。</p>
            <div className="mt-3 flex justify-end gap-2"><button onClick={() => setOpen(false)} className="text-xs text-mute hover:text-fg">跳过</button><Btn size="sm" onClick={() => setOpen(false)}>知道了</Btn></div>
          </div>
        </Floating>
      </div>
    </Row>
  );
}

function UndoDelete() {
  const init = ["季度总结.docx", "设计稿 v3.fig", "会议纪要.md"];
  const [items, setItems] = useState(init);
  const [del, setDel] = useState<{ n: string; i: number; k: number } | null>(null);
  const k = useRef(0);
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="overflow-hidden rounded-xl border border-line bg-bg">
        {items.map((n) => <div key={n} className="anim-scale-in flex items-center gap-3 border-b border-line px-4 py-3 text-[13px] last:border-0"><FileText size={15} className="text-mute" />{n}<button aria-label={`删除 ${n}`} onClick={() => { setDel({ n, i: init.indexOf(n), k: ++k.current }); setItems(items.filter((x) => x !== n)); }} className="ml-auto text-mute hover:text-fg"><Trash2 size={14} /></button></div>)}
        {!items.length && <div className="p-6 text-center text-xs text-mute">已清空</div>}
      </div>
      {del && <div key={del.k} className="anim-fade-up relative mt-3 flex items-center justify-between overflow-hidden rounded-xl bg-inv px-4 py-3 text-[13px] text-invfg" style={{ animationDuration: ".3s" }}>已删除「{del.n}」<button onClick={() => { const n = [...items]; n.splice(Math.min(del.i, n.length), 0, del.n); setItems(n); setDel(null); }} className="inline-flex items-center gap-1 font-medium underline underline-offset-4"><Undo2 size={13} />撤销</button><span className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-invfg/60" style={{ animation: "drain 5s linear forwards" }} onAnimationEnd={() => setDel(null)} /></div>}
      <div className="mt-3 text-center"><button className="text-xs text-mute underline underline-offset-4 hover:text-fg" onClick={() => { setItems(init); setDel(null); }}>重置演示</button></div>
    </div>
  );
}

function Avatars() {
  const names = ["张伟", "王芳", "李娜", "刘洋", "陈静"];
  const [n, setN] = useState(3);
  return (
    <div className="flex flex-wrap items-center gap-12">
      <div className="flex -space-x-2.5">
        {names.slice(0, 4).map((x, i) => <span key={x} title={x} className="grid h-10 w-10 place-items-center rounded-full border-2 border-bg bg-soft2 text-xs font-medium transition-transform hover:z-10 hover:-translate-y-1" style={{ background: `color-mix(in oklab, var(--fg) ${8 + i * 7}%, var(--bg))` }}>{x[0]}</span>)}
        <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-bg bg-inv text-xs text-invfg">+12</span>
      </div>
      <div className="flex items-center gap-4">
        <button aria-label={`通知 ${n} 条`} onClick={() => setN(n + 1)} className="relative grid h-10 w-10 place-items-center rounded-full border border-line2 hover:bg-soft2"><Bell size={16} /><span key={n} className="anim-pop absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-bg bg-inv px-1 text-[10px] text-invfg">{n > 99 ? "99+" : n}</span></button>
        <span className="text-xs text-mute">点击铃铛 +1</span>
      </div>
      <div className="flex items-center gap-3">
        {[["在线", "bg-fg", true], ["离线", "bg-dim", false]].map(([t, c, ping]: any) => <span key={t} className="inline-flex items-center gap-2 rounded-full border border-line2 px-3 py-1 text-xs"><span className="relative flex h-2 w-2"><span className={cn("absolute inset-0 rounded-full", c, ping && "animate-[ping_1.6s_infinite]")} /><span className={cn("relative h-2 w-2 rounded-full", c)} /></span>{t}</span>)}
      </div>
    </div>
  );
}

function Tour() {
  const [s, setS] = useState(-1);
  const refs = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];
  const box = useRef<HTMLDivElement>(null);
  const [r, setR] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const steps = [["搜索", "在这里快速查找任何内容。"], ["通知", "新消息会在这里提醒你。"], ["创建", "点击开始创建第一个项目！"]];
  useEffect(() => { if (s < 0) return; const e = refs[s].current!, b = box.current!.getBoundingClientRect(), t = e.getBoundingClientRect(); setR({ x: t.left - b.left - 6, y: t.top - b.top - 6, w: t.width + 12, h: t.height + 12 }); }, [s]);
  return (
    <div ref={box} className="relative h-60 overflow-hidden rounded-xl border border-line bg-bg">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <span className="text-sm font-semibold">应用</span>
        <button ref={refs[0]} aria-label="搜索" className="ml-auto grid h-9 w-9 place-items-center rounded-lg border border-line2"><Search size={15} /></button>
        <button ref={refs[1]} aria-label="通知" className="inline-grid h-9 w-9 place-items-center align-middle rounded-lg border border-line2"><Bell size={15} /></button>
        <button ref={refs[2]} className="h-9 rounded-lg bg-inv px-4 text-[13px] text-invfg">创建</button>
      </div>
      <div className="grid h-32 place-items-center"><Btn variant="outline" onClick={() => setS(0)}>开始新手引导</Btn></div>
      {s >= 0 && <>
        <div className="pointer-events-none absolute rounded-xl transition-all duration-500" style={{ left: r.x, top: r.y, width: r.w, height: r.h, boxShadow: "0 0 0 9999px rgb(0 0 0 / .6)", transitionTimingFunction: "var(--ease)" }} />
        <div className="absolute z-10 w-52 rounded-xl border border-line2 bg-bg p-3.5 shadow-pop transition-all duration-500" style={{ left: clamp(r.x + r.w - 208, 8, 9999), top: r.y + r.h + 10 }}>
          <div className="text-[13px] font-medium">{steps[s][0]}</div><p className="mt-0.5 text-xs text-mute">{steps[s][1]}</p>
          <div className="mt-3 flex items-center justify-between"><span className="font-mono text-[11px] text-dim">{s + 1}/3</span><div className="flex gap-2"><button className="text-xs text-mute hover:text-fg" onClick={() => setS(-1)}>跳过</button><Btn size="sm" className="h-7" onClick={() => setS(s === 2 ? -1 : s + 1)}>{s === 2 ? "完成" : "下一步"}</Btn></div></div>
        </div>
      </>}
    </div>
  );
}

const _unused = [ChevronDown, Menu, Play, SkipForward, CmdIcon, Folder, ArrowRight, Range, Caption, useInterval];
void _unused;

export const navfeedback: Section[] = [
  {
    id: "navigation", group: "components", title: "导航", en: "Navigation",
    desc: "导航决定用户如何在信息中穿行：我在哪、能去哪、怎么回来。",
    blocks: [
      { id: "n-bar", title: "顶部导航栏", desc: "悬停时背景胶囊平滑跟随。测量 offsetLeft / offsetWidth 定位。", render: () => <Navbar /> },
      { id: "n-tabs", title: "标签页", desc: "下划线指示器滑动到当前标签，面板淡入。支持 ← → 切换。", tips: ["role=tablist/tab/tabpanel。"], render: () => <Tabs /> },
      { id: "n-crumb", title: "面包屑与分页", desc: "层级过深时中间折叠为省略号；分页始终显示首尾与当前页相邻页。", render: () => <CrumbPager /> },
      { id: "n-steps", title: "步骤条", desc: "已完成显示对勾，进行中带光环，连接线按进度填充。", render: () => <Steps /> },
      { id: "n-side", title: "侧边栏", desc: "可收起为图标栏，文字淡出、宽度过渡。未读数收起时缩成小点。", render: () => <SidebarDemo /> },
      { id: "n-menu", title: "下拉菜单与右键菜单", desc: "收纳次要操作。位置需防止溢出容器边缘。", tips: ["触屏用户无法右键，务必提供其他入口。"], render: () => <MenusDemo /> },
      { id: "n-toc", title: "页内目录", desc: "高亮当前章节，点击平滑滚动。本站左侧栏同样采用这种滚动侦测。", render: () => <Toc /> },
      { id: "n-cmd", title: "命令面板", desc: "键盘优先的万能入口：搜索 + 执行。试试 ⌘K / Ctrl+K。", render: () => <CmdTrigger /> },
      { id: "n-dock", title: "Dock 放大", desc: "按与指针的水平距离，用高斯函数平滑放大，邻近图标连带放大。", render: () => <Dock /> },
      { id: "n-island", title: "灵动岛", desc: "一个黑色胶囊，根据状态变形。宽、高、圆角同时过渡，使用带过冲的曲线。", render: () => <Island /> },
    ],
  },
  {
    id: "feedback", group: "components", title: "反馈与浮层", en: "Feedback & Overlays",
    desc: "界面要“回话”：操作有没有成功、系统在忙什么、接下来该做什么。",
    blocks: [
      { id: "fb-toast", title: "轻提示 Toast", desc: "短暂、非阻断。底部进度条显示剩余时间，悬停时暂停；最多同时 4 条。", render: () => <Toasts /> },
      { id: "fb-modal", title: "对话框", desc: "需要用户立即决策时使用。打开后焦点放在最安全的按钮（取消）上。", tips: ["createPortal 到 body。", "锁定 body 滚动，Esc 与点击遮罩关闭。"], render: () => <Modal /> },
      { id: "fb-drawer", title: "抽屉与底部面板", desc: "不打断上下文的次级任务。底部面板可拖动手柄下拉关闭。", render: () => <Drawers /> },
      { id: "fb-alert", title: "警告条", desc: "页面内的持久提示。关闭时高度平滑收起，下方内容不会突然跳动。", render: () => <Alerts /> },
      { id: "fb-progress", title: "进度指示", desc: "线性、不定态、分段、环形、转圈、跳动点——根据“是否知道进度”选择。", render: () => <Progress /> },
      { id: "fb-skeleton", title: "骨架屏", desc: "用内容轮廓占位，比 spinner 更能减轻等待感。", render: () => <Skeleton /> },
      { id: "fb-empty", title: "空状态", desc: "解释为什么空，并给出下一步行动。插图克制，主操作只有一个。", render: () => <Empty /> },
      { id: "fb-pop", title: "工具提示与气泡卡片", desc: "Tooltip 只放简短文本；需要交互内容请改用 Popover。", render: () => <PopTip /> },
      { id: "fb-undo", title: "撤销式删除", desc: "“可撤销”优于“二次确认”：先执行，再给 5 秒后悔机会。", render: () => <UndoDelete /> },
      { id: "fb-avatar", title: "头像、徽章与状态", desc: "叠放头像、数字角标与在线状态。状态要带文字，不只靠颜色。", render: () => <Avatars /> },
      { id: "fb-tour", title: "新手引导 · 聚光灯", desc: "一个绝对定位的高亮框 + 超大 box-shadow 形成遮罩“挖洞”。", render: () => <Tour /> },
    ],
  },
];
