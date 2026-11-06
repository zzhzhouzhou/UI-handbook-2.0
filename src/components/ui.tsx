import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode, type RefObject, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

/* ---------- Button ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "soft" | "danger" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
};
const V = {
  primary: "bg-inv text-invfg hover:opacity-80",
  outline: "border border-line2 bg-bg hover:bg-soft2",
  ghost: "hover:bg-soft2",
  soft: "bg-soft2 hover:bg-line",
  danger: "border border-fg text-fg hover:bg-inv hover:text-invfg",
  link: "underline underline-offset-4 decoration-line2 hover:decoration-fg px-0",
};
const S = { sm: "h-8 px-3 text-xs", md: "h-9 px-4 text-[13px]", lg: "h-11 px-6 text-sm", icon: "h-9 w-9" };
export function Btn({ variant = "primary", size = "md", loading, className, children, disabled, ...p }: BtnProps) {
  return (
    <button
      {...p}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg align-middle font-medium transition-[background,color,border-color,opacity,transform] duration-150 active:scale-[.97] disabled:pointer-events-none disabled:opacity-40",
        V[variant],
        S[size],
        className
      )}
    >
      {loading && <Loader2 size={14} className="animate-[spin_0.8s_linear_infinite]" />}
      {children}
    </button>
  );
}

/* ---------- Segmented control (sliding thumb) ---------- */
export function Seg<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
}: {
  options: { value: T; label?: ReactNode; icon?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md";
  className?: string;
}) {
  const i = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div
      role="tablist"
      className={cn("relative inline-grid rounded-lg bg-soft2 p-[3px] align-middle", className)}
      style={{ gridTemplateColumns: `repeat(${options.length},1fr)` }}
    >
      <span
        className="absolute bottom-[3px] top-[3px] rounded-md bg-bg shadow-[0_0_0_1px_var(--line2),0_1px_2px_rgb(0_0_0/.06)] transition-transform duration-300"
        style={{
          left: 3,
          width: `calc((100% - 6px) / ${options.length})`,
          transform: `translateX(${i * 100}%)`,
          transitionTimingFunction: "var(--spring)",
        }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          onClick={() => onChange(o.value)}
          className={cn(
            "relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors",
            size === "sm" ? "h-7 px-3 text-xs" : "h-8 px-4 text-[13px]",
            o.value === value ? "text-fg" : "text-mute hover:text-fg"
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Range with label ---------- */
export function Range({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  fmt,
  className,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  fmt?: (v: number) => string;
  className?: string;
}) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className={cn("block", className)}>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-mute">{label}</span>
        <span className="font-mono text-fg tabular-nums">{fmt ? fmt(value) : value}</span>
      </div>
      <input
        type="range"
        className="rng"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--p": `${p}%` } as CSSProperties}
        onChange={(e) => onChange(+e.target.value)}
      />
    </label>
  );
}

/* ---------- Switch ---------- */
export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label?: string; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-[38px] shrink-0 rounded-full align-middle transition-colors duration-200 disabled:opacity-40",
        checked ? "bg-inv" : "bg-line2"
      )}
    >
      <span
        className={cn("absolute left-[3px] top-[3px] h-4 w-4 rounded-full bg-bg shadow transition-transform duration-300", checked && "translate-x-4")}
        style={{ transitionTimingFunction: "var(--spring)" }}
      />
    </button>
  );
}

/* ---------- Floating layer (portal) ---------- */
/**
 * 下拉/弹出面板统一挂到 document.body，用 fixed 跟随锚点定位。
 * 预览容器带 overflow-hidden，原先的 absolute 面板会被裁进预览框里，
 * 并且受祖先层叠上下文压制（z-20 出不去）。Portal 后这两点都消失，
 * 面板自身的样式、尺寸与阴影保持原样，不改变设计风格。
 */
export function Floating({
  anchor,
  open,
  children,
  matchWidth = false,
  align = "left",
  gap = 8,
  className,
}: {
  anchor: RefObject<HTMLElement | null>;
  open: boolean;
  children: ReactNode;
  matchWidth?: boolean;
  align?: "left" | "right";
  gap?: number;
  className?: string;
}) {
  const [pos, setPos] = useState<{ left: number; top: number; width?: number; flip: boolean } | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = anchor.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const below = window.innerHeight - r.bottom;
      // 下方空间不够且上方更宽裕时向上翻转，避免面板落到视口外
      const flip = below < 200 && r.top > below + 60;
      setPos({
        left: align === "right" ? r.right : r.left,
        top: flip ? r.top - gap : r.bottom + gap,
        width: matchWidth ? r.width : undefined,
        flip,
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    return () => {
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [open, anchor, align, gap, matchWidth]);

  if (!open || !pos || typeof document === "undefined") return null;
  return createPortal(
    <div
      data-floating
      className={cn("fixed z-[90] anim-scale-in", align === "right" && "-translate-x-full", pos.flip && "-translate-y-full", className)}
      style={{ left: pos.left, top: pos.top, width: pos.width }}
    >
      {children}
    </div>,
    document.body
  );
}

/* ---------- misc ---------- */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border border-line2 px-1.5 py-0.5 font-mono text-[11px] text-mute", className)}>
      {children}
    </span>
  );
}

export function Card({ children, className, ...p }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...p} className={cn("rounded-xl border border-line bg-bg", className)}>
      {children}
    </div>
  );
}

export function Row({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>;
}

export function Caption({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("label mb-3", className)}>{children}</div>;
}

/** 复制代码块 */
export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <pre className={cn("overflow-x-auto rounded-lg border border-line bg-bg p-3 text-[12px] leading-relaxed text-mute", className)}>{children}</pre>;
}

/** 数值动画 */
export function useCountUp(target: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(target * (1 - Math.pow(1 - p, 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}

/** 在可视时运行 rAF 循环 */
export function useLoop(cb: (t: number, dt: number) => void, active: boolean) {
  const saved = useRef(cb);
  saved.current = cb;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const f = (t: number) => {
      saved.current(t, Math.min(64, t - last));
      last = t;
      raf = requestAnimationFrame(f);
    };
    raf = requestAnimationFrame(f);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}
