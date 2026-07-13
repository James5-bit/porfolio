import { NextRequest, NextResponse } from "next/server";
import { getAll, addItem } from "@/lib/listStore";
import { requireAuth } from "@/lib/adminAuth";

type TimelineItem = { id: string; tag: string; title: string; body: string };

export async function GET() {
  const items = await getAll<TimelineItem>("certificates");
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await req.json();
  if (!body.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const item = await addItem<TimelineItem>(
    "certificates",
    { tag: body.tag ?? "", title: body.title, body: body.body ?? "" },
    body.title
  );
  return NextResponse.json(item, { status: 201 });
}
