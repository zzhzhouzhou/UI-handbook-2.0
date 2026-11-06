import { useState } from "react";
import { ArrowRight, ArrowDownRight, Link2, Check, Code2, ArrowUp } from "lucide-react";
import type { Block, Group, Section } from "@/types";
import { groups, sections, sectionNo, blockCount } from "@/content";
import { CodeOut } from "@/content/lab";
import { DotField } from "@/components/DotField";
import { Btn, Kbd, useCountUp } from "@/components/ui";
import { Logo, goTo } from "@/components/Chrome";
import { useCopy, useInView } from "@/lib/hooks";
import { cn } from "@/utils/cn";

const wrap = "mx-auto w-full max-w-[1040px] px-6 sm:px-10";

/* =============== Hero =============== */
function Stat({ n, label, run, suffix = "" }: { n: number; label: string; run: boolean; suffix?: string }) {
  const v = useCountUp(n, run, 1600);
  return (
    <div className="border-l border-line px-5 py-6 first:border-l-0 sm:px-8">
      <div className="font-mono text-3xl font-medium tabular-nums tracking-tight sm:text-4xl">{Math.round(v)}{suffix}</div>
      <div className="mt-1 text-xs text-mute">{label}</div>
    </div>
  );
}

export function Hero() {
  const [ref, inV] = useInView<HTMLDivElement>({ once: true });
  const d = (n: number) => ({ animationDelay: `${n}ms` });
  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-line">
      <DotField className="absolute inset-0 -z-10 h-full w-full" spacing={24} influence={150} />
      <div className="pointer-events-none absolute inset-0 -z-10" style={{ background: "radial-gradient(ellipse 70% 60% at 30% 40%, transparent 0%, var(--bg) 100%)" }} />
      <div className={cn(wrap, "pb-20 pt-20 sm:pt-28")}>
        <div className="anim-fade-up label flex items-center gap-3" style={d(0)}><span className="h-px w-10 bg-fg" />UI Handbook · Version 2.0</div>
        <h1 className="anim-fade-up mt-8 text-[clamp(72px,15vw,184px)] font-semibold leading-[.88] tracking-[-0.055em]" style={d(80)}>形色场</h1>
        <div className="anim-fade-up text-outline mt-3 text-[clamp(34px,7vw,92px)] font-semibold leading-none tracking-[-0.035em]" style={d(160)}>UI Handbook</div>
        <p className="anim-fade-up mt-10 max-w-[44ch] text-[17px] leading-relaxed text-mute" style={d(260)}>一本可以动手的 UI 设计手册。从设计令牌到高级交互，从组件范式到艺术构成——全部用黑、白、灰完成。</p>
        <div className="anim-fade-up mt-10 flex flex-wrap items-center gap-3" style={d(340)}>
          <Btn size="lg" onClick={() => goTo("principles")}>开始阅读<ArrowDownRight size={16} /></Btn>
          <Btn size="lg" variant="outline" onClick={() => window.dispatchEvent(new Event("hb:cmd"))}>快速跳转<span className="ml-1 flex gap-1"><Kbd>⌘</Kbd><Kbd>K</Kbd></span></Btn>
        </div>
      </div>

      <div ref={ref} className="border-t border-line bg-bg/70 backdrop-blur-sm">
        <div className={cn(wrap, "grid grid-cols-2 sm:grid-cols-4")}>
          <Stat n={groups.length} label="个部分" run={inV} />
          <Stat n={sections.length} label="个章节" run={inV} />
          <Stat n={blockCount} label="个可交互示例" run={inV} />
          <Stat n={0} label="个 UI 组件库" run={inV} />
        </div>
      </div>
    </section>
  );
}

/* =============== Contents index =============== */
export function Contents() {
  return (
    <section className={cn(wrap, "py-20")}>
      <div className="flex items-end justify-between"><h2 className="text-2xl font-semibold tracking-tight">目录</h2><span className="label">Contents</span></div>
      <div className="mt-8 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => {
          const ss = sections.filter((s) => s.group === g.id);
          return (
            <button key={g.id} onClick={() => goTo("g-" + g.id)} className="group relative flex min-h-48 flex-col justify-between overflow-hidden border-b border-r border-line p-6 text-left transition-colors duration-300 hover:bg-inv hover:text-invfg">
              <div className="flex items-start justify-between"><span className="font-mono text-xs opacity-50">PART {g.letter}</span><ArrowRight size={16} className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" /></div>
              <div>
                <div className="text-2xl font-semibold tracking-tight">{g.title}</div>
                <div className="mt-1 text-xs opacity-60">{ss.length} 章 · {ss.reduce((a, s) => a + s.blocks.length, 0)} 个示例</div>
                <div className="mt-3 line-clamp-1 text-xs opacity-0 transition-opacity duration-300 group-hover:opacity-60">{ss.map((s) => s.title).join(" · ")}</div>
              </div>
            </button>
          );
        })}
        <div className="grid min-h-48 place-items-center border-b border-r border-line p-6 text-center text-xs text-dim"><div><Logo size={32} /><div className="mt-3 font-mono uppercase tracking-[.14em]">Black · White · Grey</div></div></div>
      </div>
    </section>
  );
}

