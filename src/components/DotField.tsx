import { useEffect, useRef } from "react";
import { cssVar } from "@/lib/hooks";

/** 随指针扰动的点阵画布（黑白灰，仅在可视时运行） */
export function DotField({ spacing = 22, radius = 1.4, influence = 140, className = "", opacity = 0.5 }: { spacing?: number; radius?: number; influence?: number; className?: string; opacity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, tx: -9999, ty: -9999 });
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true, t0 = performance.now();
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mouse.current.tx = e.clientX - r.left; mouse.current.ty = e.clientY - r.top; };
    const leave = () => { mouse.current.tx = -9999; mouse.current.ty = -9999; };
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const m = mouse.current;
      m.x += (m.tx - m.x) * 0.14; m.y += (m.ty - m.y) * 0.14;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = cssVar("--fg");
      const time = (t - t0) / 1000;
      for (let y = spacing / 2; y < h; y += spacing) {
        for (let x = spacing / 2; x < w; x += spacing) {
          const dx = x - m.x, dy = y - m.y;
          const d = Math.hypot(dx, dy);
          const k = d < influence ? 1 - d / influence : 0;
          const e = k * k;
          const wave = reduce ? 0 : Math.sin(x * 0.012 + y * 0.01 + time * 0.8) * 0.5 + 0.5;
          const px = x + (dx / (d || 1)) * e * 14;
          const py = y + (dy / (d || 1)) * e * 14;
          ctx.globalAlpha = Math.min(1, (0.12 + wave * 0.18 + e * 0.9) * (opacity / 0.5));
          ctx.beginPath();
          ctx.arc(px, py, radius + e * 2.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", leave); };
  }, [spacing, radius, influence, opacity]);
  return <canvas ref={ref} className={className} />;
}
