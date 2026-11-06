import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Check, Copy, Loader2, RefreshCw, Ruler, Search, ShieldCheck, XCircle, Compass } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Kbd, Range, Seg, inputCls } from "../components/ui";
import { cn } from "../utils/cn";
import { useCopy, useInterval, useLocalStorage } from "../lib/hooks";
import { confetti } from "../lib/confetti";

const Table = ({ head, rows }: { head: string[]; rows: (string | React.ReactNode)[][] }) => (
  <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800"><table className="w-full min-w-[420px] text-sm"><thead className="bg-zinc-50 text-xs text-zinc-500 dark:bg-zinc-900"><tr>{head.map((h) => <th key={h} className="px-4 py-2.5 text-left font-medium">{h}</th>)}</tr></thead><tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={cn("px-4 py-2.5", j === 0 && "font-medium")}>{c}</td>)}</tr>)}</tbody></table></div>
);

/* ================= 规范 ================= */
function TouchStd() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const sizes = [[20, "太小", false], [32, "桌面最小", true], [44, "iOS 推荐", true], [48, "Material 推荐", true]] as const;
  return (
    <div className="space-y-4">
      <div className="relative flex flex-wrap items-end gap-6 overflow-hidden rounded-xl bg-zinc-100 p-6 dark:bg-zinc-900" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: e.clientX - r.left, y: e.clientY - r.top }); }} onMouseLeave={() => setPos(null)}>
        {sizes.map(([s, l, ok]) => <div key={s} className="text-center"><button className={cn("grid place-items-center rounded-lg bg-accent text-xs font-bold text-accent-fg", !ok && "ring-2 ring-red-400")} style={{ width: s, height: s }}>{s}</button><p className={cn("mt-2 text-[11px]", ok ? "text-zinc-500" : "text-red-500")}>{l}</p></div>)}
        {pos && <span className="pointer-events-none absolute h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400 bg-amber-300/30" style={{ left: pos.x, top: pos.y }} />}
        <p className="absolute right-3 top-2 text-[11px] text-zinc-400">黄圈 = 44px 指腹，试着去“点”最小的按钮</p>
      </div>
      <Table head={["平台", "最小触控目标", "最小间距"]} rows={[["Apple HIG", "44 × 44 pt", "8 pt"], ["Material", "48 × 48 dp", "8 dp"], ["WCAG 2.2 AA", "24 × 24 CSS px", "—"], ["WCAG 2.2 AAA", "44 × 44 CSS px", "—"]]} />
    </div>
  );
}

function ColorStd() {
  const Mock = ({ n, label }: { n: number; label: string }) => (
    <div className="space-y-2"><div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"><div className="mb-2 flex items-center justify-between"><span className={cn("h-2.5 w-14 rounded", n > 8 ? "bg-accent" : "bg-zinc-300 dark:bg-zinc-700")} /><span className={cn("h-5 w-10 rounded-md", "bg-accent")} /></div>
      <div className="grid grid-cols-3 gap-1.5">{Array.from({ length: 6 }, (_, i) => <div key={i} className={cn("h-10 rounded-lg", i < Math.round(n / 8) ? "bg-accent" : "bg-zinc-100 dark:bg-zinc-800")} />)}</div>
      <div className="mt-2 space-y-1.5">{[70, 50, 60].map((w, i) => <div key={i} className={cn("h-2 rounded", n > 20 && i === 0 ? "bg-accent" : "bg-zinc-200 dark:bg-zinc-700")} style={{ width: w + "%" }} />)}</div></div><p className="text-center text-xs text-zinc-500">{label}</p></div>
  );
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3"><Mock n={4} label="✓ 克制（≈5%）：主次分明" /><Mock n={16} label="◐ 适中（≈15%）：可接受" /><Mock n={40} label="✗ 过量（≈35%）：到处都是重点＝没有重点" /></div>
      <div className="overflow-hidden rounded-full"><div className="flex h-8 text-center text-xs font-semibold leading-8"><span className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" style={{ width: "60%" }}>60% 背景 / 中性</span><span className="bg-zinc-400 text-white dark:bg-zinc-600" style={{ width: "30%" }}>30% 文字 / 次要</span><span className="bg-accent text-accent-fg" style={{ width: "10%" }}>10%</span></div></div>
      <Table head={["用途", "浅色", "深色", "最小对比度"]} rows={[["主文字", "zinc-900", "zinc-100", "≥ 7:1"], ["次要文字", "zinc-500", "zinc-400", "≥ 4.5:1"], ["占位符", "zinc-400", "zinc-500", "≥ 3:1（非必需）"], ["边框", "zinc-200", "zinc-800", "≥ 3:1（交互控件）"], ["强调色", "accent", "accent（提亮）", "≥ 4.5:1（文字）"]]} />
    </div>
  );
}

