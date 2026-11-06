import type { Item, Section } from "./lib/types";
import { foundations } from "./sections/foundations";
import { basic } from "./sections/basic";
import { forms } from "./sections/forms";
import { nav } from "./sections/nav";
import { feedback } from "./sections/feedback";
import { data } from "./sections/data";
import { pointer } from "./sections/pointer";
import { motion } from "./sections/motion";
import { lab } from "./sections/lab";
import { play } from "./sections/play";
import { standards, patterns } from "./sections/guides";

export const sections: Section[] = [foundations, basic, forms, nav, feedback, data, pointer, motion, lab, play, standards, patterns];

export interface FlatItem extends Item {
  sectionId: string;
  sectionTitle: string;
  index: number;
}

export const allItems: FlatItem[] = sections.flatMap((s) =>
  s.items.map((it, index) => ({ ...it, sectionId: s.id, sectionTitle: s.title, index }))
);

export const itemMap = new Map(allItems.map((i) => [i.id, i]));
export const sectionMap = new Map(sections.map((s) => [s.id, s]));

export const groups: { name: string; sections: Section[] }[] = [];
sections.forEach((s) => {
  const g = groups.find((x) => x.name === s.group);
  if (g) g.sections.push(s);
  else groups.push({ name: s.group, sections: [s] });
});

export const stats = {
  total: allItems.length,
  chapters: sections.length,
  fresh: allItems.filter((i) => i.isNew).length,
};
