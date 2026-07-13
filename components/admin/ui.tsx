"use client";
import { forwardRef } from "react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-2xl border p-6 backdrop-blur-xl ${className}`}
      style={{ background: "var(--surface)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export function Button({
  variant = "secondary",
  className = "",
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const styles: Record<ButtonVariant, React.CSSProperties> = {
    primary: { background: "var(--primary)", color: "#fff" },
    secondary: { background: "var(--surface-hover)", color: "var(--ink)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--ink-dim)" },
    danger: { background: "rgba(224,82,82,0.12)", color: "#e05252" },
  };
  return (
    <button
      className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={styles[variant]}
      {...props}
    >
      {children}
    </button>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input
      ref={ref}
      className={`w-full px-3 py-2.5 rounded-lg border text-[13.5px] outline-none focus:ring-2 ${className}`}
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)" }}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2.5 rounded-lg border text-[13.5px] outline-none focus:ring-2 ${className}`}
      style={{ background: "var(--bg-elevated)", borderColor: "var(--border)", color: "var(--ink)", minHeight: 80 }}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold mb-1.5" style={{ color: "var(--ink-dim)" }}>
      {children}
    </label>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function Badge({ children, color = "var(--primary)" }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: `${color}1F`, color }}
    >
      {children}
    </span>
  );
}
