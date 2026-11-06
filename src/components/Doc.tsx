import { Component, Fragment, useMemo, useState, type ReactNode } from "react";
import { Bookmark, Check, CheckCircle2, Code2, Copy, Eye, Link2, RotateCw, Sparkles } from "lucide-react";
import { cn } from "../utils/cn";
import { useCopy, useInView, VisibleCtx } from "../lib/hooks";
import { useApp } from "../lib/store";
import type { Item, Level } from "../lib/types";
import { confetti } from "../lib/confetti";

/* ---------------- 代码高亮（轻量） ---------------- */
const KW =
  "const|let|var|function|return|import|from|export|default|if|else|for|while|new|type|interface|async|await|useState|useEffect|useRef|useMemo|useCallback|class|extends|true|false|null|undefined|as|of|in";
const RE = new RegExp(
  [
    "(\\/\\*[\\s\\S]*?\\*\\/|\\/\\/[^\\n]*)", // 1 comment
    "(\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*'|`(?:[^`\\\\]|\\\\.)*`)", // 2 string
    "(<\\/?[A-Za-z][\\w.]*)", // 3 tag
    `\\b(${KW})\\b`, // 4 keyword
    "(\\b\\d+(?:\\.\\d+)?(?:px|ms|s|rem|em|%|deg)?)", // 5 number
    "(--[\\w-]+)", // 6 css var
  ].join("|"),
  "g"
);

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  RE.lastIndex = 0;
  let k = 0;
  while ((m = RE.exec(code))) {
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1]
      ? "text-zinc-400 italic dark:text-zinc-500"
      : m[2]
        ? "text-emerald-600 dark:text-emerald-300"
        : m[3]
          ? "text-sky-600 dark:text-sky-300"
          : m[4]
            ? "text-violet-600 dark:text-violet-400"
            : m[5]
              ? "text-amber-600 dark:text-amber-300"
              : "text-pink-600 dark:text-pink-300";
    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>
    );
    last = m.index + m[0].length;
    if (m[0].length === 0) RE.lastIndex++;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodeBlock({ code, file = "Component.tsx" }: { code: string; file?: string }) {
  const { copied, copy } = useCopy();
  const nodes = useMemo(() => highlight(code.trim()), [code]);
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-1.5 dark:border-zinc-800">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[11px] text-zinc-500">{file}</span>
        </div>
        <button
          onClick={() => copy(code.trim())}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-200/70 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "已复制 ✓" : "复制"}
        </button>
      </div>
      <pre className="max-h-[460px] overflow-auto p-4 text-[12.5px] leading-relaxed text-zinc-700 dark:text-zinc-300">
        <code>{nodes}</code>
      </pre>
    </div>
  );
}

/* ---------------- 错误边界 ---------------- */
class Boundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() {
    return { err: true };
  }
  render() {
    if (this.state.err)
      return (
        <div className="text-center text-sm text-zinc-500">
          渲染出错了，
          <button className="text-accent underline" onClick={() => this.setState({ err: false })}>
            点击重试
          </button>
        </div>
      );
    return this.props.children;
  }
}

export const LEVEL_STYLE: Record<Level, string> = {
  基础: "bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  进阶: "bg-sky-50 text-sky-700 ring-sky-600/15 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-400/20",
  高级: "bg-violet-50 text-violet-700 ring-violet-600/15 dark:bg-violet-500/10 dark:text-violet-300 dark:ring-violet-400/20",
};

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", LEVEL_STYLE[level])}>{level}</span>
  );
}

