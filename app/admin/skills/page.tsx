"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, Sparkles } from "lucide-react";
import { Card, Button, Input, Field, Badge } from "@/components/admin/ui";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ListSkeleton } from "@/components/admin/Skeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { useToast } from "@/components/admin/Toast";

type Skill = { id: string; icon: string; title: string; chips: string[] };
const empty = { title: "", icon: "✦", chips: "" };

export default function SkillsPage() {
  const [items, setItems] = useState<Skill[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const { push } = useToast();

  const load = () => fetch("/api/skills").then((r) => r.json()).then(setItems);
  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(empty); setEditingId(null); setShowForm(false); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { title: form.title, icon: form.icon, chips: form.chips.split(",").map((c) => c.trim()).filter(Boolean) };
    const res = editingId
      ? await fetch(`/api/skills/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/skills", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { push((await res.json()).error || "Something went wrong.", "error"); return; }
    push(editingId ? "Skill updated." : "Skill added.", "success");
    resetForm();
    load();
  };

  const edit = (s: Skill) => { setEditingId(s.id); setForm({ title: s.title, icon: s.icon, chips: s.chips.join(", ") }); setShowForm(true); };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/skills/${deleteTarget.id}`, { method: "DELETE" });
    push("Skill deleted.", "success");
    setDeleteTarget(null);
    load();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>Skills</h2>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-dim)" }}>Categories shown in the Skills section.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <span className="flex items-center gap-1.5"><Plus size={14} /> Add category</span>
        </Button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={submit}>
          <Card>
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>{editingId ? "Edit category" : "New category"}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2"><Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field></div>
              <Field label="Icon"><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></Field>
            </div>
            <Field label="Chips (comma-separated)"><Input placeholder="React, Next.js, TypeScript" value={form.chips} onChange={(e) => setForm({ ...form, chips: e.target.value })} /></Field>
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
        <EmptyState icon={Sparkles} title="No skills yet" description="Add a category like Frontend, Backend, or AI & Automation." actionLabel="Add category" onAction={() => setShowForm(true)} />
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {items.map((s) => (
            <Card key={s.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{s.icon}</span>
                  <span className="font-semibold text-[14px]" style={{ color: "var(--ink)" }}>{s.title}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => edit(s)} className="p-1.5 rounded-lg" style={{ color: "var(--ink-dim)" }}><Pencil size={14} /></button>
                  <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg" style={{ color: "#e05252" }}><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {s.chips.map((c) => <Badge key={c}>{c}</Badge>)}
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete skill category?"
        description={`"${deleteTarget?.title}" will be removed from the Skills section.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
