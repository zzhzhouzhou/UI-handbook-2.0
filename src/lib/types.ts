import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

export type Level = "基础" | "进阶" | "高级";

export interface Item {
  id: string;
  title: string;
  en: string;
  level: Level;
  /** 2.0 新增 */
  isNew?: boolean;
  /** 用途 · 什么时候用 */
  desc: string;
  points?: string[];
  a11y?: string[];
  mistakes?: string[];
  code: string;
  demo: ComponentType;
  /** 预览区不加内边距（画布、背景类 demo） */
  bare?: boolean;
  /** 预览区最小高度 */
  h?: number;
  tags?: string[];
}

export interface Section {
  id: string;
  title: string;
  en: string;
  blurb: string;
  icon: LucideIcon;
  group: string;
  items: Item[];
  /** 渐变色相 */
  hue: number;
}

export const item = (i: Item) => i;
