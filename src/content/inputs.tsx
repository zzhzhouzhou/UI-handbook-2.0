import { useEffect, useRef, useState } from "react";
import {
  Check, X, Search, Mail, Eye, EyeOff, ChevronDown, Plus, Minus, Heart, Copy, Save, Send, ArrowRight, Trash2, List, LayoutGrid, Calendar as CalIcon,
  Star, ChevronLeft, ChevronRight, Upload, File as FileIcon, Lock, Unlock, AlertCircle, Loader2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Share2, Bookmark,
} from "lucide-react";
import type { Section } from "@/types";
import { Btn, Seg, Switch, Kbd, Caption, Row, Floating } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useClickOutside, useInterval, clamp } from "@/lib/hooks";

/* ================= BUTTONS ================= */
function Variants() {
  return (
    <div className="space-y-8">
      <div>
        <Caption>变体</Caption>
        <Row>
          <Btn>主要</Btn><Btn variant="outline">描边</Btn><Btn variant="soft">次要</Btn><Btn variant="ghost">幽灵</Btn><Btn variant="danger"><Trash2 size={14} />危险</Btn><Btn variant="link">链接</Btn>
        </Row>
      </div>
      <div>
        <Caption>尺寸</Caption>
        <Row><Btn size="sm">小 32</Btn><Btn>中 36</Btn><Btn size="lg">大 44</Btn></Row>
      </div>
      <div>
        <Caption>图标与按钮组</Caption>
        <Row className="gap-6">
          <Row className="gap-2">
            <Btn variant="outline" size="icon" aria-label="分享"><Share2 size={15} /></Btn>
            <Btn variant="outline" size="icon" aria-label="收藏"><Bookmark size={15} /></Btn>
            <Btn size="icon" aria-label="发送"><Send size={15} /></Btn>
          </Row>
          <div className="inline-flex overflow-hidden rounded-lg border border-line2 bg-bg [&>button+button]:border-l [&>button+button]:border-line2">
            {[Bold, Italic, Underline].map((I, i) => <button key={i} aria-label="格式" className="inline-grid h-9 w-9 place-items-center align-middle transition-colors hover:bg-soft2"><I size={15} /></button>)}
          </div>
          <div className="inline-flex overflow-hidden rounded-lg border border-line2 bg-bg [&>button+button]:border-l [&>button+button]:border-line2">
            {[AlignLeft, AlignCenter, AlignRight].map((I, i) => <button key={i} aria-label="对齐" className="inline-grid h-9 w-9 place-items-center align-middle transition-colors hover:bg-soft2"><I size={15} /></button>)}
          </div>
        </Row>
      </div>
    </div>
  );
}

function States() {
  const [load, setLoad] = useState(false);
  const cell = "flex flex-col items-center gap-3 rounded-xl border border-line bg-bg p-5";
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className={cell}><Btn>保存</Btn><span className="label">默认</span></div>
      <div className={cell}><Btn className="opacity-80">保存</Btn><span className="label">悬停</span></div>
      <div className={cell}><Btn className="scale-[.97] opacity-90">保存</Btn><span className="label">按下</span></div>
      <div className={cell}><Btn className="outline outline-2 outline-offset-2 outline-fg">保存</Btn><span className="label">聚焦</span></div>
      <div className={cell}><Btn disabled>保存</Btn><span className="label">禁用</span></div>
      <div className={cell}><Btn loading={load} onClick={() => { setLoad(true); setTimeout(() => setLoad(false), 1800); }}>{load ? "保存中" : "点我加载"}</Btn><span className="label">加载</span></div>
    </div>
  );
}

function SegDemo() {
  const [a, setA] = useState("list");
  const [b, setB] = useState("week");
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Seg value={a} onChange={setA} options={[{ value: "list", label: "列表", icon: <List size={14} /> }, { value: "grid", label: "网格", icon: <LayoutGrid size={14} /> }, { value: "cal", label: "日历", icon: <CalIcon size={14} /> }]} />
      <Seg size="sm" value={b} onChange={setB} options={[{ value: "day", label: "日" }, { value: "week", label: "周" }, { value: "month", label: "月" }, { value: "year", label: "年" }]} />
    </div>
  );
}

function SplitBtn() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("保存");
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  const opts = ["保存", "保存并关闭", "另存为…", "存为草稿"];
  return (
    <div ref={ref} className="relative inline-flex">
      <Btn className="rounded-r-none" onClick={() => {}}><Save size={14} />{mode}</Btn>
      <button aria-label="更多" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(!open)} className="inline-grid h-9 w-9 place-items-center rounded-r-lg border-l border-invfg/20 bg-inv text-invfg align-middle transition-opacity hover:opacity-80">
        <ChevronDown size={14} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>
      <Floating anchor={ref} open={open} gap={8}>
        <div className="w-48 rounded-xl border border-line2 bg-bg p-1 shadow-pop" role="menu">
          {opts.map((o) => (
            <button key={o} role="menuitem" onClick={() => { setMode(o); setOpen(false); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] hover:bg-soft2">{o}{mode === o && <Check size={13} />}</button>
          ))}
        </div>
      </Floating>
    </div>
  );
}

