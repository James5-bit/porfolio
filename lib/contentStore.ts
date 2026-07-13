import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export type SiteContent = {
  hero: {
    statusText: string;
    headlinePrefix: string;
    headlineHighlight: string;
    lead: string;
    resumeUrl: string;
    githubUrl: string;
    linkedinUrl: string;
  };
  about: {
    locationTag: string;
    paragraphs: string[];
    education: string;
    location: string;
    email: string;
    availability: string;
  };
  contact: {
    email: string;
    availabilityText: string;
    githubUrl: string;
    linkedinUrl: string;
  };
  stats: { num: string; label: string }[];
  github: {
    contributions: string;
    repos: string;
    stars: string;
    languages: { name: string; pct: number; color: string }[];
  };
};

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

export async function updateContent(
  updates: Partial<SiteContent>
): Promise<SiteContent> {
  const current = await getContent();
  const next = { ...current, ...updates };
  await fs.writeFile(DATA_PATH, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
