# James Peñero — Portfolio + Admin CMS

Next.js 15 / React 19 / TypeScript / Tailwind CSS / Framer Motion.

## Run locally

```bash
npm install --legacy-peer-deps
cp .env.local.example .env.local   # then edit ADMIN_PASSWORD and JWT_SECRET
npm run dev
```

Then open http://localhost:3000 — and the admin at **http://localhost:3000/admin**.

First login uses the `ADMIN_PASSWORD` from `.env.local`. After that, your
password lives as a bcrypt hash in `data/admin.json` and you change it from
**Settings** inside the admin, not by editing the env file again.

## What's in the admin (`/admin`)

A sidebar-driven CMS, not a basic form:

- **Dashboard** — stat cards (project/skill/experience/certificate counts),
  a live iframe preview of your actual site, and quick-add shortcuts.
- **Projects** — add/edit/delete, **drag-and-drop reordering** (uses
  Framer Motion's `Reorder`), a cover-image uploader with live preview, and
  a lightweight rich-text editor for Overview/Architecture/Results.
- **Skills**, **Experience**, **Certificates** — same add/edit/delete
  pattern, card-based lists, confirmation dialogs before delete.
- **Site Info** — Hero headline/intro/links, About paragraphs & meta,
  Contact info, the 4 stat numbers, and GitHub stats/languages (with
  add/remove on the language list).
- **Analytics** — charts (via Recharts) of your *content* composition:
  counts per section, most-used project tags, GitHub language mix. This is
  **not visitor traffic** — see the note on the page itself for how to wire
  up real analytics (Vercel Analytics / Plausible / GA) later.
- **Settings** — change your password (bcrypt-verified against the current
  one first).

Plus, throughout: toast notifications, loading skeletons, empty states,
dark/light mode toggle, and a command palette (**⌘K** / **Ctrl+K**) for
fast navigation and quick-add shortcuts.

## Security

- Passwords are **bcrypt-hashed** (`bcryptjs`), never stored in plain text
  after the first login.
- Sessions are **signed JWTs** (`jose` — Edge-runtime compatible) in an
  **httpOnly** cookie, 12-hour expiry.
- `middleware.ts` redirects unauthenticated visitors away from any
  `/admin/*` page, and blocks unauthenticated `POST/PUT/DELETE` calls to the
  content APIs at the edge. Every mutation route *also* re-checks the
  session server-side (defense in depth).
- Login is **rate-limited** (5 attempts/minute per IP, in-memory).
- Set a real `JWT_SECRET` in `.env.local` before using this anywhere beyond
  local/self-hosted — the fallback secret is intentionally insecure and
  only meant to make local dev work with zero setup.

> **In-memory rate limiting** resets on server restart and is per-process —
> fine for a single self-hosted instance, not for a multi-instance/serverless
> deployment. Swap `lib/rateLimit.ts` for a Redis-backed limiter if you ever
> scale beyond one instance.

## Honest scope notes (what's simplified, and why)

Built for real, functional use on your own machine or a self-hosted server
— a few things were deliberately kept lightweight instead of pulling in
heavier tooling:

- **Rich text editor** is a small hand-built `contentEditable` toolbar
  (Bold/Italic/List/Link), not Tiptap/Quill. Swap in a heavier editor later
  if you need tables, images-in-text, etc.
- **shadcn/ui** components (`Button`, `Card`, `Input`, `Textarea`, `Badge`
  in `components/admin/ui.tsx`) are hand-built in the same visual language
  — the shadcn CLI needs an interactive setup step this environment can't
  run, so these are the equivalent styled by hand.
- **Drag-and-drop** uses Framer Motion's built-in `Reorder` (already a
  dependency) rather than adding `dnd-kit`.

## Important — read before deploying

Everything (projects, skills, experience, certificates, site content,
**and uploaded images**) is written to files on disk (`data/*.json` and
`public/uploads/`). This only works on a server with a normal, writable
filesystem — your own machine, a VPS, Railway, Render, etc.

**It will NOT persist on Vercel or Netlify** (serverless functions reset
the filesystem on every deploy/request). If you deploy there:
1. Keep using `/admin` only while developing locally, and commit the
   updated `data/*.json` + `public/uploads/` to git before deploying, or
2. Swap the store files (`lib/projectsStore.ts`, `lib/listStore.ts`,
   `lib/contentStore.ts`) for a real database, and swap `app/api/upload`
   for real object storage (S3, Cloudinary, Vercel Blob, etc.).

## Structure

```
middleware.ts           — guards /admin/* pages and mutation API routes
app/
  layout.tsx              — fonts, metadata, root html
  page.tsx                 — public homepage (force-dynamic, reads live data)
  admin/
    login/page.tsx           — split-layout login (bcrypt + JWT + rate limit)
    layout.tsx                — sidebar + topbar chrome, toast provider
    page.tsx                   — dashboard (stats + live preview)
    projects/page.tsx           — drag-and-drop CRUD + image + rich text
    skills/page.tsx              — CRUD
    experience/, certificates/    — CRUD (share components/admin/TimelinePage.tsx)
    site/page.tsx                  — hero/about/contact/stats/github editor
    analytics/page.tsx              — content composition charts
    settings/page.tsx                — change password
  api/
    auth/          — login, logout, me, change-password
    projects/        — CRUD + reorder
    skills/, experience/, certificates/ — CRUD
    content/           — site-wide settings
    upload/              — image upload → public/uploads/
components/
  (public site components — Nav, Hero, About, Skills, Projects, etc.)
  admin/
    ui.tsx                 — Card, Button, Input, Textarea, Field, Badge
    Sidebar.tsx, Topbar.tsx, CommandPalette.tsx, navItems.ts
    Toast.tsx, ConfirmDialog.tsx, Skeleton.tsx, EmptyState.tsx, StatCard.tsx
    ImageUploader.tsx, RichTextEditor.tsx, TimelinePage.tsx
lib/
  auth.ts             — bcrypt + JWT (jose) + session cookie helpers
  passwordStore.ts      — bcrypt hash persisted to data/admin.json
  rateLimit.ts            — in-memory login rate limiter
  adminAuth.ts               — per-route session check (defense in depth)
  contentStore.ts, listStore.ts, projectsStore.ts — JSON file read/write
  data.ts                       — shared TypeScript types
data/
  content.json, skills.json, experience.json, certificates.json,
  projects.json, admin.json (generated on first login, gitignored)
public/uploads/         — uploaded project images (gitignored except .gitkeep)
```