function TypeStd() {
  const rows: [string, number, number, number, string][] = [["Display", 48, 56, 800, "-0.03em"], ["H1", 36, 44, 700, "-0.025em"], ["H2", 28, 36, 600, "-0.02em"], ["H3", 20, 28, 600, "-0.01em"], ["Body", 16, 26, 400, "0"], ["Small", 14, 22, 400, "0"], ["Caption", 12, 18, 500, "0.02em"]];
  return <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">{rows.map(([n, s, l, w, t]) => <div key={n} className="grid items-center gap-4 px-4 py-3 sm:grid-cols-[100px_1fr_200px]"><span className="font-mono text-xs text-accent">{n}</span><span className="truncate" style={{ fontSize: s, lineHeight: l + "px", fontWeight: w, letterSpacing: t }}>{n === "Caption" ? "辅助说明 CAPTION" : "设计即秩序 Design"}</span><span className="font-mono text-[11px] text-zinc-500">{s}/{l} · {w} · {t} · ×{(l / s).toFixed(2)}</span></div>)}</div>;
}

function ZStd() {
  const L: [string, number, string][] = [["页面内容", 0, "bg-zinc-300 dark:bg-zinc-700"], ["吸顶元素 sticky", 10, "bg-sky-400"], ["下拉 / 弹出", 20, "bg-emerald-400"], ["遮罩 overlay", 30, "bg-amber-400"], ["对话框 modal", 40, "bg-orange-400"], ["提示 toast", 50, "bg-rose-400"], ["工具提示 tooltip", 60, "bg-violet-500"]];
  const [h, setH] = useState<number | null>(null);
  return (
    <div className="grid items-center gap-8 md:grid-cols-2">
      <div className="grid h-72 place-items-center [perspective:1200px]"><div className="relative h-24 w-44 [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-35deg)]">{L.map(([n, z, c], i) => <div key={n} className={cn("absolute inset-0 grid place-items-center rounded-lg border border-white/50 text-[10px] font-bold text-white/90 transition-all duration-300", c, h === i ? "opacity-100" : "opacity-80")} style={{ transform: `translateZ(${i * 26 + (h === i ? 14 : 0)}px)` }}>{z}</div>)}</div></div>
      <ul className="space-y-1.5">{L.map(([n, z, c], i) => <li key={n} onMouseEnter={() => setH(i)} onMouseLeave={() => setH(null)} className={cn("flex cursor-default items-center gap-3 rounded-lg border px-3 py-2 text-sm transition", h === i ? "border-accent bg-accent-soft" : "border-zinc-200 dark:border-zinc-800")}><span className={cn("h-3 w-3 rounded", c)} /><span className="flex-1">{n}</span><code className="text-xs text-zinc-500">z-{z}</code></li>)}</ul>
    </div>
  );
}

function DurationStd() {
  const R: [number, string, string][] = [[100, "颜色 / 透明度变化", "linear"], [150, "按钮 hover / 按下", "ease"], [200, "下拉菜单、提示出现", "ease-out"], [300, "抽屉、底部面板", "cubic-bezier(.32,.72,0,1)"], [500, "页面级转场", "cubic-bezier(.4,0,.2,1)"]];
  const [h, setH] = useState<number | null>(null);
  return <div className="space-y-2">{R.map(([d, u, e]) => <div key={d} onMouseEnter={() => setH(d)} onMouseLeave={() => setH(null)} className="grid cursor-default items-center gap-4 rounded-xl border border-zinc-200 px-4 py-3 sm:grid-cols-[70px_1fr_1.2fr] dark:border-zinc-800"><b className="font-mono text-accent">{d}ms</b><span className="text-sm">{u}</span><div className="relative h-5 rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="absolute inset-y-0 left-0 rounded-full bg-accent" style={{ width: h === d ? "100%" : "12%", transition: `width ${d}ms ${e}` }} /></div></div>)}<p className="text-xs text-zinc-500">悬停每一行感受时长差异。退出动画取进入时长的约 80%。</p></div>;
}

function BreakpointStd() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener("resize", h); return () => window.removeEventListener("resize", h); }, []);
  const B: [string, number, string][] = [["base", 0, "手机竖屏"], ["sm", 640, "手机横屏"], ["md", 768, "平板"], ["lg", 1024, "小笔记本"], ["xl", 1280, "桌面"], ["2xl", 1536, "大屏"]];
  const cur = [...B].reverse().find(([, v]) => w >= v)!;
  return (
    <div className="space-y-5">
      <div className="flex items-baseline gap-3"><span className="text-5xl font-extrabold tabular-nums tracking-tight">{w}<span className="text-lg text-zinc-400">px</span></span><span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-accent-fg">{cur[0]}</span><span className="text-sm text-zinc-500">{cur[2]}</span></div>
      <div className="relative h-10 rounded-full bg-zinc-100 dark:bg-zinc-800">{B.slice(1).map(([n, v]) => <span key={n} className="absolute top-0 flex h-full items-center border-l border-zinc-300 pl-1.5 text-[10px] text-zinc-500 dark:border-zinc-600" style={{ left: (v / 1920) * 100 + "%" }}>{n}</span>)}<span className="absolute inset-y-1 left-1 rounded-full bg-accent/80 transition-all" style={{ width: `calc(${Math.min(w / 1920, 1) * 100}% - 8px)` }} /></div>
      <Table head={["断点", "最小宽度", "典型设备", "布局建议"]} rows={[["sm", "640px", "手机横屏", "单列 → 双列"], ["md", "768px", "平板", "侧栏可见"], ["lg", "1024px", "笔记本", "三列 / 完整导航"], ["xl", "1280px", "桌面", "内容最大宽度居中"], ["2xl", "1536px", "大屏", "留白，不继续拉伸"]]} />
      <p className="text-xs text-zinc-500">↑ 缩放浏览器窗口，数值与断点标签会实时变化。</p>
    </div>
  );
}

