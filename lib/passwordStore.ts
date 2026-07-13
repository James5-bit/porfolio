import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";

const DATA_PATH = path.join(process.cwd(), "data", "admin.json");
let cachedHash: string | null = null;

async function readStoredHash(): Promise<string | null> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw).passwordHash ?? null;
  } catch {
    return null;
  }
}

export async function getPasswordHash(): Promise<string | null> {
  if (cachedHash) return cachedHash;

  const stored = await readStoredHash();
  if (stored) {
    cachedHash = stored;
    return stored;
  }

  // First run: no data/admin.json yet — derive a hash from ADMIN_PASSWORD in
  // .env.local so login works immediately, then persist it.
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) return null;

  const hash = await bcrypt.hash(envPassword, 10);
  cachedHash = hash;
  await fs.writeFile(DATA_PATH, JSON.stringify({ passwordHash: hash }, null, 2), "utf-8");
  return hash;
}

export async function setPassword(newPlain: string): Promise<void> {
  const hash = await bcrypt.hash(newPlain, 10);
  cachedHash = hash;
  await fs.writeFile(DATA_PATH, JSON.stringify({ passwordHash: hash }, null, 2), "utf-8");
}
