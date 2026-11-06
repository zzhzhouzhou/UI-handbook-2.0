import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Sun, Moon, Menu, X, ArrowUp, ChevronsUpDown, ChevronsDownUp, CornerDownLeft, Sparkles } from "lucide-react";
import { groups, sections, sectionNo, lookup, blockCount } from "@/content";
import { useDark, toggleTheme } from "@/lib/hooks";
import { cn } from "@/utils/cn";
import { Kbd } from "@/components/ui";

export const goTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  try { history.replaceState(null, "", id === "top" ? location.pathname + location.search : `#${id}`); } catch {}
};

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <rect width="32" height="32" rx="8" fill="var(--fg)" />
      <rect x="7" y="7" width="8" height="8" rx="2" fill="var(--bg)" />
      <rect x="17" y="7" width="8" height="8" rx="2" fill="var(--bg)" opacity=".4" />
      <rect x="7" y="17" width="8" height="8" rx="2" fill="var(--bg)" opacity=".4" />
      <rect x="17" y="17" width="8" height="8" rx="2" fill="var(--bg)" />
    </svg>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const dark = useDark();
  return (
    <button onClick={(e) => toggleTheme(e)} aria-label={dark ? "切换到浅色" : "切换到深色"} className={cn("relative grid h-9 w-9 place-items-center rounded-lg text-mute transition-colors hover:bg-soft2 hover:text-fg", className)}>
      <Sun size={16} className={cn("absolute transition-all duration-500", dark ? "rotate-90 scale-0 opacity-0" : "")} />
      <Moon size={16} className={cn("absolute transition-all duration-500", dark ? "" : "-rotate-90 scale-0 opacity-0")} />
    </button>
  );
}

