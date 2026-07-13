import { NextRequest, NextResponse } from "next/server";
import { getAll, addItem } from "@/lib/listStore";
import { requireAuth } from "@/lib/adminAuth";

type Skill = { id: string; icon: string; title: string; chips: string[] };

export async function GET() {
  const skills = await getAll<Skill>("skills");
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const skill = await addItem<Skill>(
    "skills",
    { icon: body.icon ?? "✦", title: body.title, chips: body.chips ?? [] },
    body.title
  );
  return NextResponse.json(skill, { status: 201 });
}
