"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogOut, ExternalLink,
} from "lucide-react";
import { navItems as items } from "./navItems";

export function Sidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col w-60 flex-shrink-0 h-screen sticky top-0 border-r"
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      <div className="px-5 py-5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[13px]" style={{ background: "linear-gradient(135deg,var(--primary),var(--accent))" }}>
          JP
        </div>
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Portfolio CMS</div>
          <div className="text-[11px]" style={{ color: "var(--ink-faint)" }}>James Peñero</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="relative">
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "var(--surface-hover)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <div className="relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13.5px] font-medium" style={{ color: active ? "var(--ink)" : "var(--ink-dim)" }}>
                <Icon size={16} color={active ? "var(--primary)" : "currentColor"} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t flex flex-col gap-1" style={{ borderColor: "var(--border)" }}>
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px]" style={{ color: "var(--ink-dim)" }}>
          <ExternalLink size={15} /> View live site
        </a>
        <button onClick={onLogout} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-left" style={{ color: "#e05252" }}>
          <LogOut size={15} /> Log out
        </button>
      </div>
    </aside>
  );
}
