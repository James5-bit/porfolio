import { NextRequest, NextResponse } from "next/server";
import { getProjects, addProject } from "@/lib/projectsStore";
import { requireAuth } from "@/lib/adminAuth";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const authError = await requireAuth();
  if (authError) return authError;

  const body = await req.json();
  if (!body.title || !body.category) {
    return NextResponse.json(
      { error: "Title and category are required." },
      { status: 400 }
    );
  }
  const project = await addProject({
    category: body.category,
    title: body.title,
    summary: body.summary ?? "",
    tags: body.tags ?? [],
    links: body.links ?? [],
    overview: body.overview ?? "",
    architecture: body.architecture ?? "",
    challenges: body.challenges ?? [],
    results: body.results ?? "",
  });
  return NextResponse.json(project, { status: 201 });
}
