import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronsRight, Eye, EyeOff, Lock, Mail, PenLine, Search, Star, Upload, User, X, File as FileIcon, TextCursorInput, CreditCard } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Field, Switch, inputCls } from "../components/ui";
import { cn } from "../utils/cn";
import { useClickOutside, clamp } from "../lib/hooks";
import { confetti } from "../lib/confetti";

/* ---------- 输入框 ---------- */
function InputDemo() {
  const [v, setV] = useState("not-an-email");
  const valid = /^\S+@\S+\.\S+$/.test(v);
  return (
    <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
      <Field label="默认"><input className={inputCls} placeholder="请输入…" /></Field>
      <Field label="带图标">
        <div className="relative"><Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" /><input className={cn(inputCls, "pl-9")} placeholder="name@example.com" /></div>
      </Field>
      <Field label="实时校验">
        <div className="relative">
          <input value={v} onChange={(e) => setV(e.target.value)} aria-invalid={!valid} className={cn(inputCls, "pr-9", !valid ? "border-red-500 focus:border-red-500 focus:ring-red-500/15" : "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/15")} />
          {valid ? <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" /> : <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />}
        </div>
        <span className={cn("mt-1 block text-xs", valid ? "text-emerald-600" : "text-red-500")}>{valid ? "邮箱格式正确" : "请输入有效的邮箱地址"}</span>
      </Field>
      <Field label="禁用"><input className={cn(inputCls, "cursor-not-allowed opacity-50")} disabled value="不可编辑" readOnly /></Field>
    </div>
  );
}

function SearchDemo() {
  const [q, setQ] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const list = ["按钮 Button", "输入框 Input", "下拉选择 Select", "日期选择 DatePicker", "对话框 Modal", "抽屉 Drawer", "标签页 Tabs"];
  const res = list.filter((x) => x.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "/" && document.activeElement?.tagName !== "INPUT") { e.preventDefault(); ref.current?.focus(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setQ("")} className={cn(inputCls, "pl-9 pr-9")} placeholder="搜索组件…" />
        {q ? <button aria-label="清除" onClick={() => setQ("")} className="absolute right-2 top-2.5 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="h-3.5 w-3.5" /></button>
          : <kbd className="absolute right-3 top-2.5 rounded border border-zinc-300 px-1.5 font-mono text-[11px] text-zinc-400 dark:border-zinc-700">/</kbd>}
      </div>
      <ul className="mt-2 space-y-0.5 text-sm">
        {res.map((r) => <li key={r} className="rounded-md px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">{r}</li>)}
        {!res.length && <li className="px-3 py-6 text-center text-zinc-400">没有找到 “{q}”</li>}
      </ul>
    </div>
  );
}

function PasswordDemo() {
  const [v, setV] = useState("");
  const [show, setShow] = useState(false);
  const score = [/.{8,}/, /[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(v)).length;
  const lv = v ? Math.max(1, Math.min(4, score - 1)) : 0;
  const cl = ["bg-zinc-200 dark:bg-zinc-700", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
  return (
    <div className="max-w-sm">
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <input type={show ? "text" : "password"} value={v} onChange={(e) => setV(e.target.value)} className={cn(inputCls, "px-9")} placeholder="设置密码" autoComplete="new-password" />
        <button aria-label={show ? "隐藏密码" : "显示密码"} onClick={() => setShow(!show)} className="absolute right-2 top-2 rounded-md p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
      </div>
      <div className="mt-2 flex gap-1.5">{[1, 2, 3, 4].map((i) => <span key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", i <= lv ? cl[lv] : cl[0])} />)}</div>
      <p className="mt-1.5 text-xs text-zinc-500">强度：{["—", "弱", "一般", "较强", "很强"][lv]} · 至少 8 位，含大小写、数字、符号</p>
    </div>
  );
}

function FloatingDemo() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const F = ({ label, v, set, type = "text" }: { label: string; v: string; set: (s: string) => void; type?: string }) => (
    <div className="relative">
      <input type={type} value={v} onChange={(e) => set(e.target.value)} placeholder=" " id={"f-" + label} className="peer h-12 w-full rounded-lg border border-zinc-300 bg-white px-3 pt-4 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 dark:border-zinc-700 dark:bg-zinc-900" />
      <label htmlFor={"f-" + label} className="pointer-events-none absolute left-3 top-3.5 origin-left text-sm text-zinc-400 transition-all duration-200 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-accent peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-75">{label}</label>
    </div>
  );
  return <div className="grid max-w-lg gap-4 sm:grid-cols-2"><F label="姓名" v={a} set={setA} /><F label="邮箱" v={b} set={setB} type="email" /></div>;
}

function CheckDemo() {
  const [c, setC] = useState([true, false, false]);
  const [r, setR] = useState("b");
  const [s, setS] = useState(true);
  const all = c.every(Boolean), some = c.some(Boolean);
  const Box = ({ on, partial }: { on: boolean; partial?: boolean }) => (
    <span className={cn("grid h-5 w-5 place-items-center rounded-md border transition", on || partial ? "border-accent bg-accent text-accent-fg" : "border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900")}>
      {partial ? <span className="h-0.5 w-2.5 rounded bg-current" /> : <Check className={cn("h-3.5 w-3.5 transition", on ? "scale-100" : "scale-0")} strokeWidth={3} />}
    </span>
  );
  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <div className="space-y-2.5 text-sm">
        <button className="flex items-center gap-2.5 font-medium" onClick={() => setC(c.map(() => !all))}><Box on={all} partial={some && !all} />全选</button>
        {["选项 A", "选项 B", "选项 C"].map((t, i) => (
          <button key={t} className="ml-6 flex items-center gap-2.5" role="checkbox" aria-checked={c[i]} onClick={() => setC(c.map((x, j) => (j === i ? !x : x)))}><Box on={c[i]} />{t}</button>
        ))}
      </div>
      <div className="space-y-2.5 text-sm" role="radiogroup">
        {[["a", "按月付费"], ["b", "按年付费（省 20%）"], ["c", "终身买断"]].map(([k, t]) => (
          <button key={k} role="radio" aria-checked={r === k} onClick={() => setR(k)} className="flex items-center gap-2.5">
            <span className={cn("grid h-5 w-5 place-items-center rounded-full border transition", r === k ? "border-accent" : "border-zinc-300 dark:border-zinc-600")}><span className={cn("h-2.5 w-2.5 rounded-full bg-accent transition", r === k ? "scale-100" : "scale-0")} /></span>{t}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-sm"><Switch checked={s} onChange={setS} label="通知" />{s ? "通知已开启" : "通知已关闭"}</div>
    </div>
  );
}

function SliderDemo() {
  const [v, setV] = useState(40);
  const [lo, setLo] = useState(20);
  const [hi, setHi] = useState(70);
  return (
    <div className="max-w-md space-y-8">
      <div>
        <div className="relative">
          <span className="absolute -top-8 -translate-x-1/2 rounded-md bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-white dark:text-zinc-900" style={{ left: `calc(${v}% + ${8 - v * 0.16}px)` }}>{v}</span>
          <input type="range" className="rng w-full" value={v} onChange={(e) => setV(+e.target.value)} style={{ background: `linear-gradient(90deg, var(--accent) ${v}%, transparent ${v}%), var(--color-zinc-200)` }} aria-label="音量" />
        </div>
      </div>
      <div>
        <div className="relative h-6">
          <div className="absolute top-2.5 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="absolute top-2.5 h-1.5 rounded-full bg-accent" style={{ left: lo + "%", width: hi - lo + "%" }} />
          {[[lo, (n: number) => setLo(Math.min(n, hi - 5)), "最小值"], [hi, (n: number) => setHi(Math.max(n, lo + 5)), "最大值"]].map(([val, fn, l], i) => (
            <input key={i} aria-label={l as string} type="range" value={val as number} onChange={(e) => (fn as (n: number) => void)(+e.target.value)}
              className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-white" />
          ))}
        </div>
        <p className="mt-1 text-xs text-zinc-500">价格区间 ¥{lo * 10} – ¥{hi * 10}</p>
      </div>
    </div>
  );
}

function OtpDemo() {
  const [d, setD] = useState<string[]>(Array(6).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const set = (i: number, v: string) => {
    const x = [...d]; x[i] = v; setD(x);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (x.every(Boolean)) confetti(window.innerWidth / 2, window.innerHeight / 2, 60);
  };
  return (
    <div>
      <div className="flex gap-2" onPaste={(e) => { const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (t) { e.preventDefault(); setD(Array.from({ length: 6 }, (_, i) => t[i] ?? "")); refs.current[Math.min(t.length, 5)]?.focus(); } }}>
        {d.map((v, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el; }} value={v} inputMode="numeric" maxLength={1} aria-label={`第 ${i + 1} 位`}
            onChange={(e) => /^\d?$/.test(e.target.value) && set(i, e.target.value)}
            onKeyDown={(e) => { if (e.key === "Backspace" && !v && i > 0) refs.current[i - 1]?.focus(); if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus(); if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus(); }}
            className="h-12 w-10 rounded-lg border border-zinc-300 bg-white text-center text-lg font-semibold outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/15 dark:border-zinc-700 dark:bg-zinc-900 sm:w-12" />
        ))}
      </div>
      <p className="mt-2 text-xs text-zinc-500">自动跳格 · 支持粘贴 · 输入完成触发庆祝</p>
    </div>
  );
}

function RatingDemo() {
  const [v, setV] = useState(3.5);
  const [hv, setHv] = useState<number | null>(null);
  const cur = hv ?? v;
  return (
    <div className="flex items-center gap-4">
      <div className="flex" onMouseLeave={() => setHv(null)} role="radiogroup" aria-label="评分">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="relative h-8 w-8 cursor-pointer transition hover:scale-110">
            <Star className="absolute inset-0 h-8 w-8 text-zinc-300 dark:text-zinc-700" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${clamp(cur - (i - 1), 0, 1) * 100}%` }}><Star className="h-8 w-8 fill-amber-400 text-amber-400" /></span>
            <button aria-label={`${i - 0.5} 星`} className="absolute inset-y-0 left-0 w-1/2" onMouseEnter={() => setHv(i - 0.5)} onClick={() => setV(i - 0.5)} />
            <button aria-label={`${i} 星`} className="absolute inset-y-0 right-0 w-1/2" onMouseEnter={() => setHv(i)} onClick={() => setV(i)} />
          </span>
        ))}
      </div>
      <span className="text-lg font-semibold tabular-nums">{cur.toFixed(1)}</span>
    </div>
  );
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<mark className="rounded bg-accent/20 px-0.5 text-inherit">{text.slice(i, i + q.length)}</mark>{text.slice(i + q.length)}</>;
}
const CITIES = ["北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "武汉", "西安", "南京", "苏州", "天津", "长沙", "青岛"];
function ComboboxDemo() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const [sel, setSel] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  const res = CITIES.filter((c) => c.includes(q));
  const pick = (c: string) => { setSel(c); setQ(c); setOpen(false); };
  return (
    <div ref={ref} className="relative max-w-xs min-h-64">
      <input role="combobox" aria-expanded={open} aria-controls="cb-list" value={q} placeholder="搜索城市…" className={inputCls}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setHi(0); }} onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHi((h) => Math.min(h + 1, res.length - 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); } else if (e.key === "Enter" && res[hi]) pick(res[hi]); else if (e.key === "Escape") setOpen(false); }} />
      {open && (
        <ul id="cb-list" role="listbox" className="anim-scale-in absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {res.map((c, i) => (
            <li key={c} role="option" aria-selected={c === sel} onMouseEnter={() => setHi(i)} onClick={() => pick(c)} className={cn("flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm", i === hi && "bg-zinc-100 dark:bg-zinc-800")}>
              <span><Highlight text={c} q={q} /></span>{c === sel && <Check className="h-4 w-4 text-accent" />}
            </li>
          ))}
          {!res.length && <li className="px-3 py-4 text-center text-sm text-zinc-400">无匹配结果</li>}
        </ul>
      )}
    </div>
  );
}

function SelectDemo() {
  const opts = ["设计师", "前端工程师", "后端工程师", "产品经理", "运营"];
  const [v, setV] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  return (
    <div ref={ref} className="relative min-h-60 max-w-xs">
      <button aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)} className={cn(inputCls, "flex items-center justify-between text-left", !v && "text-zinc-400")}>
        {v || "选择职位"}<ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} />
      </button>
      {open && (
        <ul role="listbox" className="anim-scale-in absolute z-10 mt-1 w-full origin-top rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          {opts.map((o) => <li key={o} role="option" aria-selected={o === v} onClick={() => { setV(o); setOpen(false); }} className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">{o}{o === v && <Check className="h-4 w-4 text-accent" />}</li>)}
        </ul>
      )}
    </div>
  );
}

/* ---------- 日历 ---------- */
const WD = ["日", "一", "二", "三", "四", "五", "六"];
function useMonth() {
  const [m, setM] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const days = useMemo(() => {
    const first = m.getDay();
    const n = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: n }, (_, i) => new Date(m.getFullYear(), m.getMonth(), i + 1))] as (Date | null)[];
  }, [m]);
  return { m, days, prev: () => setM(new Date(m.getFullYear(), m.getMonth() - 1, 1)), next: () => setM(new Date(m.getFullYear(), m.getMonth() + 1, 1)) };
}
const same = (a: Date | null, b: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();
function CalHeader({ m, prev, next }: { m: Date; prev: () => void; next: () => void }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <button aria-label="上个月" onClick={prev} className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronLeft className="h-4 w-4" /></button>
      <span className="text-sm font-semibold">{m.getFullYear()} 年 {m.getMonth() + 1} 月</span>
      <button aria-label="下个月" onClick={next} className="rounded-lg p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800"><ChevronRight className="h-4 w-4" /></button>
    </div>
  );
}
function DatePickerDemo() {
  const { m, days, prev, next } = useMonth();
  const [sel, setSel] = useState<Date | null>(null);
  const today = new Date();
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-72 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CalHeader m={m} prev={prev} next={next} />
        <div className="grid grid-cols-7 text-center text-xs text-zinc-400">{WD.map((w) => <span key={w} className="py-1">{w}</span>)}</div>
        <div className="grid grid-cols-7 gap-y-0.5 text-center text-sm">
          {days.map((d, i) => d ? (
            <button key={i} onClick={() => setSel(d)} className={cn("mx-auto h-9 w-9 rounded-full transition hover:bg-zinc-100 dark:hover:bg-zinc-800", same(d, today) && "font-bold text-accent", same(d, sel) && "bg-accent text-accent-fg hover:bg-accent")}>{d.getDate()}</button>
          ) : <span key={i} />)}
        </div>
      </div>
      <p className="text-sm text-zinc-500">已选：<b className="text-zinc-900 dark:text-zinc-100">{sel ? sel.toLocaleDateString("zh-CN") : "—"}</b></p>
    </div>
  );
}

function DateRangeDemo() {
  const { m, days, prev, next } = useMonth();
  const [a, setA] = useState<Date | null>(null);
  const [b, setB] = useState<Date | null>(null);
  const [h, setH] = useState<Date | null>(null);
  const end = b ?? h;
  const [lo, hi] = a && end ? (a <= end ? [a, end] : [end, a]) : [a, a];
  const click = (d: Date) => { if (!a || b) { setA(d); setB(null); } else setB(d); };
  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="w-72 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CalHeader m={m} prev={prev} next={next} />
        <div className="grid grid-cols-7 text-center text-xs text-zinc-400">{WD.map((w) => <span key={w} className="py-1">{w}</span>)}</div>
        <div className="grid grid-cols-7 text-center text-sm" onMouseLeave={() => setH(null)}>
          {days.map((d, i) => {
            if (!d) return <span key={i} />;
            const inR = lo && hi && d >= lo && d <= hi;
            const edge = same(d, lo) || same(d, hi);
            return (
              <button key={i} onMouseEnter={() => setH(d)} onClick={() => click(d)} className={cn("h-9 transition", inR && "bg-accent-soft", same(d, lo) && "rounded-l-full", same(d, hi) && "rounded-r-full", edge && "!bg-accent font-semibold text-accent-fg")}>{d.getDate()}</button>
            );
          })}
        </div>
      </div>
      <p className="text-sm text-zinc-500">{a && b ? `${(a <= b ? a : b).toLocaleDateString("zh-CN")} → ${(a <= b ? b : a).toLocaleDateString("zh-CN")}（${Math.abs(Math.round((+b - +a) / 864e5)) + 1} 天）` : a ? "请选择结束日期" : "请选择开始日期"}</p>
    </div>
  );
}

function UploadDemo() {
  const [files, setFiles] = useState<{ n: string; s: number; p: number }[]>([]);
  const [drag, setDrag] = useState(false);
  const add = (fl: FileList | null) => {
    if (!fl) return;
    const arr = Array.from(fl).map((f) => ({ n: f.name, s: f.size, p: 0 }));
    setFiles((x) => [...x, ...arr]);
    const t = setInterval(() => setFiles((x) => { const y = x.map((f) => ({ ...f, p: Math.min(100, f.p + 8 + Math.random() * 14) })); if (y.every((f) => f.p >= 100)) clearInterval(t); return y; }), 200);
  };
  return (
    <div className="max-w-md">
      <label onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); add(e.dataTransfer.files); }}
        className={cn("flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center transition", drag ? "scale-[1.02] border-accent bg-accent-soft" : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700")}>
        <span className="grid h-12 w-12 place-items-center rounded-full bg-zinc-100 dark:bg-zinc-800"><Upload className={cn("h-5 w-5 transition", drag && "-translate-y-1 text-accent")} /></span>
        <span className="text-sm font-medium">拖拽文件到这里，或 <span className="text-accent">点击选择</span></span>
        <span className="text-xs text-zinc-500">仅本地模拟上传进度，不会上传任何数据</span>
        <input type="file" multiple className="sr-only" onChange={(e) => add(e.target.files)} />
      </label>
      <ul className="mt-3 space-y-2">
        {files.map((f, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-zinc-200 p-2.5 text-sm dark:border-zinc-800">
            <FileIcon className="h-5 w-5 shrink-0 text-zinc-400" />
            <div className="min-w-0 flex-1"><p className="truncate">{f.n}</p><div className="mt-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-accent transition-all" style={{ width: f.p + "%" }} /></div></div>
            {f.p >= 100 ? <Check className="h-4 w-4 text-emerald-500" /> : <span className="text-xs tabular-nums text-zinc-500">{Math.round(f.p)}%</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- 颜色选择 ---------- */
function hslToHex(h: number, s: number, l: number) {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return "#" + [f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
function ColorPickerDemo() {
  const [h, setH] = useState(268);
  const [s, setS] = useState(80);
  const [v, setV] = useState(60); // HSV-ish for area: x=sat, y=brightness
  const area = useRef<HTMLDivElement>(null);
  const l = (v / 100) * (1 - s / 200);
  const sl = l === 0 || l === 1 ? 0 : ((v / 100 - l) / Math.min(l, 1 - l)) * 100;
  const hex = hslToHex(h, sl, l * 100);
  const move = (e: React.PointerEvent) => {
    const r = area.current!.getBoundingClientRect();
    setS(clamp(((e.clientX - r.left) / r.width) * 100, 0, 100));
    setV(clamp(100 - ((e.clientY - r.top) / r.height) * 100, 0, 100));
  };
  const presets = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
  return (
    <div className="flex flex-wrap gap-6">
      <div className="w-64 space-y-3">
        <div ref={area} onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); move(e); }} onPointerMove={(e) => e.buttons && move(e)} className="relative h-40 cursor-crosshair touch-none rounded-xl" style={{ background: `linear-gradient(transparent, #000), linear-gradient(90deg, #fff, hsl(${h} 100% 50%))` }}>
          <span className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md" style={{ left: s + "%", top: 100 - v + "%", background: hex }} />
        </div>
        <input type="range" min={0} max={360} value={h} onChange={(e) => setH(+e.target.value)} aria-label="色相" className="rng w-full" style={{ background: "linear-gradient(90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)" }} />
      </div>
      <div className="space-y-3">
        <div className="h-16 w-40 rounded-xl shadow-inner ring-1 ring-black/10" style={{ background: hex }} />
        <p className="font-mono text-sm">{hex.toUpperCase()}</p>
        <div className="grid w-40 grid-cols-4 gap-1.5">{presets.map((c) => <button key={c} aria-label={c} onClick={() => { const n = parseInt(c.slice(1), 16); const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); const d = mx - mn; let hh = 0; if (d) hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; setH(Math.round(((hh * 60) + 360) % 360)); setS(mx ? (d / mx) * 100 : 0); setV(mx * 100); }} className="h-7 rounded-md ring-1 ring-black/10 transition hover:scale-110" style={{ background: c }} />)}</div>
      </div>
    </div>
  );
}

function MultiSelectDemo() {
  const all = ["React", "Vue", "Svelte", "Solid", "Angular", "Preact", "Lit"];
  const [sel, setSel] = useState<string[]>(["React"]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  return (
    <div ref={ref} className="relative min-h-80 max-w-sm">
      <div onClick={() => setOpen(true)} className="flex min-h-10 cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-zinc-300 bg-white p-1.5 pr-8 dark:border-zinc-700 dark:bg-zinc-900">
        {sel.map((s) => <span key={s} className="anim-scale-in inline-flex items-center gap-1 rounded-md bg-zinc-100 py-0.5 pl-2 pr-1 text-xs dark:bg-zinc-800">{s}<button aria-label={"移除" + s} onClick={(e) => { e.stopPropagation(); setSel(sel.filter((x) => x !== s)); }}><X className="h-3 w-3" /></button></span>)}
        {!sel.length && <span className="px-1.5 text-sm text-zinc-400">选择框架</span>}
        <ChevronDown className="absolute right-2.5 top-3 h-4 w-4 text-zinc-400" />
      </div>
      {open && (
        <ul className="anim-scale-in absolute z-10 mt-1 w-full rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900" role="listbox" aria-multiselectable>
          {all.map((o) => { const on = sel.includes(o); return <li key={o} role="option" aria-selected={on} onClick={() => setSel(on ? sel.filter((x) => x !== o) : [...sel, o])} className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"><span className={cn("grid h-4 w-4 place-items-center rounded border", on ? "border-accent bg-accent text-accent-fg" : "border-zinc-300 dark:border-zinc-600")}>{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>{o}</li>; })}
        </ul>
      )}
    </div>
  );
}

function ValidationDemo() {
  const [f, setF] = useState({ name: "", email: "", age: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(0);
  const err = {
    name: f.name.trim().length < 2 ? "姓名至少 2 个字符" : "",
    email: /^\S+@\S+\.\S+$/.test(f.email) ? "" : "邮箱格式不正确",
    age: +f.age >= 18 && +f.age <= 120 ? "" : "年龄需在 18–120 之间",
  };
  const bad = Object.values(err).some(Boolean);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, age: true });
    if (bad) { setShake((s) => s + 1); return; }
    setDone(true); confetti();
  };
  const row = (k: keyof typeof f, label: string, ph: string, type = "text") => (
    <Field label={label}>
      <input type={type} value={f[k]} placeholder={ph} onChange={(e) => setF({ ...f, [k]: e.target.value })} onBlur={() => setTouched({ ...touched, [k]: true })} aria-invalid={touched[k] && !!err[k]}
        className={cn(inputCls, touched[k] && err[k] && "border-red-500 focus:border-red-500 focus:ring-red-500/15")} />
      <span className={cn("block overflow-hidden text-xs text-red-500 transition-all", touched[k] && err[k] ? "mt-1 max-h-5" : "max-h-0")} role="alert">{err[k]}</span>
    </Field>
  );
  if (done) return <div className="anim-scale-in max-w-sm rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10"><CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-500" /><p className="font-semibold">提交成功！</p><button className="mt-2 text-sm text-accent underline" onClick={() => { setDone(false); setF({ name: "", email: "", age: "" }); setTouched({}); }}>再填一次</button></div>;
  return (
    <form onSubmit={submit} noValidate className="max-w-sm space-y-4">
      {row("name", "姓名", "张三")}{row("email", "邮箱", "name@example.com", "email")}{row("age", "年龄", "18", "number")}
      <Btn key={shake} variant="accent" size="lg" type="submit" className={cn("w-full", shake > 0 && bad && "anim-shake")}>提交</Btn>
    </form>
  );
}

/* ---------- 新增 ---------- */
function CreditCardDemo() {
  const [num, setNum] = useState("");
  const [name, setName] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [flip, setFlip] = useState(false);
  const fmt = (n: string) => n.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const shown = (fmt(num) + " •••• •••• •••• ••••").slice(0, 19);
  const brand = num.startsWith("4") ? "VISA" : num.startsWith("5") ? "MasterCard" : "CARD";
  return (
    <div className="flex flex-wrap items-center gap-8">
      <div className="h-48 w-80 [perspective:1000px]">
        <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]" style={{ transform: flip ? "rotateY(180deg)" : "none" }}>
          <div className="absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br from-accent via-fuchsia-600 to-zinc-900 p-5 text-white shadow-xl [backface-visibility:hidden]">
            <div className="flex justify-between"><span className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" /><span className="text-sm font-bold italic">{brand}</span></div>
            <p className="mt-7 font-mono text-xl tracking-widest">{shown}</p>
            <div className="mt-5 flex justify-between text-xs"><div><p className="text-[10px] opacity-60">持卡人</p><p className="uppercase">{name || "YOUR NAME"}</p></div><div><p className="text-[10px] opacity-60">有效期</p><p>{exp || "MM/YY"}</p></div></div>
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="mt-6 h-10 bg-black" />
            <div className="mx-5 mt-5 flex items-center justify-end rounded bg-white px-3 py-2 font-mono text-sm text-zinc-900">{cvc || "•••"}</div>
          </div>
        </div>
      </div>
      <div className="grid w-72 gap-3">
        <input className={inputCls} placeholder="卡号" inputMode="numeric" value={fmt(num)} onChange={(e) => setNum(e.target.value)} onFocus={() => setFlip(false)} />
        <input className={inputCls} placeholder="持卡人姓名" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFlip(false)} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} placeholder="MM/YY" value={exp} maxLength={5} onFocus={() => setFlip(false)} onChange={(e) => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); setExp(v); }} />
          <input className={inputCls} placeholder="CVC" inputMode="numeric" value={cvc} maxLength={3} onFocus={() => setFlip(true)} onBlur={() => setFlip(false)} onChange={(e) => setCvc(e.target.value.replace(/\D/g, ""))} />
        </div>
      </div>
    </div>
  );
}

function TextareaDemo() {
  const [v, setV] = useState("");
  const max = 140;
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const el = ref.current; if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 220) + "px"; } }, [v]);
  const p = Math.min(v.length / max, 1);
  const R = 10, C = 2 * Math.PI * R;
  return (
    <div className="max-w-md">
      <textarea ref={ref} rows={2} value={v} onChange={(e) => setV(e.target.value)} placeholder="写点什么吧，输入框会随内容自动增高…" className={cn(inputCls, "h-auto resize-none py-2.5 leading-relaxed")} />
      <div className="mt-1.5 flex items-center justify-end gap-2 text-xs">
        <span className={cn("tabular-nums", v.length > max ? "text-red-500" : "text-zinc-500")}>{v.length > max ? `超出 ${v.length - max}` : max - v.length}</span>
        <svg width="26" height="26" viewBox="0 0 26 26" className="-rotate-90"><circle cx="13" cy="13" r={R} fill="none" strokeWidth="3" className="stroke-zinc-200 dark:stroke-zinc-800" /><circle cx="13" cy="13" r={R} fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} className={cn("transition-all", v.length > max ? "stroke-red-500" : v.length > max * 0.85 ? "stroke-amber-500" : "stroke-accent")} /></svg>
      </div>
    </div>
  );
}

