// Static content has moved to JSON files under /data, managed via the
// /admin CRUD UI + API routes:
//   data/content.json      — hero, about, contact, stats, github (lib/contentStore.ts)
//   data/skills.json       — lib/listStore.ts ("skills")
//   data/experience.json   — lib/listStore.ts ("experience")
//   data/certificates.json — lib/listStore.ts ("certificates")
//   data/projects.json     — lib/projectsStore.ts

export type Project = {
  id: string;
  category: string;
  title: string;
  summary: string;
  image?: string;
  tags: string[];
  links: { label: string; href: string }[];
  overview: string;
  architecture: string;
  challenges: string[];
  results: string;
};

export type Skill = { id: string; icon: string; title: string; chips: string[] };

export type TimelineItem = { id: string; tag: string; title: string; body: string };
