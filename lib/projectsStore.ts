import fs from "fs/promises";
import path from "path";
import type { Project } from "./data";

const DATA_PATH = path.join(process.cwd(), "data", "projects.json");

export async function getProjects(): Promise<Project[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(projects, null, 2), "utf-8");
}

export async function addProject(project: Omit<Project, "id">): Promise<Project> {
  const projects = await getProjects();
  const id = slugify(project.title) + "-" + Date.now().toString(36);
  const newProject: Project = { ...project, id };
  projects.push(newProject);
  await saveProjects(projects);
  return newProject;
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const projects = await getProjects();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  projects[index] = { ...projects[index], ...updates, id };
  await saveProjects(projects);
  return projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const next = projects.filter((p) => p.id !== id);
  if (next.length === projects.length) return false;
  await saveProjects(next);
  return true;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
