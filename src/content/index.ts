import type { Group, Section } from "@/types";
import { foundations } from "./foundations";
import { inputs } from "./inputs";
import { navfeedback } from "./navfeedback";
import { data } from "./data";
import { lab } from "./lab";
import { effects } from "./effects";
import { art } from "./art";
import { games } from "./games";
import { reference } from "./reference";

export const groups: Group[] = [
  { id: "foundations", letter: "A", title: "设计基础", en: "Foundations", desc: "色彩、字体、间距、圆角、图标与动效——所有界面的底层令牌。" },
  { id: "components", letter: "B", title: "界面组件", en: "Components", desc: "按钮、表单、导航、反馈与数据展示：可交互、可键盘操作的组件范式。" },
  { id: "lab", letter: "C", title: "设计实验室", en: "Design Lab", desc: "拖动、调节、导出：把设计决策变成可复制的 CSS。" },
  { id: "effects", letter: "D", title: "高级效果", en: "Advanced Effects", desc: "文字动效、指针与 3D 空间、滚动联动与手势。" },
  { id: "art", letter: "E", title: "艺术设计", en: "Art & Perception", desc: "构图、生成艺术、设计流派与视觉感知——让界面拥有审美。" },
  { id: "games", letter: "F", title: "游戏与彩蛋", en: "Games", desc: "学累了，玩一会儿。每个游戏都是一个交互知识点。" },
  { id: "reference", letter: "G", title: "参考手册", en: "Reference", desc: "检查清单、键盘与无障碍约定、术语表。" },
];

export const sections: Section[] = [...foundations, ...inputs, ...navfeedback, ...data, ...lab, ...effects, ...art, ...games, ...reference];

export const sectionNo = (id: string) => String(sections.findIndex((s) => s.id === id) + 1).padStart(2, "0");
export const blockCount = sections.reduce((a, s) => a + s.blocks.length, 0);

/** 扁平导航目录（顺序 = 页面顺序） */
export const flatIds: string[] = ["top", ...sections.flatMap((s) => [s.id, ...s.blocks.map((b) => b.id)])];

export const lookup = (() => {
  const m = new Map<string, { section: Section; group: Group; blockTitle?: string }>();
  for (const s of sections) {
    const group = groups.find((g) => g.id === s.group)!;
    m.set(s.id, { section: s, group });
    for (const b of s.blocks) m.set(b.id, { section: s, group, blockTitle: b.title });
  }
  return m;
})();