function MachineBtn() {
  const [s, setS] = useState<"idle" | "load" | "ok">("idle");
  const [c, setC] = useState(false);
  const go = () => { if (s !== "idle") return; setS("load"); setTimeout(() => setS("ok"), 1600); setTimeout(() => setS("idle"), 3200); };
  const layer = "absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300";
  return (
    <Row className="gap-8">
      <button onClick={go} aria-live="polite" className="relative h-11 overflow-hidden rounded-full bg-inv text-sm font-medium text-invfg transition-all duration-500" style={{ width: s === "load" ? 44 : 148, transitionTimingFunction: "var(--ease)" }}>
        <span className={layer} style={{ opacity: s === "idle" ? 1 : 0, transform: s === "idle" ? "none" : "translateY(-12px)" }}><Send size={14} />提交申请</span>
        <span className={layer} style={{ opacity: s === "load" ? 1 : 0, transform: s === "load" ? "none" : "translateY(12px)" }}><Loader2 size={16} className="animate-spin" /></span>
        <span className={layer} style={{ opacity: s === "ok" ? 1 : 0, transform: s === "ok" ? "none" : "translateY(12px)" }}><Check size={16} />已提交</span>
      </button>
      <button onClick={() => { setC(true); setTimeout(() => setC(false), 1500); }} className="relative grid h-11 w-11 place-items-center rounded-full border border-line2 bg-bg transition-colors hover:bg-soft2" aria-label="复制链接">
        <Copy size={15} className={cn("absolute transition-all duration-300", c ? "rotate-90 scale-0" : "")} />
        <Check size={16} className={cn("absolute transition-all duration-300", c ? "" : "-rotate-90 scale-0")} />
      </button>
    </Row>
  );
}

function Magnetic() {
  const [p, setP] = useState({ x: 0, y: 0 });
  const [press, setPress] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-wrap items-center justify-center gap-16 py-4">
      <div ref={ref} className="grid h-40 w-56 place-items-center rounded-2xl border border-dashed border-line2"
        onMouseMove={(e) => { const r = ref.current!.getBoundingClientRect(); setP({ x: (e.clientX - r.left - r.width / 2) * 0.35, y: (e.clientY - r.top - r.height / 2) * 0.35 }); }}
        onMouseLeave={() => setP({ x: 0, y: 0 })}>
        <button className="inline-flex h-12 items-center gap-2 rounded-full bg-inv px-6 text-sm font-medium text-invfg" style={{ transform: `translate(${p.x}px,${p.y}px)`, transition: p.x === 0 && p.y === 0 ? "transform .6s var(--spring)" : "transform .12s linear" }}>
          磁吸按钮 <ArrowRight size={14} />
        </button>
      </div>
      <button onPointerDown={() => setPress(true)} onPointerUp={() => setPress(false)} onPointerLeave={() => setPress(false)}
        className="h-12 rounded-2xl border border-line2 bg-bg px-6 text-sm font-medium" style={{ transform: press ? "scale(.9)" : "none", transition: press ? "transform .15s linear" : "transform .7s cubic-bezier(.34,2.2,.64,1)" }}>
        弹性按压
      </button>
    </div>
  );
}

function HoldConfirm() {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  const raf = useRef(0);
  const t0 = useRef(0);
  const start = () => {
    if (done) return;
    t0.current = performance.now();
    const f = (t: number) => {
      const v = Math.min(1, (t - t0.current) / 1200);
      setP(v);
      if (v >= 1) { setDone(true); return; }
      raf.current = requestAnimationFrame(f);
    };
    raf.current = requestAnimationFrame(f);
  };
  const stop = () => { cancelAnimationFrame(raf.current); if (!done) setP(0); };
  return (
    <Row className="gap-6">
      <button onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onKeyDown={(e) => (e.key === " " || e.key === "Enter") && !e.repeat && start()} onKeyUp={stop}
        className="relative h-11 select-none overflow-hidden rounded-xl border border-fg px-6 text-sm font-medium">
        <span className="absolute inset-y-0 left-0 bg-inv" style={{ width: `${p * 100}%` }} />
        <span className="relative inline-flex items-center gap-2 mix-blend-difference text-white">{done ? <><Check size={14} />已删除</> : <><Trash2 size={14} />按住 1.2 秒删除</>}</span>
      </button>
      {done && <button className="text-xs text-mute underline underline-offset-4 hover:text-fg" onClick={() => { setDone(false); setP(0); }}>重置</button>}
    </Row>
  );
}

function FxButtons() {
  return (
    <Row className="gap-6">
      <button className="group relative h-11 overflow-hidden rounded-xl bg-inv px-6 text-sm font-medium text-invfg">
        <span className="relative z-10">扫光按钮</span>
        <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-invfg/25 transition-transform duration-700 group-hover:translate-x-[400%]" />
      </button>
      <button className="group inline-flex h-11 items-center gap-2 rounded-xl border border-line2 px-6 text-sm font-medium transition-colors hover:border-fg">
        了解更多<ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1.5" />
      </button>
      <button className="group relative h-11 rounded-xl px-6 text-sm font-medium">
        <span className="absolute inset-0 rounded-xl border border-line2" />
        <span className="absolute inset-0 rounded-xl bg-inv opacity-0 transition-all duration-300 [clip-path:inset(50%_50%_50%_50%_round_12px)] group-hover:opacity-100 group-hover:[clip-path:inset(0_round_12px)]" />
        <span className="relative transition-colors duration-300 group-hover:text-invfg">中心展开</span>
      </button>
      <button className="relative h-11 overflow-hidden rounded-xl border border-line2 px-6 text-sm font-medium [&:hover>span:first-child]:-translate-y-full group">
        <span className="block transition-transform duration-300" style={{ transitionTimingFunction: "var(--ease)" }}>文字上滚</span>
        <span className="absolute inset-0 grid translate-y-full place-items-center transition-transform duration-300 group-hover:translate-y-0" style={{ transitionTimingFunction: "var(--ease)" }}>文字上滚</span>
      </button>
    </Row>
  );
}

