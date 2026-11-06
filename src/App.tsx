import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { groups, sections, flatIds } from "@/content";
import { Sidebar, TopBar, CommandPalette, BackToTop, goTo } from "@/components/Chrome";
import { Hero, Contents, GroupHeader, SectionView, Footer } from "@/components/Sections";

export default function App() {
  const [active, setActive] = useState("top");
  const [progress, setProgress] = useState(0);
  const [menu, setMenu] = useState(false);
  const [egg, setEgg] = useState<null | boolean>(null);
  const els = useRef<HTMLElement[]>([]);
  const raf = useRef(0);

  const compute = useCallback(() => {
    raf.current = 0;
    if (!els.current.length) els.current = flatIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    let cur = "top";
    for (const el of els.current) {
      if (el.getBoundingClientRect().top <= 150) cur = el.id;
      else break;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setActive((p) => (p === cur ? p : cur));
    setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
  }, []);

  useEffect(() => {
    const on = () => { if (!raf.current) raf.current = requestAnimationFrame(compute); };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    compute();
    const ro = new ResizeObserver(on);
    ro.observe(document.body);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); ro.disconnect(); };
  }, [compute]);

  // 初始 hash 定位
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: "start" }), 350);
  }, []);

  // 彩蛋：反色
  useEffect(() => {
    let t: number;
    const h = () => {
      const on = document.documentElement.classList.toggle("invert-egg");
      setEgg(on);
      clearTimeout(t);
      t = window.setTimeout(() => setEgg(null), 2600);
    };
    window.addEventListener("hb:egg", h);
    return () => { window.removeEventListener("hb:egg", h); clearTimeout(t); };
  }, []);

  return (
    <div className="min-h-screen">
      <Sidebar active={active} progress={progress} open={menu} onClose={() => setMenu(false)} />
      <div className="lg:pl-[300px]">
        <TopBar active={active} progress={progress} onMenu={() => setMenu(true)} />
        <main>
          <Hero />
          <Contents />
          {groups.map((g) => (
            <div key={g.id}>
              <GroupHeader g={g} />
              {sections.filter((s) => s.group === g.id).map((s) => <SectionView key={s.id} s={s} />)}
            </div>
          ))}
        </main>
        <Footer />
      </div>
      <CommandPalette />
      <BackToTop progress={progress} />
      <div className={"pointer-events-none fixed inset-x-0 bottom-8 z-[130] flex justify-center transition-all duration-500 " + (egg !== null ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0")}>
        <div className="flex items-center gap-2 rounded-full bg-inv px-4 py-2.5 text-[13px] text-invfg shadow-pop"><Sparkles size={14} />{egg ? "彩蛋已触发 · 反色模式" : "已恢复正常模式"}</div>
      </div>
      <span className="hidden">{goTo.name}</span>
    </div>
  );
}