/* ---------------- 组件卡片 ---------------- */
export function ItemCard({ item, index }: { item: Item; index: number; sectionItems?: Item[] }) {
  const { bookmarks, toggleBookmark, learned, toggleLearned, toast } = useApp();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [key, setKey] = useState(0);
  const [ref, seen] = useInView<HTMLElement>("600px");
  const [pref, near] = useInView<HTMLDivElement>("160px", false);
  const Demo = item.demo;
  const bare = item.bare;
  const preview = useMemo(() => (
    <Boundary>
      <div key={key} className={bare ? "" : "p-5 sm:p-8"}>
        <Demo />
      </div>
    </Boundary>
  ), [key, Demo, bare]);
  const marked = bookmarks.includes(item.id);
  const done = learned.includes(item.id);
  const notes: { title: string; list: string[]; tone: string }[] = [
    { title: "实现要点", list: item.points ?? [], tone: "text-accent" },
    { title: "无障碍与细节", list: item.a11y ?? [], tone: "text-sky-600 dark:text-sky-400" },
    { title: "常见错误", list: item.mistakes ?? [], tone: "text-red-500" },
  ].filter((n) => n.list.length);

  const share = () => {
    const link = window.location.href.split("#")[0] + window.location.hash.split("/").slice(0, 3).join("/") + "/" + item.id;
    navigator.clipboard?.writeText(link).catch(() => {});
    toast("链接已复制");
  };

  return (
    <article
      id={item.id}
      ref={ref}
      className="group/card scroll-mt-24 rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/40"
    >
      <header className="flex flex-wrap items-start justify-between gap-3 p-5 pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
            <LevelBadge level={item.level} />
            {item.isNew && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-fg">
                <Sparkles className="h-3 w-3" /> NEW
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-500">{item.en}</p>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="复制链接" onClick={share}>
            <Link2 className="h-4 w-4" />
          </IconBtn>
          <IconBtn label={marked ? "取消收藏" : "收藏"} active={marked} onClick={() => toggleBookmark(item.id)}>
            <Bookmark className={cn("h-4 w-4", marked && "fill-current")} />
          </IconBtn>
          <IconBtn
            label={done ? "取消已学" : "标记为已学"}
            active={done}
            onClick={(e) => {
              const on = toggleLearned(item.id);
              if (on) {
                const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                confetti(r.left + r.width / 2, r.top + r.height / 2, 50);
                toast("已标记为学会 ✓");
              }
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
          </IconBtn>
        </div>
      </header>

      <p className="px-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <span className="mr-1.5 font-medium text-zinc-900 dark:text-zinc-200">用途 ·</span>
        {item.desc}
      </p>

      <div ref={pref} className="mt-4 px-5">
        <div className="mb-2 flex items-center justify-between">
          <div className="inline-flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
            {(
              [
                ["preview", "预览", Eye],
                ["code", "代码", Code2],
              ] as const
            ).map(([k, label, Icon]) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition",
                  tab === k
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-white"
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setKey((k) => k + 1)}
            title="重新播放"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <RotateCw className="h-3.5 w-3.5" /> 重播
          </button>
        </div>

        {tab === "preview" ? (
          <div
            className="bg-dots relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/40"
            style={{ minHeight: item.h ?? 160 }}
          >
            {seen ? (
              <VisibleCtx.Provider value={near}>{preview}</VisibleCtx.Provider>
            ) : (
              <div className="skeleton absolute inset-0 opacity-50" />
            )}
          </div>
        ) : (
          <CodeBlock code={item.code} file={item.id + ".tsx"} />
        )}
      </div>

      {notes.length > 0 && (
        <div className={cn("grid gap-5 p-5 pt-5 text-sm", notes.length > 1 ? "md:grid-cols-2" : "")}>
          {notes.map((n) => (
            <div key={n.title} className={notes.length === 3 && n.title === "常见错误" ? "md:col-span-2" : ""}>
              <h4 className={cn("mb-2 text-xs font-semibold uppercase tracking-wider", n.tone)}>{n.title}</h4>
              <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                {n.list.map((l, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {notes.length === 0 && <div className="h-5" />}
    </article>
  );
}

function IconBtn({
  children,
  label,
  active,
  onClick,
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "rounded-lg p-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        active
          ? "bg-accent-soft text-accent"
          : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

export { Fragment };
