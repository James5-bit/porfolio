"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search, LayoutDashboard, FolderKanban, Sparkles, Briefcase, Award,
  Globe2, BarChart3, Settings, Plus,
} from "lucide-react";

const commands = [
  { label: "Go to Dashboard", href: "/admin", icon: LayoutDashboard, group: "Navigate" },
  { label: "Go to Projects", href: "/admin/projects", icon: FolderKanban, group: "Navigate" },
  { label: "Go to Skills", href: "/admin/skills", icon: Sparkles, group: "Navigate" },
  { label: "Go to Experience", href: "/admin/experience", icon: Briefcase, group: "Navigate" },
  { label: "Go to Certificates", href: "/admin/certificates", icon: Award, group: "Navigate" },
  { label: "Go to Site Info", href: "/admin/site", icon: Globe2, group: "Navigate" },
  { label: "Go to Analytics", href: "/admin/analytics", icon: BarChart3, group: "Navigate" },
  { label: "Go to Settings", href: "/admin/settings", icon: Settings, group: "Navigate" },
  { label: "Add new project", href: "/admin/projects?new=1", icon: Plus, group: "Quick actions" },
  { label: "Add new skill", href: "/admin/skills?new=1", icon: Plus, group: "Quick actions" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12.5px] w-64"
        style={{ borderColor: "var(--border)", color: "var(--ink-faint)", background: "var(--surface)" }}
      >
        <Search size={13} />
        <span className="flex-1 text-left">Search or jump to…</span>
        <kbd className="text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: "var(--border-strong)" }}>⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[250] flex items-start justify-center pt-[15vh] px-4"
            style={{ background: "rgba(0,0,0,0.45)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center gap-2.5 px-4 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
                <Search size={16} color="var(--ink-faint)" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search…"
                  className="flex-1 bg-transparent outline-none text-[14px]"
                  style={{ color: "var(--ink)" }}
                />
              </div>
              <div className="max-h-72 overflow-y-auto py-2">
                {filtered.length === 0 && (
                  <p className="px-4 py-6 text-center text-[13px]" style={{ color: "var(--ink-faint)" }}>No results.</p>
                )}
                {filtered.map((c) => (
                  <button
                    key={c.href}
                    onClick={() => go(c.href)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] hover:opacity-80 text-left"
                    style={{ color: "var(--ink)" }}
                  >
                    <c.icon size={15} color="var(--primary)" />
                    {c.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
