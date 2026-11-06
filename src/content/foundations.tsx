import { useEffect, useRef, useState } from "react";
import {
  Check, X, Search, Bell, Heart, Star, Home, User, Users, Settings, Mail, Calendar, Camera, Cloud, Code2, Copy, Download, Upload, Eye, Edit3, File, Folder, Image, Link2, Lock, Map, MessageCircle, Mic, Music, Play, Pause, Plus, Minus, Share2, Trash2, Zap, Bookmark, Clock, Globe, Layers, Layout, Menu, Moon, Sun, Palette, Pen, Phone, Printer, RefreshCw, Save, Send, Shield, ShoppingCart, Smile, Sliders, Tag as TagIcon, Terminal, ThumbsUp, Wifi, Filter, Grid3x3, ArrowRight, Sparkles, Box, Command,
} from "lucide-react";
import type { Section, Block } from "@/types";
import { Btn, Seg, Range, Switch, Caption, Tag } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useCopy, copyText } from "@/lib/hooks";
import { contrast } from "@/lib/color";

/* ============ 01 设计原则 ============ */
const PRINCIPLES = [
  ["克制", "Restraint", "每增加一个元素，都要问：去掉它会损失什么？如果答案是“没什么”，就去掉。"],
  ["层级", "Hierarchy", "一屏只有一个视觉重点。大小、重量、对比与留白共同决定阅读顺序。"],
  ["一致", "Consistency", "同样的事用同样的方式表达。令牌、组件、文案、动效都应出自同一套规则。"],
  ["反馈", "Feedback", "每个操作都要有回应：悬停、按下、加载、成功、失败，缺一不可。"],
  ["留白", "Whitespace", "留白不是空，是呼吸与分组。亲密性靠间距表达，而不是线条与背景。"],
  ["对比", "Contrast", "差异制造焦点。黑白灰系统里，明度对比就是全部的表达手段。"],
  ["节奏", "Rhythm", "4px 基准、1.25 倍字阶、统一的时长，让界面像音乐一样有拍子。"],
  ["可达", "Accessibility", "对比度、键盘、读屏、减少动效——为所有人设计，也是为最苛刻的场景设计。"],
  ["直觉", "Affordance", "元素外观应暗示用法。可点击的像可点击，可拖拽的有把手。"],
  ["诚实", "Honesty", "不装饰、不说谎。阴影只表达层级，动效只表达因果，颜色只表达状态。"],
];
function Principles() {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {PRINCIPLES.map(([zh, en, d], i) => {
        const on = open === i;
        return (
          <div key={zh}>
            <button onClick={() => setOpen(on ? -1 : i)} className="group flex w-full items-center gap-4 py-4 text-left" aria-expanded={on}>
              <span className="w-8 font-mono text-[11px] text-dim">{String(i + 1).padStart(2, "0")}</span>
              <span className={cn("text-xl font-semibold tracking-tight transition-all duration-300", on ? "translate-x-1" : "text-mute group-hover:text-fg group-hover:translate-x-1")}>{zh}</span>
              <span className="label ml-auto hidden sm:block">{en}</span>
              <Plus size={16} className={cn("shrink-0 text-mute transition-transform duration-300", on && "rotate-45")} />
            </button>
            <div className={cn("grid transition-[grid-template-rows] duration-300", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")} style={{ transitionTimingFunction: "var(--ease)" }}>
              <div className="overflow-hidden">
                <p className="max-w-[56ch] pb-5 pl-12 text-[14px] text-mute">{d}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SquintTest() {
  const [blur, setBlur] = useState(0);
  const [mode, setMode] = useState<"flat" | "strong">("flat");
  const flat = mode === "flat";
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Seg value={mode} onChange={setMode} options={[{ value: "flat", label: "层级薄弱" }, { value: "strong", label: "层级清晰" }]} />
        <Range className="w-56" label="眯眼强度 blur" value={blur} min={0} max={8} step={0.5} onChange={setBlur} fmt={(v) => `${v}px`} />
      </div>
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-bg p-6 transition-[filter] duration-200" style={{ filter: `blur(${blur}px)` }}>
        <div className="flex items-center gap-3">
          <div className={cn("grid h-10 w-10 place-items-center rounded-full", flat ? "bg-soft2 text-mute" : "bg-inv text-invfg")}><Layers size={18} /></div>
          <div className={cn(flat ? "text-[14px] text-mute" : "text-xs text-dim")}>设计系统 · 3 分钟阅读</div>
        </div>
        <h4 className={cn("mt-5 tracking-tight", flat ? "text-[15px] font-medium text-mute" : "text-3xl font-semibold leading-tight text-fg")}>为什么好的界面看起来「很空」</h4>
        <p className={cn("mt-3", flat ? "text-[14px] text-mute" : "text-[13px] text-mute")}>留白、对比与克制，是让信息被看见的三个前提。</p>
        <div className="mt-6 flex items-center gap-2">
          <button className={cn("rounded-lg px-4 py-2 text-[13px]", flat ? "border border-line2 text-mute" : "bg-inv font-medium text-invfg")}>阅读全文</button>
          <button className={cn("rounded-lg px-4 py-2 text-[13px]", flat ? "border border-line2 text-mute" : "text-mute")}>收藏</button>
        </div>
      </div>
      <p className="text-center text-xs text-mute">拖动眯眼强度。层级清晰的界面，即使模糊也能看出「标题 → 按钮」的阅读路径。</p>
    </div>
  );
}

function Subtract() {
  const [o, setO] = useState({ border: true, shadow: true, icon: true, badge: true, sub: true, divider: true });
  const k = Object.keys(o) as (keyof typeof o)[];
  const names: Record<string, string> = { border: "边框", shadow: "阴影", icon: "图标", badge: "徽章", sub: "副标题", divider: "分割线" };
  const score = k.filter((x) => o[x]).length;
  return (
    <div className="grid gap-8 md:grid-cols-[200px_1fr]">
      <div>
        <Caption>元素开关</Caption>
        <div className="space-y-3">
          {k.map((x) => (
            <div key={x} className="flex items-center justify-between text-[13px]">
              <span>{names[x]}</span>
              <Switch checked={o[x]} onChange={(v) => setO({ ...o, [x]: v })} label={names[x]} />
            </div>
          ))}
        </div>
        <div className="mt-5 font-mono text-xs text-mute">视觉噪音 {score}/6</div>
        <div className="mt-2 h-px bg-line2"><div className="h-px bg-fg transition-all duration-300" style={{ width: `${(score / 6) * 100}%` }} /></div>
      </div>
      <div className="grid place-items-center py-4">
        <div className={cn("w-full max-w-xs rounded-2xl bg-bg p-5 transition-all duration-300", o.border && "border border-line2", o.shadow && "shadow-pop")}>
          <div className="flex items-start justify-between">
            {o.icon ? <div className="grid h-10 w-10 place-items-center rounded-xl bg-soft2"><Cloud size={18} /></div> : <span />}
            {o.badge && <span className="rounded-full bg-inv px-2 py-0.5 text-[10px] font-medium text-invfg">NEW</span>}
          </div>
          <div className="mt-4 text-[15px] font-semibold">云端同步</div>
          {o.sub && <div className="mt-1 text-xs text-mute">所有设备自动保持最新状态。</div>}
          {o.divider && <div className="my-4 h-px bg-line" />}
          <div className={cn("flex items-center justify-between text-xs text-mute", !o.divider && "mt-4")}>
            <span>已用 4.2 GB</span><span className="inline-flex items-center gap-1 text-fg">管理<ArrowRight size={12} /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ 02 色彩 ============ */
const GRAYS: [string, string][] = [
  ["50", "#fafafa"], ["100", "#f2f2f2"], ["200", "#ebebeb"], ["300", "#d6d6d6"], ["400", "#a1a1a1"], ["500", "#6b6b6b"],
  ["600", "#4a4a4a"], ["700", "#333333"], ["800", "#1f1f1f"], ["900", "#111111"], ["950", "#0a0a0a"],
];
function GrayScale() {
  const [hover, setHover] = useState(-1);
  const [done, copy] = useCopy();
  const [last, setLast] = useState("");
  return (
    <div>
      <div className="flex h-56 overflow-hidden rounded-xl border border-line2">
        {GRAYS.map(([n, h], i) => (
          <button
            key={n}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(-1)}
            onClick={() => { copy(h); setLast(h); }}
            className="relative flex items-end justify-start overflow-hidden p-3 text-left transition-[flex-grow] duration-500"
            style={{ background: h, flexGrow: hover === i ? 3.2 : 1, flexBasis: 0, color: i < 5 ? "#0a0a0a" : "#fafafa", transitionTimingFunction: "var(--ease)" }}
            aria-label={`灰阶 ${n} ${h}`}
          >
            <div className="whitespace-nowrap">
              <div className="font-mono text-[11px] opacity-60">{n}</div>
              <div className={cn("font-mono text-xs transition-opacity duration-300", hover === i ? "opacity-100" : "opacity-0")}>{h}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-mute">
        <span>悬停展开，点击复制色值</span>
        <span className="inline-flex items-center gap-1 font-mono">{done ? <><Check size={12} /> 已复制 {last}</> : "—"}</span>
      </div>
    </div>
  );
}

function TokenPair() {
  const Panel = ({ cls }: { cls: string }) => (
    <div className={cn(cls, "rounded-xl border border-line2 bg-bg p-5 text-fg")}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">订阅方案</div>
        <Tag>Pro</Tag>
      </div>
      <p className="mt-1 text-xs text-mute">每月 ¥68，随时取消。</p>
      <div className="mt-4 space-y-2">
        {["无限项目", "团队协作", "优先支持"].map((t) => (
          <div key={t} className="flex items-center gap-2 text-[13px]"><Check size={14} />{t}</div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <button className="h-9 flex-1 rounded-lg bg-inv text-[13px] font-medium text-invfg">升级</button>
        <button className="h-9 rounded-lg border border-line2 px-3 text-[13px] text-mute">稍后</button>
      </div>
    </div>
  );
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><Caption>.light</Caption><Panel cls="light" /></div>
        <div><Caption>.dark</Caption><Panel cls="dark" /></div>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-bg">
        <table className="w-full text-left text-xs">
          <thead className="text-dim"><tr className="border-b border-line"><th className="p-3 font-normal">令牌</th><th className="p-3 font-normal">浅色</th><th className="p-3 font-normal">深色</th><th className="p-3 font-normal">用途</th></tr></thead>
          <tbody className="font-mono">
            {[["--bg", "#ffffff", "#0a0a0a", "页面"], ["--soft", "#fafafa", "#0f0f0f", "承载面"], ["--line", "#ebebeb", "#1f1f1f", "分割线"], ["--mute", "#6b6b6b", "#a0a0a0", "次要文字"], ["--fg", "#0a0a0a", "#f4f4f4", "主文字 / 主按钮"]].map((r) => (
              <tr key={r[0]} className="border-b border-line last:border-0">
                <td className="p-3">{r[0]}</td>
                <td className="p-3"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm border border-line2 align-middle" style={{ background: r[1] }} />{r[1]}</td>
                <td className="p-3"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm border border-line2 align-middle" style={{ background: r[2] }} />{r[2]}</td>
                <td className="p-3 font-sans text-mute">{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OnlyOne() {
  const [n, setN] = useState(1);
  const items = ["保存", "分享", "导出", "同步", "邀请", "归档", "发布", "删除"];
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr] md:items-center">
      <div>
        <Range label="强调元素数量" value={n} min={1} max={8} onChange={setN} />
        <p className="mt-4 text-xs text-mute">{n === 1 ? "焦点明确：用户一眼知道下一步。" : n <= 3 ? "仍可接受，但开始分散注意力。" : "到处都是重点，就没有重点。"}</p>
      </div>
      <div className="flex flex-wrap gap-2 rounded-xl border border-line bg-bg p-5">
        {items.map((t, i) => (
          <button key={t} className={cn("h-10 min-w-20 rounded-lg px-4 text-[13px] font-medium transition-all duration-300", i < n ? "bg-inv text-invfg" : "border border-line2 text-mute")}>{t}</button>
        ))}
      </div>
    </div>
  );
}

function ContrastTable() {
  const rows = [["--fg", "#0a0a0a"], ["--mute", "#6b6b6b"], ["--dim", "#a1a1a1"], ["--line2", "#d6d6d6"]];
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg">
      {rows.map(([n, h]) => {
        const c = contrast(h, "#ffffff");
        const aa = c >= 4.5, large = c >= 3;
        return (
          <div key={n} className="flex items-center gap-4 border-b border-line p-4 last:border-0">
            <div className="w-24 font-mono text-xs text-mute">{n}</div>
            <div className="flex-1 text-lg font-medium tracking-tight" style={{ color: h }}>清晰易读的文字 Aa</div>
            <div className="w-16 text-right font-mono text-sm tabular-nums">{c.toFixed(1)}:1</div>
            <div className="flex w-28 justify-end gap-1.5">
              {[["AA", aa], ["大字", large]].map(([t, ok]) => (
                <span key={t as string} className={cn("inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px]", ok ? "border-fg text-fg" : "border-line2 text-dim line-through")}>
                  {ok ? <Check size={10} /> : <X size={10} />}{t as string}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============ 03 字体排版 ============ */
function TypeScale() {
  const [base, setBase] = useState(16);
  const [ratio, setRatio] = useState("1.25");
  const r = +ratio;
  const steps = [3, 2, 1, 0, -1].map((n) => ({ n, size: base * Math.pow(r, n) }));
  const names = ["Display", "Heading", "Title", "Body", "Caption"];
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end gap-6">
        <Seg value={ratio} onChange={setRatio} options={[{ value: "1.125", label: "1.125" }, { value: "1.2", label: "1.2" }, { value: "1.25", label: "1.25" }, { value: "1.333", label: "1.333" }]} />
        <Range className="w-48" label="基准字号" value={base} min={12} max={20} onChange={setBase} fmt={(v) => `${v}px`} />
      </div>
      <div className="divide-y divide-line rounded-xl border border-line bg-bg">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-baseline gap-4 overflow-hidden px-5 py-4">
            <div className="w-20 shrink-0 font-mono text-[11px] text-dim">{names[i]}</div>
            <div className="min-w-0 flex-1 truncate font-medium transition-[font-size] duration-300" style={{ fontSize: s.size, letterSpacing: s.size > 30 ? "-0.03em" : s.size > 20 ? "-0.015em" : 0, lineHeight: 1.2 }}>设计即秩序 Aa 123</div>
            <div className="shrink-0 font-mono text-[11px] text-mute tabular-nums">{s.size.toFixed(1)}px</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeightTrack() {
  const [track, setTrack] = useState(-2);
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {[300, 400, 500, 600, 700].map((w) => (
          <div key={w} className="group rounded-xl border border-line bg-bg p-4 text-center transition-colors hover:border-fg">
            <div className="text-5xl leading-none transition-transform duration-300 group-hover:scale-110" style={{ fontWeight: w }}>永</div>
            <div className="mt-3 font-mono text-[11px] text-dim">{w}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-line bg-bg p-6">
        <Range className="mb-6 max-w-xs" label="字距 letter-spacing" value={track} min={-6} max={12} onChange={setTrack} fmt={(v) => `${(v / 100).toFixed(2)}em`} />
        <div className="overflow-hidden text-5xl font-semibold leading-tight" style={{ letterSpacing: `${track / 100}em` }}>Typography 排版之美</div>
        <div className="mt-2 text-xs text-mute">大标题收紧到 −0.02 ~ −0.04em；小字号与全大写标签放宽到 +0.05 ~ +0.1em。</div>
      </div>
    </div>
  );
}

function CJK() {
  const [size, setSize] = useState(15);
  const [lh, setLh] = useState(1.8);
  const [ls, setLs] = useState(2);
  const [w, setW] = useState(34);
  return (
    <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
      <div className="space-y-5">
        <Range label="字号" value={size} min={12} max={22} onChange={setSize} fmt={(v) => `${v}px`} />
        <Range label="行高" value={lh} min={1.2} max={2.4} step={0.05} onChange={setLh} fmt={(v) => v.toFixed(2)} />
        <Range label="字距" value={ls} min={0} max={10} onChange={setLs} fmt={(v) => `${(v / 100).toFixed(2)}em`} />
        <Range label="行宽" value={w} min={14} max={48} onChange={setW} fmt={(v) => `${v} 字`} />
        <button className="text-xs text-mute underline underline-offset-4 hover:text-fg" onClick={() => { setSize(15); setLh(1.8); setLs(2); setW(34); }}>恢复推荐值</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-bg p-6">
        <div className="text-fg" style={{ fontSize: size, lineHeight: lh, letterSpacing: `${ls / 100}em`, maxWidth: `${w}em` }}>
          <div className="mb-3 text-2xl font-semibold tracking-tight" style={{ lineHeight: 1.3 }}>留白是一种态度</div>
          中文排版与西文不同：方块字天然等宽，笔画密度高，因此需要比西文更大的行高（1.7–1.9）与略微放宽的字距。中英文混排时，在汉字与 Latin 字母、数字之间保留约四分之一个字宽的间距，如 UI Design 与 2025 年。
        </div>
      </div>
    </div>
  );
}

function FontPairs() {
  const items = [
    { n: "无衬线 Sans", f: "var(--font-sans)", d: "清晰、中性，界面与正文的默认选择。", s: "界面是一种语言" },
    { n: "衬线 Serif", f: "var(--font-serif)", d: "典雅、人文，适合标题与长篇阅读。", s: "界面是一种语言" },
    { n: "等宽 Mono", f: "var(--font-mono)", d: "精确、技术感，用于数字、标签与代码。", s: "界面是一种语言" },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((x) => (
        <div key={x.n} className="group flex flex-col rounded-xl border border-line bg-bg p-5 transition-colors hover:border-fg">
          <div className="label">{x.n}</div>
          <div className="my-8 text-3xl leading-tight tracking-tight" style={{ fontFamily: x.f, fontWeight: 500 }}>{x.s}</div>
          <div className="mt-auto text-xs text-mute">{x.d}</div>
        </div>
      ))}
    </div>
  );
}

/* ============ 04 间距 ============ */
function SpacingScale() {
  const steps = [4, 8, 12, 16, 24, 32, 48, 64, 96];
  const [done, copy] = useCopy();
  const [sel, setSel] = useState(16);
  return (
    <div>
      <div className="space-y-1">
        {steps.map((s) => (
          <button key={s} onClick={() => { setSel(s); copy(`${s}px`); }} className="group flex w-full items-center gap-4 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-soft2">
            <span className="w-14 font-mono text-xs text-mute tabular-nums">{s}px</span>
            <span className="w-10 font-mono text-[11px] text-dim">{s / 4}</span>
            <span className="h-3 rounded-sm bg-fg transition-all duration-500 group-hover:opacity-100" style={{ width: s * 3, opacity: sel === s ? 1 : 0.25, transitionTimingFunction: "var(--ease)" }} />
          </button>
        ))}
      </div>
      <div className="mt-3 font-mono text-xs text-mute">{done ? `已复制 ${sel}px` : "点击复制 · 4px 为基准单位"}</div>
    </div>
  );
}

function Proximity() {
  const [inner, setInner] = useState(6);
  const [outer, setOuter] = useState(28);
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="space-y-5">
        <Range label="组内间距" value={inner} min={0} max={32} onChange={setInner} fmt={(v) => `${v}px`} />
        <Range label="组间间距" value={outer} min={0} max={64} onChange={setOuter} fmt={(v) => `${v}px`} />
        <p className="text-xs text-mute">{outer > inner * 2 ? "分组清晰：标签贴近自己的输入框。" : "组内与组间间距接近，关系变得模糊。"}</p>
      </div>
      <div className="mx-auto w-full max-w-sm rounded-xl border border-line bg-bg p-6" style={{ display: "flex", flexDirection: "column", gap: outer }}>
        {[["姓名", "张三"], ["邮箱", "zhang@example.com"], ["简介", "产品设计师"]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", flexDirection: "column", gap: inner }}>
            <label className="text-xs font-medium">{l}</label>
            <div className="h-9 rounded-lg border border-line2 px-3 text-[13px] leading-9 text-mute">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GridOverlay() {
  const [cols, setCols] = useState("12");
  const [gap, setGap] = useState(16);
  const [show, setShow] = useState(true);
  const n = +cols;
  const spans: Record<string, [number, number, string][]> = {
    "4": [[4, 1, "标题"], [2, 1, "A"], [2, 1, "B"]],
    "6": [[6, 1, "标题"], [4, 1, "主内容"], [2, 1, "侧栏"]],
    "12": [[12, 1, "标题"], [8, 1, "主内容"], [4, 1, "侧栏"], [3, 1, "A"], [3, 1, "B"], [3, 1, "C"], [3, 1, "D"]],
  };
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end gap-6">
        <Seg value={cols} onChange={setCols} options={[{ value: "4", label: "4 列" }, { value: "6", label: "6 列" }, { value: "12", label: "12 列" }]} />
        <Range className="w-44" label="列间距" value={gap} min={4} max={32} onChange={setGap} fmt={(v) => `${v}px`} />
        <div className="flex items-center gap-2 text-xs text-mute">显示栅格 <Switch checked={show} onChange={setShow} label="显示栅格" /></div>
      </div>
      <div className="relative rounded-xl border border-line bg-bg p-4">
        {show && (
          <div className="pointer-events-none absolute inset-4 grid" style={{ gridTemplateColumns: `repeat(${n},1fr)`, gap }}>
            {Array.from({ length: n }).map((_, i) => <div key={i} className="bg-fg/[0.06] outline outline-1 -outline-offset-1 outline-fg/10" />)}
          </div>
        )}
        <div className="relative grid" style={{ gridTemplateColumns: `repeat(${n},1fr)`, gap }}>
          {spans[cols].map(([s, , t], i) => (
            <div key={i} className={cn("flex h-14 items-center justify-center rounded-md text-xs transition-all", i === 0 ? "bg-inv text-invfg" : "bg-soft2 text-mute outline outline-1 outline-line2")} style={{ gridColumn: `span ${s}` }}>{t} · {s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Breakpoints() {
  const [w, setW] = useState(720);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const MAX = 960;
  const set = (x: number) => {
    const r = ref.current!.getBoundingClientRect();
    setW(Math.round(Math.min(MAX, Math.max(240, x - r.left))));
  };
  const cols = w < 420 ? 1 : w < 700 ? 2 : 3;
  const bp = w < 420 ? "sm" : w < 700 ? "md" : "lg";
  return (
    <div>
      <div className="mb-3 flex items-center justify-between font-mono text-xs"><span className="text-mute">容器宽度 <span className="text-fg">{w}px</span></span><span className="rounded-md bg-inv px-2 py-0.5 text-invfg">{bp} · {cols} 列</span></div>
      <div ref={ref} className="relative" style={{ height: 230 }}>
        <div className="absolute left-0 top-0 h-full overflow-hidden rounded-xl border border-line bg-bg p-3" style={{ width: Math.min(w, MAX) }}>
          <div className="grid h-full gap-2" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
            {Array.from({ length: cols * 2 }).map((_, i) => <div key={i} className="rounded-md bg-soft2" />)}
          </div>
        </div>
        <div
          role="slider"
          aria-label="拖动调整容器宽度"
          aria-valuenow={w}
          tabIndex={0}
          onPointerDown={(e) => { drag.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); }}
          onPointerMove={(e) => drag.current && set(e.clientX)}
          onPointerUp={() => (drag.current = false)}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") setW((v) => Math.max(240, v - 20)); if (e.key === "ArrowRight") setW((v) => Math.min(MAX, v + 20)); }}
          className="absolute top-0 flex h-full w-4 -translate-x-1/2 cursor-ew-resize touch-none items-center justify-center"
          style={{ left: w }}
        >
          <div className="h-12 w-1.5 rounded-full bg-fg" />
        </div>
      </div>
      <div className="mt-4 flex gap-1 font-mono text-[11px] text-dim">
        {[["sm", "<420"], ["md", "420–700"], ["lg", "≥700"]].map(([k, v]) => (
          <span key={k} className={cn("rounded-md border px-2 py-1", bp === k ? "border-fg text-fg" : "border-line")}>{k} {v}</span>
        ))}
      </div>
    </div>
  );
}

/* ============ 05 圆角 / 层级 ============ */
function NestedRadius() {
  const [outer, setOuter] = useState(28);
  const [pad, setPad] = useState(12);
  const inner = Math.max(0, outer - pad);
  const Demo = ({ r, label }: { r: number; label: string }) => (
    <div>
      <Caption>{label}</Caption>
      <div className="border border-line2 bg-bg" style={{ borderRadius: outer, padding: pad }}>
        <div className="grid h-28 place-items-center bg-inv text-xs text-invfg" style={{ borderRadius: r }}>内 {r}px</div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="mb-6 grid gap-6 sm:grid-cols-2">
        <Range label="外圆角" value={outer} min={0} max={48} onChange={setOuter} fmt={(v) => `${v}px`} />
        <Range label="内边距" value={pad} min={0} max={32} onChange={setPad} fmt={(v) => `${v}px`} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Demo r={outer} label="错误：内 = 外" />
        <Demo r={inner} label={`正确：内 = 外 − 内边距 = ${inner}`} />
      </div>
    </div>
  );
}

function Elevation() {
  const [mode, setMode] = useState<"shadow" | "border">("shadow");
  const L = [
    ["0", "页面", "", "border border-transparent"],
    ["1", "卡片", "0 1px 2px rgb(0 0 0/.04),0 1px 1px rgb(0 0 0/.03)", "border border-line"],
    ["2", "悬浮", "0 2px 4px rgb(0 0 0/.04),0 8px 16px rgb(0 0 0/.06)", "border border-line2"],
    ["3", "菜单", "0 4px 8px rgb(0 0 0/.05),0 16px 32px rgb(0 0 0/.08)", "border border-line2"],
    ["4", "对话框", "0 8px 16px rgb(0 0 0/.06),0 32px 64px rgb(0 0 0/.14)", "border border-fg/40"],
  ];
  return (
    <div>
      <Seg className="mb-6" value={mode} onChange={setMode} options={[{ value: "shadow", label: "阴影表达" }, { value: "border", label: "边框表达" }]} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {L.map(([n, t, s, b]) => (
          <div key={n} className={cn("group rounded-xl bg-bg p-4 transition-all duration-300 hover:-translate-y-1", mode === "border" ? b : "border border-transparent")} style={{ boxShadow: mode === "shadow" ? s : undefined, height: 120 }}>
            <div className="font-mono text-[11px] text-dim">Z · {n}</div>
            <div className="mt-8 text-sm font-medium">{t}</div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-mute">阴影越高越柔、越大、越淡；深色模式下阴影几乎不可见，改用更亮的边框表达层级。</p>
    </div>
  );
}

function Separation() {
  const [m, setM] = useState("space");
  const rows = ["设置", "通知", "隐私", "关于"];
  const wrap: Record<string, string> = { space: "space-y-6", line: "divide-y divide-line", fill: "space-y-1", shadow: "space-y-3" };
  const item: Record<string, string> = { space: "", line: "py-3", fill: "rounded-lg bg-soft2 px-4 py-3", shadow: "rounded-lg bg-bg px-4 py-3 shadow-soft border border-line" };
  return (
    <div>
      <Seg className="mb-6" value={m} onChange={setM} options={[{ value: "space", label: "留白" }, { value: "line", label: "分割线" }, { value: "fill", label: "底色" }, { value: "shadow", label: "阴影" }]} />
      <div className="mx-auto max-w-sm rounded-xl border border-line bg-soft p-5">
        <div className={wrap[m]}>
          {rows.map((r) => (
            <div key={r} className={cn("flex items-center justify-between text-[13px] transition-all", item[m])}>
              <span>{r}</span><ArrowRight size={14} className="text-dim" />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-mute">优先级：留白 &gt; 底色 &gt; 分割线 &gt; 阴影。能用空间表达的就不要加线。</p>
    </div>
  );
}

/* ============ 06 图标 ============ */
const ICONS: [string, any][] = [
  ["search", Search], ["bell", Bell], ["heart", Heart], ["star", Star], ["home", Home], ["user", User], ["users", Users], ["settings", Settings], ["mail", Mail], ["calendar", Calendar], ["camera", Camera], ["cloud", Cloud],
  ["code", Code2], ["copy", Copy], ["download", Download], ["upload", Upload], ["eye", Eye], ["edit", Edit3], ["file", File], ["folder", Folder], ["image", Image], ["link", Link2], ["lock", Lock], ["map", Map],
  ["message", MessageCircle], ["mic", Mic], ["music", Music], ["play", Play], ["pause", Pause], ["plus", Plus], ["minus", Minus], ["share", Share2], ["trash", Trash2], ["zap", Zap], ["bookmark", Bookmark], ["clock", Clock],
  ["globe", Globe], ["layers", Layers], ["layout", Layout], ["menu", Menu], ["moon", Moon], ["sun", Sun], ["palette", Palette], ["pen", Pen], ["phone", Phone], ["printer", Printer], ["refresh", RefreshCw], ["save", Save],
  ["send", Send], ["shield", Shield], ["cart", ShoppingCart], ["smile", Smile], ["sliders", Sliders], ["tag", TagIcon], ["terminal", Terminal], ["thumbs-up", ThumbsUp], ["wifi", Wifi], ["filter", Filter], ["grid", Grid3x3], ["sparkles", Sparkles], ["box", Box], ["command", Command],
];
function IconLib() {
  const [q, setQ] = useState("");
  const [sw, setSw] = useState(1.5);
  const [size, setSize] = useState(22);
  const [last, setLast] = useState("");
  const list = ICONS.filter(([n]) => n.includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-5 grid gap-5 sm:grid-cols-[1fr_180px_180px] sm:items-end">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索图标，如 user / mail" className="h-9 w-full rounded-lg border border-line2 bg-bg pl-9 pr-3 text-[13px] outline-none transition-colors focus:border-fg" />
        </div>
        <Range label="描边" value={sw} min={0.75} max={3} step={0.25} onChange={setSw} />
        <Range label="尺寸" value={size} min={16} max={40} onChange={setSize} fmt={(v) => `${v}px`} />
      </div>
      <div className="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-8 lg:grid-cols-10">
        {list.map(([n, I]) => (
          <button key={n} title={n} onClick={() => { copyText(`<${I.displayName ?? n} />`); setLast(n); }} className="group relative grid aspect-square place-items-center bg-bg transition-colors hover:bg-inv hover:text-invfg">
            <I size={size} strokeWidth={sw} className="transition-transform duration-300 group-hover:scale-110" />
          </button>
        ))}
        {list.length === 0 && <div className="col-span-full bg-bg p-10 text-center text-sm text-mute">没有匹配的图标</div>}
      </div>
      <div className="mt-3 text-xs text-mute">{last ? `已复制 ${last}` : `共 ${list.length} 个 · 点击复制 · 线性图标统一描边，避免与填充混用`}</div>
    </div>
  );
}

function DrawIcons() {
  const [k, setK] = useState(0);
  const S = (d: string, delay = 0.45) => (
    <path key={k + d} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: `draw .5s ${delay}s var(--ease) forwards` }} />
  );
  const items = [
    { t: "成功", p: [S("M7.5 12.5l3 3 6-7")] },
    { t: "失败", p: [S("M8.5 8.5l7 7", 0.4), S("M15.5 8.5l-7 7", 0.55)] },
    { t: "警告", p: [S("M12 7.5v5.5", 0.4), S("M12 16.4v.1", 0.7)] },
    { t: "信息", p: [S("M12 11v5.5", 0.4), S("M12 7.9v.1", 0.7)] },
  ];
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-10 py-4">
        {items.map((it) => (
          <div key={it.t} className="text-center">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
              <circle key={k} cx="12" cy="12" r="9.5" pathLength={1} strokeDasharray={1} strokeDashoffset={1} style={{ animation: "draw .6s var(--ease) forwards" }} />
              {it.p}
            </svg>
            <div className="mt-2 text-xs text-mute">{it.t}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center"><Btn variant="outline" size="sm" onClick={() => setK((x) => x + 1)}><RefreshCw size={13} />重播</Btn></div>
    </div>
  );
}

function Hamburgers() {
  const [open, setOpen] = useState(false);
  const bar = "absolute left-0 h-[1.5px] w-full rounded bg-current transition-all duration-300";
  return (
    <div className="flex flex-wrap items-center justify-center gap-12 py-4">
      {[0, 1, 2].map((v) => (
        <button key={v} aria-expanded={open} aria-label="菜单" onClick={() => setOpen(!open)} className="grid h-14 w-14 place-items-center rounded-xl border border-line2 bg-bg transition-colors hover:bg-soft2">
          {v < 2 ? (
            <span className="relative block h-4 w-6">
              <span className={bar} style={{ top: open ? 7.5 : v === 1 ? 2 : 0, transform: open ? `rotate(${v === 1 ? 0 : 45}deg)` : "none", width: open && v === 1 ? 14 : "100%", left: open && v === 1 ? 10 : 0, transformOrigin: "center" }} />
              <span className={bar} style={{ top: 7.5, opacity: open ? 0 : 1, width: v === 1 && !open ? 16 : "100%" }} />
              <span className={bar} style={{ top: open ? 7.5 : v === 1 ? 13 : 15, transform: open ? `rotate(${v === 1 ? 0 : -45}deg)` : "none", width: open && v === 1 ? 14 : "100%", left: open && v === 1 ? 10 : 0 }} />
              {v === 1 && open && <>
                <span className="absolute left-0 top-[7.5px] h-[1.5px] w-5 origin-left rotate-[40deg] rounded bg-current" />
                <span className="absolute left-0 top-[7.5px] h-[1.5px] w-5 origin-left -rotate-[40deg] rounded bg-current" />
              </>}
            </span>
          ) : (
            <span className="grid grid-cols-3 gap-[3px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-current transition-all duration-300" style={{ transitionDelay: `${(i % 3 + Math.floor(i / 3)) * 30}ms`, transform: open ? (i % 2 ? "scale(0)" : "scale(1.4)") : "none" }} />
              ))}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ============ 07 动效令牌 ============ */
const CURVES: [string, string][] = [
  ["linear", "linear"], ["ease-out", "cubic-bezier(0,0,.2,1)"], ["ease-in-out", "cubic-bezier(.4,0,.2,1)"], ["expo-out", "cubic-bezier(.16,1,.3,1)"], ["spring", "cubic-bezier(.34,1.56,.64,1)"],
];
function curvePath(css: string) {
  if (css === "linear") return "M0,24 L24,0";
  const m = css.match(/\(([^)]+)\)/)![1].split(",").map(Number);
  return `M0,24 C${m[0] * 24},${24 - m[1] * 24} ${m[2] * 24},${24 - m[3] * 24} 24,0`;
}
function EasingRace() {
  const [go, setGo] = useState(false);
  const [n, setN] = useState(0);
  const play = () => { setGo(false); setN((x) => x + 1); requestAnimationFrame(() => requestAnimationFrame(() => setGo(true))); };
  useEffect(() => { const t = setTimeout(play, 400); return () => clearTimeout(t); }, []);
  return (
    <div>
      <div className="space-y-3">
        {CURVES.map(([name, css]) => (
          <div key={name} className="flex items-center gap-4">
            <svg width="28" height="28" viewBox="-2 -2 28 28" fill="none" stroke="currentColor" strokeWidth="1.2" className="shrink-0 text-mute"><rect x="0" y="0" width="24" height="24" className="text-line2" stroke="currentColor" /><path d={curvePath(css)} stroke="var(--fg)" /></svg>
            <div className="w-24 shrink-0 font-mono text-[11px] text-mute">{name}</div>
            <div className="relative h-8 flex-1 rounded-full bg-soft2">
              <div key={n} className="absolute left-1 top-1 h-6 w-6 rounded-full bg-inv" style={{ transform: go ? "translateX(calc(var(--w) - 2rem))" : "none", transition: go ? `transform 1.2s ${css}` : "none", ["--w" as any]: "100%" }} ref={(el) => { if (el?.parentElement) el.style.setProperty("--w", el.parentElement.clientWidth + "px"); }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5"><Btn variant="outline" size="sm" onClick={play}><Play size={13} />再播放一次</Btn></div>
    </div>
  );
}

function Durations() {
  const T = [[100, "微交互", "按钮颜色、图标切换"], [150, "悬停", "hover、焦点环"], [200, "出现", "菜单、提示、对话框"], [300, "移动", "抽屉、底部面板"], [500, "转场", "页面、大型元素"]];
  const [hov, setHov] = useState(-1);
  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-bg">
      {T.map(([ms, n, d], i) => (
        <div key={ms} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(-1)} className="relative flex items-center gap-4 px-5 py-4 transition-colors hover:bg-soft">
          <div className="w-16 font-mono text-sm tabular-nums">{ms}ms</div>
          <div className="w-16 text-[13px] font-medium">{n}</div>
          <div className="hidden flex-1 text-xs text-mute sm:block">{d}</div>
          <div className="relative ml-auto h-1.5 w-40 rounded-full bg-soft2"><div className="h-1.5 rounded-full bg-fg" style={{ width: hov === i ? "100%" : "0%", transition: hov === i ? `width ${ms}ms cubic-bezier(.4,0,.2,1)` : "none" }} /></div>
        </div>
      ))}
    </div>
  );
}

function Stagger() {
  const [n, setN] = useState(0);
  const [gap, setGap] = useState(60);
  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <div className="space-y-5">
        <Range label="交错间隔" value={gap} min={0} max={160} step={10} onChange={setGap} fmt={(v) => `${v}ms`} />
        <Btn variant="outline" size="sm" onClick={() => setN((x) => x + 1)}><RefreshCw size={13} />重播</Btn>
      </div>
      <div key={n + "-" + gap} className="space-y-2">
        {["Dashboard", "Projects", "Messages", "Calendar", "Settings"].map((t, i) => (
          <div key={t} className="flex items-center gap-3 rounded-lg border border-line bg-bg px-4 py-3 text-[13px]" style={{ animation: `fadeUp .5s ${i * gap}ms var(--ease) both` }}>
            <span className="h-2 w-2 rounded-full bg-fg" />{t}<span className="ml-auto font-mono text-[11px] text-dim">+{i * gap}ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============ export ============ */
const B = (b: Block) => b;
export const foundations: Section[] = [
  {
    id: "principles", group: "foundations", title: "设计原则", en: "Principles",
    desc: "在写第一个像素之前，先确定判断标准。十条原则，是后续所有取舍的依据。",
    blocks: [
      B({ id: "p-rules", title: "十条原则", desc: "点击展开。这些原则不是口号，而是评审设计稿时可以直接引用的判断句。", render: () => <Principles /> }),
      B({ id: "p-squint", title: "眯眼测试", desc: "把页面模糊后，依然能看出重点与阅读路径，说明视觉层级是成立的。", tips: ["层级靠大小、重量、对比，而不是靠颜色。", "标题与主按钮应在模糊后仍是最醒目的两处。"], render: () => <SquintTest /> }),
      B({ id: "p-subtract", title: "减法工作台", desc: "依次关闭边框、阴影、图标……观察信息是否仍然完整。能拿掉而不损失信息的，就是噪音。", render: () => <Subtract /> }),
    ],
  },
  {
    id: "color", group: "foundations", title: "色彩系统", en: "Color",
    desc: "黑白灰不是“没有颜色”，而是把所有表达压缩到明度这一条轴上。",
    blocks: [
      B({ id: "c-gray", title: "灰阶", desc: "11 级中性灰承担 95% 的界面。浅端用于面与线，中段用于文字，深端用于主操作。", tips: ["避免纯黑 #000 大面积铺底，使用 #0a0a0a 更柔和。", "相邻两级的明度差保持感知均匀。"], render: () => <GrayScale /> }),
      B({ id: "c-token", title: "语义令牌", desc: "组件只引用语义变量，不引用具体色值。同一份 JSX，在 .dark 作用域里自动换肤。", code: `:root  { --bg:#fff;    --fg:#0a0a0a; --line:#ebebeb }\n.dark  { --bg:#0a0a0a; --fg:#f4f4f4; --line:#1f1f1f }`, render: () => <TokenPair /> }),
      B({ id: "c-one", title: "重点只能有一个", desc: "实心黑色是系统里最重的元素。拖动滑块，感受强调元素变多时“重点”如何消失。", render: () => <OnlyOne /> }),
      B({ id: "c-contrast", title: "文字对比度", desc: "按 WCAG 2.1 计算灰阶文字在白底上的对比度。正文至少 4.5:1，大字 3:1。", tips: ["占位符与禁用态可以低于 4.5:1，但不能低于 2:1。", "dim 灰仅用于装饰性标签与非必要信息。"], render: () => <ContrastTable /> }),
    ],
  },
  {
    id: "type", group: "foundations", title: "字体排版", en: "Typography",
    desc: "界面 90% 是文字。字阶、字重、字距与中文排版细节，决定“高级感”的下限。",
    blocks: [
      B({ id: "t-scale", title: "字阶", desc: "用倍率生成字阶，而不是凭感觉挑数字。切换倍率与基准，观察层级变化。", code: `font-size: calc(1rem * 1.25 ** 2); /* 1.563rem */`, render: () => <TypeScale /> }),
      B({ id: "t-weight", title: "字重与字距", desc: "字重建立层级，字距调节气质。大字收紧、小字放宽。", render: () => <WeightTrack /> }),
      B({ id: "t-cjk", title: "中文排版", desc: "拖动参数，找到舒适的中文阅读设置：行高 1.7–1.9、字距 0.02em、每行 28–38 字。", tips: ["中英文之间留四分之一字宽的间距。", "避免行首出现标点符号（避头尾）。"], render: () => <CJK /> }),
      B({ id: "t-pair", title: "字体性格", desc: "同一句话，三种性格。无衬线负责界面，衬线负责人文，等宽负责精确。", render: () => <FontPairs /> }),
    ],
  },
  {
    id: "space", group: "foundations", title: "间距与栅格", en: "Spacing & Grid",
    desc: "间距是看不见的结构。用 4px 刻度与栅格，让一切对齐并有节奏。",
    blocks: [
      B({ id: "s-scale", title: "间距刻度", desc: "所有 padding / gap / margin 只从刻度里取，不出现 5px、13px 这类“野值”。", render: () => <SpacingScale /> }),
      B({ id: "s-prox", title: "亲密性", desc: "相关的靠近，无关的拉远。调整组内与组间距，观察表单的可读性变化。", render: () => <Proximity /> }),
      B({ id: "s-grid", title: "栅格", desc: "4 / 6 / 12 列自适应栅格，叠加半透明列辅助对齐。", render: () => <GridOverlay /> }),
      B({ id: "s-bp", title: "响应式断点", desc: "拖动右侧手柄改变容器宽度，布局随之重排。按钮可聚焦，支持方向键。", render: () => <Breakpoints /> }),
    ],
  },
  {
    id: "surface", group: "foundations", title: "圆角与层级", en: "Radius & Elevation",
    desc: "形状与深度的语言：圆角要同心，阴影要克制，分隔优先用空间。",
    blocks: [
      B({ id: "r-nest", title: "嵌套圆角", desc: "内圆角 = 外圆角 − 内边距，视觉上两条曲线才会同心。", tips: ["同一界面圆角不超过 3 种：6 / 12 / 16。"], render: () => <NestedRadius /> }),
      B({ id: "r-elev", title: "层级与阴影", desc: "五个海拔层级。切换阴影与边框两种表达方式。", render: () => <Elevation /> }),
      B({ id: "r-sep", title: "四种分隔方式", desc: "同一份列表，四种分隔。留白最轻，阴影最重。", render: () => <Separation /> }),
    ],
  },
  {
    id: "icons", group: "foundations", title: "图标系统", en: "Iconography",
    desc: "图标与文字共享同一条视觉重量。线性、统一描边、24px 网格；不要用表情符号代替图标。",
    blocks: [
      B({ id: "i-lib", title: "线性图标库", desc: "实时调整描边与尺寸，点击复制组件名。", tips: ["尺寸只取 16 / 20 / 24 三档。", "使用 currentColor 继承文字色。", "纯图标按钮必须有 aria-label。"], render: () => <IconLib /> }),
      B({ id: "i-draw", title: "状态图标描边", desc: "SVG 描边动画：圆环先画出，符号随后出现。", code: `<path pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"\n  style="animation: draw .5s forwards" />`, render: () => <DrawIcons /> }),
      B({ id: "i-burger", title: "菜单图标变形", desc: "三种变形：经典叉、箭头、点阵。点击任意一个。", render: () => <Hamburgers /> }),
    ],
  },
  {
    id: "motion", group: "foundations", title: "动效令牌", en: "Motion",
    desc: "统一的时长与缓动，让界面像一个整体在呼吸。",
    blocks: [
      B({ id: "m-ease", title: "缓动对比", desc: "五条曲线同时起跑。进入用 ease-out，位移用 ease-in-out，强调用 spring。", tips: ["退出动画取进入时长的 80%。", "只对 transform 与 opacity 做动画。"], render: () => <EasingRace /> }),
      B({ id: "m-dur", title: "时长阶梯", desc: "悬停每一行，感受 100ms 到 500ms 的差异。", render: () => <Durations /> }),
      B({ id: "m-stagger", title: "交错入场", desc: "列表依次入场，每项延迟 30–60ms，比整体淡入更有层次。", render: () => <Stagger /> }),
    ],
  },
];