function KeyboardStd() {
  const [last, setLast] = useState<string[]>([]);
  useEffect(() => { const h = (e: KeyboardEvent) => { if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return; setLast((l) => [e.key === " " ? "Space" : e.key, ...l].slice(0, 6)); }; window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, []);
  return (
    <div className="space-y-5">
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 dark:bg-zinc-900"><span className="text-xs text-zinc-500">你按下了 →</span>{last.length ? last.map((k, i) => <Kbd key={i + k}>{k}</Kbd>) : <span className="text-xs text-zinc-400">按任意键试试</span>}</div>
      <Table head={["组件", "按键", "行为"]} rows={[["按钮", <><Kbd>Enter</Kbd> <Kbd>Space</Kbd></>, "触发"], ["复选 / 开关", <Kbd>Space</Kbd>, "切换"], ["单选组", <><Kbd>↑</Kbd> <Kbd>↓</Kbd></>, "移动并选中"], ["标签页", <><Kbd>←</Kbd> <Kbd>→</Kbd></>, "切换标签（roving tabindex）"], ["菜单 / 列表框", <><Kbd>↑</Kbd> <Kbd>↓</Kbd> <Kbd>Enter</Kbd></>, "导航 / 选择"], ["对话框", <Kbd>Esc</Kbd>, "关闭，焦点回到触发器"], ["对话框", <Kbd>Tab</Kbd>, "焦点在对话框内循环（focus trap）"], ["滑块", <><Kbd>←</Kbd> <Kbd>→</Kbd> <Kbd>Home</Kbd> <Kbd>End</Kbd></>, "步进 / 最小 / 最大"], ["树", <><Kbd>←</Kbd> <Kbd>→</Kbd></>, "折叠 / 展开"]]} />
    </div>
  );
}

/* ================= 模式 ================= */
function LayoutPattern() {
  const [k, setK] = useState("sidebar");
  const B = ({ c, className }: { c: string; className?: string }) => <div className={cn("grid place-items-center rounded-lg text-xs font-semibold", c, className)} />;
  const base = "bg-zinc-200/80 dark:bg-zinc-800";
  const A = "bg-accent/25";
  const layouts: Record<string, [string, React.ReactNode]> = {
    sidebar: [`grid-template-columns: 240px 1fr;`, <div className="grid h-56 gap-2" style={{ gridTemplateColumns: "70px 1fr" }}><B c={A} /><div className="grid gap-2" style={{ gridTemplateRows: "30px 1fr" }}><B c={base} /><B c={base} /></div></div>],
    topnav: [`grid-template-rows: 64px 1fr 80px;`, <div className="grid h-56 gap-2" style={{ gridTemplateRows: "32px 1fr 30px" }}><B c={A} /><B c={base} /><B c={base} /></div>],
    dashboard: [`grid-template-columns: 220px 1fr 280px;`, <div className="grid h-56 gap-2" style={{ gridTemplateColumns: "60px 1fr 80px", gridTemplateRows: "30px 1fr" }}><B c={A} className="row-span-2" /><B c={base} className="col-span-2" /><B c={base} /><B c={base} /></div>],
    landing: [`max-width: 72rem; margin-inline: auto;`, <div className="mx-auto grid h-56 w-4/5 gap-2" style={{ gridTemplateRows: "26px 70px 1fr 26px" }}><B c={A} /><B c={base} /><div className="grid grid-cols-3 gap-2"><B c={base} /><B c={base} /><B c={base} /></div><B c={A} /></div>],
  };
  return (
    <div className="space-y-4"><Seg value={k} onChange={setK} options={[{ value: "sidebar", label: "侧栏 + 内容" }, { value: "topnav", label: "顶栏 + 页脚" }, { value: "dashboard", label: "三栏仪表盘" }, { value: "landing", label: "落地页" }]} /><div key={k} className="anim-fade-up rounded-xl border border-dashed border-zinc-300 p-3 dark:border-zinc-700">{layouts[k][1]}</div><code className="block rounded-lg bg-zinc-100 px-3 py-2 text-xs dark:bg-zinc-900">{layouts[k][0]}</code></div>
  );
}

function ResponsivePattern() {
  const [w, setW] = useState(640);
  return (
    <div className="space-y-4">
      <Range label="容器宽度（拖动，体验容器查询）" value={w} onChange={setW} min={280} max={760} unit="px" />
      <div className="overflow-hidden rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700"><div className="@container mx-auto transition-[width] duration-100" style={{ width: w, maxWidth: "100%" }}>
        <div className="flex gap-3 p-3"><aside className="hidden w-28 shrink-0 space-y-2 @lg:block">{[1, 2, 3, 4].map((i) => <div key={i} className="h-7 rounded-lg bg-accent/20" />)}</aside><div className="grid flex-1 grid-cols-1 gap-3 @md:grid-cols-2 @2xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="grid h-20 place-items-center rounded-xl bg-zinc-100 text-sm font-semibold text-zinc-500 dark:bg-zinc-800">{i + 1}</div>)}</div></div>
      </div></div>
      <p className="text-xs text-zinc-500">{w < 448 ? "1 列、无侧栏" : w < 512 ? "2 列、无侧栏" : w < 672 ? "2 列、显示侧栏" : "3 列、显示侧栏"} · 使用 <code className="text-accent">@container</code> + <code className="text-accent">@md:</code> 变体：组件按<b>自身容器</b>而非视口响应。</p>
    </div>
  );
}

function FormUxPattern() {
  const [good, setGood] = useState(true);
  const Bad = () => <div className="space-y-2 rounded-xl border border-red-200 p-4 dark:border-red-500/30"><p className="rounded bg-red-100 px-2 py-1 text-xs text-red-600">错误：请填写所有必填项！！！</p><input className="h-9 w-full rounded border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="姓名" /><input className="h-9 w-full rounded border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="邮箱" /><input className="h-9 w-full rounded border border-zinc-300 px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900" placeholder="密码" /><button className="h-9 w-full rounded bg-zinc-400 text-sm text-white">提交</button></div>;
  const Good = () => <div className="space-y-3 rounded-xl border border-emerald-200 p-4 dark:border-emerald-500/30">{[["姓名", "你的真实姓名", ""], ["邮箱", "用于接收验证邮件", ""], ["密码", "至少 8 位，含数字和字母", ""]].map(([l, h]) => <label key={l} className="block text-xs font-medium">{l}<input className="mt-1 h-9 w-full rounded-lg border border-zinc-300 px-2.5 text-sm font-normal outline-none focus:border-accent focus:ring-4 focus:ring-accent/15 dark:border-zinc-700 dark:bg-zinc-900" /><span className="mt-1 block text-[11px] font-normal text-zinc-500">{h}</span></label>)}<button className="h-10 w-full rounded-lg bg-accent text-sm font-semibold text-accent-fg">创建账号</button></div>;
  return (
    <div className="space-y-4"><Seg value={good ? "g" : "b"} onChange={(v) => setGood(v === "g")} options={[{ value: "b", label: "✗ 常见问题" }, { value: "g", label: "✓ 推荐做法" }]} />
      <div className="grid items-start gap-5 md:grid-cols-2"><div key={String(good)} className="anim-fade-up max-w-xs">{good ? <Good /> : <Bad />}</div>
        <ul className="space-y-2 text-sm">{(good ? ["标签永远显示在输入框上方，不依赖 placeholder", "提示文字写在输入框下方，说明格式与用途", "按钮文案是动词短语：“创建账号”而不是“提交”", "单列布局，一行一个问题", "错误在字段旁就地显示，且说明如何修正"] : ["placeholder 当标签：一输入就消失，用户忘了要填什么", "错误堆在顶部，用户要来回对照", "按钮文案含糊（提交），也不知是否可点击", "没有任何格式提示，用户只能试错", "感叹号和红字制造焦虑"]).map((t) => <li key={t} className="flex gap-2">{good ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> : <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />}<span className="text-zinc-600 dark:text-zinc-400">{t}</span></li>)}</ul></div></div>
  );
}

function DarkPattern() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="dark rounded-xl bg-zinc-950 p-4"><p className="mb-3 text-xs text-zinc-400">深色模式：越高的层越亮</p>{[["背景 zinc-950", "bg-zinc-950"], ["卡片 zinc-900", "bg-zinc-900"], ["悬浮 zinc-800", "bg-zinc-800"], ["弹层 zinc-700", "bg-zinc-700"]].map(([t, c], i) => <div key={t} className={cn("mb-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-200", c)} style={{ marginLeft: i * 12 }}>{t}</div>)}</div>
        <div className="grid grid-cols-2 gap-3"><div className="grid h-full place-items-center rounded-xl bg-black p-4 text-center text-xs text-zinc-300"><div><p className="text-lg font-bold text-white">#000</p>纯黑：对比过强，易拖影</div></div><div className="grid h-full place-items-center rounded-xl bg-zinc-950 p-4 text-center text-xs text-zinc-300 ring-1 ring-white/10"><div><p className="text-lg font-bold text-white">zinc-950</p>柔和黑：更舒适 ✓</div></div></div>
      </div>
      <Table head={["要点", "浅色", "深色"]} rows={[["层级表达", "阴影", "更亮的表面 + 1px 边框"], ["强调色", "饱和、较深", "降低饱和、提亮"], ["文字", "zinc-900 on white", "zinc-100（非纯白）on zinc-950"], ["图片", "原样", "略降亮度 / 加遮罩"], ["切换", "跟随系统，可手动覆盖并记忆", "<head> 内联脚本防止闪白"]]} />
    </div>
  );
}

