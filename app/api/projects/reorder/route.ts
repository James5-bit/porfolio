import { NextRequest, NextResponse } from "next/server";
import { getProjects, saveProjects } from "@/lib/projectsStore";
import { requireAuth } from "@/lib/adminAuth";

export async function PUT(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { orderedIds }: { orderedIds: string[] } = await req.json();
  const projects = await getProjects();
  const byId = new Map(projects.map((p) => [p.id, p]));
  const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean) as typeof projects;

  // Include any projects not present in orderedIds (safety net) at the end
  const missing = projects.filter((p) => !orderedIds.includes(p.id));
  await saveProjects([...reordered, ...missing]);

  return NextResponse.json({ ok: true });
}
