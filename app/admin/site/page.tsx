"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Plus, Save } from "lucide-react";
import { Card, Button, Input, Textarea, Field } from "@/components/admin/ui";
import { ListSkeleton } from "@/components/admin/Skeleton";
import { useToast } from "@/components/admin/Toast";

export default function SiteInfoPage() {
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { push } = useToast();

  useEffect(() => { fetch("/api/content").then((r) => r.json()).then(setContent); }, []);

  if (!content) return <ListSkeleton rows={5} />;

  const set = (path: string, value: any) => {
    setContent((c: any) => {
      const next = structuredClone(c);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
    setSaving(false);
    push(res.ok ? "Site content saved." : "Failed to save.", res.ok ? "success" : "error");
  };

  return (
    <form onSubmit={save} className="flex flex-col gap-6">
      <div className="flex items-center justify-between sticky top-[73px] z-10 py-2" style={{ background: "var(--bg)" }}>
        <div>
          <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>Site Info</h2>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-dim)" }}>Hero, About, Contact, Stats & GitHub.</p>
        </div>
        <Button type="submit" variant="primary" disabled={saving}>
          <span className="flex items-center gap-1.5"><Save size={14} /> {saving ? "Saving…" : "Save all changes"}</span>
        </Button>
      </div>

      <Card>
        <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Hero section</h3>
        <Field label="Status pill text"><Input value={content.hero.statusText} onChange={(e) => set("hero.statusText", e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Headline (normal part)"><Input value={content.hero.headlinePrefix} onChange={(e) => set("hero.headlinePrefix", e.target.value)} /></Field>
          <Field label="Headline (highlighted part)"><Input value={content.hero.headlineHighlight} onChange={(e) => set("hero.headlineHighlight", e.target.value)} /></Field>
        </div>
        <Field label="Intro paragraph"><Textarea value={content.hero.lead} onChange={(e) => set("hero.lead", e.target.value)} /></Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Resume URL"><Input value={content.hero.resumeUrl} onChange={(e) => set("hero.resumeUrl", e.target.value)} /></Field>
          <Field label="GitHub URL"><Input value={content.hero.githubUrl} onChange={(e) => set("hero.githubUrl", e.target.value)} /></Field>
          <Field label="LinkedIn URL"><Input value={content.hero.linkedinUrl} onChange={(e) => set("hero.linkedinUrl", e.target.value)} /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>About section</h3>
        <Field label="Location tag (under portrait)"><Input value={content.about.locationTag} onChange={(e) => set("about.locationTag", e.target.value)} /></Field>
        {content.about.paragraphs.map((p: string, i: number) => (
          <Field key={i} label={`Paragraph ${i + 1} (use **word** for bold)`}>
            <Textarea value={p} onChange={(e) => { const next = [...content.about.paragraphs]; next[i] = e.target.value; set("about.paragraphs", next); }} />
          </Field>
        ))}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Education"><Input value={content.about.education} onChange={(e) => set("about.education", e.target.value)} /></Field>
          <Field label="Location"><Input value={content.about.location} onChange={(e) => set("about.location", e.target.value)} /></Field>
          <Field label="Email"><Input value={content.about.email} onChange={(e) => set("about.email", e.target.value)} /></Field>
          <Field label="Availability text"><Input value={content.about.availability} onChange={(e) => set("about.availability", e.target.value)} /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Contact section</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email"><Input value={content.contact.email} onChange={(e) => set("contact.email", e.target.value)} /></Field>
          <Field label="Availability text"><Input value={content.contact.availabilityText} onChange={(e) => set("contact.availabilityText", e.target.value)} /></Field>
          <Field label="GitHub URL"><Input value={content.contact.githubUrl} onChange={(e) => set("contact.githubUrl", e.target.value)} /></Field>
          <Field label="LinkedIn URL"><Input value={content.contact.linkedinUrl} onChange={(e) => set("contact.linkedinUrl", e.target.value)} /></Field>
        </div>
      </Card>

      <Card>
        <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Stats strip</h3>
        <div className="grid grid-cols-2 gap-4">
          {content.stats.map((s: any, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <Field label={`Stat ${i + 1} — number`}><Input value={s.num} onChange={(e) => { const next = [...content.stats]; next[i] = { ...s, num: e.target.value }; set("stats", next); }} /></Field>
              <Field label="Label"><Input value={s.label} onChange={(e) => { const next = [...content.stats]; next[i] = { ...s, label: e.target.value }; set("stats", next); }} /></Field>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-[14px] font-semibold mb-4" style={{ color: "var(--ink)" }}>GitHub section</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Contributions"><Input value={content.github.contributions} onChange={(e) => set("github.contributions", e.target.value)} /></Field>
          <Field label="Repositories"><Input value={content.github.repos} onChange={(e) => set("github.repos", e.target.value)} /></Field>
          <Field label="Stars"><Input value={content.github.stars} onChange={(e) => set("github.stars", e.target.value)} /></Field>
        </div>
        {content.github.languages.map((l: any, i: number) => (
          <div key={i} className="grid gap-3 items-end mb-1" style={{ gridTemplateColumns: "1fr 1fr 1fr auto" }}>
            <Field label={`Language ${i + 1}`}><Input value={l.name} onChange={(e) => { const next = [...content.github.languages]; next[i] = { ...l, name: e.target.value }; set("github.languages", next); }} /></Field>
            <Field label="% share"><Input type="number" value={l.pct} onChange={(e) => { const next = [...content.github.languages]; next[i] = { ...l, pct: Number(e.target.value) }; set("github.languages", next); }} /></Field>
            <Field label="Color"><Input value={l.color} onChange={(e) => { const next = [...content.github.languages]; next[i] = { ...l, color: e.target.value }; set("github.languages", next); }} /></Field>
            <Button type="button" variant="danger" className="mb-4" onClick={() => set("github.languages", content.github.languages.filter((_: any, idx: number) => idx !== i))}>
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
        <Button type="button" variant="secondary" onClick={() => set("github.languages", [...content.github.languages, { name: "", pct: 0, color: "#7C5CFF" }])}>
          <span className="flex items-center gap-1.5"><Plus size={14} /> Add language</span>
        </Button>
      </Card>
    </form>
  );
}
