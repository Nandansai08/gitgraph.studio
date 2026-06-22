<div align="center">

<img width="80" height="80" alt="GitGraph Studio Logo" src="https://raw.githubusercontent.com/Nandansai08/gitgraph.studio/main/assets/logo.png" onerror="this.style.display='none'" />

# GitGraph Studio

### 🎨 Design, preview, and generate custom GitHub contribution graph art.

Create names, logos, symbols, and pixel art for your GitHub activity heatmap using an interactive visual editor.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Version](https://img.shields.io/github/package-json/v/Nandansai08/gitgraph.studio?style=for-the-badge&color=informational)](package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[![CI](https://github.com/Nandansai08/gitgraph.studio/actions/workflows/build.yml/badge.svg)](https://github.com/Nandansai08/gitgraph.studio/actions/workflows/build.yml)
[![GitHub stars](https://img.shields.io/github/stars/Nandansai08/gitgraph.studio?style=social)](https://github.com/Nandansai08/gitgraph.studio/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Nandansai08/gitgraph.studio?style=social)](https://github.com/Nandansai08/gitgraph.studio/network/members)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[Live Demo](https://gitgraphstudio-f9hqfjbcaje4cyfj.centralindia-01.azurewebsites.net) · [Report Bug](https://github.com/Nandansai08/gitgraph.studio/issues/new?template=bug_report.yml) · [Request Feature](https://github.com/Nandansai08/gitgraph.studio/issues/new?template=feature_request.yml) · [Contributing](CONTRIBUTING.md)

</div>

![Editor Demo](./docs/screenshots/editor-demo.gif)

---

## 📸 Screenshots

Below are the screenshots showcasing the features of GitGraph Studio:

### 1. Landing Page / Workflow Setup
![Landing Page](./docs/screenshots/landing-page.png)

### 2. Contribution Graph Editor
![Graph Editor](./docs/screenshots/editor.png)

### 3. Customization & settings
![Import Export](./docs/screenshots/import-export.png)

### 4. Authentication
![Authentication](./docs/screenshots/auth.png)

### 5. Community Gallery
![Gallery](./docs/screenshots/gallery.png)

---

## ✨ What is GitGraph Studio?

GitGraph Studio is a **full-stack web app** that lets you visually design GitHub contribution graphs — paint pixels, craft art, and generate commit schedules that produce any pattern you want on your GitHub profile.

Think of it as a **Figma for your GitHub activity grid**.

> **🎉 Fun fact:** Every design you see in the gallery was created with this very tool!

---

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🎨 Contribution Graph Editor
Paint, erase, fill, and undo on a full 53×7 GitHub-accurate grid with 4 intensity levels matching GitHub's green palette.

### ✏️ Text to Graph
Type any text and stamp it onto the grid using built-in pixel fonts — turn your name into contribution art.

### 🖼️ Image to Graph
Upload an image and convert it to pixel art on your contribution graph automatically.

### 📅 Custom Date Ranges
Select any year or custom date range to target specific sections of your GitHub profile.

</td>
<td width="50%">

### 👁️ GitHub Preview
See a live preview of exactly how your design will look on your actual GitHub profile.

### 💾 Import / Export
Export your designs as JSON and import them later. Share designs with others effortlessly.
Try the bundled preset at `public/presets/heart-art.json` for a quick import demo.

### 🌐 Community Gallery
Browse, remix, fork, like, and bookmark community-created designs. Get inspired by others.

![Community Gallery Trending Templates](./docs/screenshots/gallery.png)

### 🔄 Fork & Remix
Found a design you love? Fork it, make it yours, and publish your own version.

</td>
</tr>
</table>

### ⚡ GitHub Actions Integration

Generate a GitHub Actions workflow that automates commits to produce your designed pattern on your contribution graph — **set it and forget it**.

![GitHub Actions Workflow Automation](./docs/screenshots/landing-page.png)

### 🎨 Visual Theme Customizer & Settings
Personalize your editor workspace with custom coordinate color palettes (Emerald Classic, Slate Monochrome, Cyber Indigo, Amber Sunset, Crimson Power) and fine-grained grid interactivity options.

![System Settings Dashboard](./docs/screenshots/import-export.png)

### 🌐 Discover & Search Community Designs
Find trending patterns, search by author or title, and instantly load designs into your editor canvas to remix them.

![Discover and Search Gallery Banner](./docs/screenshots/gallery-banner.png)

---

## 🏗️ Quick Start

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- A **[Supabase](https://supabase.com)** project (free tier works)
- **GitHub OAuth** app credentials ([create one](https://github.com/settings/developers))

### 1. Clone & Install

```bash
git clone https://github.com/Nandansai08/gitgraph.studio.git
cd gitgraph.studio
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

```env
# ──────────────────────────────────────────────
# Database (Supabase → Settings → Database)
# ──────────────────────────────────────────────
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# ──────────────────────────────────────────────
# Auth.js (NextAuth)
# ──────────────────────────────────────────────
AUTH_SECRET=""                              # Generate with: npx auth secret
NEXTAUTH_URL="http://localhost:3000"

# ──────────────────────────────────────────────
# GitHub OAuth (github.com/settings/developers)
# ──────────────────────────────────────────────
AUTH_GITHUB_ID=""
AUTH_GITHUB_SECRET=""

# ──────────────────────────────────────────────
# Google OAuth (console.cloud.google.com)
# ──────────────────────────────────────────────
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# ──────────────────────────────────────────────
# Supabase API (supabase.com → Settings → API)
# ──────────────────────────────────────────────
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# ──────────────────────────────────────────────
# Google Gemini (optional, for AI features)
# ──────────────────────────────────────────────
GEMINI_API_KEY=""

# ──────────────────────────────────────────────
# App
# ──────────────────────────────────────────────
APP_URL="http://localhost:3000"
```

> 💡 See [docs/getting-started.md](docs/getting-started.md) for a detailed walkthrough of each variable.

### 3. Setup Database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Locally

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — you're ready to go! 🎉

---

## 🏛️ Architecture

```mermaid
graph TB
    Client[Next.js Frontend<br/>React + Tailwind CSS]
    Auth[Auth.js v5<br/>GitHub · Google · Email]
    API[Next.js API Routes<br/>Server Actions]
    ORM[Prisma ORM]
    DB[(Supabase<br/>PostgreSQL)]
    AI[Google Gemini<br/>AI Generation]

    Client --> Auth
    Client --> API
    API --> ORM
    ORM --> DB
    API --> AI
    Auth --> ORM
```

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | Full-stack React framework |
| **Language** | TypeScript 5.8 | Type-safe development |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Auth** | Auth.js v5 (NextAuth) | GitHub, Google, Credentials |
| **Database** | Supabase PostgreSQL | Managed PostgreSQL |
| **ORM** | Prisma 5 | Type-safe database access |
| **Animations** | Motion (Framer Motion) | Smooth UI animations |
| **Icons** | Lucide React | Beautiful SVG icons |
| **AI** | Google Gemini API | AI-powered generation |

> 📖 For a deeper dive, see [docs/architecture.md](docs/architecture.md)

---

## 📁 Project Structure

```
gitgraph.studio/
├── app/                        # Next.js App Router
│   ├── api/                    # API routes (gallery, comments, search, users)
│   ├── actions.ts              # Server Actions (save, fork, like, comment)
│   └── [[...slug]]/            # SPA catch-all route
├── auth.ts                     # Auth.js / NextAuth configuration
├── middleware.ts               # Route protection middleware
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Preset design seeds
├── lib/
│   └── prisma.ts               # Prisma client singleton
├── src/
│   ├── App.tsx                 # Main application component
│   ├── data/galleryData.ts     # Local gallery presets
│   ├── types.ts                # TypeScript type definitions
│   └── utils/                  # Pixel fonts and utilities
├── components/                 # Shared UI components
├── docs/                       # Project documentation
└── .github/                    # CI workflows & issue templates
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
|---------|:-----:|:---------:|
| Browse Gallery | ✅ | ✅ |
| Use Editor | ✅ | ✅ |
| Export JSON | ❌ | ✅ |
| Save Design | ❌ | ✅ |
| Fork / Remix | ❌ | ✅ |
| Like / Bookmark | ❌ | ✅ |
| Comment | ❌ | ✅ |
| Publish to Gallery | ❌ | ✅ |

---

## 🗺️ Roadmap

### v1 — Core ✅
- [x] Contribution graph editor with paint, erase, fill tools
- [x] Export designs as JSON
- [x] Community gallery with browse, like, bookmark
- [x] Fork & remix designs

### v2 — Growth 🚧
- [ ] AI-powered graph generation (Gemini integration)
- [ ] Real-time collaboration on designs
- [ ] Design analytics dashboard
- [ ] Template library expansion

### v3 — Ecosystem 🔮
- [ ] Templates marketplace
- [ ] Plugin system for custom tools
- [ ] API for programmatic graph generation
- [ ] Design contests & challenges

> 💡 Have an idea? [Open a feature request](https://github.com/Nandansai08/gitgraph.studio/issues/new?template=feature_request.yml)!

---

## 🤝 Contributing

We love contributions! GitGraph Studio is built by the community, for the community.

Whether you're fixing a typo, adding a feature, or improving docs — **every contribution matters**.

```bash
# Fork the repo, then:
git clone https://github.com/YOUR_USERNAME/gitgraph.studio.git
cd gitgraph.studio
npm install
npm run dev
```

Please read our **[Contributing Guide](CONTRIBUTING.md)** for details on:
- 🔧 Development setup
- 🌿 Branch naming conventions
- 📝 Commit message format
- 🔀 Pull request process

> 🏷️ Look for issues labeled [`good first issue`](https://github.com/Nandansai08/gitgraph.studio/labels/good%20first%20issue) to get started!

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Getting Started](docs/getting-started.md) | Detailed setup & configuration guide |
| [Architecture](docs/architecture.md) | System design & technical overview |
| [Export Format](docs/export-format.md) | JSON export schema documentation |
| [Deployment](docs/deployment.md) | Deploy to Vercel, Azure, or self-host |
| [Authentication](docs/authentication.md) | OAuth setup for GitHub & Google |
| [Contributing](docs/contributing.md) | In-depth contributor guide |
| [Changelog](CHANGELOG.md) | Notable changes between releases |

---

## 🛡️ Security

Found a vulnerability? Please report it responsibly. See our [Security Policy](SECURITY.md) for details.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💖 Acknowledgments

- [Next.js](https://nextjs.org) — The React framework for the web
- [Supabase](https://supabase.com) — Open source Firebase alternative
- [Prisma](https://prisma.io) — Next-generation ORM
- [Auth.js](https://authjs.dev) — Authentication for the web
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS framework
- [Lucide](https://lucide.dev) — Beautiful open-source icons

---

<div align="center">

**⭐ If you find GitGraph Studio useful, give it a star!**

Made with ❤️ by [Nandan](https://github.com/Nandansai08) and [contributors](https://github.com/Nandansai08/gitgraph.studio/graphs/contributors)

</div>
