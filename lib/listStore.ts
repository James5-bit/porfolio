import fs from "fs/promises";
import path from "path";

type WithId = { id: string };

function filePath(name: string) {
  return path.join(process.cwd(), "data", `${name}.json`);
}

export async function getAll<T extends WithId>(name: string): Promise<T[]> {
  const raw = await fs.readFile(filePath(name), "utf-8");
  return JSON.parse(raw);
}

async function saveAll<T>(name: string, items: T[]): Promise<void> {
  await fs.writeFile(filePath(name), JSON.stringify(items, null, 2), "utf-8");
}

export async function addItem<T extends WithId>(
  name: string,
  item: Omit<T, "id">,
  idFrom: string
): Promise<T> {
  const items = await getAll<T>(name);
  const id = slugify(idFrom) + "-" + Date.now().toString(36);
  const newItem = { ...item, id } as T;
  items.push(newItem);
  await saveAll(name, items);
  return newItem;
}

export async function updateItem<T extends WithId>(
  name: string,
  id: string,
  updates: Partial<T>
): Promise<T | null> {
  const items = await getAll<T>(name);
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates, id };
  await saveAll(name, items);
  return items[index];
}

export async function deleteItem(name: string, id: string): Promise<boolean> {
  const items = await getAll<WithId>(name);
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await saveAll(name, next);
  return true;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "item";
}
