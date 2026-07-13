import { NextRequest, NextResponse } from "next/server";
import { getContent, updateContent } from "@/lib/contentStore";
import { requireAuth } from "@/lib/adminAuth";

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await req.json();
  const updated = await updateContent(body);
  return NextResponse.json(updated);
}
