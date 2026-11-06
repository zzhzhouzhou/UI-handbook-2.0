import type { ReactNode } from "react";

export type Block = {
  id: string;
  title: string;
  desc: string;
  tips?: string[];
  code?: string;
  render: () => ReactNode;
  /** 去掉预览区的内边距 */
  flush?: boolean;
};

export type Section = {
  id: string;
  group: string;
  title: string;
  en: string;
  desc: string;
  blocks: Block[];
};

export type Group = {
  id: string;
  letter: string;
  title: string;
  en: string;
  desc: string;
};
