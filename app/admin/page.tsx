"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FolderKanban, Sparkles, Briefcase, Award, ExternalLink, Plus } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { CardSkeleton } from "@/components/admin/Skeleton";

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
    ]).then(([projects, skills, experience, certificates]) => {
      setCounts({
        projects: projects.length,
        skills: skills.length,
        experience: experience.length,
        certificates: certificates.length,
      });
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--ink)" }}>Welcome back, James 👋</h2>
        <p className="text-[13.5px] mt-1" style={{ color: "var(--ink-dim)" }}>
          Here's what's live on your portfolio right now.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {!counts ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={FolderKanban} label="Projects" value={counts.projects} accent="#7C5CFF" index={0} />
            <StatCard icon={Sparkles} label="Skill categories" value={counts.skills} accent="#A78BFA" index={1} />
            <StatCard icon={Briefcase} label="Experience entries" value={counts.experience} accent="#34D399" index={2} />
            <StatCard icon={Award} label="Certificates" value={counts.certificates} accent="#F5C518" index={3} />
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 rounded-2xl border overflow-hidden"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--border)" }}>
            <span className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>Live preview</span>
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--primary)" }}>
              Open full site <ExternalLink size={12} />
            </a>
          </div>
          <iframe src="/" title="Live site preview" className="w-full" style={{ height: 420, border: "none" }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border p-5 flex flex-col gap-2"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <span className="text-[13px] font-semibold mb-1" style={{ color: "var(--ink)" }}>Quick actions</span>
          {[
            { href: "/admin/projects", label: "Add a project", icon: FolderKanban },
            { href: "/admin/skills", label: "Add a skill", icon: Sparkles },
            { href: "/admin/experience", label: "Add experience", icon: Briefcase },
            { href: "/admin/site", label: "Edit hero & about", icon: ExternalLink },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium"
              style={{ background: "var(--surface-hover)", color: "var(--ink)" }}
            >
              <Plus size={14} color="var(--primary)" /> {a.label}
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
