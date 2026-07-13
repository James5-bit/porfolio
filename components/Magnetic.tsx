"use client";
import { useRef } from "react";

export default function Magnetic({
  children,
  className = "",
  href,
  onClick,
  type,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: React.MouseEventHandler;
  type?: "button" | "submit";
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  const cls = `magnetic ${className}`;

  if (href) {
    return (
      <a
        ref={ref as any}
        href={href}
        className={cls}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref as any}
      type={type ?? "button"}
      className={cls}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
  );
}