const CHECK: [string, string[]][] = [["视觉", ["字号层级不超过 6 级", "间距全部来自 4px 刻度", "同一页面圆角不超过 3 种", "强调色使用占比 < 10%", "深色模式单独检查过阴影与边框"]], ["交互", ["所有可点击元素有 hover / active / focus 态", "触控目标 ≥ 44px", "加载中有反馈，且按钮宽度不抖动", "危险操作可撤销或二次确认", "空状态、错误状态、加载状态都有设计"]], ["无障碍", ["正文对比度 ≥ 4.5:1", "只用键盘能完成所有操作", "图标按钮有 aria-label", "表单控件都有关联的 label", "尊重 prefers-reduced-motion"]], ["性能", ["动画只用 transform / opacity", "图片有尺寸占位，避免布局抖动", "长列表使用虚拟滚动", "首屏之外的组件懒加载", "字体使用 font-display: swap"]]];
function ChecklistPattern() {
  const [done, setDone] = useLocalStorage<string[]>("hb-check", []);
  const all = CHECK.flatMap(([, l]) => l); const pct = Math.round((done.filter((d) => all.includes(d)).length / all.length) * 100);
  const [tab, setTab] = useState(0);
  const R = 34, C = 2 * Math.PI * R;
  const toggle = (t: string) => { const on = !done.includes(t); setDone(on ? [...done, t] : done.filter((x) => x !== t)); if (on && done.length + 1 === all.length) confetti(); };
  return (
    <div className="grid gap-6 md:grid-cols-[160px_1fr]">
      <div className="space-y-3 text-center"><div className="relative mx-auto h-28 w-28"><svg viewBox="0 0 80 80" className="-rotate-90"><circle cx="40" cy="40" r={R} fill="none" strokeWidth="7" className="stroke-zinc-200 dark:stroke-zinc-800" /><circle cx="40" cy="40" r={R} fill="none" strokeWidth="7" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} className="stroke-accent transition-all duration-500" /></svg><span className="absolute inset-0 grid place-items-center text-2xl font-bold tabular-nums">{pct}%</span></div><Btn size="sm" variant="ghost" onClick={() => setDone([])}>重置</Btn></div>
      <div className="space-y-3"><Seg value={tab} onChange={setTab} options={CHECK.map(([n], i) => ({ value: i, label: n }))} /><ul className="space-y-1.5">{CHECK[tab][1].map((t) => { const on = done.includes(t); return <li key={t}><button onClick={() => toggle(t)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-zinc-100 dark:hover:bg-zinc-800"><span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-md border transition", on ? "border-accent bg-accent text-accent-fg" : "border-zinc-300 dark:border-zinc-600")}>{on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}</span><span className={cn(on && "text-zinc-400 line-through")}>{t}</span></button></li>; })}</ul></div>
    </div>
  );
}

