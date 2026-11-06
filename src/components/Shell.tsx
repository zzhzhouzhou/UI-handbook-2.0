import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Check, ChevronDown, Command, Home, Menu, Moon, Palette, RotateCcw, Search, Sparkles, Sun, X } from "lucide-react";
import { cn } from "../utils/cn";
import { useApp, type FontKey } from "../lib/store";
import { go } from "../lib/router";
import { allItems, groups, sections, stats } from "../registry";
import { Range, Seg } from "./ui";
import { confetti } from "../lib/confetti";

/* ---------------- 顶栏 ---------------- */
export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { theme, toggleTheme, setPaletteOpen, tweaksOpen, setTweaksOpen } = useApp();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => { const d = document.documentElement; setPct(d.scrollTop / Math.max(1, d.scrollHeight - d.clientHeight)); };
    h(); window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-zinc-200/80 bg-white/75 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/75">
      <div className="flex h-full items-center gap-3 px-4">
        <button onClick={onMenu} aria-label="打开目录" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800"><Menu className="h-5 w-5" /></button>
        <a href="#/" className="group flex items-center gap-2.5 font-bold tracking-tight">
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-accent text-accent-fg shadow-md shadow-accent/30 transition group-hover:rotate-6">
            <span className="grid grid-cols-2 gap-[3px]"><i className="h-2 w-2 rounded-[2px] bg-current" /><i className="h-2 w-2 rounded-[2px] bg-current opacity-45" /><i className="h-2 w-2 rounded-[2px] bg-current opacity-45" /><i className="h-2 w-2 rounded-[2px] bg-current" /></span>
          </span>
          <span className="hidden sm:inline">形色场 <span className="font-medium text-zinc-400">UI Handbook</span></span>
          <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[10px] font-bold text-accent">2.0</span>
        </a>
        <div className="flex-1" />
        <button onClick={() => setPaletteOpen(true)} className="hidden h-9 w-64 items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-400 transition hover:border-zinc-300 hover:bg-white md:flex dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
          <Search className="h-4 w-4" />搜索组件…<span className="ml-auto flex gap-1"><kbd className="rounded border border-zinc-300 px-1.5 font-mono text-[10px] dark:border-zinc-700">{mac ? "⌘" : "Ctrl"}</kbd><kbd className="rounded border border-zinc-300 px-1.5 font-mono text-[10px] dark:border-zinc-700">K</kbd></span>
        </button>
        <button onClick={() => setPaletteOpen(true)} aria-label="搜索" className="grid h-9 w-9 place-items-center rounded-lg hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"><Search className="h-5 w-5" /></button>
        <button onClick={() => setTweaksOpen(!tweaksOpen)} aria-label="外观设置" title="外观：主色 / 圆角 / 字体" className={cn("grid h-9 w-9 place-items-center rounded-lg transition hover:bg-zinc-100 dark:hover:bg-zinc-800", tweaksOpen && "bg-accent-soft text-accent")}><Palette className="h-5 w-5" /></button>
        <button onClick={(e) => toggleTheme(e)} aria-label="切换主题" title="切换主题 (T)" className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Sun className={cn("absolute h-5 w-5 transition-all duration-500", theme === "dark" ? "rotate-90 scale-0" : "")} />
          <Moon className={cn("absolute h-5 w-5 transition-all duration-500", theme === "dark" ? "" : "-rotate-90 scale-0")} />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-[-1px] h-[2px] origin-left bg-gradient-to-r from-accent to-pink-500" style={{ transform: `scaleX(${pct})` }} />
    </header>
  );
}

