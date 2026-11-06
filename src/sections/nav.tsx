import { useEffect, useRef, useState } from "react";
import { Bell, Check, ChevronDown, ChevronRight, Compass, Copy, Edit3, Folder, Home, Inbox, LayoutDashboard, Mail, Menu, MoreHorizontal, Music, Phone as PhoneIcon, Play, Search, Settings, Share2, Timer, Trash2, User, Users, X, FileText, Image as ImageIcon, Globe, Sparkles, Mic } from "lucide-react";
import { item, type Section } from "../lib/types";
import { Btn, Kbd, Phone } from "../components/ui";
import { cn } from "../utils/cn";
import { useClickOutside } from "../lib/hooks";

function NavbarDemo() {
  const links = ["产品", "解决方案", "定价", "文档", "关于"];
  const [hv, setHv] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ l: 0, w: 0 });
  const idx = hv ?? active;
  useEffect(() => { const el = refs.current[idx]; if (el) setPill({ l: el.offsetLeft, w: el.offsetWidth }); }, [idx]);
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold"><span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-accent-fg"><Sparkles className="h-4 w-4" /></span>Brand</div>
        <nav className="relative hidden gap-1 sm:flex" onMouseLeave={() => setHv(null)}>
          <span className="absolute inset-y-0 rounded-lg bg-zinc-100 transition-all duration-300 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] dark:bg-zinc-800" style={{ left: pill.l, width: pill.w }} />
          {links.map((l, i) => (
            <button key={l} ref={(el) => { refs.current[i] = el; }} onMouseEnter={() => setHv(i)} onClick={() => setActive(i)} className={cn("relative px-3.5 py-1.5 text-sm transition-colors", i === active ? "font-semibold text-zinc-900 dark:text-white" : "text-zinc-500")}>{l}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2"><Btn size="sm" variant="ghost" className="hidden sm:inline-flex">登录</Btn><Btn size="sm" variant="accent">开始使用</Btn>
          <button className="rounded-lg p-2 sm:hidden" aria-label="菜单" onClick={() => setOpen(!open)}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>
      </div>
      <div className={cn("grid overflow-hidden border-zinc-200 transition-all duration-300 sm:hidden dark:border-zinc-800", open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]")}>
        <div className="min-h-0">{links.map((l) => <a key={l} className="block px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800">{l}</a>)}</div>
      </div>
      <p className="border-t border-zinc-200 px-4 py-2 text-xs text-zinc-500 dark:border-zinc-800">桌面：悬停时背景胶囊跟随移动；窄屏：折叠为汉堡菜单（grid-rows 0fr→1fr 做高度动画）</p>
    </div>
  );
}

function TabsDemo() {
  const tabs = [["概览", "这里是项目概览：核心指标、最近动态与待办事项。"], ["活动", "活动流：成员的每一次提交、评论与审批都会出现在这里。"], ["设置", "设置：团队、权限、集成与账单。"]];
  const [i, setI] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState({ l: 0, w: 0 });
  useEffect(() => { const el = refs.current[i]; if (el) setBar({ l: el.offsetLeft, w: el.offsetWidth }); }, [i]);
  return (
    <div className="max-w-lg">
      <div role="tablist" className="relative flex border-b border-zinc-200 dark:border-zinc-800" onKeyDown={(e) => { if (e.key === "ArrowRight") setI((i + 1) % 3); if (e.key === "ArrowLeft") setI((i + 2) % 3); }}>
        {tabs.map(([t], k) => <button key={t} ref={(el) => { refs.current[k] = el; }} role="tab" aria-selected={i === k} tabIndex={i === k ? 0 : -1} onClick={() => setI(k)} className={cn("px-4 py-2.5 text-sm font-medium transition-colors", i === k ? "text-accent" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white")}>{t}</button>)}
        <span className="absolute -bottom-px h-0.5 rounded-full bg-accent transition-all duration-300" style={{ left: bar.l, width: bar.w }} />
      </div>
      <p key={i} role="tabpanel" className="anim-fade-up py-4 text-sm text-zinc-600 dark:text-zinc-400">{tabs[i][1]}</p>
    </div>
  );
}

function BreadcrumbDemo() {
  const [exp, setExp] = useState(false);
  const full = ["首页", "产品", "设计系统", "组件库", "表单", "输入框"];
  const show = exp || full.length <= 4 ? full : [full[0], "…", ...full.slice(-2)];
  return (
    <nav aria-label="面包屑"><ol className="flex flex-wrap items-center gap-1.5 text-sm">
      {show.map((s, i) => (
        <li key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-300" />}
          {s === "…" ? <button onClick={() => setExp(true)} aria-label="展开隐藏层级" className="rounded px-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreHorizontal className="h-4 w-4" /></button>
            : i === show.length - 1 ? <span aria-current="page" className="font-medium">{s}</span>
              : <a className="text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white" href="#">{i === 0 ? <Home className="inline h-4 w-4" /> : s}</a>}
        </li>
      ))}
    </ol></nav>
  );
}

function PaginationDemo() {
  const [p, setP] = useState(5);
  const total = 20;
  const pages: (number | string)[] = [];
  const add = (n: number | string) => pages.push(n);
  add(1);
  if (p > 4) add("…");
  for (let i = Math.max(2, p - 1); i <= Math.min(total - 1, p + 1); i++) add(i);
  if (p < total - 3) add("…");
  add(total);
  const B = "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm transition";
  return (
    <div className="flex flex-wrap items-center gap-1">
      <button className={cn(B, "hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800")} disabled={p === 1} onClick={() => setP(p - 1)} aria-label="上一页">‹</button>
      {pages.map((n, i) => typeof n === "string" ? <span key={i} className="px-1 text-zinc-400">…</span> : <button key={i} aria-current={n === p ? "page" : undefined} onClick={() => setP(n)} className={cn(B, n === p ? "bg-accent font-semibold text-accent-fg" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}>{n}</button>)}
      <button className={cn(B, "hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800")} disabled={p === total} onClick={() => setP(p + 1)} aria-label="下一页">›</button>
    </div>
  );
}

function SidebarDemo() {
  const [col, setCol] = useState(false);
  const [act, setAct] = useState(0);
  const items: [typeof Home, string, number?][] = [[LayoutDashboard, "仪表盘"], [Inbox, "收件箱", 5], [Users, "团队"], [FileText, "文档"], [Settings, "设置"]];
  return (
    <div className="flex h-72 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <aside className={cn("flex shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/80 p-2 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/60", col ? "w-14" : "w-52")}>
        <div className="mb-2 flex h-9 items-center gap-2 overflow-hidden px-2 font-bold"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-accent text-accent-fg"><Sparkles className="h-3.5 w-3.5" /></span><span className={cn("whitespace-nowrap transition-opacity", col && "opacity-0")}>Workspace</span></div>
        {items.map(([I, t, n], i) => (
          <button key={t} title={t} onClick={() => setAct(i)} className={cn("relative mb-0.5 flex h-9 items-center gap-3 overflow-hidden rounded-lg px-2.5 text-sm transition", act === i ? "bg-white font-medium text-accent shadow-sm dark:bg-zinc-800" : "text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800")}>
            <I className="h-4 w-4 shrink-0" /><span className={cn("whitespace-nowrap transition-opacity", col && "opacity-0")}>{t}</span>
            {n && <span className={cn("ml-auto rounded-full bg-accent px-1.5 text-[10px] font-semibold text-accent-fg", col && "absolute right-1 top-1 ml-0 h-2 min-w-2 px-0 text-[0px]")}>{n}</span>}
          </button>
        ))}
        <button onClick={() => setCol(!col)} className="mt-auto flex h-9 items-center gap-3 rounded-lg px-2.5 text-sm text-zinc-500 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"><ChevronRight className={cn("h-4 w-4 transition", !col && "rotate-180")} />{!col && "收起"}</button>
      </aside>
      <div className="grid flex-1 place-items-center text-sm text-zinc-400">内容区 · 当前：{items[act][1]}</div>
    </div>
  );
}

function StepsDemo() {
  const steps = ["账号", "资料", "偏好", "完成"];
  const [s, setS] = useState(1);
  return (
    <div className="max-w-lg space-y-6">
      <ol className="flex items-center">
        {steps.map((t, i) => (
          <li key={t} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
            <span className="flex flex-col items-center gap-1.5">
              <span className={cn("grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold transition-all duration-300", i < s ? "border-accent bg-accent text-accent-fg" : i === s ? "border-accent text-accent ring-4 ring-accent/15" : "border-zinc-300 text-zinc-400 dark:border-zinc-700")}>{i < s ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}</span>
              <span className={cn("text-xs", i <= s ? "font-medium" : "text-zinc-400")}>{t}</span>
            </span>
            {i < steps.length - 1 && <span className="relative -mt-5 mx-2 h-0.5 flex-1 overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800"><span className="absolute inset-y-0 left-0 bg-accent transition-all duration-500" style={{ width: i < s ? "100%" : "0%" }} /></span>}
          </li>
        ))}
      </ol>
      <div className="flex gap-2"><Btn variant="outline" disabled={s === 0} onClick={() => setS(s - 1)}>上一步</Btn><Btn variant="accent" disabled={s === steps.length} onClick={() => setS(s + 1)}>{s >= steps.length - 1 ? "完成" : "下一步"}</Btn></div>
    </div>
  );
}

function DropdownMenuDemo() {
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  const its = [[User, "个人资料"], [Settings, "偏好设置"], [Users, "邀请成员"], [Trash2, "退出登录"]] as const;
  return (
    <div ref={ref} className="relative inline-block min-h-52" onKeyDown={(e) => { if (!open) return; if (e.key === "ArrowDown") { e.preventDefault(); setHi((hi + 1) % its.length); } if (e.key === "ArrowUp") { e.preventDefault(); setHi((hi + its.length - 1) % its.length); } if (e.key === "Escape") setOpen(false); if (e.key === "Enter") setOpen(false); }}>
      <Btn variant="outline" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}>账户菜单 <ChevronDown className={cn("h-4 w-4 transition", open && "rotate-180")} /></Btn>
      {open && <div role="menu" className="anim-scale-in absolute left-0 top-11 z-10 w-52 origin-top-left rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        {its.map(([I, t], i) => <button key={t} role="menuitem" onMouseEnter={() => setHi(i)} onClick={() => setOpen(false)} className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm", hi === i && "bg-zinc-100 dark:bg-zinc-800", i === 3 && "text-red-500")}><I className="h-4 w-4" />{t}</button>)}
      </div>}
    </div>
  );
}

function MiniPaletteDemo() {
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const cmds = [[Home, "跳转到首页", "G H"], [Search, "搜索文档", "/"], [Settings, "打开设置", "⌘ ,"], [Copy, "复制链接", "⌘ C"], [Share2, "分享", "⌘ S"], [Trash2, "删除项目", "⌫"]] as const;
  const res = cmds.filter(([, t]) => t.includes(q));
  return (
    <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900" onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setHi((hi + 1) % Math.max(res.length, 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setHi((hi + res.length - 1) % Math.max(res.length, 1)); } }}>
      <div className="flex items-center gap-2 border-b border-zinc-200 px-3 dark:border-zinc-800"><Search className="h-4 w-4 text-zinc-400" /><input autoFocus={false} value={q} onChange={(e) => { setQ(e.target.value); setHi(0); }} placeholder="输入命令…" className="h-12 flex-1 bg-transparent text-sm outline-none" /><Kbd>Esc</Kbd></div>
      <ul className="max-h-60 overflow-auto p-1.5">
        {res.map(([I, t, k], i) => <li key={t} onMouseEnter={() => setHi(i)} className={cn("flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm", i === hi && "bg-accent-soft text-accent")}><I className="h-4 w-4" /><span className="flex-1">{t}</span><span className="font-mono text-[11px] text-zinc-400">{k}</span></li>)}
        {!res.length && <li className="py-8 text-center text-sm text-zinc-400">没有匹配的命令</li>}
      </ul>
      <p className="border-t border-zinc-200 px-3 py-2 text-xs text-zinc-500 dark:border-zinc-800">本站按 <Kbd>⌘</Kbd> <Kbd>K</Kbd> 唤起的就是完整版</p>
    </div>
  );
}

function ContextMenuDemo() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [last, setLast] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const its = [[Copy, "复制"], [Edit3, "重命名"], [Share2, "分享"], [Trash2, "删除"]] as const;
  useEffect(() => { const h = () => setPos(null); window.addEventListener("click", h); window.addEventListener("scroll", h, true); return () => { window.removeEventListener("click", h); window.removeEventListener("scroll", h, true); }; }, []);
  return (
    <div ref={box} onContextMenu={(e) => { e.preventDefault(); const r = box.current!.getBoundingClientRect(); setPos({ x: Math.min(e.clientX - r.left, r.width - 170), y: Math.min(e.clientY - r.top, r.height - 170) }); }} className="relative grid h-56 select-none place-items-center rounded-xl border border-dashed border-zinc-300 text-sm text-zinc-500 dark:border-zinc-700">
      在此区域右键 {last && <span className="ml-2 text-accent">（上次：{last}）</span>}
      {pos && <ul className="anim-scale-in absolute z-10 w-40 rounded-xl border border-zinc-200 bg-white p-1 text-zinc-900 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100" style={{ left: pos.x, top: pos.y }}>
        {its.map(([I, t]) => <li key={t}><button onClick={() => setLast(t)} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"><I className="h-4 w-4" />{t}</button></li>)}
      </ul>}
    </div>
  );
}

function ShrinkHeaderDemo() {
  const [y, setY] = useState(0);
  const [pct, setPct] = useState(0);
  return (
    <div className="relative h-80 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <header className={cn("absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b px-4 transition-all duration-300", y > 20 ? "h-12 border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80" : "h-20 border-transparent")}>
        <b className={cn("transition-all", y > 20 ? "text-sm" : "text-xl")}>长文章标题</b><span className="text-xs text-zinc-500">{Math.round(pct)}%</span>
        <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent" style={{ transform: `scaleX(${pct / 100})` }} />
      </header>
      <div className="h-full overflow-auto px-6 pb-8 pt-24" onScroll={(e) => { const el = e.currentTarget; setY(el.scrollTop); setPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100); }}>
        {Array.from({ length: 12 }, (_, i) => <p key={i} className="mb-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">第 {i + 1} 段：向下滚动这块区域——头部会缩小并加毛玻璃，同时顶部出现阅读进度条。好的头部在内容滚动时给内容让路，在回滚时提供导航。</p>)}
      </div>
    </div>
  );
}

function BottomTabDemo() {
  const [t, setT] = useState(0);
  const tabs = [[Home, "首页"], [Compass, "发现"], [Bell, "消息"], [User, "我的"]] as const;
  return (
    <Phone>
      <div className="grid h-full place-items-center pb-16 pt-6 text-center"><div><p className="text-4xl">{["🏠", "🧭", "🔔", "👤"][t]}</p><p className="mt-2 text-sm font-medium">{tabs[t][1]}</p></div></div>
      <nav className="absolute inset-x-0 bottom-0 flex border-t border-zinc-200 bg-white/90 pb-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        {tabs.map(([I, l], i) => <button key={l} onClick={() => setT(i)} className={cn("relative flex flex-1 flex-col items-center gap-0.5 pt-2 text-[10px] transition-colors", t === i ? "text-accent" : "text-zinc-400")}><I className={cn("h-5 w-5 transition-transform", t === i && "-translate-y-0.5 scale-110")} />{l}{i === 2 && <span className="absolute right-[28%] top-1.5 h-2 w-2 rounded-full bg-red-500" />}</button>)}
      </nav>
    </Phone>
  );
}

function NotificationDemo() {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([{ id: 1, t: "李雷 评论了你的设计稿", d: "2 分钟前", u: true }, { id: 2, t: "构建 #482 已成功部署", d: "1 小时前", u: true }, { id: 3, t: "韩梅梅 邀请你加入团队", d: "昨天", u: false }]);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false), open);
  const n = list.filter((x) => x.u).length;
  return (
    <div ref={ref} className="relative inline-block min-h-72">
      <button aria-label={`通知，${n} 条未读`} onClick={() => setOpen(!open)} className="relative grid h-10 w-10 place-items-center rounded-xl border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"><Bell className="h-5 w-5" />{n > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">{n}</span>}</button>
      {open && <div className="anim-scale-in absolute left-0 top-12 z-10 w-80 origin-top-left rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800"><b className="text-sm">通知</b><button className="text-xs text-accent" onClick={() => setList(list.map((x) => ({ ...x, u: false })))}>全部已读</button></div>
        {list.map((x) => <button key={x.id} onClick={() => setList(list.map((y) => (y.id === x.id ? { ...y, u: false } : y)))} className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60"><span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", x.u ? "bg-accent" : "bg-transparent")} /><span><span className="block text-sm">{x.t}</span><span className="text-xs text-zinc-500">{x.d}</span></span></button>)}
      </div>}
    </div>
  );
}

