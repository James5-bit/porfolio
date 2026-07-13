import { NextRequest, NextResponse } from "next/server";
import { updateItem, deleteItem } from "@/lib/listStore";
import { requireAuth } from "@/lib/adminAuth";

type TimelineItem = { id: string; tag: string; title: string; body: string };

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();
  const updated = await updateItem<TimelineItem>("certificates", id, body);
  if (!updated) return NextResponse.json({ error: "Item not found." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await requireAuth();
  if (authError) return authError;

  const { id } = await params;
  const ok = await deleteItem("certificates", id);
  if (!ok) return NextResponse.json({ error: "Item not found." }, { status: 404 });
  return NextResponse.json({ success: true });
}