/* =============== Group header =============== */
export function GroupHeader({ g }: { g: Group }) {
  const [ref, inV] = useInView<HTMLElement>({ once: true, margin: "-10% 0px" });
  const n = sections.filter((s) => s.group === g.id).length;
  return (
    <section id={"g-" + g.id} ref={ref} className="relative scroll-mt-14 overflow-hidden border-t border-fg">
      <div className={cn(wrap, "relative py-20 sm:py-28")}>
        <div className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none text-outline font-semibold leading-none opacity-30 transition-all duration-1000" style={{ fontSize: "clamp(180px, 30vw, 360px)", transform: `translateY(-50%) translateX(${inV ? 0 : 60}px)`, opacity: inV ? 0.3 : 0 }}>{g.letter}</div>
        <div className={cn("relative transition-all duration-700", inV ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}>
          <div className="label flex items-center gap-3"><span className="h-px w-8 bg-fg" />Part {g.letter} · {n} 章</div>
          <h2 className="mt-5 text-[clamp(44px,8vw,96px)] font-semibold leading-none tracking-[-0.045em]">{g.title}</h2>
          <div className="mt-2 text-[clamp(18px,2.4vw,28px)] font-light tracking-tight text-dim">{g.en}</div>
          <p className="mt-6 max-w-[46ch] text-[15px] text-mute">{g.desc}</p>
        </div>
      </div>
    </section>
  );
}

/* =============== Block =============== */
function BlockView({ b, no }: { b: Block; no: string }) {
  const [ref, inV] = useInView<HTMLElement>({ once: true, margin: "0px 0px -8% 0px" });
  const [done, copy] = useCopy();
  const [code, setCode] = useState(false);
  return (
    <article id={b.id} ref={ref} className={cn("reveal scroll-mt-24 border-t border-line py-12", inV && "in")}>
      <header className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="label flex items-center gap-2"><span>{no}</span><span className="h-px w-4 bg-line2" /></div>
          <h3 className="mt-2 text-[22px] font-semibold tracking-tight">{b.title}</h3>
          <p className="mt-2 max-w-[62ch] text-[14px] text-mute">{b.desc}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {b.code && <button aria-label="查看代码" aria-pressed={code} onClick={() => setCode(!code)} className={cn("grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-soft2", code ? "bg-soft2 text-fg" : "text-dim hover:text-fg")}><Code2 size={15} /></button>}
          <button aria-label="复制链接" onClick={() => copy(location.origin + location.pathname + "#" + b.id)} className="grid h-8 w-8 place-items-center rounded-lg text-dim transition-colors hover:bg-soft2 hover:text-fg">{done ? <Check size={15} /> : <Link2 size={15} />}</button>
        </div>
      </header>
      <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-soft">
        <div className={cn("stage-dots", b.flush ? "" : "p-5 sm:p-8")}><div className="relative">{b.render()}</div></div>
      </div>
      {b.code && <div className={cn("grid transition-[grid-template-rows,margin] duration-300", code ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]")}><div className="overflow-hidden"><CodeOut code={b.code} /></div></div>}
      {b.tips && (
        <ul className="mt-6 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
          {b.tips.map((t) => <li key={t} className="flex gap-3 text-[13px] text-mute"><span className="mt-[9px] h-1 w-1 shrink-0 bg-fg" />{t}</li>)}
        </ul>
      )}
    </article>
  );
}

/* =============== Section =============== */
export function SectionView({ s }: { s: Section }) {
  const no = sectionNo(s.id);
  return (
    <section id={s.id} className={cn(wrap, "scroll-mt-14 pb-10 pt-20")}>
      <header className="mb-8">
        <div className="flex items-center gap-4"><span className="grid h-7 min-w-7 place-items-center rounded-md bg-inv px-1.5 font-mono text-[11px] font-medium text-invfg">{no}</span><span className="label">{s.en}</span></div>
        <h2 className="mt-5 text-[clamp(34px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.035em]">{s.title}</h2>
        <p className="mt-4 max-w-[56ch] text-[16px] text-mute">{s.desc}</p>
      </header>
      {s.blocks.map((b, i) => <BlockView key={b.id} b={b} no={`${no}.${String(i + 1).padStart(2, "0")}`} />)}
    </section>
  );
}

/* =============== Footer =============== */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-fg">
      <div className={cn(wrap, "py-20")}>
        <div className="text-[clamp(56px,13vw,160px)] font-semibold leading-[.9] tracking-[-0.055em]">形色场</div>
        <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="max-w-[44ch] text-[14px] text-mute">少，但是更好。谢谢你读到这里。</div>
          <button onClick={() => goTo("top")} className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-line2 px-5 text-[13px] transition-colors hover:bg-inv hover:text-invfg"><ArrowUp size={14} />回到顶部</button>
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-[.14em] text-dim"><span>UI Handbook 2.0</span><span>Black · White · Grey</span><span>{sections.length} Chapters / {blockCount} Demos</span></div>
      </div>
    </footer>
  );
}
