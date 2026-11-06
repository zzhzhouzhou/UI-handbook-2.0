import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, BellRing, Check, CheckCircle2, Info, Inbox, Loader2, MessageSquare, Plus, Share2, Trash2, X, XCircle, Camera, Edit3, Image as ImageIcon, Undo2, Footprints, Lightbulb, Search } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, inputCls } from "../components/ui";
import { cn } from "../utils/cn";
import { useClickOutside, useInterval, clamp } from "../lib/hooks";
import { confetti } from "../lib/confetti";

function ToastDemo() {
  type T = { id: number; kind: "ok" | "err" | "info"; text: string };
  const [list, setList] = useState<T[]>([]);
  const id = useRef(0);
  const push = (kind: T["kind"], text: string) => { const i = ++id.current; setList((l) => [...l.slice(-3), { id: i, kind, text }]); setTimeout(() => setList((l) => l.filter((x) => x.id !== i)), 4000); };
  const ic = { ok: <CheckCircle2 className="h-5 w-5 text-emerald-500" />, err: <XCircle className="h-5 w-5 text-red-500" />, info: <Info className="h-5 w-5 text-sky-500" /> };
  return (
    <div className="relative min-h-72">
      <div className="flex flex-wrap gap-2">
        <Btn variant="outline" onClick={() => push("ok", "保存成功")}>成功</Btn>
        <Btn variant="outline" onClick={() => push("err", "网络异常，请重试")}>错误</Btn>
        <Btn variant="outline" onClick={() => push("info", "有新版本可用")}>信息</Btn>
      </div>
      <div className="absolute bottom-0 right-0 flex w-72 flex-col-reverse gap-2" aria-live="polite">
        {list.map((t) => (
          <div key={t.id} className="anim-fade-up group relative flex items-center gap-3 overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 pr-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {ic[t.kind]}<span className="flex-1 text-sm">{t.text}</span>
            <button aria-label="关闭" onClick={() => setList((l) => l.filter((x) => x.id !== t.id))} className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="h-4 w-4" /></button>
            <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent [animation:shrink_4s_linear_forwards] group-hover:[animation-play-state:paused]" style={{ animationName: "toastbar" }} />
          </div>
        ))}
      </div>
      <style>{`@keyframes toastbar{from{transform:scaleX(1)}to{transform:scaleX(0)}}`}</style>
    </div>
  );
}

function Overlay({ open, onClose, children, side }: { open: boolean; onClose: () => void; children: React.ReactNode; side?: "center" | "right" | "bottom" }) {
  const [mounted, setMounted] = useState(open);
  useEffect(() => { if (open) setMounted(true); else { const t = setTimeout(() => setMounted(false), 250); return () => clearTimeout(t); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-250", open ? "opacity-100" : "opacity-0")} />
      <div className={cn("absolute transition-all duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]",
        side === "right" ? cn("inset-y-0 right-0 w-80 max-w-full", open ? "translate-x-0" : "translate-x-full")
          : side === "bottom" ? cn("inset-x-0 bottom-0 mx-auto max-w-lg", open ? "translate-y-0" : "translate-y-full")
            : cn("left-1/2 top-1/2 w-[92%] max-w-sm -translate-x-1/2", open ? "-translate-y-1/2 scale-100 opacity-100" : "-translate-y-[45%] scale-95 opacity-0"))}>
        {children}
      </div>
    </div>, document.body);
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (open) setTimeout(() => ref.current?.focus(), 50); }, [open]);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Btn variant="danger" onClick={() => setOpen(true)}><Trash2 className="h-4 w-4" />删除项目</Btn>
      {done && <span className="anim-fade-up text-sm text-emerald-600">✓ 已删除（演示）</span>}
      <Overlay open={open} onClose={() => setOpen(false)}>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15"><AlertTriangle className="h-5 w-5" /></div>
          <h3 className="text-lg font-semibold">确认删除该项目？</h3>
          <p className="mt-1.5 text-sm text-zinc-500">此操作无法撤销，所有相关数据将被永久移除。</p>
          <div className="mt-6 flex justify-end gap-2"><Btn variant="outline" ref={ref} onClick={() => setOpen(false)}>取消</Btn><Btn variant="danger" onClick={() => { setOpen(false); setDone(true); }}>确认删除</Btn></div>
        </div>
      </Overlay>
    </div>
  );
}

