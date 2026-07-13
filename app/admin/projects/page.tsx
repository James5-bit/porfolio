"use client";
import { useEffect, useState } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical, Pencil, Trash2, Plus, FolderKanban } from "lucide-react";
import type { Project } from "@/lib/data";
import { Card, Button, Input, Textarea, Field } from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ListSkeleton } from "@/components/admin/Skeleton";
import { EmptyState } from "@/components/admin/EmptyState";
import { useToast } from "@/components/admin/Toast";

const empty = {
  title: "", category: "", summary: "", image: "", tags: "", overview: "",
  architecture: "", challenges: "", results: "", liveDemo: "", github: "",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const { push } = useToast();

  const load = () => fetch("/api/projects").then((r) => r.json()).then(setProjects);
  useEffect(() => { load(); }, []);

  const buildPayload = () => {
    const links = [];
    if (form.liveDemo) links.push({ label: "↗ Live Demo", href: form.liveDemo });
    if (form.github) links.push({ label: "⌥ GitHub", href: form.github });
    return {
      title: form.title, category: form.category, summary: form.summary, image: form.image,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      overview: form.overview, architecture: form.architecture,
      challenges: form.challenges.split("\n").map((c) => c.trim()).filter(Boolean),
      results: form.results, links,
    };
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = buildPayload();
    const res = editingId
      ? await fetch(`/api/projects/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!res.ok) { push((await res.json()).error || "Something went wrong.", "error"); return; }
    push(editingId ? "Project updated." : "Project added.", "success");
    resetForm();
    load();
  };

  const resetForm = () => { setForm(empty); setEditingId(null); setShowForm(false); };

  const edit = (p: Project) => {
    setEditingId(p.id);
    setForm({
      title: p.title, category: p.category, summary: p.summary, image: p.image ?? "",
      tags: p.tags.join(", "), overview: p.overview, architecture: p.architecture,
      challenges: p.challenges.join("\n"), results: p.results,
      liveDemo: p.links.find((l) => l.label.includes("Demo"))?.href ?? "",
      github: p.links.find((l) => l.label.includes("GitHub"))?.href ?? "",
    });
    setShowForm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/projects/${deleteTarget.id}`, { method: "DELETE" });
    push("Project deleted.", "success");
    setDeleteTarget(null);
    load();
  };

  const onReorder = async (next: Project[]) => {
    setProjects(next);
    await fetch("/api/projects/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: next.map((p) => p.id) }),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>Featured Work</h2>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-dim)" }}>Drag to reorder how projects appear on your site.</p>
        </div>
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <span className="flex items-center gap-1.5"><Plus size={14} /> Add project</span>
        </Button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={submit}
        >
          <Card>
            <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>
              {editingId ? "Edit project" : "New project"}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
                <Field label="Category"><Input placeholder="e.g. Full-Stack · E-commerce" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></Field>
                <Field label="Summary"><Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} /></Field>
                <Field label="Tags (comma-separated)"><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Live demo URL"><Input value={form.liveDemo} onChange={(e) => setForm({ ...form, liveDemo: e.target.value })} /></Field>
                  <Field label="GitHub URL"><Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} /></Field>
                </div>
              </div>
              <Field label="Cover image">
                <ImageUploader value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
              </Field>
            </div>
            <Field label="Overview"><RichTextEditor value={form.overview} onChange={(html) => setForm({ ...form, overview: html })} /></Field>
            <Field label="Architecture"><RichTextEditor value={form.architecture} onChange={(html) => setForm({ ...form, architecture: html })} /></Field>
            <Field label="Challenges (one per line)"><Textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} /></Field>
            <Field label="Results"><RichTextEditor value={form.results} onChange={(html) => setForm({ ...form, results: html })} /></Field>
            <div className="flex gap-2 mt-2">
              <Button type="submit" variant="primary">{editingId ? "Save changes" : "Add project"}</Button>
              <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
            </div>
          </Card>
        </motion.form>
      )}

      {!projects ? (
        <ListSkeleton rows={3} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Add your first case study to show up on the homepage."
          actionLabel="Add project"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <Reorder.Group axis="y" values={projects} onReorder={onReorder} className="flex flex-col gap-2">
          {projects.map((p) => (
            <Reorder.Item key={p.id} value={p}>
              <div
                className="flex items-center gap-3 p-4 rounded-xl border cursor-grab active:cursor-grabbing"
                style={{ borderColor: "var(--border)", background: "var(--surface)" }}
              >
                <GripVertical size={16} color="var(--ink-faint)" />
                {p.image ? (
                  <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ background: "var(--surface-hover)" }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[13.5px] truncate" style={{ color: "var(--ink)" }}>{p.title}</div>
                  <div className="text-[12px] truncate" style={{ color: "var(--ink-dim)" }}>{p.category}</div>
                </div>
                <button onClick={() => edit(p)} className="p-2 rounded-lg" style={{ color: "var(--ink-dim)" }}><Pencil size={15} /></button>
                <button onClick={() => setDeleteTarget(p)} className="p-2 rounded-lg" style={{ color: "#e05252" }}><Trash2 size={15} /></button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete project?"
        description={`"${deleteTarget?.title}" will be permanently removed from your site.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