function MaskDemo() {
  const [phone, setPhone] = useState("");
  const [money, setMoney] = useState("");
  const fp = (s: string) => { const d = s.replace(/\D/g, "").slice(0, 11); return d.length > 7 ? `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7)}` : d.length > 3 ? `${d.slice(0, 3)} ${d.slice(3)}` : d; };
  const fm = (s: string) => { const [i, d] = s.replace(/[^\d.]/g, "").split("."); const ii = (i || "").replace(/\B(?=(\d{3})+(?!\d))/g, ","); return d !== undefined ? `${ii}.${d.slice(0, 2)}` : ii; };
  return (
    <div className="grid max-w-lg gap-4 sm:grid-cols-2">
      <Field label="手机号（3-4-4）"><input className={inputCls} inputMode="numeric" value={phone} onChange={(e) => setPhone(fp(e.target.value))} placeholder="138 0013 8000" /></Field>
      <Field label="金额（千分位）"><div className="relative"><span className="absolute left-3 top-2.5 text-sm text-zinc-400">¥</span><input className={cn(inputCls, "pl-7 text-right tabular-nums")} inputMode="decimal" value={money} onChange={(e) => setMoney(fm(e.target.value))} placeholder="1,234,567.89" /></div></Field>
    </div>
  );
}

function SlideUnlockDemo() {
  const [x, setX] = useState(0);
  const [ok, setOk] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const max = () => (track.current?.clientWidth ?? 280) - 48;
  const move = (e: React.PointerEvent) => { if (!drag.current || ok) return; const r = track.current!.getBoundingClientRect(); setX(clamp(e.clientX - r.left - 24, 0, max())); };
  const end = () => { if (!drag.current) return; drag.current = false; if (x >= max() - 4) { setOk(true); confetti(); } else setX(0); };
  return (
    <div className="max-w-xs">
      <div ref={track} onPointerMove={move} onPointerUp={end} onPointerLeave={end} className="relative h-12 select-none overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className="absolute inset-y-0 left-0 rounded-full bg-accent/30" style={{ width: x + 48 }} />
        <span className="absolute inset-0 grid place-items-center text-sm text-zinc-500" style={{ opacity: 1 - x / max() }}>{ok ? "" : "向右滑动解锁 →"}</span>
        {ok && <span className="absolute inset-0 grid place-items-center text-sm font-semibold text-emerald-600">✓ 已解锁</span>}
        <div onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }} className={cn("absolute left-0 top-0 grid h-12 w-12 cursor-grab touch-none place-items-center rounded-full bg-white shadow-md active:cursor-grabbing dark:bg-zinc-600", x === 0 || ok ? "transition-transform duration-300" : "")} style={{ transform: `translateX(${ok ? max() : x}px)` }}>
          <ChevronsRight className="h-5 w-5 text-accent" />
        </div>
      </div>
      {ok && <button onClick={() => { setOk(false); setX(0); }} className="mt-2 text-xs text-zinc-500 underline">重置</button>}
    </div>
  );
}

