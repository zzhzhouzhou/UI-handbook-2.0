import { useEffect, useState } from "react";

export interface Route {
  section?: string;
  item?: string;
  nonce: number;
}

function parse(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  const [s, sec, it] = h.split("/");
  if (s === "s" && sec) return { section: sec, item: it, nonce: Date.now() };
  return { nonce: Date.now() };
}

export function go(path: string) {
  const target = "#" + (path.startsWith("/") ? path : "/" + path);
  if (window.location.hash === target) window.dispatchEvent(new HashChangeEvent("hashchange"));
  else window.location.hash = target;
}

export function useRoute(): Route {
  const [r, setR] = useState<Route>(parse);
  useEffect(() => {
    const h = () => setR(parse());
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
  return r;
}