/* ---------------- 侧边栏 ---------------- */
export function Sidebar({ open, onClose, current }: { open: boolean; onClose: () => void; current?: { section?: string; item?: string } }) {
  const { learned, bookmarks } = useApp();
  const [q, setQ] = useState("");
  const [exp, setExp] = useState<Record<string, boolean>>({});
  useEffect(() => { if (current?.section) setExp((e) => ({ ...e, [current.section!]: true })); }, [current?.section]);
  const filtered = useMemo(() => (q ? allItems.filter((i) => (i.title + i.en + i.id + (i.tags ?? []).join(" ")).toLowerCase().includes(q.toLowerCase())) : []), [q]);
  const pct = Math.round((learned.length / stats.total) * 100);
  const nav = (path: string) => { go(path); onClose(); };
  return (
    <>
      <div onClick={onClose} className={cn("fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")} />
      <aside className={cn("fixed bottom-0 left-0 top-14 z-40 flex w-72 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 [transition-timing-function:cubic-bezier(.32,.72,0,1)] lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="space-y-3 border-b border-zinc-200 p-3 dark:border-zinc-800">
          <div className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" /><input id="sidebar-search" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Escape" && (setQ(""), e.currentTarget.blur())} placeholder="过滤目录（按 / 聚焦）" className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-8 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15 dark:border-zinc-800 dark:bg-zinc-900" />{q && <button aria-label="清除" onClick={() => setQ("")} className="absolute right-2 top-2 rounded p-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><X className="h-4 w-4" /></button>}</div>
          <div className="flex items-center gap-3 px-1 text-xs text-zinc-500"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800"><div className="h-full rounded-full bg-gradient-to-r from-accent to-pink-500 transition-all duration-500" style={{ width: pct + "%" }} /></div><span className="tabular-nums">已学 {learned.length}/{stats.total}</span></div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 text-sm">
          <button onClick={() => nav("/")} className={cn("mb-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800", !current?.section && "bg-accent-soft text-accent")}><Home className="h-4 w-4" />首页</button>
          {q ? (
            <div className="mt-2 space-y-0.5">{filtered.length ? filtered.map((i) => <button key={i.id} onClick={() => nav(`/s/${i.sectionId}/${i.id}`)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-zinc-100 dark:hover:bg-zinc-800"><span>{i.title}<span className="ml-2 text-xs text-zinc-400">{i.sectionTitle}</span></span>{i.isNew && <Sparkles className="h-3 w-3 text-accent" />}</button>) : <p className="px-3 py-8 text-center text-zinc-400">没有找到 “{q}”</p>}</div>
          ) : groups.map((g) => (
            <div key={g.name} className="mt-4">
              <p className="mb-1 flex items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{g.name}{g.name.includes("新增") && <span className="rounded bg-accent px-1 text-[9px] text-accent-fg">NEW</span>}</p>
              {g.sections.map((s) => {
                const on = current?.section === s.id; const open2 = exp[s.id] ?? false; const done = s.items.filter((i) => learned.includes(i.id)).length; const Icon = s.icon;
                return (
                  <div key={s.id}>
                    <div className={cn("group flex items-center rounded-lg transition", on ? "bg-accent-soft" : "hover:bg-zinc-100 dark:hover:bg-zinc-800")}>
                      <button onClick={() => nav(`/s/${s.id}`)} className={cn("flex flex-1 items-center gap-2.5 px-3 py-2 text-left font-medium", on && "text-accent")}><Icon className="h-4 w-4 shrink-0" /><span className="flex-1">{s.title}</span><span className="text-[11px] font-normal tabular-nums text-zinc-400">{done}/{s.items.length}</span></button>
                      <button aria-label={open2 ? "收起" : "展开"} onClick={() => setExp({ ...exp, [s.id]: !open2 })} className="p-2 text-zinc-400"><ChevronDown className={cn("h-4 w-4 transition-transform", open2 && "rotate-180")} /></button>
                    </div>
                    <div className={cn("grid transition-all duration-300", open2 ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <ul className="min-h-0 overflow-hidden border-l border-zinc-200 pl-2 ml-5 dark:border-zinc-800">
                        {s.items.map((i) => (
                          <li key={i.id}><button onClick={() => nav(`/s/${s.id}/${i.id}`)} className={cn("flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition", current?.item === i.id ? "font-semibold text-accent" : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white")}>
                            <span className="flex-1 truncate">{i.title}</span>{i.isNew && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}{bookmarks.includes(i.id) && <span className="text-[10px] text-amber-500">★</span>}{learned.includes(i.id) && <Check className="h-3 w-3 text-emerald-500" />}</button></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

/* ---------------- 外观面板 ---------------- */
const HUES = [268, 330, 12, 38, 150, 190, 220];
export function Tweaks() {
  const { tweaksOpen, setTweaksOpen, hue, setHue, radius, setRadius, font, setFont, resetTweaks, theme, toggleTheme } = useApp();
  return (
    <>
      <div className={cn("fixed bottom-5 right-5 z-[60] w-72 origin-bottom-right rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900/95", tweaksOpen ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0")}>
        <div className="mb-3 flex items-center justify-between"><b className="flex items-center gap-2 text-sm"><Palette className="h-4 w-4 text-accent" />外观</b><div className="flex gap-1"><button onClick={resetTweaks} aria-label="重置" title="重置" className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"><RotateCcw className="h-4 w-4" /></button><button onClick={() => setTweaksOpen(false)} aria-label="关闭" className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"><X className="h-4 w-4" /></button></div></div>
        <div className="space-y-4">
          <div><p className="mb-2 text-xs text-zinc-500">主色</p><div className="mb-3 flex gap-2">{HUES.map((h) => <button key={h} aria-label={`色相 ${h}`} onClick={() => setHue(h)} className={cn("h-7 w-7 rounded-full ring-offset-2 ring-offset-white transition hover:scale-110 dark:ring-offset-zinc-900", hue === h && "ring-2 ring-zinc-900 dark:ring-white")} style={{ background: `oklch(0.62 0.2 ${h})` }} />)}</div><Range label="自定义色相" value={hue} onChange={setHue} min={0} max={360} /></div>
          <Range label="圆角" value={radius} onChange={setRadius} min={0} max={2} step={0.1} unit="×" />
          <div><p className="mb-2 text-xs text-zinc-500">字体</p><Seg<FontKey> value={font} onChange={setFont} options={[{ value: "sans", label: "无衬线" }, { value: "serif", label: "衬线" }, { value: "mono", label: "等宽" }]} /></div>
          <div className="flex items-center justify-between text-xs text-zinc-500">主题<button onClick={(e) => toggleTheme(e)} className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1 text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800">{theme === "dark" ? <><Moon className="h-3.5 w-3.5" />深色</> : <><Sun className="h-3.5 w-3.5" />浅色</>}</button></div>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-400">整站所有组件都由 CSS 变量驱动，实时联动。调好后到「设计实验室 → 设计令牌导出」复制。</p>
      </div>
    </>
  );
}

/* ---------------- Toast ---------------- */
export function ToastHost() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[120] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} onClick={() => dismissToast(t.id)} className="anim-fade-up pointer-events-auto rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-xl dark:bg-white dark:text-zinc-900">{t.text}</button>
      ))}
    </div>
  );
}

/* ---------------- 回到顶部 ---------------- */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const h = () => setShow(window.scrollY > 700); h(); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="回到顶部" className={cn("fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-zinc-200 bg-white/90 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-900/90 lg:left-[19.5rem]", show ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0")}><ArrowUp className="h-5 w-5" /></button>
  );
}

/* ---------------- 全局快捷键 + Konami 彩蛋 ---------------- */
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
export function Globals({ currentSection }: { currentSection?: string }) {
  const { setPaletteOpen, toggleTheme, toast, setTweaksOpen } = useApp();
  const idx = useRef(0);
  const busy = useRef(false);
  const fire = () => {
    if (busy.current) return; busy.current = true;
    toast("🎮 彩蛋解锁！彩虹模式启动");
    const w = window.innerWidth, h = window.innerHeight;
    confetti(w / 2, h / 2, 200); setTimeout(() => confetti(w * 0.2, h * 0.7, 120), 300); setTimeout(() => confetti(w * 0.8, h * 0.7, 120), 600);
    const s = document.documentElement.style; const base = s.getPropertyValue("--accent-h"); const t0 = performance.now();
    const loop = (t: number) => { const p = (t - t0) / 6000; if (p >= 1) { s.setProperty("--accent-h", base); busy.current = false; return; } s.setProperty("--accent-h", String((+base + p * 1080) % 360)); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  };
  useEffect(() => {
    const onFire = () => fire();
    window.addEventListener("hb-konami-fire", onFire);
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement; const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) || t.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === "/") { e.preventDefault(); const el = document.getElementById("sidebar-search") as HTMLInputElement | null; if (window.innerWidth < 1024) setPaletteOpen(true); else el?.focus(); }
      if (k === "t") toggleTheme();
      if (k === "[" || k === "]") { const i = sections.findIndex((s) => s.id === currentSection); const n = sections[(i + (k === "]" ? 1 : -1) + sections.length) % sections.length]; if (i >= 0 || k === "]") go(`/s/${(i < 0 ? sections[0] : n).id}`); }
      if (k === "Escape") setTweaksOpen(false);
      if (k === KONAMI[idx.current]) { idx.current++; window.dispatchEvent(new CustomEvent("hb-konami", { detail: idx.current })); if (idx.current === KONAMI.length) { idx.current = 0; fire(); setTimeout(() => window.dispatchEvent(new CustomEvent("hb-konami", { detail: 0 })), 2500); } }
      else { idx.current = k === KONAMI[0] ? 1 : 0; window.dispatchEvent(new CustomEvent("hb-konami", { detail: idx.current })); }
    };
    window.addEventListener("keydown", h);
    return () => { window.removeEventListener("keydown", h); window.removeEventListener("hb-konami-fire", onFire); };
  });
  return null;
}

export { Command };