export const forms: Section = {
  id: "forms", title: "表单与输入", en: "Forms & Inputs", group: "组件", icon: TextCursorInput, hue: 330,
  blurb: "表单是用户与产品对话的主要方式。好的表单体验 = 清晰的标签 + 即时但不打扰的反馈 + 键盘友好。这里从最简单的输入框，一路做到日期范围和信用卡。",
  items: [
    item({ id: "input", title: "输入框", en: "Input", level: "基础", demo: InputDemo, tags: ["text"],
      desc: "所有表单的基础。需要 4 种状态：默认、聚焦、错误/成功、禁用。聚焦用品牌色边框 + 4px 柔和光环。",
      points: ["高度统一 40px，padding 12px。", "错误提示紧贴输入框，使用 role=alert。", "校验时机：失焦后再提示，输入过程中静默修正。"], a11y: ["label 必须关联 input，不能只靠 placeholder。", "错误态设置 aria-invalid。"], mistakes: ["用 placeholder 代替 label。", "每敲一个字就报错。"],
      code: `<input aria-invalid={!valid}
  className="h-10 rounded-lg border px-3 outline-none
    focus:border-accent focus:ring-4 focus:ring-accent/15
    aria-[invalid=true]:border-red-500" />` }),
    item({ id: "search", title: "搜索框", en: "Search Field", level: "基础", demo: SearchDemo, tags: ["filter"],
      desc: "带清除按钮、快捷键提示（/）与空结果提示的搜索。按 / 聚焦，Esc 清空。",
      points: ["有内容时显示清除按钮，否则显示快捷键。", "空结果给出明确文案，而不是留白。"], code: `onKeyDown={(e) => e.key === "Escape" && setQ("")}` }),
    item({ id: "password", title: "密码输入", en: "Password + Strength", level: "进阶", demo: PasswordDemo, tags: ["security"],
      desc: "可切换明文显示，并用 4 段进度条实时展示强度。",
      points: ["强度按长度、大小写、数字、符号综合打分。", "autoComplete=new-password 方便密码管理器。"], a11y: ["显示/隐藏按钮需动态的 aria-label。"], code: `const score = [/.{8,}/, /[A-Z]/, /[a-z]/, /\\d/, /[^A-Za-z0-9]/].filter((r) => r.test(v)).length;` }),
    item({ id: "floating", title: "浮动标签", en: "Floating Label", level: "进阶", demo: FloatingDemo, tags: ["material"],
      desc: "标签默认位于输入框内，聚焦或有内容时上浮缩小，节省空间。",
      points: ["关键技巧：placeholder=\" \" + peer-placeholder-shown 判断是否有内容。", "只用 transform 过渡，不触发布局。"], code: `<input placeholder=" " className="peer" />
<label className="peer-focus:-translate-y-2.5 peer-focus:scale-75
  peer-[:not(:placeholder-shown)]:-translate-y-2.5" />` }),
    item({ id: "checkbox", title: "复选 · 单选 · 开关", en: "Checkbox / Radio / Switch", level: "基础", demo: CheckDemo, tags: ["toggle"],
      desc: "复选框用于多选，单选用于互斥，开关用于即时生效的设置。父级复选框支持半选状态。",
      points: ["开关：改变即生效，不需要保存按钮。", "半选状态用横线表示。"], a11y: ["自绘控件需 role=checkbox/radio/switch + aria-checked。", "整行可点击，扩大点击区。"], code: `<button role="switch" aria-checked={on} onClick={() => setOn(!on)} />` }),
    item({ id: "slider", title: "滑块", en: "Slider & Range", level: "进阶", demo: SliderDemo, tags: ["range"],
      desc: "在连续区间内选值。单值滑块带气泡提示；双滑块用于价格区间。",
      points: ["已选部分用强调色，用渐变背景实现。", "双滑块：两个 input 叠放，pointer-events 只给 thumb。", "两端之间保留最小间距。"], a11y: ["原生 input[type=range] 自带键盘支持。"], code: `<input type="range" style={{ background: "linear-gradient(90deg, var(--accent) " + v + "%, #e4e4e7 " + v + "%)" }} />` }),
    item({ id: "otp", title: "验证码输入", en: "OTP Input", level: "进阶", demo: OtpDemo, tags: ["pin", "code"],
      desc: "6 位验证码：自动跳格、Backspace 回退、支持粘贴整串，输入完成自动提交。",
      points: ["inputMode=numeric 唤起数字键盘。", "onPaste 拆分字符串填入各格。"], a11y: ["每格 aria-label=“第 n 位”；autoComplete=one-time-code 可读取短信验证码。"], code: `onPaste={(e) => {
  const t = e.clipboardData.getData("text").replace(/\\D/g, "").slice(0, 6);
  setDigits(Array.from({ length: 6 }, (_, i) => t[i] ?? ""));
}}` }),
    item({ id: "rating", title: "评分", en: "Star Rating", level: "进阶", demo: RatingDemo, tags: ["star"],
      desc: "支持半星与悬停预览。每颗星上覆盖左右两个半区按钮。",
      points: ["用 overflow-hidden + 宽度百分比绘制部分填充。", "悬停预览，移出恢复。"], a11y: ["每个半区按钮提供 aria-label。"], code: `<span style={{ width: clamp(value - (i - 1), 0, 1) * 100 + "%" }} className="absolute overflow-hidden"><Star fill="gold" /></span>` }),
    item({ id: "combobox", title: "可搜索下拉", en: "Combobox", level: "高级", demo: ComboboxDemo, tags: ["autocomplete"],
      desc: "输入过滤 + 键盘上下选择 + 匹配文本高亮。选项很多时的首选。",
      points: ["↑↓ 移动高亮，Enter 选择，Esc 关闭。", "点击外部关闭（useClickOutside）。", "匹配文字用 mark 高亮。"], a11y: ["role=combobox + listbox + option，aria-expanded / aria-selected。"], code: `<input role="combobox" aria-expanded={open} aria-controls="list" />
<ul id="list" role="listbox">…</ul>` }),
    item({ id: "select", title: "下拉选择", en: "Select", level: "基础", demo: SelectDemo, tags: ["dropdown"],
      desc: "自绘下拉，样式可控。选项少于 5 个时考虑分段控制器或单选。",
      points: ["箭头旋转提示展开状态。", "选中项显示对勾。", "移动端优先用原生 select。"], code: `<button aria-haspopup="listbox" aria-expanded={open}>…</button>` }),
    item({ id: "datepicker", title: "日期选择器", en: "Date Picker", level: "进阶", demo: DatePickerDemo, tags: ["calendar"],
      desc: "月视图日历。今天用强调色文字，选中日用实心圆。",
      points: ["用 Date(y, m+1, 0) 获取当月天数。", "月首空位用 null 占位。"], a11y: ["日期按钮需包含完整日期的 aria-label。"], code: `const n = new Date(y, m + 1, 0).getDate(); // 当月天数
const first = new Date(y, m, 1).getDay(); // 月首偏移` }),
    item({ id: "upload", title: "文件上传区", en: "Dropzone", level: "进阶", demo: UploadDemo, tags: ["file", "drag"],
      desc: "拖拽或点击选择文件，列表中显示进度。拖入时整体放大并变色。",
      points: ["onDragOver 必须 preventDefault 才能触发 drop。", "原生 input 用 sr-only 隐藏，label 作为点击区。"], a11y: ["保留原生 input，键盘用户仍可选文件。"], code: `<label onDragOver={(e) => e.preventDefault()} onDrop={(e) => add(e.dataTransfer.files)}>
  <input type="file" className="sr-only" />
</label>` }),
    item({ id: "color-picker", title: "颜色选择", en: "Color Picker", level: "高级", demo: ColorPickerDemo, tags: ["hsl", "hex"],
      desc: "饱和度/明度二维面板 + 色相条 + 预设色。用 Pointer Events 统一鼠标和触摸。",
      points: ["面板背景 = 白→色相 的横向渐变叠加 透明→黑 的纵向渐变。", "setPointerCapture 保证拖出面板仍能跟随。", "touch-action: none 阻止拖动时页面滚动。"], code: `background: "linear-gradient(transparent, #000), linear-gradient(90deg, #fff, hsl(" + h + " 100% 50%))"` }),
    item({ id: "multiselect", title: "多选下拉", en: "Multi Select", level: "进阶", demo: MultiSelectDemo, tags: ["tags"],
      desc: "已选项以标签显示在输入区，可单独删除；下拉中以复选框表示状态。", points: ["下拉保持打开，方便连续选择。"], code: `onClick={() => setSel(on ? sel.filter((x) => x !== o) : [...sel, o])}` }),
    item({ id: "daterange", title: "日期范围选择", en: "Date Range", level: "高级", demo: DateRangeDemo, tags: ["range"],
      desc: "点击起止两次，悬停时预览区间；范围两端为圆角胶囊。",
      points: ["起止顺序可颠倒，渲染前 sort。", "已选完再点击则重新开始。"], code: `const [lo, hi] = a <= end ? [a, end] : [end, a];
const inRange = d >= lo && d <= hi;` }),
    item({ id: "validation", title: "表单校验", en: "Form Validation", level: "高级", demo: ValidationDemo, tags: ["validate", "submit"],
      desc: "失焦后才显示错误，提交失败时按钮抖动并展示所有错误，成功后庆祝。",
      points: ["touched 状态：只对碰过的字段报错。", "错误高度用 max-height 过渡，避免跳动。", "提交失败时聚焦第一个错误字段（可选）。"], a11y: ["错误文本 role=alert，输入框 aria-invalid。", "noValidate + 自定义校验，确保提示一致。"], code: `const [touched, setTouched] = useState({});
<input onBlur={() => setTouched({ ...touched, email: true })} />
{touched.email && err.email && <p role="alert">{err.email}</p>}` }),
    item({ id: "credit-card", title: "信用卡输入", en: "Credit Card Form", level: "高级", isNew: true, demo: CreditCardDemo, tags: ["payment", "3d", "flip"],
      desc: "实时预览的 3D 翻转卡片：输入卡号、姓名、有效期时显示正面，聚焦 CVC 时翻到背面。",
      points: ["3D 翻转：perspective + preserve-3d + backface-visibility:hidden。", "卡号每 4 位自动加空格；有效期自动补斜杠。", "根据首位数字识别卡组织。"], a11y: ["autoComplete=cc-number / cc-exp / cc-csc。"], code: `<div className="[perspective:1000px]">
  <div style={{ transform: flip ? "rotateY(180deg)" : "none" }} className="[transform-style:preserve-3d] transition-transform duration-700">
    <Front className="[backface-visibility:hidden]" />
    <Back className="[backface-visibility:hidden] [transform:rotateY(180deg)]" />
  </div>
</div>` }),
    item({ id: "textarea", title: "自适应文本域", en: "Auto-grow Textarea", level: "进阶", isNew: true, demo: TextareaDemo, tags: ["counter"],
      desc: "高度随内容自动增长，并用环形进度显示字数；接近上限变黄，超出变红。",
      points: ["每次输入先把 height 设为 auto，再设为 scrollHeight。", "环形进度：strokeDasharray + strokeDashoffset。"], code: `el.style.height = "auto";
el.style.height = Math.min(el.scrollHeight, 220) + "px";` }),
    item({ id: "mask", title: "输入掩码", en: "Input Mask", level: "进阶", isNew: true, demo: MaskDemo, tags: ["format", "phone"],
      desc: "边输入边格式化：手机号 3-4-4 分组，金额千分位。让用户一眼核对。",
      points: ["先清洗再格式化：replace(/\\D/g, \"\")。", "保持 inputMode=numeric。", "光标跳动问题可在高级场景里手动恢复 selectionStart。"], code: `const fmt = (s: string) => s.replace(/\\D/g, "").slice(0, 11).replace(/(\\d{3})(\\d{4})(\\d+)/, "$1 $2 $3");` }),
    item({ id: "slide-unlock", title: "滑动解锁", en: "Slide to Confirm", level: "进阶", isNew: true, demo: SlideUnlockDemo, tags: ["gesture", "pointer"],
      desc: "用手势防止误触高风险操作（支付、删除）。拖到尽头才触发，中途松手弹回。",
      points: ["Pointer Events + setPointerCapture。", "拖动期间无过渡，松手后才加 transition 回弹。", "提示文字透明度随进度渐隐。"], a11y: ["必须提供非手势的替代方案（如确认按钮）。"], code: `const end = () => { if (x >= max - 4) confirm(); else setX(0); };` }),
  ],
};

// 未使用的图标引用，保持 tree-shaking 友好
void [User, PenLine, CreditCard];
