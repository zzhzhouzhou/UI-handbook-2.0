import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CornerDownLeft, Dices, Home, Moon, Palette, Search, Sparkles, Bookmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../utils/cn";
import { useApp } from "../lib/store";
import { go } from "../lib/router";
import { allItems, sections } from "../registry";
import { LevelBadge } from "./Doc";

interface Cmd { key: string; title: string; sub?: string; icon: LucideIcon; run: () => void; group: string; badge?: React.ReactNode; hay: string }

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, toggleTheme, setTweaksOpen, bookmarks } = useApp();
  const [q, setQ] = useState("");
  const [hi, setHi] = useState(0);
  const inp = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const close = () => setPaletteOpen(false);

  useEffect(() => { if (paletteOpen) { setQ(""); setHi(0); setTimeout(() => inp.current?.focus(), 30); } }, [paletteOpen]);

  const cmds = useMemo<Cmd[]>(() => {
    const actions: Cmd[] = [
      { key: "a-home", title: "回到首页", icon: Home, group: "操作", run: () => go("/"), hay: "home 首页 主页" },
      { key: "a-rand", title: "随机来一个组件", sub: "手气不错", icon: Dices, group: "操作", run: () => { const i = allItems[Math.floor(Math.random() * allItems.length)]; go(`/s/${i.sectionId}/${i.id}`); }, hay: "random 随机 手气" },
      { key: "a-theme", title: "切换深色 / 浅色", icon: Moon, group: "操作", run: () => toggleTheme(), hay: "theme dark light 主题 深色 浅色" },
      { key: "a-look", title: "打开外观面板", sub: "主色 / 圆角 / 字体", icon: Palette, group: "操作", run: () => setTweaksOpen(true), hay: "appearance 外观 主色 圆角 字体 tweak" },
    ];
    const secs: Cmd[] = sections.map((s) => ({ key: "s-" + s.id, title: s.title, sub: s.en + " · " + s.items.length + " 个组件", icon: s.icon, group: "章节", run: () => go(`/s/${s.id}`), hay: (s.title + s.en + s.id).toLowerCase() }));
    const items: Cmd[] = allItems.map((i) => ({ key: i.id, title: i.title, sub: i.en + " · " + i.sectionTitle, icon: bookmarks.includes(i.id) ? Bookmark : ArrowRight, group: "组件", run: () => go(`/s/${i.sectionId}/${i.id}`), badge: <span className="flex items-center gap-1.5">{i.isNew && <Sparkles className="h-3 w-3 text-accent" />}<LevelBadge level={i.level} /></span>, hay: (i.title + i.en + i.id + i.desc + (i.tags ?? []).join(" ") + i.sectionTitle).toLowerCase() }));
    return [...actions, ...secs, ...items];
  }, [bookmarks, toggleTheme, setTweaksOpen]);

  const res = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [...cmds.filter((c) => c.group === "操作"), ...cmds.filter((c) => c.group === "章节")];
    const score = (c: Cmd) => { const t = c.title.toLowerCase(); if (t === s) return 100; if (t.startsWith(s)) return 80; if (t.includes(s)) return 60; if (c.hay.includes(s)) return 30; let i = 0; for (const ch of s) { i = c.hay.indexOf(ch, i); if (i < 0) return 0; i++; } return 5; };
    return cmds.map((c) => [c, score(c)] as const).filter(([, n]) => n > 0).sort((a, b) => ({ 操作: 0, 章节: 1, 组件: 2 }[a[0].group] ?? 3) - ({ 操作: 0, 章节: 1, 组件: 2 }[b[0].group] ?? 3) || b[1] - a[1]).slice(0, 40).map(([c]) => c);
  }, [q, cmds]);

  useEffect(() => { setHi(0); }, [q]);
  useEffect(() => { list.current?.querySelector<HTMLElement>(`[data-i="${hi}"]`)?.scrollIntoView({ block: "nearest" }); }, [hi]);

  if (!paletteOpen) return null;
  const run = (c?: Cmd) => { if (!c) return; close(); setTimeout(c.run, 10); };
  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="命令面板">
      <div onClick={close} className="anim-scale-in absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="anim-scale-in relative w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900" onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setHi((hi + 1) % Math.max(res.length, 1)); } else if (e.key === "ArrowUp") { e.preventDefault(); setHi((hi + res.length - 1) % Math.max(res.length, 1)); } else if (e.key === "Enter") run(res[hi]); else if (e.key === "Escape") close(); }}>
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 dark:border-zinc-800"><Search className="h-5 w-5 text-zinc-400" /><input ref={inp} value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索组件、章节或操作…（支持中英文 / 标签）" className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-400" /><kbd className="rounded border border-zinc-300 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400 dark:border-zinc-700">ESC</kbd></div>
        <div ref={list} className="max-h-[52vh] overflow-y-auto p-2">
          {res.length === 0 && <div className="py-14 text-center text-sm text-zinc-400">没有找到 “{q}” 的相关内容</div>}
          {res.map((c, i) => {
            const head = c.group !== lastGroup; lastGroup = c.group; const Icon = c.icon;
            return (
              <div key={c.key}>
                {head && <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{q && c.group === "组件" ? "匹配的组件" : c.group}</p>}
                <button data-i={i} onMouseMove={() => setHi(i)} onClick={() => run(c)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", i === hi ? "bg-accent-soft" : "")}>
                  <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", i === hi ? "bg-accent text-accent-fg" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800")}><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className={cn("block truncate text-sm font-medium", i === hi && "text-accent")}>{c.title}</span>{c.sub && <span className="block truncate text-xs text-zinc-500">{c.sub}</span>}</span>
                  {c.badge}{i === hi && <CornerDownLeft className="h-4 w-4 text-accent" />}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 text-[11px] text-zinc-500 dark:border-zinc-800"><span className="flex gap-3"><span>↑↓ 选择</span><span>↵ 跳转</span><span>esc 关闭</span></span><span>{res.length} 项结果</span></div>
      </div>
    </div>
  );
}