function RetryPattern() {
  const [st, setSt] = useState<"idle" | "load" | "err" | "ok">("idle");
  const [tries, setTries] = useState(0);
  const [auto, setAuto] = useState(true);
  const [cd, setCd] = useState(0);
  const attempt = (n: number) => { setSt("load"); setTries(n); setTimeout(() => { if (n >= 3) { setSt("ok"); setCd(0); } else { setSt("err"); if (auto) setCd(Math.pow(2, n)); } }, 900); };
  useInterval(() => { if (cd <= 1) { setCd(0); attempt(tries + 1); } else setCd(cd - 1); }, st === "err" && cd > 0 ? 1000 : null);
  return (
    <div className="max-w-sm space-y-3">
      <div className="grid min-h-40 place-items-center rounded-2xl border border-zinc-200 p-5 text-center dark:border-zinc-800">
        {st === "idle" && <p className="text-sm text-zinc-500">前 3 次请求会失败，第 4 次成功</p>}
        {st === "load" && <div className="space-y-2"><Loader2 className="mx-auto h-6 w-6 animate-spin text-accent" /><p className="text-sm text-zinc-500">第 {tries + 1} 次请求中…</p></div>}
        {st === "err" && <div className="anim-fade-up space-y-2"><XCircle className="mx-auto h-7 w-7 text-red-500" /><p className="text-sm font-medium">网络开小差了</p><p className="text-xs text-zinc-500">已失败 {tries + 1} 次 · {cd > 0 ? `${cd} 秒后自动重试（指数退避）` : "请手动重试"}</p><Btn size="sm" variant="accent" onClick={() => { setCd(0); attempt(tries + 1); }}><RefreshCw className="h-4 w-4" />立即重试</Btn></div>}
        {st === "ok" && <div className="anim-fade-up space-y-1"><Check className="mx-auto h-7 w-7 text-emerald-500" /><p className="text-sm font-medium">加载成功 🎉</p><p className="text-xs text-zinc-500">共重试 {tries} 次</p></div>}
      </div>
      <div className="flex items-center justify-between"><Btn size="sm" variant="outline" onClick={() => attempt(0)}>发起请求</Btn><label className="flex items-center gap-2 text-xs text-zinc-500"><input type="checkbox" className="accent-[var(--accent)]" checked={auto} onChange={(e) => setAuto(e.target.checked)} />自动重试</label></div>
    </div>
  );
}

