"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  danger = true,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
            style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: danger ? "rgba(224,82,82,0.12)" : "rgba(124,92,255,0.12)" }}>
                <AlertTriangle size={18} color={danger ? "#e05252" : "#7C5CFF"} />
              </div>
              <div>
                <h3 className="font-semibold text-[15px]" style={{ color: "var(--ink)" }}>{title}</h3>
                <p className="text-[13px] mt-1" style={{ color: "var(--ink-dim)" }}>{description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={onCancel} className="px-4 py-2 rounded-lg text-[13px] font-medium" style={{ background: "var(--surface)", color: "var(--ink)" }}>
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white"
                style={{ background: danger ? "#e05252" : "var(--primary)" }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
