import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/* ---------- theme ---------- */
const subs = new Set<() => void>();
let dark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

export function useDark() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => subs.delete(cb);
    },
    () => dark,
    () => false
  );
}

export function setDark(next: boolean, origin?: { x: number; y: number }) {
  const apply = () => {
    dark = next;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("hb-theme", next ? "dark" : "light");
    } catch {}
    subs.forEach((f) => f());
  };
  const doc = document as any;
  if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    apply();
    return;
  }
  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? 0;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const t = doc.startViewTransition(apply);
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
    );
  });
}

export function toggleTheme(e?: { clientX: number; clientY: number }) {
  setDark(!dark, e ? { x: e.clientX, y: e.clientY } : undefined);
}

export function cssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ---------- misc hooks ---------- */
export function useInView<T extends Element>(opts: { margin?: string; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          if (opts.once) io.disconnect();
        } else if (!opts.once) setInView(false);
      },
      { rootMargin: opts.margin ?? "0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opts.margin, opts.once]);
  return [ref, inView] as const;
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch {}
    ta.remove();
  }
}

export function useCopy(timeout = 1400) {
  const [done, setDone] = useState(false);
  const t = useRef<number>(0);
  const copy = useCallback(
    (text: string) => {
      copyText(text);
      setDone(true);
      clearTimeout(t.current);
      t.current = window.setTimeout(() => setDone(false), timeout);
    },
    [timeout]
  );
  return [done, copy] as const;
}

export function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV] as const;
}

export function useClickOutside<T extends HTMLElement>(cb: () => void, active = true) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!active) return;
    const h = (e: MouseEvent) => {
      const t = e.target as Node;
      // 浮层用 Portal 挂在 body 下，不在锚点 ref 内；点击浮层内部不应算「点击外部」
      if (ref.current && !ref.current.contains(t) && !(t instanceof Element && t.closest("[data-floating]"))) cb();
    };
    const k = (e: KeyboardEvent) => e.key === "Escape" && cb();
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("keydown", k);
    };
  }, [cb, active]);
  return ref;
}

export function useInterval(cb: () => void, ms: number | null) {
  const saved = useRef(cb);
  saved.current = cb;
  useEffect(() => {
    if (ms == null) return;
    const id = setInterval(() => saved.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
