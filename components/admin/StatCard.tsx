"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  accent = "#7C5CFF",
  index = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className="rounded-2xl border p-5 backdrop-blur-xl"
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}1F` }}>
          <Icon size={17} color={accent} />
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--ink)", fontFamily: "var(--font-mono)" }}>
        {value}
      </div>
      <div className="text-[13px] mt-1" style={{ color: "var(--ink-dim)" }}>{label}</div>
    </motion.div>
  );
}
