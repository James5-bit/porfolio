"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { CommandPalette } from "./CommandPalette";
import { navItems } from "./navItems";

export function Topbar({ title, onLogout }: { title: string; onLogout: () => void }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 flex items-center justify-between gap-4 px-5 md:px-8 py-4 border-b backdrop-blur-xl"
        style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--bg) 85%, transparent)" }}
      >
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setDrawerOpen(true)} style={{ color: "var(--ink)" }}>
            <Menu size={20} />
          </button>
          <h1 className="text-[17px] font-semibold" style={{ color: "var(--ink)" }}>{title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <CommandPalette />
          </div>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg border flex items-center justify-center"
            style={{ borderColor: "var(--border)", color: "var(--ink)" }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            className="fixed inset-0 z-[260] md:hidden"
            style={{ background: "rgba(0,0,0,0.5)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-64 h-full p-4 flex flex-col gap-1"
              style={{ background: "var(--bg-elevated)" }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>Menu</span>
                <button onClick={() => setDrawerOpen(false)} style={{ color: "var(--ink-dim)" }}><X size={18} /></button>
              </div>
              {navItems.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-medium"
                    style={{ background: active ? "var(--surface-hover)" : "transparent", color: active ? "var(--ink)" : "var(--ink-dim)" }}
                  >
                    <Icon size={16} color={active ? "var(--primary)" : "currentColor"} />
                    {item.label}
                  </Link>
                );
              })}
              <button onClick={onLogout} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] mt-2 text-left" style={{ color: "#e05252" }}>
                Log out
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
