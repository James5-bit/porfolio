"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, Button, Input, Textarea, Field } from "./ui";
import { ConfirmDialog } from "./ConfirmDialog";
import { ListSkeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";
import { useToast } from "./Toast";

type TimelineItem = { id: string; tag: string; title: string; body: string };
const empty = { tag: "", title: "", body: "" };

export function TimelinePage({
  endpoint,
  title,
  icon: Icon,
  emptyDescription,
}: {
  endpoint: "experience" | "certificates";
  title: string;
  icon: LucideIcon;
  emptyDescription: string;
}) {
  const [items, setItems] = useState<TimelineItem[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState<TimelineItem | null>(null);
  const { push } = useToast();

  const load = () => fetch(`/api/${endpoint}`).then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, [endpoint]);

  const resetForm = () => { setForm(empty); setEditingId(null); setShowForm(false); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = editingId
      ? await fetch(`/api/${endpoint}/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      : await fetch(`/api/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) { push((await res.json()).error || "Something went wrong.", "error"); return; }
    push(editingId ? "Updated." : "Added.", "success");
    resetForm();
    load();
  };

  const edit = (it: TimelineItem) => { setEditingId(it.id); setForm({ tag: it.tag, title: it.title, body: it.body }); setShowForm(true); };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/${endpoint}/${deleteTarget.id}`, { method: "DELETE" });
    push("Entry deleted.", "success");
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>{title}</h2>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-dim)" }}>Shown as a timeline on your site.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <span className="flex items-center gap-1.5"><Plus size={14} /> Add entry</span>
        </Button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={submit}>
          <Card>
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>{editingId ? "Edit entry" : "New entry"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tag (e.g. 2025 — Present)"><Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} /></Field>
              <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
            </div>
            <Field label="Description"><Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
            <div className="flex gap-2 mt-2">
              <Button type="submit" variant="primary">{editingId ? "Save changes" : "Add"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </Card>
        </motion.form>
      )}

      {!items ? (
        <ListSkeleton rows={3} />
      ) : items.length === 0 ? (
        <EmptyState icon={Icon} title={`No ${title.toLowerCase()} yet`} description={emptyDescription} actionLabel="Add entry" onAction={() => setShowForm(true)} />
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-3 p-4 rounded-xl border" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[13.5px]" style={{ color: "var(--ink)" }}>{it.title}</div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--ink-dim)" }}>{it.tag}</div>
              </div>
              <button onClick={() => edit(it)} className="p-2 rounded-lg" style={{ color: "var(--ink-dim)" }}><Pencil size={15} /></button>
              <button onClick={() => setDeleteTarget(it)} className="p-2 rounded-lg" style={{ color: "#e05252" }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this entry?"
        description={`"${deleteTarget?.title}" will be removed.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
