import { useEffect, useState } from "react";
import { Check, Search, Plus } from "lucide-react";
import type { Section } from "@/types";
import { Kbd, Seg } from "@/components/ui";
import { cn } from "@/utils/cn";
import { useLocal } from "@/lib/hooks";

const LISTS: [string, string[]][] = [
  ["视觉", ["字号层级不超过 6 级", "间距全部来自 4px 刻度", "同一页面圆角不超过 3 种", "强调色（黑）占比 < 10%", "深色模式单独检查过阴影与边框"]],
  ["交互", ["所有可点击元素有 hover / active / focus 态", "触控目标 ≥ 44px", "加载中有反馈，且按钮宽度不抖动", "危险操作可撤销或二次确认", "空状态、错误状态、加载状态都有设计"]],
  ["无障碍", ["正文对比度 ≥ 4.5:1", "只用键盘能完成所有操作", "图标按钮有 aria-label", "表单控件都有关联的 label", "尊重 prefers-reduced-motion"]],
  ["性能", ["动画只用 transform / opacity", "图片有尺寸占位，避免布局抖动", "长列表使用虚拟滚动", "首屏之外的组件懒加载", "字体使用 font-display: swap"]],
];
function Checklist() {
  const [done, setDone] = useLocal<string[]>("hb-check", []);
  const total = LISTS.reduce((a, b) => a + b[1].length, 0);
  const p = done.length / total;
  const R = 34, C = 2 * Math.PI * R;
  return (
    <div className="grid gap-8 md:grid-cols-[160px_1fr]">
      <div className="text-center">
        <div className="relative mx-auto grid h-28 w-28 place-items-center"><svg width="112" height="112" viewBox="0 0 80 80" className="-rotate-90"><circle cx="40" cy="40" r={R} fill="none" stroke="var(--line2)" strokeWidth="3" /><circle cx="40" cy="40" r={R} fill="none" stroke="var(--fg)" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ transition: "stroke-dashoffset .6s var(--ease)" }} /></svg><div className="absolute font-mono text-2xl tabular-nums">{Math.round(p * 100)}<span className="text-sm text-dim">%</span></div></div>
        <div className="mt-3 text-xs text-mute">{done.length} / {total} 已达标</div>
        <button className="mt-2 text-xs text-mute underline underline-offset-4 hover:text-fg" onClick={() => setDone([])}>重置</button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {LISTS.map(([g, items]) => (
          <div key={g}>
            <div className="label mb-3">{g}</div>
            <div className="space-y-1">
              {items.map((t) => { const on = done.includes(t); return (
                <button key={t} onClick={() => setDone(on ? done.filter((x) => x !== t) : [...done, t])} className="group flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left text-[13px] transition-colors hover:bg-soft2">
                  <span className={cn("mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition-all", on ? "border-fg bg-inv text-invfg" : "border-line2")}>{on && <Check size={11} strokeWidth={3} />}</span>
                  <span className={cn("transition-colors", on ? "text-dim line-through" : "")}>{t}</span>
                </button>); })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TERMS: [string, string, string, string][] = [
  ["可供性", "Affordance", "基础", "元素通过外观暗示“可以如何使用”，比如按钮的凸起感。"],
  ["设计令牌", "Design Token", "基础", "把颜色、间距、字体等设计决策抽象成可复用的变量。"],
  ["视觉层级", "Visual Hierarchy", "基础", "通过大小、对比、位置引导阅读顺序。"],
  ["亲密性", "Proximity", "基础", "相关元素靠近，无关元素拉远。"],
  ["留白", "Whitespace", "基础", "元素之间的空白，用于分组、呼吸与聚焦。"],
  ["栅格", "Grid System", "基础", "用等分列与间距约束布局，使页面对齐并有节奏。"],
  ["拟物", "Skeuomorphism", "风格", "模仿现实物体的质感，如皮革、玻璃、阴影。"],
  ["新拟态", "Neumorphism", "风格", "同色背景上用明暗双阴影塑造的柔和凸起 / 凹陷。"],
  ["毛玻璃", "Glassmorphism", "风格", "半透明 + 背景模糊，营造层叠感。"],
  ["粗野主义", "Brutalism", "风格", "裸露结构、硬阴影、粗边框的反装饰风格。"],
  ["瑞士风格", "Swiss Style", "风格", "网格、无衬线、不对称的国际主义平面设计。"],
  ["微交互", "Microinteraction", "交互", "单一用途的小型反馈动画，如点赞、开关。"],
  ["骨架屏", "Skeleton", "交互", "用内容轮廓占位，减轻等待感。"],
  ["渐进披露", "Progressive Disclosure", "交互", "只在需要时展示更多信息，降低认知负荷。"],
  ["费茨定律", "Fitts's Law", "交互", "目标越大、越近，点击越快。"],
  ["希克定律", "Hick's Law", "交互", "选项越多，决策时间越长。"],
  ["焦点环", "Focus Ring", "无障碍", "键盘聚焦时显示的轮廓，指示当前位置。"],
  ["读屏", "Screen Reader", "无障碍", "把界面内容转为语音的辅助技术。"],
  ["对比度", "Contrast Ratio", "无障碍", "前景与背景亮度之比，WCAG 规定了最低值。"],
  ["回流", "Reflow", "性能", "布局变化导致浏览器重新计算几何信息。"],
  ["合成层", "Compositing", "性能", "transform / opacity 在合成器中处理，不触发回流。"],
  ["光学校正", "Optical Alignment", "艺术", "为抵消视觉错觉而对几何尺寸做的微调。"],
  ["格式塔", "Gestalt", "艺术", "接近、相似、闭合、连续等视觉组织原则。"],
  ["黄金分割", "Golden Ratio", "艺术", "1 : 1.618 的比例，常用于构图与版式。"],
];
function Glossary() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("全部");
  const cats = ["全部", ...Array.from(new Set(TERMS.map((t) => t[2])))];
  const list = TERMS.filter((t) => (cat === "全部" || t[2] === cat) && (t[0] + t[1] + t[3]).toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="relative w-full max-w-xs"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索术语…" className="h-9 w-full rounded-lg border border-line2 bg-bg pl-9 pr-3 text-[13px] outline-none focus:border-fg" /></div>
        <div className="no-scrollbar max-w-full overflow-x-auto"><Seg size="sm" value={cat} onChange={setCat} options={cats.map((c) => ({ value: c, label: c }))} /></div>
      </div>
      <div className="divide-y divide-line border-y border-line">
        {list.map(([zh, en, c, d]) => (
          <div key={en} className="group grid gap-1 py-4 transition-colors sm:grid-cols-[200px_1fr_70px] sm:gap-6">
            <div><div className="font-medium transition-transform duration-300 group-hover:translate-x-1">{zh}</div><div className="font-mono text-[11px] text-dim">{en}</div></div>
            <div className="text-[13px] text-mute">{d}</div>
            <div className="label sm:text-right">{c}</div>
          </div>
        ))}
        {!list.length && <div className="py-12 text-center text-sm text-mute">没有匹配的术语</div>}
      </div>
    </div>
  );
}

function KeyViz() {
  const [k, setK] = useState<{ key: string; code: string; n: number } | null>(null);
  const [hist, setHist] = useState<string[]>([]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement).tagName)) return;
      setK({ key: e.key === " " ? "Space" : e.key, code: e.code, n: Date.now() });
      setHist((x) => [e.key === " " ? "␣" : e.key.length > 5 ? e.key.slice(0, 3) : e.key, ...x].slice(0, 12));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  return (
    <div className="grid place-items-center gap-6 py-6">
      <div key={k?.n} className="anim-scale-in grid h-28 min-w-28 place-items-center rounded-2xl border border-fg border-b-[6px] bg-bg px-6 text-4xl font-semibold tracking-tight">{k ? k.key : "按任意键"}</div>
      <div className="font-mono text-xs text-mute">{k ? `code: ${k.code}` : "在页面任意位置按下键盘"}</div>
      <div className="flex h-7 gap-1.5">{hist.map((h, i) => <span key={i} className="kbd" style={{ opacity: 1 - i * 0.08 }}>{h}</span>)}</div>
    </div>
  );
}

function KeyTable() {
  const R: [string[], string, string][] = [
    [["Tab"], "所有可聚焦元素", "按 DOM 顺序移动焦点；Shift+Tab 反向"],
    [["Enter"], "按钮 / 链接", "触发"],
    [["Space"], "按钮 / 复选 / 开关", "触发 / 切换"],
    [["←", "→"], "标签页 / 单选组", "移动并选中（roving tabindex）"],
    [["↑", "↓"], "菜单 / 列表框 / 下拉", "导航选项"],
    [["Esc"], "对话框 / 菜单 / 弹层", "关闭，焦点回到触发器"],
    [["Home", "End"], "列表 / 滑块", "跳到首 / 尾"],
    [["⌘", "K"], "命令面板", "全局唤起"],
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-bg">
      {R.map(([k, a, b], i) => <div key={i} className="grid items-center gap-2 border-b border-line px-4 py-3 text-[13px] last:border-0 sm:grid-cols-[130px_200px_1fr] sm:gap-4"><div className="flex gap-1">{k.map((x) => <Kbd key={x}>{x}</Kbd>)}</div><div className="font-medium">{a}</div><div className="text-mute">{b}</div></div>)}
    </div>
  );
}

function TouchTarget() {
  const [hits, setHits] = useState<Record<number, number>>({});
  const S = [[24, "太小", "桌面最小"], [32, "桌面", "桌面推荐"], [44, "iOS", "Apple HIG"], [48, "Material", "Material 推荐"]] as [number, string, string][];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-center gap-10 rounded-xl border border-line bg-bg py-10">
        {S.map(([s, n]) => (
          <div key={s} className="text-center">
            <div className="relative mx-auto grid place-items-center" style={{ width: 56, height: 56 }}>
              <span className="absolute rounded-full border border-dashed border-fg/40" style={{ width: 44, height: 44 }} />
              <button onClick={() => setHits({ ...hits, [s]: (hits[s] ?? 0) + 1 })} aria-label={`${s}px 按钮`} className="relative grid place-items-center rounded-lg bg-inv text-invfg transition-transform active:scale-90" style={{ width: s, height: s }}><Plus size={Math.min(16, s / 2)} /></button>
            </div>
            <div className="mt-3 font-mono text-xs">{s}px</div>
            <div className="text-[11px] text-dim">{n} · 点击 {hits[s] ?? 0}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-mute">虚线圆 = 44px 指腹大小。试着去“点”最小的按钮，感受误触。</p>
    </div>
  );
}

export const reference: Section[] = [
  {
    id: "checklist", group: "reference", title: "上线检查清单", en: "Checklist",
    desc: "交付前过一遍。勾选记录会保存在本地，下次打开仍然在。",
    blocks: [{ id: "ck-list", title: "20 项自检", desc: "视觉、交互、无障碍、性能四个维度。", render: () => <Checklist /> }],
  },
  {
    id: "a11y", group: "reference", title: "键盘与无障碍", en: "Keyboard & A11y",
    desc: "只用键盘能完成的界面，对所有人都更好用。",
    blocks: [
      { id: "k-table", title: "键盘行为速查", desc: "每一类组件的标准键盘约定。", render: () => <KeyTable /> },
      { id: "k-viz", title: "按键可视化", desc: "在页面上按下任意键，查看 key 与 code。", render: () => <KeyViz /> },
      { id: "k-touch", title: "触控目标", desc: "四种尺寸的按钮对比。", render: () => <TouchTarget /> },
    ],
  },
  {
    id: "glossary", group: "reference", title: "设计术语表", en: "Glossary",
    desc: "24 个常用术语，支持搜索与分类过滤。",
    blocks: [{ id: "gl-list", title: "术语", desc: "中英对照，附一句话释义。", render: () => <Glossary /> }],
  },
];