/* ================= 新增 ================= */
const GLOSS: [string, string][] = [["Affordance 可供性", "元素通过外观暗示“可以如何使用”，比如按钮的凸起感。"], ["Skeuomorphism 拟物", "模仿现实物体的质感，如皮革、玻璃、阴影。"], ["Neumorphism 新拟态", "同色背景上用明暗双阴影塑造的柔和凸起 / 凹陷。"], ["Glassmorphism 毛玻璃", "半透明 + 背景模糊，营造层叠感。"], ["Design Token 设计令牌", "把颜色、间距等设计决策抽象成命名变量。"], ["Elevation 海拔", "用阴影或表面明度表达元素的层级高低。"], ["Fitts's Law 菲茨定律", "目标越大、距离越近，点击越快。"], ["Hick's Law 希克定律", "选项越多，决策时间越长。"], ["Progressive Disclosure 渐进披露", "只在需要时展示高级信息，降低初始复杂度。"], ["Microinteraction 微交互", "单一用途的小型反馈，如点赞动画、下拉刷新。"], ["Skeleton Screen 骨架屏", "用内容轮廓占位，缓解等待焦虑。"], ["Empty State 空状态", "无数据时的界面，应解释原因并引导下一步。"], ["Focus Trap 焦点陷阱", "模态框打开时 Tab 键只在其内部循环。"], ["Roving Tabindex", "组合控件只有一个元素可 Tab 进入，内部用方向键移动。"], ["Hit Area 点击热区", "可响应点击的实际区域，常大于视觉尺寸。"], ["Tabular Nums 等宽数字", "每个数字宽度相同，防止数值变化时抖动。"], ["Kerning 字距", "特定字符对之间的间距微调。"], ["Leading 行距", "行与行之间的距离，对应 CSS line-height。"], ["Gestalt 格式塔", "人类倾向把相近、相似的元素视为一组。"], ["Bento Grid 便当格", "大小不一的圆角方块组成的信息布局。"], ["FLIP 动画", "First-Last-Invert-Play：测量前后位置，用 transform 反向补偿再播放。"], ["Easing 缓动", "描述动画速度随时间变化的曲线。"], ["Stagger 交错", "列表项依次延迟入场，形成节奏。"], ["Debounce 防抖", "停止触发一段时间后才执行，如搜索输入。"], ["Optimistic UI 乐观更新", "先假设成功并更新界面，失败再回滚。"], ["Critical CSS 关键 CSS", "首屏渲染必需的样式，内联以加速首次绘制。"], ["Layout Shift 布局偏移", "内容加载导致元素位置跳动，CLS 指标衡量它。"], ["Container Query 容器查询", "组件根据自身容器尺寸而非视口响应。"], ["OKLCH", "感知均匀的色彩空间：明度、彩度、色相。"], ["Z-index 层叠", "控制元素在 Z 轴上的堆叠顺序。"]];
function GlossaryDemo() {
  const [q, setQ] = useState(""); const [open, setOpen] = useState<string | null>(null);
  const res = GLOSS.filter(([t, d]) => (t + d).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-3"><div className="relative max-w-sm"><Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" /><input className={cn(inputCls, "pl-9")} placeholder={`在 ${GLOSS.length} 个术语中搜索…`} value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="grid gap-2 sm:grid-cols-2">{res.map(([t, d]) => <button key={t} onClick={() => setOpen(open === t ? null : t)} className={cn("rounded-xl border p-3 text-left transition", open === t ? "border-accent bg-accent-soft" : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-800")}><b className="text-sm">{t}</b><div className={cn("grid transition-all duration-300", open === t ? "mt-1 grid-rows-[1fr]" : "grid-rows-[0fr]")}><p className="overflow-hidden text-sm text-zinc-600 dark:text-zinc-400">{d}</p></div></button>)}</div>{!res.length && <p className="py-8 text-center text-sm text-zinc-400">没有匹配的术语</p>}</div>
  );
}

const TW: [string, string, string][] = [["布局", "flex items-center justify-between", "弹性行，垂直居中，两端对齐"], ["布局", "grid grid-cols-3 gap-4", "三列网格"], ["布局", "grid place-items-center", "网格居中（最简居中）"], ["布局", "absolute inset-0", "铺满父级"], ["布局", "sticky top-0 z-10", "吸顶"], ["布局", "mx-auto max-w-6xl px-6", "居中容器"], ["布局", "aspect-video", "16:9 比例"], ["间距", "space-y-4", "子元素垂直间距"], ["间距", "-space-x-3", "负间距叠放（头像组）"], ["文字", "truncate", "单行省略"], ["文字", "line-clamp-3", "三行省略"], ["文字", "tabular-nums", "等宽数字"], ["文字", "tracking-tight", "收紧字距"], ["文字", "text-balance", "标题均衡换行"], ["文字", "bg-clip-text text-transparent", "渐变文字基础"], ["效果", "backdrop-blur-xl", "毛玻璃"], ["效果", "ring-2 ring-accent ring-offset-2", "焦点环"], ["效果", "shadow-lg shadow-accent/30", "彩色阴影"], ["效果", "mix-blend-multiply", "正片叠底"], ["效果", "[mask-image:linear-gradient(black,transparent)]", "渐隐遮罩"], ["过渡", "transition duration-200 ease-out", "标准过渡"], ["过渡", "active:scale-[0.97]", "按压反馈"], ["过渡", "hover:-translate-y-1", "悬停上浮"], ["过渡", "motion-reduce:transition-none", "尊重减弱动效"], ["状态", "group-hover:opacity-100", "父级悬停时子元素响应"], ["状态", "peer-focus:text-accent", "兄弟元素聚焦联动"], ["状态", "aria-[invalid=true]:border-red-500", "按 aria 属性设样式"], ["状态", "disabled:opacity-50", "禁用态"], ["状态", "has-[:checked]:bg-accent-soft", "子元素状态影响父级"], ["响应式", "@container @md:grid-cols-2", "容器查询"], ["响应式", "sm:flex-row md:grid", "按断点切换"], ["响应式", "hidden lg:block", "大屏显示"], ["深色", "dark:bg-zinc-900 dark:text-zinc-100", "深色变体"], ["滚动", "snap-x snap-mandatory", "横向吸附滚动"], ["滚动", "scroll-mt-24", "锚点偏移"], ["滚动", "overscroll-contain", "阻止滚动穿透"], ["任意值", "w-[calc(100%-2rem)]", "任意值 + calc"], ["任意值", "grid-cols-[1fr_auto_1fr]", "自定义列模板"]];
function TailwindCheat() {
  const [q, setQ] = useState(""); const { copied, copy } = useCopy(); const [last, setLast] = useState("");
  const res = TW.filter(([c, k, d]) => (c + k + d).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-3"><div className="relative max-w-sm"><Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" /><input className={cn(inputCls, "pl-9")} placeholder="搜索：居中、省略、毛玻璃、focus…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="grid gap-2 md:grid-cols-2">{res.map(([c, k, d]) => <button key={k} onClick={() => { copy(k); setLast(k); }} className="group flex items-start gap-3 rounded-xl border border-zinc-200 p-3 text-left transition hover:border-accent dark:border-zinc-800"><span className="mt-0.5 rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800">{c}</span><span className="min-w-0 flex-1"><code className="block break-all text-[13px] text-accent">{k}</code><span className="text-xs text-zinc-500">{d}</span></span>{copied && last === k ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-zinc-300 opacity-0 transition group-hover:opacity-100" />}</button>)}</div>{!res.length && <p className="py-8 text-center text-sm text-zinc-400">没有匹配项</p>}</div>
  );
}

function ShortcutsDemo() {
  const R: [React.ReactNode, string][] = [[<><Kbd>⌘</Kbd> <Kbd>K</Kbd></>, "打开全局搜索 / 命令面板"], [<Kbd>/</Kbd>, "聚焦侧边栏搜索"], [<Kbd>T</Kbd>, "切换深色 / 浅色主题"], [<Kbd>[</Kbd>, "上一章"], [<Kbd>]</Kbd>, "下一章"], [<Kbd>Esc</Kbd>, "关闭面板 / 抽屉"], [<><Kbd>↑</Kbd> <Kbd>↑</Kbd> <Kbd>↓</Kbd> <Kbd>↓</Kbd> <Kbd>←</Kbd> <Kbd>→</Kbd> <Kbd>←</Kbd> <Kbd>→</Kbd> <Kbd>B</Kbd> <Kbd>A</Kbd></>, "🥚 彩蛋"]];
  return <ul className="max-w-xl divide-y divide-zinc-100 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">{R.map(([k, d], i) => <li key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm"><span className="flex flex-wrap gap-1">{k}</span><span className="text-right text-zinc-500">{d}</span></li>)}</ul>;
}

const useUnused = () => useRef(null);
void useUnused; void useMemo;

export const standards: Section = {
  id: "standards", title: "设计规范标准", en: "Design Standards", group: "规范", icon: Ruler, hue: 100,
  blurb: "把“感觉”变成“数字”。触控尺寸、对比度、字阶、层级、时长、断点、键盘交互——团队共同遵守的硬指标。",
  items: [
    item({ id: "std-touch", title: "触控与尺寸标准", en: "Touch Target", level: "基础", demo: TouchStd, tags: ["44px", "tap"], desc: "手指不是鼠标指针。最小可点击区域决定了误触率，也决定了无障碍合规。", points: ["视觉尺寸可以小，点击热区要够大（用 padding 或伪元素扩展）。", "相邻目标之间保留 ≥ 8px 间距。"], code: `.icon-btn::after { content: ""; position: absolute; inset: -8px; } /* 扩展热区 */` }),
    item({ id: "std-color", title: "色彩使用标准", en: "Color Usage", level: "基础", demo: ColorStd, tags: ["60-30-10"], desc: "60-30-10 法则：60% 中性背景、30% 文字与次要元素、10% 强调。对比同一界面三种强调色占比，感受“克制”的力量。", code: `/* 强调色只用于：主按钮、链接、焦点环、选中态 */` }),
    item({ id: "std-type", title: "字阶与行高标准", en: "Type Scale Spec", level: "基础", demo: TypeStd, tags: ["font-size", "line-height"], desc: "每个角色对应固定的字号 / 行高 / 字重 / 字距。大字号收紧行高，小字号放宽。", points: ["正文行高 1.6，标题 1.15–1.3。", "字号越大，字距越紧。"], code: `.h1 { font: 700 36px/44px var(--font-sans); letter-spacing: -0.025em; }` }),
    item({ id: "std-z", title: "层级 z-index 标准", en: "Z-index Scale", level: "进阶", demo: ZStd, tags: ["layer", "stack"], desc: "不要随手写 z-[9999]。约定一张层级表，让所有人对“谁盖住谁”有共识。悬停右侧列表，高亮左侧对应层。", points: ["以 10 为间隔，预留插入空间。", "Portal 渲染的浮层，避开 stacking context 陷阱。", "transform / filter / opacity<1 会创建新的层叠上下文。"], code: `:root { --z-sticky: 10; --z-dropdown: 20; --z-overlay: 30; --z-modal: 40; --z-toast: 50; --z-tooltip: 60; }` }),
    item({ id: "std-duration", title: "动效时长标准", en: "Duration Spec", level: "基础", demo: DurationStd, tags: ["timing"], desc: "不同类型的动画用不同时长，且距离越长、元素越大，时长越久。", code: `--dur-fast: 150ms; --dur-base: 200ms; --dur-slow: 300ms; --ease-out: cubic-bezier(.32,.72,0,1);` }),
    item({ id: "std-breakpoint", title: "响应式断点标准", en: "Breakpoints", level: "基础", demo: BreakpointStd, tags: ["media", "viewport"], desc: "移动优先：先写手机样式，再用 sm / md / lg 逐级增强。缩放窗口，上面的数字实时变化。", points: ["断点由内容决定，而不是设备型号。", "组件级响应优先使用容器查询。"], code: `<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" />` }),
    item({ id: "std-keyboard", title: "键盘交互标准", en: "Keyboard Patterns", level: "进阶", demo: KeyboardStd, tags: ["a11y", "aria"], desc: "遵循 WAI-ARIA Authoring Practices：每类组件有约定的按键行为。上方会回显你按下的键。", a11y: ["Tab 只负责在“组件之间”移动，组件内部用方向键。"], code: `onKeyDown={(e) => { if (e.key === "Escape") close(); }}` }),
    item({ id: "pat-layout", title: "页面布局骨架", en: "Layout Skeletons", level: "基础", demo: LayoutPattern, tags: ["wireframe", "grid"], desc: "先搭骨架，再填内容。四种最常用的页面骨架，点击切换。", code: `<div className="grid min-h-screen grid-cols-[240px_1fr]"><aside /><main /></div>` }),
    item({ id: "pat-responsive", title: "响应式策略 · 容器查询", en: "Responsive Strategy", level: "进阶", demo: ResponsivePattern, tags: ["container query", "@container"], desc: "同一个组件放进窄侧栏和宽主区应该有不同布局。容器查询让组件对“自己的宽度”负责，而不是对视口负责。", points: ["父级加 @container；子级用 @md: @lg: 等变体。", "Tailwind v4 内置支持。"], code: `<div className="@container"><div className="grid grid-cols-1 @md:grid-cols-2 @2xl:grid-cols-3" /></div>` }),
    item({ id: "pat-form", title: "表单体验", en: "Form UX", level: "基础", demo: FormUxPattern, tags: ["ux", "do and dont"], desc: "同一张表单，糟糕版与推荐版对比。多数转化率损失都发生在表单上。", code: `<label>邮箱<input /><span className="text-xs text-zinc-500">用于接收验证邮件</span></label>` }),
    item({ id: "pat-dark", title: "深色模式", en: "Dark Mode", level: "进阶", demo: DarkPattern, tags: ["theme", "elevation"], desc: "深色模式不是反色。层级要靠“更亮的表面”表达，强调色要降饱和，并避免纯黑。", code: `<script>/* 内联脚本，首屏前设置 class="dark" 防闪白 */</script>` }),
    item({ id: "pat-checklist", title: "设计走查清单", en: "Review Checklist", level: "基础", demo: ChecklistPattern, tags: ["qa", "checklist"], desc: "上线前逐项过一遍：视觉、交互、无障碍、性能。进度会保存在本地，全部完成有惊喜。", code: `const pct = Math.round((done.length / all.length) * 100);` }),
    item({ id: "pat-retry", title: "错误与重试模式", en: "Error & Retry", level: "进阶", demo: RetryPattern, tags: ["network", "backoff"], desc: "网络会失败。好的界面：说明发生了什么、自动重试（指数退避）、保留手动重试入口。", points: ["退避间隔 1s → 2s → 4s，避免雪崩。", "重试期间保持原有内容，而不是清空。"], code: `const delay = Math.min(1000 * 2 ** attempt, 30000);` }),
    item({ id: "ref-glossary", title: "UI 术语表", en: "Glossary", level: "基础", isNew: true, demo: GlossaryDemo, tags: ["terms", "术语", "词典"], desc: "29 个设计与前端常见术语，支持搜索，点击展开解释。", code: `const res = GLOSS.filter(([t, d]) => (t + d).includes(q));` }),
    item({ id: "ref-tailwind", title: "Tailwind 速查表", en: "Tailwind Cheatsheet", level: "基础", isNew: true, demo: TailwindCheat, tags: ["class", "cheatsheet", "速查"], desc: "37 条最实用的组合类名，按需搜索，点击即复制。", code: `<div className="flex items-center justify-between" />` }),
    item({ id: "ref-shortcuts", title: "本站快捷键", en: "Keyboard Shortcuts", level: "基础", isNew: true, demo: ShortcutsDemo, tags: ["hotkey", "快捷键"], desc: "全站支持的快捷键一览。键盘优先的人会爱上它们。", code: `window.addEventListener("keydown", (e) => e.key === "t" && toggleTheme());` }),
  ],
};

/* 为保持“规范 / 模式”两章结构，把模式类条目拆分为独立章节 */
const patItems = standards.items.filter((i) => i.id.startsWith("pat-") || i.id.startsWith("ref-"));
standards.items = standards.items.filter((i) => !patItems.includes(i));

export const patterns: Section = {
  id: "patterns", title: "模式与原则", en: "Patterns & References", group: "规范", icon: Compass, hue: 220,
  blurb: "跨组件的设计模式、最佳实践与速查资料：布局骨架、响应式、表单体验、深色模式、走查清单、错误处理，以及术语表与 Tailwind 速查。",
  items: patItems,
};

void BookOpen; void ShieldCheck;
