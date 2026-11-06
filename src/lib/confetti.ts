const COLORS = ["#6d4aff", "#ff4d8d", "#ffb020", "#22c55e", "#06b6d4", "#f97316", "#ef4444"];

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  vr: number;
  w: number;
  h: number;
  c: string;
  life: number;
  circle: boolean;
}

/** 全屏纸屑，从 (x, y) 向外喷发，结束后自动清理 */
export function confetti(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 140) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  const dpr = window.devicePixelRatio || 1;
  c.width = window.innerWidth * dpr;
  c.height = window.innerHeight * dpr;
  document.body.appendChild(c);
  const ctx = c.getContext("2d")!;
  ctx.scale(dpr, dpr);
  const ps: P[] = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2;
    const s = 4 + Math.random() * 11;
    return {
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 5,
      r: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.4,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 5,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      life: 1,
      circle: Math.random() > 0.7,
    };
  });
  let raf = 0;
  const tick = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = 0;
    for (const p of ps) {
      p.vy += 0.28;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.life -= 0.007;
      if (p.life <= 0 || p.y > window.innerHeight + 20) continue;
      alive++;
      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      if (p.circle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.h / 1.5, 0, Math.PI * 2);
        ctx.fill();
      } else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive) raf = requestAnimationFrame(tick);
    else {
      cancelAnimationFrame(raf);
      c.remove();
    }
  };
  raf = requestAnimationFrame(tick);
}