function ScrollSpyDemo() {
  const secs = ["简介", "安装", "使用", "进阶", "FAQ"];
  const [act, setAct] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const onScroll = () => {
    const c = box.current!; let cur = 0;
    secs.forEach((_, i) => { const el = c.querySelector<HTMLElement>(`[data-sec="${i}"]`)!; if (el.offsetTop - c.scrollTop <= 60) cur = i; });
    setAct(cur);
  };
  return (
    <div className="flex h-72 gap-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div ref={box} onScroll={onScroll} className="flex-1 overflow-auto scroll-smooth p-5">
        {secs.map((s, i) => <section key={s} data-sec={i} className="mb-6 min-h-52"><h4 className="mb-2 text-lg font-semibold">{s}</h4><p className="text-sm leading-relaxed text-zinc-500">这是「{s}」章节的内容。滚动时右侧目录会自动高亮当前所在章节；点击目录项则平滑滚动到对应位置。</p></section>)}
      </div>
      <ul className="w-28 shrink-0 space-y-1 border-l border-zinc-200 py-5 pl-4 text-sm dark:border-zinc-800">
        {secs.map((s, i) => <li key={s}><button onClick={() => box.current!.querySelector<HTMLElement>(`[data-sec="${i}"]`)!.scrollIntoView({ behavior: "smooth", block: "start" })} className={cn("-ml-[17px] border-l-2 pl-4 transition-colors", act === i ? "border-accent font-medium text-accent" : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white")}>{s}</button></li>)}
      </ul>
    </div>
  );
}

/* ---------- 新增 ---------- */
function DockDemo() {
  const [mx, setMx] = useState<number | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const icons = [[Home, "from-sky-400 to-blue-600"], [Mail, "from-rose-400 to-red-600"], [ImageIcon, "from-amber-300 to-orange-500"], [Music, "from-pink-400 to-fuchsia-600"], [Globe, "from-emerald-400 to-teal-600"], [Settings, "from-zinc-400 to-zinc-600"], [Folder, "from-violet-400 to-indigo-600"]] as const;
  const scale = (i: number) => {
    const el = refs.current[i];
    if (mx === null || !el) return 1;
    const c = el.getBoundingClientRect(); const d = Math.abs(mx - (c.left + c.width / 2));
    return 1 + 0.9 * Math.exp(-(d * d) / (2 * 48 * 48));
  };
  return (
    <div className="grid h-44 place-items-end justify-center pb-2">
      <div onMouseMove={(e) => setMx(e.clientX)} onMouseLeave={() => setMx(null)} className="glass flex items-end gap-2 rounded-2xl px-3 pb-2 pt-2 shadow-xl">
        {icons.map(([I, g], i) => {
          const s = scale(i);
          return <div key={i} ref={(el) => { refs.current[i] = el; }} className="grid origin-bottom place-items-center" style={{ width: 44, height: 44, transform: `scale(${s}) translateY(${-(s - 1) * 6}px)`, transition: mx === null ? "transform 0.3s cubic-bezier(0.32,0.72,0,1)" : "none" }}><span className={cn("grid h-full w-full place-items-center rounded-xl bg-gradient-to-br text-white shadow-md", g)}><I className="h-5 w-5" /></span></div>;
        })}
      </div>
    </div>
  );
}

function IslandDemo() {
  const [s, setS] = useState(0);
  const st = [
    { w: 120, h: 36, node: <span className="h-2 w-2 rounded-full bg-emerald-400" /> },
    { w: 280, h: 64, node: <div className="flex w-full items-center gap-3 px-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500"><PhoneIcon className="h-4 w-4" /></span><div className="flex-1 text-left text-xs"><p className="font-semibold">陈小明</p><p className="text-white/50">00:42 通话中</p></div><span className="grid h-8 w-8 place-items-center rounded-full bg-red-500"><X className="h-4 w-4" /></span></div> },
    { w: 320, h: 120, node: <div className="flex w-full flex-col gap-3 px-5"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-400"><Music className="h-5 w-5" /></span><div className="text-left text-xs"><p className="text-sm font-semibold">Midnight City</p><p className="text-white/50">M83</p></div><div className="ml-auto flex h-5 items-end gap-0.5">{[0, 1, 2, 3].map((i) => <span key={i} className="w-0.5 origin-bottom rounded bg-pink-400" style={{ height: "100%", animation: `bar 0.9s ${i * 0.15}s infinite` }} />)}</div></div><div className="h-1 rounded-full bg-white/20"><div className="h-full w-2/5 rounded-full bg-white" /></div></div> },
    { w: 200, h: 44, node: <div className="flex items-center gap-2 text-sm"><Timer className="h-4 w-4 text-amber-400" /><span className="font-mono tabular-nums text-amber-300">04:59</span><Mic className="h-4 w-4 text-white/50" /></div> },
  ];
  const cur = st[s];
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <button aria-label="切换灵动岛状态" onClick={() => setS((s + 1) % st.length)} className="flex items-center justify-center overflow-hidden bg-black text-white shadow-xl [transition:width_0.5s_cubic-bezier(0.34,1.4,0.64,1),height_0.5s_cubic-bezier(0.34,1.4,0.64,1),border-radius_0.5s]" style={{ width: cur.w, height: cur.h, borderRadius: cur.h / 2 > 30 ? 36 : cur.h / 2 }}>
        <div key={s} className="anim-fade-up flex w-full items-center justify-center" style={{ animationDuration: "0.4s" }}>{cur.node}</div>
      </button>
      <p className="text-xs text-zinc-500">点击切换：待机 → 通话 → 音乐 → 计时 · 尺寸与圆角同时过渡</p>
    </div>
  );
}

function MegaMenuDemo() {
  const [open, setOpen] = useState<string | null>(null);
  const data: Record<string, [typeof Home, string, string][]> = {
    产品: [[LayoutDashboard, "分析面板", "实时数据洞察"], [Users, "协作空间", "多人同时编辑"], [FileText, "文档中心", "知识库与 Wiki"], [Play, "自动化", "无代码工作流"]],
    资源: [[FileText, "博客", "最新文章"], [Globe, "社区", "加入讨论"], [Compass, "教程", "从零开始"], [Settings, "API 文档", "开发者指南"]],
  };
  return (
    <div className="relative min-h-72 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800" onMouseLeave={() => setOpen(null)}>
      <div className="flex h-12 items-center gap-1 border-b border-zinc-200 bg-white px-3 dark:border-zinc-800 dark:bg-zinc-900">
        {Object.keys(data).map((k) => <button key={k} onMouseEnter={() => setOpen(k)} onFocus={() => setOpen(k)} className={cn("rounded-lg px-3 py-1.5 text-sm transition", open === k ? "bg-zinc-100 dark:bg-zinc-800" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}>{k} <ChevronDown className={cn("inline h-3.5 w-3.5 transition", open === k && "rotate-180")} /></button>)}
        <button className="rounded-lg px-3 py-1.5 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800" onMouseEnter={() => setOpen(null)}>定价</button>
      </div>
      <div className={cn("absolute inset-x-0 top-12 z-10 origin-top bg-white p-4 shadow-xl transition-all duration-200 dark:bg-zinc-900", open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0")}>
        <div key={open ?? "x"} className="anim-fade-up grid gap-2 sm:grid-cols-2" style={{ animationDuration: "0.25s" }}>
          {(data[open ?? "产品"]).map(([I, t, d]) => <a key={t} className="flex cursor-pointer gap-3 rounded-xl p-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"><span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-soft text-accent"><I className="h-5 w-5" /></span><span><b className="block text-sm">{t}</b><span className="text-xs text-zinc-500">{d}</span></span></a>)}
        </div>
      </div>
    </div>
  );
}

function HamburgerDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  return (
    <div className="flex items-center gap-10">
      <button aria-label="菜单" aria-expanded={a} onClick={() => setA(!a)} className="relative h-10 w-10 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
        <span className={cn("absolute left-2.5 h-0.5 w-5 rounded bg-current transition-all duration-300", a ? "top-[19px] rotate-45" : "top-[13px]")} />
        <span className={cn("absolute left-2.5 top-[19px] h-0.5 w-5 rounded bg-current transition-all duration-300", a && "scale-x-0 opacity-0")} />
        <span className={cn("absolute left-2.5 h-0.5 w-5 rounded bg-current transition-all duration-300", a ? "top-[19px] -rotate-45" : "top-[25px]")} />
      </button>
      <button aria-label="菜单" aria-expanded={b} onClick={() => setB(!b)} className="group relative h-10 w-10 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
        <span className={cn("absolute left-2.5 top-[13px] h-0.5 rounded bg-current transition-all duration-300", b ? "w-5 translate-y-[6px] rotate-45" : "w-5")} />
        <span className={cn("absolute right-2.5 top-[19px] h-0.5 rounded bg-current transition-all duration-300", b ? "w-0" : "w-3")} />
        <span className={cn("absolute left-2.5 top-[25px] h-0.5 rounded bg-current transition-all duration-300", b ? "w-5 -translate-y-[6px] -rotate-45" : "w-4")} />
      </button>
      <button aria-label="菜单" aria-expanded={c} onClick={() => setC(!c)} className="grid h-10 w-10 grid-cols-3 place-content-center gap-1 rounded-lg p-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
        {Array.from({ length: 9 }, (_, i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-current transition-all duration-300" style={{ transform: c ? `scale(${[0, 2, 6, 8].includes(i) ? 1.4 : i === 4 ? 0 : 0.8})` : "none", opacity: c && i % 2 && i !== 4 ? 0.3 : 1, transitionDelay: i * 20 + "ms" }} />)}
      </button>
    </div>
  );
}

export const nav: Section = {
  id: "navigation", title: "导航", en: "Navigation", group: "组件", icon: Compass, hue: 150,
  blurb: "导航决定用户如何在信息中穿行。好的导航让人始终知道：我在哪、能去哪、怎么回来。",
  items: [
    item({ id: "navbar", title: "顶部导航栏", en: "Navbar", level: "基础", demo: NavbarDemo, tags: ["header", "menu"],
      desc: "品牌 + 主导航 + 主操作。桌面端悬停时背景胶囊平滑跟随，窄屏折叠为汉堡菜单。",
      points: ["测量 offsetLeft/offsetWidth 定位胶囊。", "grid-template-rows: 0fr → 1fr 实现自适应高度的折叠动画。"], a11y: ["nav 地标 + aria-current；汉堡按钮 aria-expanded。"], code: `<span className="absolute rounded-lg bg-zinc-100 transition-all" style={{ left: pill.l, width: pill.w }} />` }),
    item({ id: "tabs", title: "标签页", en: "Tabs", level: "基础", demo: TabsDemo, tags: ["tablist"],
      desc: "同一层级内容的切换。下划线指示器滑动到当前标签，面板淡入。",
      a11y: ["role=tablist/tab/tabpanel；← → 切换，roving tabindex。"], code: `<div role="tablist" onKeyDown={(e) => e.key === "ArrowRight" && next()}>
  <button role="tab" aria-selected={i === k} tabIndex={i === k ? 0 : -1} />
</div>` }),
    item({ id: "breadcrumb", title: "面包屑", en: "Breadcrumb", level: "基础", demo: BreadcrumbDemo, tags: ["path"],
      desc: "显示层级路径。层级过深时中间折叠为 …，点击展开。", a11y: ["nav aria-label=面包屑；当前页 aria-current=page。"], code: `const show = full.length > 4 ? [full[0], "…", ...full.slice(-2)] : full;` }),
    item({ id: "pagination", title: "分页", en: "Pagination", level: "基础", demo: PaginationDemo, tags: ["pager"],
      desc: "大数据分页，始终显示首尾页和当前页的相邻页，其余用省略号。", points: ["当前页 ±1，首尾必显。"], a11y: ["当前页 aria-current=page。"], code: `// 1 … 4 [5] 6 … 20` }),
    item({ id: "sidebar", title: "侧边栏", en: "Sidebar", level: "进阶", demo: SidebarDemo, tags: ["collapse"],
      desc: "应用级导航。可收起为图标栏，文字淡出、宽度过渡。", points: ["收起时保留 title 属性做悬停提示。", "未读数收起时缩成小红点。"], code: `<aside className={col ? "w-14" : "w-52"} style={{ transition: "width .3s" }} />` }),
    item({ id: "steps", title: "步骤条", en: "Stepper", level: "进阶", demo: StepsDemo, tags: ["wizard"],
      desc: "多步骤流程。已完成显示对勾，进行中带光环，连接线按进度填充。", a11y: ["当前步骤 aria-current=step。"], code: `<span style={{ width: i < s ? "100%" : "0%" }} className="transition-all duration-500 bg-accent" />` }),
    item({ id: "dropdown-menu", title: "下拉菜单", en: "Dropdown Menu", level: "进阶", demo: DropdownMenuDemo, tags: ["menu"],
      desc: "收纳次要操作。支持键盘上下导航、Esc 关闭、危险操作标红。", a11y: ["role=menu / menuitem；焦点管理。"], code: `<div role="menu"><button role="menuitem" /></div>` }),
    item({ id: "command", title: "命令面板 ⌘K", en: "Command Palette", level: "高级", demo: MiniPaletteDemo, tags: ["cmdk", "spotlight"],
      desc: "键盘优先的万能入口：搜索 + 执行。强用户的效率神器。本站的 ⌘K 就是完整版本。", points: ["全局监听 ⌘K / Ctrl+K。", "↑↓ 移动，Enter 执行，Esc 关闭。", "结果按相关度排序。"], code: `useEffect(() => {
  const h = (e: KeyboardEvent) => (e.metaKey || e.ctrlKey) && e.key === "k" && setOpen(true);
  window.addEventListener("keydown", h);
  return () => window.removeEventListener("keydown", h);
}, []);` }),
    item({ id: "context-menu", title: "右键菜单", en: "Context Menu", level: "进阶", demo: ContextMenuDemo, tags: ["right-click"],
      desc: "在对象上右键调出相关操作。位置需防止溢出容器边缘。", points: ["onContextMenu + preventDefault。", "点击空白或滚动时关闭。"], mistakes: ["把唯一入口放在右键里，触屏用户无法访问。"], code: `onContextMenu={(e) => { e.preventDefault(); setPos({ x: e.clientX, y: e.clientY }); }}` }),
    item({ id: "shrink-header", title: "阅读进度 / 收缩头部", en: "Reading Progress", level: "进阶", demo: ShrinkHeaderDemo, tags: ["scroll", "sticky"],
      desc: "长内容页，头部滚动后缩小并加毛玻璃，顶部细线显示阅读进度。", points: ["进度 = scrollTop / (scrollHeight − clientHeight)。", "用 scaleX 而不是 width 动画。"], code: `<span style={{ transform: "scaleX(" + pct / 100 + ")" }} className="origin-left" />` }),
    item({ id: "bottom-tab", title: "底部标签栏", en: "Bottom Tab Bar", level: "基础", demo: BottomTabDemo, tags: ["mobile"],
      desc: "移动端主导航，3–5 个入口，拇指易达。选中项图标轻微上浮放大。", points: ["留出底部安全区 padding-bottom: env(safe-area-inset-bottom)。"], code: `<nav className="fixed inset-x-0 bottom-0 pb-[env(safe-area-inset-bottom)]" />` }),
    item({ id: "notify-panel", title: "通知面板", en: "Notification Panel", level: "进阶", demo: NotificationDemo, tags: ["bell", "inbox"],
      desc: "红点未读数 + 弹出列表，支持单条/全部已读。", a11y: ["按钮 aria-label 中包含未读数。"], code: `<button aria-label={n + " 条未读通知"} />` }),
    item({ id: "scrollspy", title: "页内目录 · 滚动侦测", en: "Scroll Spy TOC", level: "进阶", demo: ScrollSpyDemo, tags: ["toc"],
      desc: "长文档右侧目录，高亮当前章节，点击平滑滚动。", points: ["用 scroll-padding-top 或 scroll-margin 抵消固定头部。", "IntersectionObserver 比 scroll 事件更省性能。"], code: `el.scrollIntoView({ behavior: "smooth", block: "start" });` }),
    item({ id: "dock", title: "Dock 放大", en: "Magnifying Dock", level: "高级", isNew: true, demo: DockDemo, tags: ["macos", "magnify"],
      desc: "macOS 风格的 Dock：图标按与鼠标的水平距离，用高斯函数平滑放大，邻近图标连带放大。",
      points: ["scale = 1 + A·exp(−d² / 2σ²)，σ≈48px，A≈0.9。", "跟随期间不加 transition，离开时再用弹性曲线复位。", "transform-origin: bottom，放大时向上长。"], a11y: ["放大只是装饰，所有图标需有文字标签（title / aria-label）。"], code: `const d = Math.abs(mouseX - (rect.left + rect.width / 2));
const scale = 1 + 0.9 * Math.exp(-(d * d) / (2 * 48 * 48));` }),
    item({ id: "island", title: "灵动岛", en: "Dynamic Island", level: "高级", isNew: true, demo: IslandDemo, tags: ["ios", "morph"],
      desc: "一个黑色胶囊，根据状态变形为来电、音乐、计时器。宽高与圆角同时过渡，内容淡入。",
      points: ["为 width / height / border-radius 设置带过冲的曲线 cubic-bezier(.34,1.4,.64,1)。", "内容用 key 重新挂载触发入场动画。", "适合承载“进行中的后台任务”。"], code: `style={{ width: s.w, height: s.h, borderRadius: s.h / 2,
  transition: "width .5s cubic-bezier(.34,1.4,.64,1), height .5s cubic-bezier(.34,1.4,.64,1)" }}` }),
    item({ id: "mega-menu", title: "Mega 菜单", en: "Mega Menu", level: "进阶", isNew: true, demo: MegaMenuDemo, tags: ["flyout"],
      desc: "内容丰富的站点的大型下拉面板：图标 + 标题 + 描述的卡片网格。", points: ["悬停与聚焦都要能打开。", "鼠标移出整个区域才关闭，避免对角线移动时误关。", "用 visibility + opacity 过渡，关闭后不可聚焦。"], code: `<div onMouseLeave={() => setOpen(null)}>…</div>` }),
    item({ id: "hamburger", title: "汉堡图标变形", en: "Hamburger Morph", level: "基础", isNew: true, demo: HamburgerDemo, tags: ["icon", "menu"],
      desc: "三种变形：经典 ✕、箭头式、九宫格点阵。用同一组 span 的 transform 做过渡。", points: ["用 absolute + top 固定位置，旋转 ±45° 形成叉。", "点阵版用 transitionDelay 做逐点波浪。"], a11y: ["aria-expanded 同步状态。"], code: `<span className={open ? "top-[19px] rotate-45" : "top-[13px]"} />` }),
  ],
};