function LikeCopy() {
  const [on, setOn] = useState(false);
  const [n, setN] = useState(0);
  const parts = Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; return [Math.cos(a) * 26, Math.sin(a) * 26]; });
  return (
    <Row className="gap-10">
      <button aria-pressed={on} aria-label="点赞" onClick={() => { setOn(!on); if (!on) setN((x) => x + 1); }} className="relative grid h-12 w-12 place-items-center rounded-full border border-line2 bg-bg">
        <Heart key={on ? "on" + n : "off"} size={20} className={cn(on && "anim-pop fill-current")} />
        {on && parts.map(([x, y], i) => <span key={n + "-" + i} className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-fg" style={{ ["--dx" as any]: x + "px", ["--dy" as any]: y + "px", animation: "burst .6s ease-out forwards" }} />)}
      </button>
      <ChipFilter />
    </Row>
  );
}
function ChipFilter() {
  const [sel, setSel] = useState<string[]>(["设计"]);
  return (
    <div className="flex flex-wrap gap-2">
      {["设计", "前端", "后端", "动效", "无障碍", "性能"].map((t) => {
        const on = sel.includes(t);
        return (
          <button key={t} aria-pressed={on} onClick={() => setSel(on ? sel.filter((x) => x !== t) : [...sel, t])} className={cn("inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] transition-all duration-200", on ? "border-fg bg-inv text-invfg" : "border-line2 text-mute hover:border-fg hover:text-fg")}>
            <span className={cn("overflow-hidden transition-all duration-200", on ? "w-3.5 opacity-100" : "w-0 opacity-0")}><Check size={13} /></span>{t}
          </button>
        );
      })}
    </div>
  );
}

/* ================= FORMS ================= */
const inp = "h-10 w-full rounded-lg border border-line2 bg-bg px-3 text-[13px] outline-none transition-[border-color,box-shadow] placeholder:text-dim focus:border-fg focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--fg)_10%,transparent)] disabled:bg-soft2 disabled:text-dim";
function InputStates() {
  const [v, setV] = useState("");
  const [touched, setTouched] = useState(false);
  const ok = /^\S+@\S+\.\S+$/.test(v);
  const err = touched && !ok;
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block"><div className="mb-1.5 text-xs font-medium">默认</div><input className={inp} placeholder="请输入…" /></label>
      <label className="block"><div className="mb-1.5 text-xs font-medium">带图标</div><div className="relative"><Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" /><input className={cn(inp, "pl-9")} placeholder="name@example.com" /></div></label>
      <label className="block">
        <div className="mb-1.5 flex justify-between text-xs font-medium"><span>实时校验</span><span className="font-normal text-dim">失焦后提示</span></div>
        <div className="relative">
          <input className={cn(inp, "pr-9", err && "border-fg bg-soft2", ok && "border-line2")} value={v} onChange={(e) => setV(e.target.value)} onBlur={() => setTouched(true)} aria-invalid={err} placeholder="输入邮箱" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{ok ? <Check size={15} /> : err ? <AlertCircle size={15} /> : null}</span>
        </div>
        <div className={cn("grid transition-all duration-200", err ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}><div className="overflow-hidden"><p role="alert" className="mt-1.5 text-xs text-fg">邮箱格式不正确，例如 name@example.com</p></div></div>
      </label>
      <label className="block"><div className="mb-1.5 text-xs font-medium text-dim">禁用</div><input className={inp} disabled value="不可编辑" readOnly /></label>
    </div>
  );
}

function FloatLabel() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {["用户名", "公司名称"].map((l) => (
        <div key={l} className="relative">
          <input placeholder=" " className="peer h-14 w-full rounded-xl border border-line2 bg-bg px-4 pt-4 text-sm outline-none transition-colors focus:border-fg" />
          <label className="pointer-events-none absolute left-4 top-1/2 origin-left -translate-y-1/2 text-sm text-dim transition-all duration-200 peer-focus:-translate-y-[130%] peer-focus:scale-75 peer-focus:text-fg peer-[:not(:placeholder-shown)]:-translate-y-[130%] peer-[:not(:placeholder-shown)]:scale-75">{l}</label>
        </div>
      ))}
    </div>
  );
}

function SearchBox() {
  const all = ["按钮 Button", "输入框 Input", "下拉选择 Select", "日期选择 DatePicker", "对话框 Modal", "抽屉 Drawer", "标签页 Tabs", "工具提示 Tooltip"];
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const list = all.filter((x) => x.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "/" && !/INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName)) { e.preventDefault(); ref.current?.focus(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  const hl = (t: string) => { if (!q) return t; const i = t.toLowerCase().indexOf(q.toLowerCase()); return i < 0 ? t : <>{t.slice(0, i)}<mark className="bg-inv px-0.5 text-invfg">{t.slice(i, i + q.length)}</mark>{t.slice(i + q.length)}</>; };
  return (
    <div className="mx-auto max-w-md">
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim" />
        <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setQ("")} placeholder="搜索组件…" className={cn(inp, "h-11 rounded-xl pl-10 pr-12")} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{q ? <button aria-label="清除" onClick={() => setQ("")} className="grid h-5 w-5 place-items-center rounded-full bg-soft2 text-mute hover:text-fg"><X size={11} /></button> : <Kbd>/</Kbd>}</div>
      </div>
      <ul className="mt-2 overflow-hidden rounded-xl border border-line bg-bg">
        {list.map((x) => <li key={x} className="border-b border-line px-4 py-2.5 text-[13px] transition-colors last:border-0 hover:bg-soft2">{hl(x)}</li>)}
        {!list.length && <li className="px-4 py-8 text-center text-[13px] text-mute">没有找到 “{q}”</li>}
      </ul>
    </div>
  );
}

