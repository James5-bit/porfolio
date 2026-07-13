"use client";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border border-dashed"
      style={{ borderColor: "var(--border-strong)" }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--surface)" }}>
        <Icon size={22} color="var(--primary)" />
      </div>
      <h3 className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>{title}</h3>
      <p className="text-[13px] mt-1.5 max-w-xs" style={{ color: "var(--ink-dim)" }}>{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
          style={{ background: "var(--primary)" }}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