/* =============== Sidebar =============== */
export function Sidebar({ active, progress, open, onClose }: { active: string; progress: number; open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [expand, setExpand] = useState(() => { try { return localStorage.getItem("hb-expand") !== "0"; } catch { return true; } });
  const scroller = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [bar, setBar] = useState({ top: 0, h: 0, show: false });
  const activeSec = lookup.get(active)?.section.id;
  const ql = q.trim().toLowerCase();

  const filtered = useMemo(() => {
    return groups.map((g) => ({
      g,
      items: sections.filter((s) => s.group === g.id).map((s) => {
        if (!ql) return { s, blocks: s.blocks };
        const hit = (t: string) => t.toLowerCase().includes(ql);
        const secHit = hit(s.title) || hit(s.en);
        const blocks = secHit ? s.blocks : s.blocks.filter((b) => hit(b.title) || hit(b.desc));
        return secHit || blocks.length ? { s, blocks } : null;
      }).filter(Boolean) as { s: typeof sections[number]; blocks: typeof sections[number]["blocks"] }[],
    })).filter((x) => x.items.length);
  }, [ql]);
  const matchCount = filtered.reduce((a, x) => a + x.items.reduce((b, i) => b + 1 + i.blocks.length, 0), 0);

  // 滑动指示条 + 自动把当前项滚入可视区
  useEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    const sc = scroller.current;
    if (!el || !sc) { setBar((b) => ({ ...b, show: false })); return; }
    setBar({ top: el.offsetTop, h: el.offsetHeight, show: true });
    const er = el.getBoundingClientRect(), sr = sc.getBoundingClientRect();
    const pad = 120;
    if (er.top < sr.top + pad || er.bottom > sr.bottom - pad) {
      sc.scrollTo({ top: el.offsetTop - sc.clientHeight / 2 + el.offsetHeight / 2, behavior: "smooth" });
    }
  }, [active, ql, expand, filtered]);

  useEffect(() => { try { localStorage.setItem("hb-expand", expand ? "1" : "0"); } catch {} }, [expand]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "/" && !/INPUT|TEXTAREA/.test((e.target as HTMLElement).tagName)) { e.preventDefault(); input.current?.focus(); } };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const jump = (id: string) => { goTo(id); onClose(); };
  const itemBase = "relative flex w-full items-center text-left transition-colors";

  return (
    <>
      <div onClick={onClose} className={cn("fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")} />
      <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[300px] flex-col border-r border-line bg-bg transition-transform duration-300 lg:z-30 lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")} style={{ transitionTimingFunction: "var(--ease)" }}>
        {/* header */}
        <div className="shrink-0 px-5 pb-3 pt-5">
          <div className="flex items-center justify-between">
            <button onClick={() => jump("top")} className="flex items-center gap-3 text-left">
              <Logo />
              <div className="leading-tight"><div className="text-[15px] font-semibold tracking-tight">形色场</div><div className="font-mono text-[10px] uppercase tracking-[.14em] text-dim">UI Handbook 2.0</div></div>
            </button>
            <button aria-label="关闭菜单" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-mute hover:bg-soft2 lg:hidden"><X size={16} /></button>
          </div>
          <div className="relative mt-4">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
            <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Escape" && (setQ(""), input.current?.blur())} placeholder="筛选目录" className="h-9 w-full rounded-lg border border-line bg-soft pl-9 pr-9 text-[13px] outline-none transition-colors placeholder:text-dim focus:border-fg" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">{q ? <button aria-label="清除" onClick={() => setQ("")} className="grid h-5 w-5 place-items-center rounded-full text-mute hover:bg-soft2"><X size={11} /></button> : <Kbd>/</Kbd>}</div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-dim">
            <span className="font-mono">{ql ? `${matchCount} 项匹配` : `${sections.length} 章 · ${blockCount} 个示例`}</span>
            <button onClick={() => setExpand(!expand)} className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-mute transition-colors hover:bg-soft2 hover:text-fg" aria-pressed={expand}>
              {expand ? <ChevronsDownUp size={13} /> : <ChevronsUpDown size={13} />}{expand ? "收起子项" : "展开子项"}
            </button>
          </div>
        </div>

        {/* scrolling list */}
        <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-line" style={{ maskImage: "linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 20px), transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 14px, #000 calc(100% - 20px), transparent 100%)" }}>
          <nav ref={nav} aria-label="章节目录" className="relative px-3 pb-24 pt-3">
            <span className="absolute bottom-0 left-[22px] top-0 w-px bg-line" />
            <span className="absolute left-[21px] w-[3px] rounded-full bg-fg transition-all duration-300" style={{ top: bar.top, height: bar.h, opacity: bar.show ? 1 : 0, transitionTimingFunction: "var(--ease)" }} />
            {!ql && (
              <button data-nav="top" onClick={() => jump("top")} className={cn(itemBase, "h-8 gap-3 rounded-md pl-[18px] pr-2 text-[13px]", active === "top" ? "font-medium text-fg" : "text-mute hover:text-fg")}>
                <span className="w-5 font-mono text-[10px] text-dim">—</span>概览
              </button>
            )}
            {filtered.map(({ g, items }) => (
              <div key={g.id} className="mt-4">
                <button onClick={() => jump("g-" + g.id)} className="sticky top-0 z-10 flex w-full items-center gap-2 bg-bg/90 py-2 pl-[18px] pr-2 text-left backdrop-blur">
                  <span className="grid h-4 w-4 place-items-center rounded bg-inv font-mono text-[9px] font-semibold text-invfg">{g.letter}</span>
                  <span className="label !text-fg/70">{g.en}</span>
                  <span className="ml-auto font-mono text-[10px] text-dim">{items.length}</span>
                </button>
                {items.map(({ s, blocks }) => {
                  const on = s.id === activeSec;
                  return (
                    <div key={s.id}>
                      <button data-nav={s.id} onClick={() => jump(s.id)} className={cn(itemBase, "h-8 gap-3 rounded-md pl-[18px] pr-2 text-[13px]", active === s.id ? "font-medium text-fg" : on ? "text-fg" : "text-mute hover:text-fg")}>
                        <span className={cn("w-5 font-mono text-[10px] transition-colors", on ? "text-fg" : "text-dim")}>{sectionNo(s.id)}</span>
                        <span className="truncate">{s.title}</span>
                        <span className="ml-auto font-mono text-[10px] text-dim opacity-0 transition-opacity group-hover:opacity-100">{s.blocks.length}</span>
                      </button>
                      <div className={cn("grid transition-[grid-template-rows,opacity] duration-300", expand || ql || on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} style={{ transitionTimingFunction: "var(--ease)" }}>
                        <div className="overflow-hidden">
                          {blocks.map((b) => (
                            <button key={b.id} data-nav={b.id} onClick={() => jump(b.id)} className={cn(itemBase, "h-[26px] rounded-md pl-[52px] pr-2 text-[12px]", active === b.id ? "font-medium text-fg" : "text-dim hover:text-fg")}>
                              <span className="truncate">{b.title}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            {!filtered.length && <div className="px-4 py-12 text-center text-[13px] text-mute">没有匹配 “{q}” 的目录</div>}
            <div className="mt-10 pl-[18px] font-mono text-[10px] uppercase tracking-[.14em] text-dim">— End of index</div>
          </nav>
        </div>

        {/* footer */}
        <div className="shrink-0 border-t border-line p-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1"><div className="mb-1.5 flex justify-between font-mono text-[10px] text-dim"><span>阅读进度</span><span className="tabular-nums text-fg">{Math.round(progress * 100)}%</span></div><div className="h-[3px] overflow-hidden rounded-full bg-line"><div className="h-full origin-left rounded-full bg-fg" style={{ transform: `scaleX(${progress})`, transition: "transform .15s linear" }} /></div></div>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}

/* =============== TopBar =============== */
export function TopBar({ active, progress, onMenu }: { active: string; progress: number; onMenu: () => void }) {
  const info = lookup.get(active);
  return (
    <header className="glass sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-line px-4 sm:px-8">
      <button aria-label="打开菜单" onClick={onMenu} className="grid h-9 w-9 place-items-center rounded-lg text-mute hover:bg-soft2 lg:hidden"><Menu size={17} /></button>
      <div className="min-w-0 flex-1 overflow-hidden text-[13px]">
        <div key={info ? info.section.id : "top"} className="anim-fade-up flex items-center gap-2 truncate" style={{ animationDuration: ".35s" }}>
          {info ? (<><span className="hidden font-mono text-[11px] text-dim sm:inline">{info.group.letter}</span><span className="hidden text-mute sm:inline">{info.group.title}</span><span className="hidden text-dim sm:inline">/</span><span className="font-mono text-[11px] text-dim">{sectionNo(info.section.id)}</span><span className="truncate font-medium">{info.section.title}</span></>) : <span className="font-medium">概览</span>}
        </div>
      </div>
      <button onClick={() => window.dispatchEvent(new Event("hb:cmd"))} className="hidden h-9 items-center gap-6 rounded-lg border border-line2 bg-bg px-3 text-[13px] text-dim transition-colors hover:border-fg sm:flex"><span className="flex items-center gap-2"><Search size={14} />搜索</span><span className="flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span></button>
      <button aria-label="搜索" onClick={() => window.dispatchEvent(new Event("hb:cmd"))} className="grid h-9 w-9 place-items-center rounded-lg text-mute hover:bg-soft2 sm:hidden"><Search size={16} /></button>
      <ThemeToggle />
      <div className="absolute inset-x-0 -bottom-px h-px origin-left bg-fg" style={{ transform: `scaleX(${progress})` }} />
    </header>
  );
}

/* =============== Command palette =============== */
type Item = { id: string; title: string; sub: string; kind: "section" | "block" | "action"; run?: () => void };
export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const inp = useRef<HTMLInputElement>(null);
  const dark = useDark();
  const all: Item[] = useMemo(() => [
    { id: "a-theme", title: dark ? "切换到浅色模式" : "切换到深色模式", sub: "操作", kind: "action", run: () => toggleTheme() },
    { id: "a-top", title: "回到顶部", sub: "操作", kind: "action", run: () => goTo("top") },
    { id: "a-egg", title: "触发彩蛋：反色模式", sub: "操作", kind: "action", run: () => window.dispatchEvent(new Event("hb:egg")) },
    ...sections.flatMap((s) => [
      { id: s.id, title: s.title, sub: `${sectionNo(s.id)} · ${s.en}`, kind: "section" as const },
      ...s.blocks.map((b) => ({ id: b.id, title: b.title, sub: s.title, kind: "block" as const })),
    ]),
  ], [dark]);
  const res = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return all.filter((x) => x.kind !== "block").slice(0, 40);
    return all.filter((x) => (x.title + x.sub).toLowerCase().includes(k)).slice(0, 50);
  }, [q, all]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); } if (e.key === "Escape") setOpen(false); };
    const o = () => setOpen(true);
    window.addEventListener("keydown", h); window.addEventListener("hb:cmd", o);
    return () => { window.removeEventListener("keydown", h); window.removeEventListener("hb:cmd", o); };
  }, []);
  useEffect(() => { if (open) { setQ(""); setI(0); setTimeout(() => inp.current?.focus(), 30); } }, [open]);
  useEffect(() => { setI(0); }, [q]);
  useEffect(() => { list.current?.querySelector<HTMLElement>(`[data-i="${i}"]`)?.scrollIntoView({ block: "nearest" }); }, [i]);
  const run = (x: Item) => { setOpen(false); setTimeout(() => (x.run ? x.run() : goTo(x.id)), 80); };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[120] grid place-items-start justify-items-center px-4 pt-[14vh]" style={{ animation: "fadeIn .15s both" }}>
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[3px]" onClick={() => setOpen(false)} />
      <div role="dialog" aria-label="命令面板" className="anim-scale-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-line2 bg-bg shadow-pop">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={16} className="text-dim" />
          <input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="跳转到章节、示例，或执行操作…" className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-dim"
            onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setI((x) => Math.min(res.length - 1, x + 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setI((x) => Math.max(0, x - 1)); } if (e.key === "Enter" && res[i]) run(res[i]); }} />
          <Kbd>Esc</Kbd>
        </div>
        <div ref={list} className="max-h-[52vh] overflow-y-auto p-2">
          {res.map((x, k) => (
            <button key={x.id + k} data-i={k} onMouseMove={() => setI(k)} onClick={() => run(x)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors", k === i ? "bg-inv text-invfg" : "")}>
              <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[10px]", k === i ? "border-invfg/30" : "border-line2 text-dim")}>{x.kind === "action" ? <Sparkles size={12} /> : x.kind === "section" ? "§" : "·"}</span>
              <span className="truncate text-[14px]">{x.title}</span>
              <span className={cn("ml-auto shrink-0 font-mono text-[11px]", k === i ? "opacity-60" : "text-dim")}>{x.sub}</span>
              {k === i && <CornerDownLeft size={13} className="shrink-0 opacity-70" />}
            </button>
          ))}
          {!res.length && <div className="py-14 text-center text-sm text-mute">没有找到 “{q}”</div>}
        </div>
        <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-dim"><span className="flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd>选择</span><span className="flex items-center gap-1"><Kbd>↵</Kbd>跳转</span><span className="ml-auto font-mono">{res.length} 项</span></div>
      </div>
    </div>
  );
}

/* =============== Back to top =============== */
export function BackToTop({ progress }: { progress: number }) {
  const R = 18, C = 2 * Math.PI * R;
  const show = progress > 0.03;
  return (
    <button aria-label="回到顶部" onClick={() => goTo("top")} className={cn("fixed bottom-6 right-6 z-30 grid h-11 w-11 place-items-center rounded-full border border-line2 bg-bg shadow-soft transition-all duration-300 hover:bg-soft2", show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0")}>
      <svg className="absolute inset-0 -rotate-90" width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r={R} fill="none" stroke="var(--fg)" strokeWidth="1.5" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} strokeLinecap="round" /></svg>
      <ArrowUp size={15} />
    </button>
  );
}
