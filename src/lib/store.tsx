import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocalStorage } from "./hooks";

type Theme = "light" | "dark";
export type FontKey = "sans" | "serif" | "mono";

export interface ToastMsg {
  id: number;
  text: string;
}

interface Ctx {
  theme: Theme;
  toggleTheme: (e?: { clientX: number; clientY: number }) => void;
  hue: number;
  setHue: (n: number) => void;
  radius: number;
  setRadius: (n: number) => void;
  font: FontKey;
  setFont: (f: FontKey) => void;
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  learned: string[];
  toggleLearned: (id: string) => boolean;
  lastVisited: string | null;
  setLastVisited: (id: string) => void;
  toasts: ToastMsg[];
  toast: (text: string) => void;
  dismissToast: (id: number) => void;
  paletteOpen: boolean;
  setPaletteOpen: (b: boolean) => void;
  tweaksOpen: boolean;
  setTweaksOpen: (b: boolean) => void;
  resetTweaks: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

const FONTS: Record<FontKey, string> = {
  sans: '"Inter", ui-sans-serif, system-ui, -apple-system, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  serif: '"Noto Serif SC", "Songti SC", "STSong", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "hb-theme",
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const [hue, setHue] = useLocalStorage("hb-hue", 268);
  const [radius, setRadius] = useLocalStorage("hb-radius", 1);
  const [font, setFont] = useLocalStorage<FontKey>("hb-font", "sans");
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>("hb-bookmarks", []);
  const [learned, setLearned] = useLocalStorage<string[]>("hb-learned", []);
  const [lastVisited, setLastVisited] = useLocalStorage<string | null>("hb-last", null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const tid = useRef(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
  useEffect(() => {
    const s = document.documentElement.style;
    s.setProperty("--accent-h", String(hue));
    s.setProperty("--rs", String(radius));
    s.setProperty("--ff-sans", FONTS[font]);
  }, [hue, radius, font]);

  const toggleTheme = useCallback(
    (e?: { clientX: number; clientY: number }) => {
      const next: Theme = theme === "dark" ? "light" : "dark";
      const apply = () => {
        document.documentElement.classList.toggle("dark", next === "dark");
        setTheme(next);
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = document as any;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!doc.startViewTransition || reduce) return apply();
      const x = e?.clientX ?? window.innerWidth - 40;
      const y = e?.clientY ?? 30;
      const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const t = doc.startViewTransition(apply);
      t.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 650, easing: "cubic-bezier(0.4,0,0.2,1)", pseudoElement: "::view-transition-new(root)" }
        );
      });
    },
    [theme, setTheme]
  );

  const toast = useCallback((text: string) => {
    const id = ++tid.current;
    setToasts((t) => [...t.slice(-3), { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toggleBookmark = useCallback(
    (id: string) => setBookmarks((b) => (b.includes(id) ? b.filter((x) => x !== id) : [...b, id])),
    [setBookmarks]
  );
  const toggleLearned = useCallback(
    (id: string) => {
      const has = learned.includes(id);
      setLearned(has ? learned.filter((x) => x !== id) : [...learned, id]);
      return !has;
    },
    [learned, setLearned]
  );
  const resetTweaks = useCallback(() => {
    setHue(268);
    setRadius(1);
    setFont("sans");
  }, [setHue, setRadius, setFont]);

  const value = useMemo<Ctx>(
    () => ({
      theme, toggleTheme, hue, setHue, radius, setRadius, font, setFont,
      bookmarks, toggleBookmark, learned, toggleLearned, lastVisited, setLastVisited,
      toasts, toast, dismissToast, paletteOpen, setPaletteOpen, tweaksOpen, setTweaksOpen, resetTweaks,
    }),
    [theme, toggleTheme, hue, setHue, radius, setRadius, font, setFont, bookmarks, toggleBookmark, learned, toggleLearned,
      lastVisited, setLastVisited, toasts, toast, dismissToast, paletteOpen, tweaksOpen, resetTweaks]
  );
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("AppProvider missing");
  return c;
}
