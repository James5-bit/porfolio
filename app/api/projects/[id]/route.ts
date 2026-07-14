import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/lib/projectsStore";
import { requireAuth } from "@/lib/adminAuth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();
  const updated = await updateProject(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const ok = await deleteProject(id);
  if (!ok) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
