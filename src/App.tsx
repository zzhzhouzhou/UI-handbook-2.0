import { useEffect, useState } from "react";
import { AppProvider } from "./lib/store";
import { useRoute } from "./lib/router";
import { BackToTop, Globals, Sidebar, ToastHost, Topbar, Tweaks } from "./components/Shell";
import { CommandPalette } from "./components/Palette";
import { Home, SectionPage } from "./components/Pages";

function Layout() {
  const route = useRoute();
  const [menu, setMenu] = useState(false);
  useEffect(() => { setMenu(false); }, [route.section, route.item]);
  useEffect(() => { if (!route.section) { document.title = "形色场 UI Handbook 2.0 · 可交互的组件手册与设计实验室"; window.scrollTo({ top: 0 }); } }, [route.section, route.nonce]);
  return (
    <>
      <Topbar onMenu={() => setMenu(true)} />
      <Sidebar open={menu} onClose={() => setMenu(false)} current={route} />
      <main className="min-h-screen pt-14 lg:pl-72">{route.section ? <SectionPage key={route.section} route={route} /> : <Home />}</main>
      <CommandPalette />
      <Tweaks />
      <ToastHost />
      <BackToTop />
      <Globals currentSection={route.section} />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}