function DrawerDemo() {
  const [r, setR] = useState(false);
  const [b, setB] = useState(false);
  const [dy, setDy] = useState(0);
  const start = useRef<number | null>(null);
  return (
    <div className="flex flex-wrap gap-3">
      <Btn variant="outline" onClick={() => setR(true)}>右侧抽屉</Btn>
      <Btn variant="outline" onClick={() => setB(true)}>底部面板（可下拉关闭）</Btn>
      <Overlay open={r} onClose={() => setR(false)} side="right">
        <div className="flex h-full flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800"><b>筛选条件</b><button aria-label="关闭" onClick={() => setR(false)}><X className="h-5 w-5" /></button></div>
          <div className="flex-1 space-y-4 p-4"><input className={inputCls} placeholder="关键词" /><select className={inputCls}><option>全部状态</option></select></div>
          <div className="flex gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800"><Btn variant="outline" className="flex-1" onClick={() => setR(false)}>重置</Btn><Btn variant="accent" className="flex-1" onClick={() => setR(false)}>应用</Btn></div>
        </div>
      </Overlay>
      <Overlay open={b} onClose={() => { setB(false); setDy(0); }} side="bottom">
        <div className="rounded-t-3xl border border-zinc-200 bg-white p-4 pb-8 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900" style={{ transform: `translateY(${dy}px)`, transition: start.current === null ? "transform .3s" : "none" }}>
          <div className="mx-auto mb-4 h-6 w-full cursor-grab touch-none" onPointerDown={(e) => { start.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={(e) => start.current !== null && setDy(Math.max(0, e.clientY - start.current))} onPointerUp={() => { start.current = null; if (dy > 100) { setB(false); setTimeout(() => setDy(0), 300); } else setDy(0); }}>
            <div className="mx-auto mt-1 h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          </div>
          <h3 className="mb-3 font-semibold">分享到</h3>
          <div className="grid grid-cols-4 gap-3 text-center text-xs">{[[MessageSquare, "消息"], [Share2, "链接"], [Camera, "二维码"], [ImageIcon, "海报"]].map(([I, t]) => { const Ic = I as typeof Camera; return <button key={t as string} className="space-y-1.5"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-zinc-100 dark:bg-zinc-800"><Ic className="h-5 w-5" /></span>{t as string}</button>; })}</div>
        </div>
      </Overlay>
    </div>
  );
}

function AlertDemo() {
  const [shown, setShown] = useState([true, true, true, true]);
  const A = [
    [Info, "信息：系统将于今晚 23:00 进行维护。", "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200"],
    [CheckCircle2, "成功：你的更改已保存。", "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"],
    [AlertTriangle, "警告：存储空间已使用 90%。", "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"],
    [XCircle, "错误：支付失败，请检查银行卡信息。", "border-red-200 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"],
  ] as const;
  return (
    <div className="space-y-2.5">
      {A.map(([I, t, c], i) => (
        <div key={i} className={cn("grid transition-all duration-300", shown[i] ? "grid-rows-[1fr]" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden"><div role="alert" className={cn("flex items-center gap-3 rounded-xl border px-4 py-3 text-sm", c)}><I className="h-5 w-5 shrink-0" /><span className="flex-1">{t}</span><button aria-label="关闭" onClick={() => setShown(shown.map((s, j) => (j === i ? false : s)))} className="rounded p-1 opacity-60 hover:opacity-100"><X className="h-4 w-4" /></button></div></div>
        </div>
      ))}
      {!shown.some(Boolean) && <button className="text-sm text-accent underline" onClick={() => setShown([true, true, true, true])}>全部恢复</button>}
    </div>
  );
}

function ProgressDemo() {
  const [p, setP] = useState(35);
  useInterval(() => setP((v) => (v >= 100 ? 0 : v + 1)), 90);
  const R = 34, C = 2 * Math.PI * R;
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div><div className="mb-1 flex justify-between text-xs text-zinc-500"><span>上传中</span><span className="tabular-nums">{p}%</span></div><div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-accent transition-[width]" style={{ width: p + "%" }} /></div></div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full w-1/3 rounded-full bg-accent" style={{ animation: "indet 1.4s ease-in-out infinite" }} /></div>
        <div className="flex gap-1">{Array.from({ length: 10 }, (_, i) => <span key={i} className={cn("h-2 flex-1 rounded-sm transition-colors", i < p / 10 ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800")} />)}</div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative h-20 w-20"><svg viewBox="0 0 80 80" className="-rotate-90"><circle cx="40" cy="40" r={R} fill="none" strokeWidth="7" className="stroke-zinc-200 dark:stroke-zinc-800" /><circle cx="40" cy="40" r={R} fill="none" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p / 100)} className="stroke-accent" /></svg><span className="absolute inset-0 grid place-items-center text-sm font-bold tabular-nums">{p}</span></div>
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <div className="flex gap-1.5">{[0, 1, 2].map((i) => <span key={i} className="h-2.5 w-2.5 rounded-full bg-accent" style={{ animation: `dot 1.2s ${i * 0.16}s infinite` }} />)}</div>
      </div>
      <style>{`@keyframes indet{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}

function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (loading) { const t = setTimeout(() => setLoading(false), 2000); return () => clearTimeout(t); } }, [loading]);
  return (
    <div className="max-w-sm">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {loading ? (
          <div className="space-y-3"><div className="flex items-center gap-3"><div className="skeleton h-11 w-11 rounded-full" /><div className="flex-1 space-y-2"><div className="skeleton h-3 w-1/2 rounded" /><div className="skeleton h-3 w-1/3 rounded" /></div></div><div className="skeleton h-32 rounded-xl" /><div className="skeleton h-3 rounded" /><div className="skeleton h-3 w-4/5 rounded" /></div>
        ) : (
          <div className="anim-fade-up space-y-3"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold text-white">林</div><div><p className="text-sm font-semibold">林小夕</p><p className="text-xs text-zinc-500">2 小时前</p></div></div><div className="h-32 rounded-xl bg-gradient-to-br from-accent to-pink-400" /><p className="text-sm">骨架屏的形状应尽量与真实内容一致，减少加载完成时的布局跳动。</p></div>
        )}
      </div>
      <Btn className="mt-3" size="sm" variant="outline" onClick={() => setLoading(true)}>重新加载</Btn>
    </div>
  );
}

function EmptyDemo() {
  return (
    <div className="mx-auto max-w-xs text-center">
      <div className="relative mx-auto mb-4 grid h-24 w-24 place-items-center"><span className="absolute inset-0 rounded-full bg-accent-soft" /><span className="absolute -right-1 top-2 h-4 w-4 rounded-full bg-accent/30 anim-float" /><Inbox className="relative h-10 w-10 text-accent" /></div>
      <h4 className="font-semibold">还没有任何消息</h4>
      <p className="mt-1 text-sm text-zinc-500">新的消息会出现在这里。你也可以主动发起一次对话。</p>
      <div className="mt-4 flex justify-center gap-2"><Btn variant="accent"><Plus className="h-4 w-4" />新建对话</Btn><Btn variant="ghost">了解更多</Btn></div>
    </div>
  );
}

function PopoverDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  return (
    <div ref={ref} className="relative inline-block min-h-52">
      <Btn variant="outline" aria-expanded={open} onClick={() => setOpen(!open)}><Lightbulb className="h-4 w-4" />使用提示</Btn>
      {open && <div className="anim-scale-in absolute left-0 top-12 z-10 w-64 origin-top-left rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <span className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900" />
        <b className="text-sm">快速上手</b><p className="mt-1 text-sm text-zinc-500">Popover 可以承载交互内容，点击外部或按 Esc 关闭。</p>
        <div className="mt-3 flex justify-end gap-2"><Btn size="sm" variant="ghost" onClick={() => setOpen(false)}>跳过</Btn><Btn size="sm" variant="accent" onClick={() => setOpen(false)}>知道了</Btn></div>
      </div>}
    </div>
  );
}

function FabDemo() {
  const [open, setOpen] = useState(false);
  const acts = [[Edit3, "写文章"], [Camera, "拍照"], [ImageIcon, "相册"]] as const;
  return (
    <div className="relative h-60 rounded-xl bg-zinc-100/60 dark:bg-zinc-900/60">
      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-3">
        {acts.map(([I, t], i) => (
          <div key={t} className="flex items-center gap-2 transition-all duration-300" style={{ transform: open ? "none" : "translateY(20px) scale(0.6)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transitionDelay: open ? (acts.length - 1 - i) * 50 + "ms" : "0ms" }}>
            <span className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white dark:bg-white dark:text-zinc-900">{t}</span>
            <button aria-label={t} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-lg dark:bg-zinc-800"><I className="h-5 w-5" /></button>
          </div>
        ))}
        <button aria-label="更多操作" aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-fg shadow-xl shadow-accent/40 transition-transform hover:scale-105 active:scale-95"><Plus className={cn("h-6 w-6 transition-transform duration-300", open && "rotate-[135deg]")} /></button>
      </div>
    </div>
  );
}

function UndoDemo() {
  const init = ["季度总结.docx", "设计稿 v3.fig", "会议纪要.md"];
  const [files, setFiles] = useState(init);
  const [del, setDel] = useState<{ name: string; idx: number } | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remove = (name: string) => { const idx = files.indexOf(name); setFiles(files.filter((f) => f !== name)); setDel({ name, idx }); if (t.current) clearTimeout(t.current); t.current = setTimeout(() => setDel(null), 5000); };
  const undo = () => { if (!del) return; const f = [...files]; f.splice(del.idx, 0, del.name); setFiles(f); setDel(null); if (t.current) clearTimeout(t.current); };
  return (
    <div className="relative max-w-sm">
      <ul className="space-y-1.5">
        {files.map((f) => <li key={f} className="anim-fade-up flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900">{f}<button aria-label={"删除" + f} onClick={() => remove(f)} className="rounded-md p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button></li>)}
        {!files.length && <li className="py-6 text-center text-sm text-zinc-400">已清空</li>}
      </ul>
      <div className={cn("mt-4 flex items-center gap-3 overflow-hidden rounded-xl bg-zinc-900 px-4 py-3 text-sm text-white shadow-xl transition-all duration-300 dark:bg-white dark:text-zinc-900", del ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0")}>
        <span className="flex-1 truncate">已删除「{del?.name}」</span>
        <button onClick={undo} className="inline-flex items-center gap-1 font-semibold text-accent"><Undo2 className="h-4 w-4" />撤销</button>
      </div>
      {files.length < 3 && !del && <button onClick={() => setFiles(init)} className="mt-2 text-xs text-zinc-500 underline">重置演示</button>}
    </div>
  );
}

function HoldDemo() {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef(0);
  const t0 = useRef(0);
  const D = 1200;
  const loop = (t: number) => { const v = clamp((t - t0.current) / D, 0, 1); setP(v); if (v >= 1) { setDone(true); confetti(); return; } raf.current = requestAnimationFrame(loop); };
  const down = () => { if (done) return; t0.current = performance.now(); raf.current = requestAnimationFrame(loop); };
  const up = () => { cancelAnimationFrame(raf.current); if (!done) setP(0); };
  return (
    <div className="flex items-center gap-4">
      <button onPointerDown={down} onPointerUp={up} onPointerLeave={up} onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !e.repeat && down()} onKeyUp={up}
        className={cn("relative inline-flex h-12 w-52 select-none items-center justify-center overflow-hidden rounded-xl border text-sm font-semibold transition", done ? "border-emerald-500 bg-emerald-500 text-white" : "border-red-300 text-red-600 dark:border-red-500/40 dark:text-red-300")}>
        {!done && <span className="absolute inset-y-0 left-0 bg-red-500/25" style={{ width: p * 100 + "%" }} />}
        <span className="relative">{done ? "✓ 已删除" : p > 0 ? "继续按住…" : "按住 1.2 秒删除"}</span>
      </button>
      {done && <button className="text-xs text-zinc-500 underline" onClick={() => { setDone(false); setP(0); }}>重置</button>}
    </div>
  );
}

function TourDemo() {
  const [step, setStep] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const els = useRef<(HTMLElement | null)[]>([]);
  const [r, setR] = useState({ l: 0, t: 0, w: 0, h: 0 });
  const steps = [["搜索", "在这里快速查找任何内容。"], ["通知", "新消息会在这里提醒你。"], ["创建", "点击开始创建第一个项目！"]];
  useLayoutEffect(() => { const el = els.current[step]; if (el && box.current) { const a = el.getBoundingClientRect(), b = box.current.getBoundingClientRect(); setR({ l: a.left - b.left - 6, t: a.top - b.top - 6, w: a.width + 12, h: a.height + 12 }); } }, [step]);
  return (
    <div ref={box} className="relative h-72 overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3"><span ref={(el) => { els.current[0] = el; }} className="inline-flex h-9 flex-1 items-center gap-2 rounded-lg bg-zinc-100 px-3 text-sm text-zinc-400 dark:bg-zinc-800"><Search className="h-4 w-4" />搜索…</span><span ref={(el) => { els.current[1] = el; }} className="grid h-9 w-9 place-items-center rounded-lg bg-zinc-100 dark:bg-zinc-800"><BellRing className="h-4 w-4" /></span></div>
      <div className="mt-6 grid place-items-center"><Btn ref={(el: HTMLButtonElement | null) => { els.current[2] = el; }} variant="accent" size="lg" onClick={() => setStep(0)}><Footprints className="h-4 w-4" />开始新手引导</Btn></div>
      {step >= 0 && <>
        <div className="pointer-events-none absolute rounded-xl ring-2 ring-accent transition-all duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]" style={{ left: r.l, top: r.t, width: r.w, height: r.h, boxShadow: "0 0 0 9999px rgb(0 0 0 / 0.55)" }} />
        <div className="anim-scale-in absolute z-10 w-56 rounded-xl bg-white p-3.5 text-zinc-900 shadow-2xl transition-all duration-500" style={{ left: clamp(r.l, 8, (box.current?.clientWidth ?? 400) - 232), top: r.t + r.h + 12 }}>
          <p className="text-xs text-zinc-400">{step + 1} / {steps.length}</p><b className="text-sm">{steps[step][0]}</b><p className="mt-0.5 text-xs text-zinc-500">{steps[step][1]}</p>
          <div className="mt-3 flex justify-between"><button className="text-xs text-zinc-500" onClick={() => setStep(-1)}>跳过</button><button className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-accent-fg" onClick={() => setStep(step + 1 >= steps.length ? -1 : step + 1)}>{step + 1 >= steps.length ? "完成" : "下一步"}</button></div>
        </div>
      </>}
    </div>
  );
}

function AnimIconsDemo() {
  const [k, setK] = useState(0);
  return (
    <div className="space-y-4">
      <div key={k} className="flex items-center gap-10">
        {[["#10b981", <path key="a" d="M20 34l9 9 17-20" />], ["#ef4444", <g key="b"><path d="M22 22l20 20" /><path d="M42 22L22 42" /></g>], ["#f59e0b", <g key="c"><path d="M32 18v18" /><path d="M32 44v1" /></g>]].map(([c, p], i) => (
          <svg key={i} viewBox="0 0 64 64" width="72" height="72" fill="none" stroke={c as string} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="32" cy="32" r="28" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw 0.7s ease-out forwards" }} />
            <g pathLength={1} style={{ ["--d" as string]: 1 }}>
              {(p as React.ReactElement)}
            </g>
          </svg>
        ))}
      </div>
      <Btn size="sm" variant="outline" onClick={() => setK(k + 1)}>重播</Btn>
    </div>
  );
}

export const feedback: Section = {
  id: "feedback", title: "反馈与覆盖层", en: "Feedback & Overlays", group: "组件", icon: BellRing, hue: 25,
  blurb: "界面要“回话”：操作有没有成功、系统在忙什么、接下来该做什么。反馈要及时、不打扰、可撤销。",
  items: [
    item({ id: "toast", title: "轻提示", en: "Toast", level: "基础", demo: ToastDemo, tags: ["snackbar", "message"],
      desc: "短暂、非阻断的反馈。底部进度条显示剩余时间，悬停时暂停；最多同时 4 条。", points: ["用 aria-live=polite 通知读屏。", "进度条用 transform: scaleX 动画。", "错误提示可适当延长或需手动关闭。"], mistakes: ["用 toast 展示必须阅读的重要信息。"], code: `<div aria-live="polite">{toasts.map((t) => <Toast key={t.id} {...t} />)}</div>` }),
    item({ id: "modal", title: "对话框 / 确认框", en: "Modal Dialog", level: "基础", demo: ModalDemo, tags: ["dialog", "confirm"],
      desc: "需要用户立即决策时使用。危险操作用红色图标 + 明确的动词按钮（“确认删除”而不是“确定”）。", points: ["createPortal 到 body，避免被父级 overflow/transform 裁剪。", "打开时锁定 body 滚动，Esc 与点击遮罩关闭。", "打开后焦点放在最安全的按钮（取消）上。"], a11y: ["role=dialog aria-modal；关闭后焦点还给触发按钮。"], code: `createPortal(<div role="dialog" aria-modal="true">…</div>, document.body)` }),
    item({ id: "drawer", title: "抽屉 / 底部面板", en: "Drawer & Bottom Sheet", level: "进阶", demo: DrawerDemo, tags: ["sheet", "slide"],
      desc: "不打断上下文的次级任务（筛选、详情）。底部面板支持拖动手柄下拉关闭。", points: ["300ms cubic-bezier(.32,.72,0,1) 带来 iOS 般的减速感。", "拖动超过 100px 才关闭，否则回弹。"], code: `onPointerMove={(e) => setDy(Math.max(0, e.clientY - startY))}
onPointerUp={() => (dy > 100 ? close() : setDy(0))}` }),
    item({ id: "alert", title: "警告条 / 横幅", en: "Alert & Banner", level: "基础", demo: AlertDemo, tags: ["notice"],
      desc: "页面内的持久提示。四种语义色，可关闭，关闭时高度平滑收起。", points: ["grid-rows 0fr 动画关闭，下方内容不会突然跳动。"], a11y: ["错误用 role=alert，其余用 role=status。"], code: `<div className={open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} style={{ display: "grid", transition: "all .3s" }}>` }),
    item({ id: "progress", title: "进度指示", en: "Progress", level: "基础", demo: ProgressDemo, tags: ["spinner", "loader"],
      desc: "线性、不定态、分段、环形、转圈、跳动点——根据“是否知道进度”选择合适的形式。", points: ["已知进度用确定态；未知用不定态。", "环形：strokeDasharray = 周长，strokeDashoffset = 周长 × (1 − p)。"], a11y: ["role=progressbar + aria-valuenow。"], code: `<circle strokeDasharray={C} strokeDashoffset={C * (1 - p)} />` }),
    item({ id: "skeleton", title: "加载态 / 骨架屏", en: "Skeleton", level: "基础", demo: SkeletonDemo, tags: ["loading", "shimmer"],
      desc: "用内容的轮廓占位，比 spinner 更能减轻等待感。形状要与真实内容一致。", points: ["流光用 background-position 动画。", "加载完成用 fade-up 过渡。"], mistakes: ["骨架与真实布局不一致，造成跳动。"], code: `.skeleton { background-image: linear-gradient(90deg, transparent, rgb(255 255 255 / .6), transparent);
  background-size: 200% 100%; animation: shimmer 1.6s linear infinite; }` }),
    item({ id: "empty", title: "空状态", en: "Empty State", level: "基础", demo: EmptyDemo, tags: ["blank"],
      desc: "没有数据时的引导：解释为什么空 + 给出下一步行动。", points: ["插图克制，文案友好，主操作只有一个。"], code: `<EmptyState icon={Inbox} title="还没有任何消息" action="新建对话" />` }),
    item({ id: "popover", title: "气泡卡片", en: "Popover", level: "进阶", demo: PopoverDemo, tags: ["floating"],
      desc: "可承载交互内容的浮层，带小箭头指向触发器。", points: ["小箭头：旋转 45° 的方块 + 两边描边。", "复杂定位建议用 Floating UI。"], code: `<span className="absolute -top-1.5 left-6 h-3 w-3 rotate-45 border-l border-t bg-white" />` }),
    item({ id: "fab", title: "悬浮操作按钮 · Speed Dial", en: "FAB Speed Dial", level: "进阶", demo: FabDemo, tags: ["floating"],
      desc: "主操作悬浮在右下角，点击展开次级操作，+ 号旋转 135° 变为 ×。", points: ["子项用递减 transition-delay 形成依次弹出。", "收起时 pointer-events: none。"], code: `transitionDelay: open ? (n - 1 - i) * 50 + "ms" : "0ms"` }),
    item({ id: "undo-snackbar", title: "撤销式删除", en: "Undo Snackbar", level: "进阶", isNew: true, demo: UndoDemo, tags: ["undo", "delete"],
      desc: "“可撤销”优于“二次确认”：先执行，再给 5 秒后悔机会。减少弹窗打断，还让用户更有安全感。", points: ["记录被删项的原索引，撤销时插回原位。", "新的删除会重置计时器。", "超时后才真正调用后端删除。"], code: `const undo = () => { const f = [...files]; f.splice(del.idx, 0, del.name); setFiles(f); };` }),
    item({ id: "hold-confirm", title: "长按确认", en: "Hold to Confirm", level: "进阶", isNew: true, demo: HoldDemo, tags: ["destructive", "press"],
      desc: "用时间代替弹窗来防止误操作：按住按钮直到填满才触发。", points: ["requestAnimationFrame 根据经过时间计算进度。", "松手、指针移出都应取消并复位。", "支持键盘：按住空格 / 回车。"], a11y: ["提供辅助文案“按住 1.2 秒”。"], code: `const v = clamp((t - t0) / 1200, 0, 1); if (v >= 1) confirm();` }),
    item({ id: "tour", title: "新手引导 · 聚光灯", en: "Product Tour", level: "高级", isNew: true, demo: TourDemo, tags: ["onboarding", "spotlight"],
      desc: "逐步高亮界面元素并附说明。技巧：一个绝对定位的高亮框 + 超大 box-shadow 形成遮罩。", points: ["box-shadow: 0 0 0 9999px rgb(0 0 0 / .55) 让高亮框“挖洞”。", "高亮框位置用 getBoundingClientRect 测量，并用 transition 平滑移动。", "每步给出“跳过”。"], a11y: ["允许 Esc 退出，不要强制完成。"], code: `<div style={{ left, top, width, height, boxShadow: "0 0 0 9999px rgb(0 0 0 / .55)" }}
  className="absolute rounded-xl ring-2 ring-accent transition-all" />` }),
    item({ id: "anim-icons", title: "状态动画图标", en: "Animated Status Icons", level: "进阶", isNew: true, demo: AnimIconsDemo, tags: ["svg", "success"],
      desc: "成功 / 失败 / 警告的 SVG 描边动画。圆环先画出，符号随后出现。", points: ["pathLength=1 把任意路径长度归一化，dasharray/offset 就可以直接用 0–1。", "stroke-dashoffset 从 1 动画到 0 即“画出”。"], code: `<circle pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw .7s forwards" }} />` }),
  ],
};

void Check; void Info;
