"use client";
import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "./Toast";

export function ImageUploader({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const upload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      onChange(data.url);
      push("Image uploaded.", "success");
    } catch (err: any) {
      push(err.message || "Upload failed.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  if (value) {
    return (
      <div className="relative w-full h-40 rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
        <img src={value} alt="Preview" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 text-white"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className="w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors"
      style={{
        borderColor: dragOver ? "var(--primary)" : "var(--border-strong)",
        background: dragOver ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "var(--surface)",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
      />
      {uploading ? (
        <Loader2 size={20} className="animate-spin" color="var(--primary)" />
      ) : (
        <>
          <Upload size={20} color="var(--ink-faint)" />
          <p className="text-[12.5px] mt-2" style={{ color: "var(--ink-dim)" }}>
            Drag an image here or click to browse
          </p>
        </>
      )}
    </div>
  );
}
