<div align="center">

<img width="80" height="80" alt="GitGraph Studio Logo" src="https://raw.githubusercontent.com/Nandansai08/gitgraph.studio/main/assets/logo.png" onerror="this.style.display='none'" />

# GitGraph Studio

**Design your GitHub contribution graph like a canvas.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-purple)](https://authjs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Live Demo](https://gitgraph.studio) · [Report Bug](https://github.com/Nandansai08/gitgraph.studio/issues) · [Request Feature](https://github.com/Nandansai08/gitgraph.studio/issues)

</div>

---

## ✨ What is GitGraph Studio?

GitGraph Studio is a full-stack web app that lets you **visually design GitHub contribution graphs** — paint pixels, craft art, and generate commit schedules that produce any pattern you want on your GitHub profile.

Think of it as a **Figma for your GitHub activity grid**.

---

## 🚀 Features

### 🎨 Editor
- **Pixel-level contribution graph editor** — paint, erase, fill, and undo on a full 53×7 GitHub-accurate grid
- **4 intensity levels** matching GitHub's green palette (level 1–4)
- **Text generator** — type any text and stamp it onto the grid in pixel fonts
- **Emoji stamp tool** — apply smiley, stars, hearts and more as pixel art
- **Zoom in/out** and responsive canvas
- **Undo / Redo** stack

### 🖼️ Community Gallery
- Browse **8 preset designs** including Nebula Flow, Wolfpack, Space Invader, SYSTEM text art, and more
- **Live SVG graph preview** on every gallery card — see the actual pixel pattern before clicking
- **Filter by tag** (Art, Text, Logos, Workflows) and search by title/author
- **Remix in Editor** — load any gallery design directly into the canvas
- **Fork Design** — save a copy of any design to your own profile (requires sign-in)

### 🔐 Authentication
- Sign in with **GitHub OAuth**, **Google OAuth**, or **Email + Password**
- GitHub-style **deterministic identicons** — unique geometric avatar for every user, no uploads needed
- Route protection via Next.js middleware for `/editor`, `/settings`, `/dashboard`
- Guest access to browse gallery and use the editor (export and save require sign-in)

### 💾 Persistence (Supabase + Prisma)
- **Save designs** to PostgreSQL via Prisma ORM
- **Like, Bookmark, Fork** any community design
- **Threaded comments** on gallery designs
- **Version history** — every save creates a design version snapshot
- **Analytics** — view count tracking per design

### 🌐 Community
- Public profile pages with contribution stats (likes, views, forks)
- Publish your designs to the community gallery
- Fork and remix others' work

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.8 |
| Styling | Tailwind CSS v4 |
| Auth | Auth.js v5 (NextAuth) — GitHub, Google, Credentials |
| Database | Supabase PostgreSQL |
| ORM | Prisma 5 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |
| AI | Google Gemini API |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- GitHub and/or Google OAuth app credentials

### 1. Clone & Install

```bash
git clone https://github.com/Nandansai08/gitgraph.studio.git
cd gitgraph.studio
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
# Supabase Database (from Supabase → Settings → Database)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"

# Auth.js
AUTH_SECRET="your-random-secret"        # npx auth secret
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (github.com/settings/developers)
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Supabase API
SUPABASE_URL="https://[PROJECT_ID].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 3. Setup Database

```bash
# Apply schema migrations
npx prisma migrate dev --name init

# Seed preset designs (8 presets including Nebula, Wolf, etc.)
npx prisma db seed
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
gitgraph.studio/
├── app/                   # Next.js App Router
│   ├── api/               # API routes (gallery, comments, search, users)
│   ├── actions.ts         # Server Actions (save, fork, like, comment)
│   └── [[...slug]]/       # SPA catch-all route
├── auth.ts                # NextAuth configuration
├── middleware.ts           # Route protection
├── prisma/
│   ├── schema.prisma      # Full database schema
│   └── seed.ts            # 8 preset design seeds
├── lib/
│   └── prisma.ts          # Prisma client singleton
├── src/
│   ├── App.tsx            # Main application component (~4k lines)
│   ├── data/galleryData.ts # Local gallery presets
│   ├── types.ts           # TypeScript type definitions
│   └── utils/             # Pixel fonts and utilities
└── components/            # Shared UI components
```

---

## 🎨 Preset Designs

The following designs are seeded into the database on first setup:

| Design | Tags | Description |
|--------|------|-------------|
| 🫀 Pixel Love Heart | Art | Centered pixel heart shape |
| 👾 Space Invader | Art | Classic 8-bit retro arcade sprite |
| 🔤 Hello Git Logo | Text | GIT spelled in pixel typography |
| 💎 GitGraph Emblem | Logos | Abstract diamond emblem |
| 🌌 Nebula Framework Flow | Art, Workflows | Full-width sine wave constellation |
| 🐺 Wolfpack Architecture | Logos, Art | Geometric symmetric wolf head |
| 💻 System Core Commit | Text, Art | SYSTEM spelled across the grid |
| 🌿 Standard Monorepo | Workflows | Multi-branch trunk commit pattern |

---

## 🔒 Auth-Gated Features

| Feature | Guest | Signed In |
|---------|-------|-----------|
| Browse Gallery | ✅ | ✅ |
| Use Editor | ✅ | ✅ |
| Export JSON | ❌ | ✅ |
| Save Design | ❌ | ✅ |
| Fork / Remix | ❌ | ✅ |
| Like / Bookmark | ❌ | ✅ |
| Comment | ❌ | ✅ |
| Publish to Gallery | ❌ | ✅ |

---

## 📜 License

MIT © [Nandan Sai Chigurupati](https://github.com/Nandansai08)
