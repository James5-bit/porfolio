"use client";
import { useEffect, useRef } from "react";
import { Bold, Italic, List, Link2 } from "lucide-react";

export function RichTextEditor({
  value,
  onChange,
  minHeight = 120,
}: {
  value: string;
  onChange: (html: string) => void;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    onChange(ref.current?.innerHTML || "");
  };

  const addLink = () => {
    const url = prompt("Link URL:");
    if (url) exec("createLink", url);
  };

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center gap-1 px-2 py-1.5 border-b" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <ToolbarBtn onClick={() => exec("bold")}><Bold size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("italic")}><Italic size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec("insertUnorderedList")}><List size={14} /></ToolbarBtn>
        <ToolbarBtn onClick={addLink}><Link2 size={14} /></ToolbarBtn>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML || "")}
        className="px-3 py-2.5 text-[14px] outline-none"
        style={{ minHeight, color: "var(--ink)" }}
      />
    </div>
  );
}

function ToolbarBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="w-7 h-7 rounded-md flex items-center justify-center hover:opacity-80"
      style={{ color: "var(--ink-dim)" }}
    >
      {children}
    </button>
  );
}
