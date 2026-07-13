"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Info } from "lucide-react";
import { Card } from "@/components/admin/ui";
import { ListSkeleton } from "@/components/admin/Skeleton";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/experience").then((r) => r.json()),
      fetch("/api/certificates").then((r) => r.json()),
      fetch("/api/content").then((r) => r.json()),
    ]).then(([projects, skills, experience, certificates, content]) => {
      setData({
        composition: [
          { name: "Projects", count: projects.length },
          { name: "Skills", count: skills.length },
          { name: "Experience", count: experience.length },
          { name: "Certificates", count: certificates.length },
        ],
        languages: content.github.languages,
        tagCounts: countTags(projects),
      });
    });
  }, []);

  if (!data) return <ListSkeleton rows={4} />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--ink)" }}>Analytics</h2>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-dim)" }}>Content composition — not visitor traffic.</p>
      </div>

      <Card className="flex items-start gap-3">
        <Info size={16} color="var(--primary)" className="flex-shrink-0 mt-0.5" />
        <p className="text-[12.5px]" style={{ color: "var(--ink-dim)" }}>
          This shows what's <em>in</em> your portfolio (project/skill/entry counts, tag frequency, GitHub
          language mix) — it doesn't track real visitors. To see actual site traffic, wire up something
          like Vercel Analytics, Plausible, or Google Analytics and this page can be extended to show it.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Content by section</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.composition}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--ink-dim)" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--ink-dim)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#7C5CFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--ink)" }}>GitHub language mix</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.languages} dataKey="pct" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {data.languages.map((l: any, i: number) => <Cell key={i} fill={l.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="text-[13px] font-semibold mb-4" style={{ color: "var(--ink)" }}>Most-used project tags</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.tagCounts} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--ink-dim)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: "var(--ink-dim)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#A78BFA" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function countTags(projects: any[]) {
  const counts: Record<string, number> = {};
  projects.forEach((p) => p.tags?.forEach((t: string) => { counts[t] = (counts[t] ?? 0) + 1; }));
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