function Password() {
  const [v, setV] = useState("");
  const [show, setShow] = useState(false);
  const score = [v.length >= 8, /[a-z]/.test(v) && /[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
  const lv = ["", "弱", "一般", "较强", "很强"][v ? Math.max(1, score) : 0];
  return (
    <div className="mx-auto max-w-sm">
      <div className="relative">
        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
        <input type={show ? "text" : "password"} value={v} onChange={(e) => setV(e.target.value)} placeholder="设置密码" className={cn(inp, "px-9")} autoComplete="new-password" />
        <button aria-label={show ? "隐藏密码" : "显示密码"} onClick={() => setShow(!show)} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-mute hover:bg-soft2 hover:text-fg">{show ? <EyeOff size={14} /> : <Eye size={14} />}</button>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className={cn("h-1 rounded-full transition-all duration-300", v && i < Math.max(1, score) ? "bg-fg" : "bg-line2")} />)}</div>
      <div className="mt-2 flex justify-between text-xs text-mute"><span>强度：{lv || "—"}</span><span>≥8 位 · 大小写 · 数字 · 符号</span></div>
    </div>
  );
}

function Choices() {
  const [items, setItems] = useState([true, false, true]);
  const [radio, setRadio] = useState("m");
  const [sw, setSw] = useState(true);
  const all = items.every(Boolean), some = items.some(Boolean);
  const box = (on: boolean, mid = false) => <span className={cn("grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border transition-all duration-150", on || mid ? "border-fg bg-inv text-invfg" : "border-line2 bg-bg")}>{mid ? <Minus size={12} /> : on ? <Check size={12} strokeWidth={3} /> : null}</span>;
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <div className="space-y-2.5">
        <Caption>复选 · 半选</Caption>
        <button className="flex items-center gap-2.5 text-[13px] font-medium" onClick={() => setItems(items.map(() => !all))}>{box(all, some && !all)}全选</button>
        {["选项 A", "选项 B", "选项 C"].map((t, i) => <button key={t} className="ml-6 flex items-center gap-2.5 text-[13px]" onClick={() => setItems(items.map((x, j) => (j === i ? !x : x)))}>{box(items[i])}{t}</button>)}
      </div>
      <div className="space-y-2.5">
        <Caption>单选</Caption>
        {[["m", "按月付费"], ["y", "按年付费（省 20%）"], ["l", "终身买断"]].map(([v, t]) => (
          <button key={v} role="radio" aria-checked={radio === v} onClick={() => setRadio(v)} className="flex items-center gap-2.5 text-[13px]">
            <span className={cn("grid h-[18px] w-[18px] place-items-center rounded-full border transition-colors", radio === v ? "border-fg" : "border-line2")}><span className={cn("h-2 w-2 rounded-full bg-fg transition-transform duration-200", radio === v ? "scale-100" : "scale-0")} /></span>{t}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <Caption>开关</Caption>
        <div className="flex items-center justify-between text-[13px]">通知<Switch checked={sw} onChange={setSw} label="通知" /></div>
        <div className="flex items-center justify-between text-[13px] text-dim">禁用<Switch checked={false} onChange={() => {}} disabled label="禁用" /></div>
        <p className="text-xs text-mute">{sw ? "通知已开启" : "通知已关闭"} · 开关即时生效</p>
      </div>
    </div>
  );
}

function Sliders() {
  const [v, setV] = useState(40);
  const [lo, setLo] = useState(20);
  const [hi, setHi] = useState(70);
  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div>
        <Caption>单值 · 气泡</Caption>
        <div className="relative pt-8">
          <div className="absolute top-0 -translate-x-1/2 rounded-md bg-inv px-2 py-1 font-mono text-[11px] text-invfg" style={{ left: `calc(${v}% + ${7 - v * 0.14}px)` }}>{v}</div>
          <input type="range" className="rng" min={0} max={100} value={v} style={{ ["--p" as any]: v + "%" }} onChange={(e) => setV(+e.target.value)} aria-label="音量" />
        </div>
      </div>
      <div>
        <Caption>双滑块 · 价格区间 ¥{lo * 10}–{hi * 10}</Caption>
        <div className="relative mt-8 h-4">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-line2" />
          <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-fg" style={{ left: `${lo}%`, right: `${100 - hi}%` }} />
          <input type="range" className="rng dual" min={0} max={100} value={lo} onChange={(e) => setLo(Math.min(+e.target.value, hi - 5))} aria-label="最小值" />
          <input type="range" className="rng dual" min={0} max={100} value={hi} onChange={(e) => setHi(Math.max(+e.target.value, lo + 5))} aria-label="最大值" />
        </div>
      </div>
    </div>
  );
}

function Otp() {
  const [d, setD] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const done = d.every(Boolean);
  const set = (i: number, c: string) => { const n = [...d]; n[i] = c; setD(n); if (c && i < 5) refs.current[i + 1]?.focus(); };
  return (
    <div className="text-center">
      <div className="flex justify-center gap-2" onPaste={(e) => { const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (t) { e.preventDefault(); setD(Array.from({ length: 6 }, (_, i) => t[i] ?? "")); refs.current[Math.min(5, t.length)]?.focus(); } }}>
        {d.map((c, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el; }} value={c} inputMode="numeric" maxLength={1} aria-label={`第 ${i + 1} 位`} autoComplete={i === 0 ? "one-time-code" : "off"}
            onChange={(e) => /^\d?$/.test(e.target.value) && set(i, e.target.value)}
            onKeyDown={(e) => e.key === "Backspace" && !c && i > 0 && refs.current[i - 1]?.focus()}
            className={cn("h-12 w-10 rounded-lg border bg-bg text-center font-mono text-lg outline-none transition-all focus:border-fg focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--fg)_10%,transparent)]", c ? "border-fg" : "border-line2")} />
        ))}
      </div>
      <div className="mt-4 h-5 text-xs text-mute">{done ? <span className="inline-flex items-center gap-1 text-fg"><Check size={13} />验证通过</span> : "自动跳格 · 支持粘贴 · Backspace 回退"}</div>
      {done && <button className="mt-1 text-xs text-mute underline underline-offset-4 hover:text-fg" onClick={() => { setD(Array(6).fill("")); refs.current[0]?.focus(); }}>清空</button>}
    </div>
  );
}

function Rating() {
  const [v, setV] = useState(3.5);
  const [h, setH] = useState(0);
  const show = h || v;
  return (
    <div className="text-center">
      <div className="inline-flex gap-1" onMouseLeave={() => setH(0)}>
        {[1, 2, 3, 4, 5].map((i) => {
          const f = clamp(show - (i - 1), 0, 1);
          return (
            <span key={i} className="relative block h-8 w-8 transition-transform hover:scale-110">
              <Star size={32} strokeWidth={1.25} className="absolute inset-0 text-line2" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${f * 100}%` }}><Star size={32} strokeWidth={1.25} className="fill-current" /></span>
              <button aria-label={`${i - 0.5} 星`} className="absolute inset-y-0 left-0 w-1/2" onMouseEnter={() => setH(i - 0.5)} onClick={() => setV(i - 0.5)} />
              <button aria-label={`${i} 星`} className="absolute inset-y-0 right-0 w-1/2" onMouseEnter={() => setH(i)} onClick={() => setV(i)} />
            </span>
          );
        })}
      </div>
      <div className="mt-3 font-mono text-sm tabular-nums">{show.toFixed(1)} / 5</div>
    </div>
  );
}

function TagInput() {
  const [tags, setTags] = useState(["设计系统", "动效"]);
  const [v, setV] = useState("");
  const add = () => { const t = v.trim(); if (t && !tags.includes(t) && tags.length < 6) setTags([...tags, t]); setV(""); };
  return (
    <div className="mx-auto max-w-md">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-line2 bg-bg p-1.5 transition-colors focus-within:border-fg">
        {tags.map((t) => <span key={t} className="anim-scale-in inline-flex h-7 items-center gap-1 rounded-md bg-soft2 pl-2.5 pr-1 text-[13px]">{t}<button aria-label={`移除 ${t}`} onClick={() => setTags(tags.filter((x) => x !== t))} className="grid h-5 w-5 place-items-center rounded text-mute hover:bg-line hover:text-fg"><X size={11} /></button></span>)}
        <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } if (e.key === "Backspace" && !v) setTags(tags.slice(0, -1)); }} placeholder={tags.length >= 6 ? "已达上限" : "输入后回车"} disabled={tags.length >= 6} className="h-7 min-w-24 flex-1 bg-transparent px-1.5 text-[13px] outline-none placeholder:text-dim" />
      </div>
      <div className="mt-2 text-xs text-mute">{tags.length}/6 · 回车添加 · Backspace 删除末项</div>
    </div>
  );
}

function StepperCountdown() {
  const [n, setN] = useState(2);
  const [left, setLeft] = useState(0);
  useInterval(() => setLeft((x) => x - 1), left > 0 ? 1000 : null);
  return (
    <Row className="gap-10">
      <div className="inline-flex items-center rounded-lg border border-line2 bg-bg">
        <button aria-label="减少" disabled={n <= 0} onClick={() => setN(n - 1)} className="inline-grid h-9 w-9 place-items-center align-middle rounded-l-lg hover:bg-soft2 disabled:opacity-30"><Minus size={14} /></button>
        <input aria-label="数量" value={n} onChange={(e) => setN(clamp(+e.target.value.replace(/\D/g, "") || 0, 0, 10))} className="h-9 w-12 bg-transparent text-center font-mono text-sm outline-none" />
        <button aria-label="增加" disabled={n >= 10} onClick={() => setN(n + 1)} className="inline-grid h-9 w-9 place-items-center align-middle rounded-r-lg hover:bg-soft2 disabled:opacity-30"><Plus size={14} /></button>
      </div>
      <Btn variant="outline" disabled={left > 0} onClick={() => setLeft(30)} className="min-w-28 tabular-nums">{left > 0 ? `${left}s 后重发` : "获取验证码"}</Btn>
    </Row>
  );
}

const CITIES = ["北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "武汉", "西安", "南京", "苏州", "天津", "长沙", "青岛"];
function Combo() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState("");
  const [hi, setHi] = useState(0);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false), open);
  const list = CITIES.filter((c) => c.includes(q));
  return (
    <div ref={ref} className="relative mx-auto max-w-xs">
      <div className="relative">
        <input value={open ? q : sel} onFocus={() => { setOpen(true); setQ(""); }} onChange={(e) => { setQ(e.target.value); setHi(0); setOpen(true); }}
          onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setHi((h) => Math.min(list.length - 1, h + 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); } if (e.key === "Enter" && list[hi]) { setSel(list[hi]); setOpen(false); } }}
          placeholder="搜索城市…" className={cn(inp, "pr-9")} role="combobox" aria-expanded={open} />
        <ChevronDown size={14} className={cn("pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-dim transition-transform", open && "rotate-180")} />
      </div>
      <Floating anchor={ref} open={open} gap={6} matchWidth>
        <div className="max-h-52 overflow-auto rounded-xl border border-line2 bg-bg p-1 shadow-pop">
          {list.map((c, i) => <button key={c} onMouseEnter={() => setHi(i)} onClick={() => { setSel(c); setOpen(false); }} className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px]", i === hi && "bg-soft2")}>{c}{sel === c && <Check size={13} />}</button>)}
          {!list.length && <div className="p-4 text-center text-xs text-mute">无匹配结果</div>}
        </div>
      </Floating>
      <div className="mt-3 text-xs text-mute">↑↓ 移动 · Enter 选择 · Esc 关闭</div>
    </div>
  );
}

function DatePicker() {
  const [d, setD] = useState(new Date());
  const [sel, setSel] = useState<Date | null>(new Date());
  const y = d.getFullYear(), m = d.getMonth();
  const first = new Date(y, m, 1).getDay();
  const n = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => i + 1)];
  const today = new Date();
  const same = (a: Date | null, day: number) => a && a.getFullYear() === y && a.getMonth() === m && a.getDate() === day;
  return (
    <div className="mx-auto w-72 rounded-2xl border border-line2 bg-bg p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <button aria-label="上个月" onClick={() => setD(new Date(y, m - 1, 1))} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-soft2"><ChevronLeft size={15} /></button>
        <div className="text-sm font-medium tabular-nums">{y} 年 {m + 1} 月</div>
        <button aria-label="下个月" onClick={() => setD(new Date(y, m + 1, 1))} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-soft2"><ChevronRight size={15} /></button>
      </div>
      <div className="grid grid-cols-7 text-center">
        {"日一二三四五六".split("").map((w) => <div key={w} className="pb-2 text-[11px] text-dim">{w}</div>)}
        {cells.map((c, i) => c ? (
          <button key={i} aria-label={`${y}年${m + 1}月${c}日`} onClick={() => setSel(new Date(y, m, c))} className={cn("mx-auto grid h-9 w-9 place-items-center rounded-full text-[13px] tabular-nums transition-colors", same(sel, c) ? "bg-inv text-invfg" : "hover:bg-soft2", same(today, c) && !same(sel, c) && "font-semibold underline underline-offset-4")}>{c}</button>
        ) : <span key={i} />)}
      </div>
    </div>
  );
}

function Upload_() {
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<{ n: string; p: number }[]>([]);
  const add = (names: string[]) => setFiles((f) => [...f, ...names.map((n) => ({ n, p: 0 }))]);
  useInterval(() => setFiles((f) => f.map((x) => ({ ...x, p: Math.min(100, x.p + 6 + Math.random() * 10) }))), files.some((f) => f.p < 100) ? 200 : null);
  return (
    <div className="mx-auto max-w-lg">
      <label onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); add(Array.from(e.dataTransfer.files).map((f) => f.name)); }}
        className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center transition-all duration-200", over ? "scale-[1.02] border-fg bg-soft2" : "border-line2 hover:border-fg")}>
        <div className="grid h-10 w-10 place-items-center rounded-full bg-soft2"><Upload size={17} /></div>
        <div className="text-[13px]">拖拽文件到这里，或<span className="underline underline-offset-4">点击选择</span></div>
        <div className="text-xs text-dim">仅本地模拟进度，不会上传任何数据</div>
        <input type="file" multiple className="sr-only" onChange={(e) => add(Array.from(e.target.files ?? []).map((f) => f.name))} />
      </label>
      <div className="mt-3 space-y-2">
        {files.map((f, i) => (
          <div key={i} className="anim-scale-in flex items-center gap-3 rounded-lg border border-line bg-bg p-3">
            <FileIcon size={16} className="text-mute" />
            <div className="min-w-0 flex-1"><div className="truncate text-[13px]">{f.n}</div><div className="mt-1.5 h-0.5 rounded bg-line"><div className="h-0.5 rounded bg-fg transition-all" style={{ width: f.p + "%" }} /></div></div>
            {f.p >= 100 ? <Check size={14} /> : <span className="font-mono text-[11px] text-mute tabular-nums">{Math.round(f.p)}%</span>}
            <button aria-label="移除" onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-mute hover:text-fg"><X size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AutoTextarea() {
  const [v, setV] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const max = 120;
  useEffect(() => { const t = ref.current!; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }, [v]);
  const r = 10, c = 2 * Math.PI * r, p = Math.min(1, v.length / max);
  return (
    <div className="mx-auto max-w-md rounded-xl border border-line2 bg-bg p-3 transition-colors focus-within:border-fg">
      <textarea ref={ref} rows={2} value={v} onChange={(e) => setV(e.target.value)} placeholder="写点什么吧，输入框会随内容自动增高…" className="max-h-52 w-full resize-none bg-transparent text-[13px] leading-relaxed outline-none placeholder:text-dim" />
      <div className="mt-2 flex items-center justify-end gap-3 text-xs text-mute">
        <span className="tabular-nums">{v.length > max ? <span className="text-fg">超出 {v.length - max}</span> : `${v.length}/${max}`}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90"><circle cx="12" cy="12" r={r} fill="none" stroke="var(--line2)" strokeWidth="2" /><circle cx="12" cy="12" r={r} fill="none" stroke="var(--fg)" strokeWidth="2" strokeDasharray={c} strokeDashoffset={c * (1 - p)} strokeLinecap="round" style={{ transition: "stroke-dashoffset .2s" }} /></svg>
        <Btn size="sm" disabled={!v.trim() || v.length > max}>发送</Btn>
      </div>
    </div>
  );
}

function Mask() {
  const [ph, setPh] = useState("");
  const [amt, setAmt] = useState("");
  const fmtPh = (s: string) => { const d = s.replace(/\D/g, "").slice(0, 11); return [d.slice(0, 3), d.slice(3, 7), d.slice(7)].filter(Boolean).join(" "); };
  const fmtAmt = (s: string) => { const d = s.replace(/[^\d.]/g, ""); const [a, b] = d.split("."); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (b !== undefined ? "." + b.slice(0, 2) : ""); };
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="block"><div className="mb-1.5 text-xs font-medium">手机号（3-4-4）</div><input className={cn(inp, "font-mono")} value={ph} onChange={(e) => setPh(fmtPh(e.target.value))} inputMode="numeric" placeholder="138 0000 0000" /></label>
      <label className="block"><div className="mb-1.5 text-xs font-medium">金额（千分位）</div><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-dim">¥</span><input className={cn(inp, "pl-7 font-mono")} value={amt} onChange={(e) => setAmt(fmtAmt(e.target.value))} inputMode="decimal" placeholder="1,234,567.00" /></div></label>
    </div>
  );
}

function SlideUnlock() {
  const [x, setX] = useState(0);
  const [done, setDone] = useState(false);
  const drag = useRef(false);
  const box = useRef<HTMLDivElement>(null);
  const W = () => (box.current?.clientWidth ?? 300) - 48;
  const move = (cx: number) => { if (!drag.current) return; const r = box.current!.getBoundingClientRect(); setX(clamp(cx - r.left - 24, 0, W())); };
  const up = () => { if (!drag.current) return; drag.current = false; if (x > W() * 0.95) { setDone(true); setX(W()); } else setX(0); };
  return (
    <div className="mx-auto max-w-sm">
      <div ref={box} className="relative h-12 select-none overflow-hidden rounded-full border border-line2 bg-soft2" onPointerMove={(e) => move(e.clientX)} onPointerUp={up} onPointerLeave={up}>
        <div className="absolute inset-y-0 left-0 bg-inv/10" style={{ width: x + 24 }} />
        <div className="absolute inset-0 grid place-items-center text-[13px] text-mute" style={{ opacity: done ? 0 : 1 - x / W() }}>向右滑动解锁</div>
        <div className="absolute inset-0 grid place-items-center text-[13px] font-medium transition-opacity" style={{ opacity: done ? 1 : 0 }}>已解锁</div>
        <div onPointerDown={(e) => { if (done) return; drag.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }} className="absolute left-1 top-1 grid h-10 w-10 cursor-grab touch-none place-items-center rounded-full bg-inv text-invfg active:cursor-grabbing" style={{ transform: `translateX(${x}px)`, transition: drag.current ? "none" : "transform .4s var(--spring)" }}>
          {done ? <Unlock size={15} /> : <ArrowRight size={15} />}
        </div>
      </div>
      {done && <button className="mt-3 block text-xs text-mute underline underline-offset-4 hover:text-fg" onClick={() => { setDone(false); setX(0); }}>重置</button>}
    </div>
  );
}

function FormValidate() {
  const [f, setF] = useState({ name: "", email: "", age: "" });
  const [t, setT] = useState<Record<string, boolean>>({});
  const [shake, setShake] = useState(0);
  const [ok, setOk] = useState(false);
  const err: Record<string, string> = {
    name: f.name.trim().length < 2 ? "姓名至少 2 个字符" : "",
    email: /^\S+@\S+\.\S+$/.test(f.email) ? "" : "邮箱格式不正确",
    age: +f.age >= 18 && +f.age <= 120 ? "" : "年龄需在 18–120 之间",
  };
  const submit = (e: React.FormEvent) => { e.preventDefault(); setT({ name: true, email: true, age: true }); if (Object.values(err).some(Boolean)) setShake((s) => s + 1); else setOk(true); };
  if (ok) return <div className="anim-scale-in mx-auto max-w-sm py-8 text-center"><div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-inv text-invfg"><Check size={20} /></div><div className="font-medium">提交成功</div><button className="mt-2 text-xs text-mute underline underline-offset-4" onClick={() => { setOk(false); setF({ name: "", email: "", age: "" }); setT({}); }}>再填一次</button></div>;
  return (
    <form noValidate onSubmit={submit} className="mx-auto max-w-sm space-y-4">
      {([["name", "姓名"], ["email", "邮箱"], ["age", "年龄"]] as const).map(([k, l]) => (
        <label key={k} className="block">
          <div className="mb-1.5 text-xs font-medium">{l}</div>
          <input className={cn(inp, t[k] && err[k] && "border-fg bg-soft2")} value={f[k]} aria-invalid={!!(t[k] && err[k])} onChange={(e) => setF({ ...f, [k]: e.target.value })} onBlur={() => setT({ ...t, [k]: true })} />
          <div className={cn("grid transition-all duration-200", t[k] && err[k] ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}><div className="overflow-hidden"><p role="alert" className="mt-1.5 flex items-center gap-1 text-xs"><AlertCircle size={12} />{err[k]}</p></div></div>
        </label>
      ))}
      <Btn key={shake} type="submit" className={cn("w-full", shake > 0 && "anim-shake")}>提交</Btn>
    </form>
  );
}

export const inputs: Section[] = [
  {
    id: "buttons", group: "components", title: "按钮", en: "Buttons",
    desc: "界面里最核心的交互元素。一个页面里，主要按钮只应出现一次。",
    blocks: [
      { id: "b-variants", title: "变体与尺寸", desc: "六种变体、三种尺寸、图标按钮与按钮组。", tips: ["variant × size 两个维度组合 class。", "纯图标按钮必须有 aria-label，触控目标 ≥ 40px。", "危险按钮配合二次确认或撤销。"], render: () => <Variants /> },
      { id: "b-states", title: "交互状态", desc: "每个可交互元素至少六种状态：默认、悬停、按下、聚焦、禁用、加载。", tips: ["按下：scale(0.97)。", "加载态保持按钮宽度，避免布局抖动。", "用 :focus-visible 而不是 :focus。"], render: () => <States /> },
      { id: "b-seg", title: "分段控制器", desc: "在 2–4 个互斥视图间切换。滑块用 transform 平移，带轻微回弹。", code: `transform: translateX(calc(index * 100%));\ntransition: transform .3s cubic-bezier(.34,1.56,.64,1);`, render: () => <SegDemo /> },
      { id: "b-split", title: "分割按钮", desc: "主操作 + 备选操作。点击箭头展开更多选项。", render: () => <SplitBtn /> },
      { id: "b-machine", title: "状态机按钮", desc: "idle → loading → success。宽度收缩为圆形，内容交叉淡入。", render: () => <MachineBtn /> },
      { id: "b-magnet", title: "磁吸与弹性按压", desc: "按钮向指针靠近；按下时快速收缩，松开用过冲曲线弹回。", render: () => <Magnetic /> },
      { id: "b-hold", title: "长按确认", desc: "用时间代替弹窗来防止误操作：按住按钮直到填满才触发。支持键盘空格 / 回车。", render: () => <HoldConfirm /> },
      { id: "b-fx", title: "悬停特效", desc: "扫光、箭头位移、中心展开、文字上滚——克制地使用，一页最多一个。", render: () => <FxButtons /> },
      { id: "b-micro", title: "微交互", desc: "点赞的弹跳与粒子；筛选标签选中时滑出对勾，而不仅仅靠颜色。", render: () => <LikeCopy /> },
    ],
  },
  {
    id: "forms", group: "components", title: "表单与输入", en: "Forms",
    desc: "表单是用户与产品对话的主要方式：清晰的标签 + 即时但不打扰的反馈。",
    blocks: [
      { id: "f-input", title: "输入框", desc: "默认、聚焦、校验、禁用四种状态。校验时机：失焦后再提示。", tips: ["label 必须关联 input，不能只靠 placeholder。", "错误提示用 role=alert，输入框 aria-invalid。"], render: () => <InputStates /> },
      { id: "f-float", title: "浮动标签", desc: "标签默认位于输入框内，聚焦或有内容时上浮缩小。", render: () => <FloatLabel /> },
      { id: "f-search", title: "搜索框", desc: "按 / 聚焦，Esc 清空。有内容时显示清除按钮，匹配文字高亮。", render: () => <SearchBox /> },
      { id: "f-pwd", title: "密码输入", desc: "可切换明文，并用 4 段进度条实时展示强度。", render: () => <Password /> },
      { id: "f-choice", title: "复选 · 单选 · 开关", desc: "自绘控件，支持半选状态。开关改变即生效，不需要保存按钮。", render: () => <Choices /> },
      { id: "f-slider", title: "滑块", desc: "单值滑块带气泡；双滑块用于区间选择。", render: () => <Sliders /> },
      { id: "f-otp", title: "验证码输入", desc: "6 位验证码：自动跳格、Backspace 回退、支持整串粘贴。", render: () => <Otp /> },
      { id: "f-rating", title: "星级评分", desc: "支持半星与悬停预览。每颗星覆盖左右两个半区按钮。", render: () => <Rating /> },
      { id: "f-tags", title: "标签输入", desc: "输入多个自由文本值。回车确认，去重并限制数量。", render: () => <TagInput /> },
      { id: "f-stepper", title: "步进器与倒计时", desc: "到达边界自动禁用；验证码冷却期间禁用并显示剩余秒数。", render: () => <StepperCountdown /> },
      { id: "f-combo", title: "可搜索下拉", desc: "输入过滤 + 键盘上下选择 + 当前项高亮。", render: () => <Combo /> },
      { id: "f-date", title: "日期选择器", desc: "月视图日历。今天带下划线，选中日用实心圆。", render: () => <DatePicker /> },
      { id: "f-upload", title: "文件上传区", desc: "拖拽或点击选择文件，列表中显示进度。", render: () => <Upload_ /> },
      { id: "f-textarea", title: "自适应文本域", desc: "高度随内容增长，环形进度显示字数。", render: () => <AutoTextarea /> },
      { id: "f-mask", title: "输入掩码", desc: "边输入边格式化：手机号分组、金额千分位。", render: () => <Mask /> },
      { id: "f-unlock", title: "滑动解锁", desc: "用手势防止误触高风险操作。拖到尽头才触发，中途松手弹回。", tips: ["必须提供非手势的替代方案。"], render: () => <SlideUnlock /> },
      { id: "f-validate", title: "表单校验", desc: "只对碰过的字段报错；提交失败时按钮抖动并展示全部错误。", render: () => <FormValidate /> },
    ],
  },
];
