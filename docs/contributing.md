# In-Depth Contributor Guide

Welcome to the GitGraph Studio developer community! We are excited to have you.

This document serves as an in-depth extension of our main [CONTRIBUTING.md](file:///c:/Users/nanda/gitgraph.studio/CONTRIBUTING.md). It details coding styles, schema management, component rules, state management guidelines, and troubleshooting.

---

## 🛠️ Codebase Structure

Before editing, take a minute to understand where things live:

- **Routing & Backend**: [app/](file:///c:/Users/nanda/gitgraph.studio/app/) uses Next.js App Router. API routes are under `app/api/` and server operations use Server Actions in `app/actions.ts`.
- **Database Schema**: Managed via Prisma at [prisma/schema.prisma](file:///c:/Users/nanda/gitgraph.studio/prisma/schema.prisma).
- **Core Canvas Logic**: Located inside the main Single Page App catch-all routing component [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx).
- **Shared Components**: Reusable widgets (buttons, input modals, dialogs) are located in the [components/](file:///c:/Users/nanda/gitgraph.studio/components/) folder.

---

## 💅 Styling Guide

We use **Tailwind CSS v4** for all styling.
- **Harmony**: Avoid introducing random hex codes (e.g. `bg-[#12a4f3]`). Use the design tokens or custom utility styles defined in `index.css`.
- **Contribution colors**: Standard green contribution levels match GitHub's styling:
  - Level 0 (Empty): `bg-zinc-800` or custom neutral shades
  - Level 1: `bg-emerald-950`
  - Level 2: `bg-emerald-700`
  - Level 3: `bg-emerald-500`
  - Level 4: `bg-emerald-300`
- **Responsive Web Design**: Ensure any UI adjustments adapt cleanly down to mobile screen viewports.

---

## 🗄️ Database Workflow & Migrations

If your contribution requires altering database tables:

1. **Modify the schema** in [prisma/schema.prisma](file:///c:/Users/nanda/gitgraph.studio/prisma/schema.prisma).
2. **Generate a migration**:
   ```bash
   npx prisma migrate dev --name describe_your_changes
   ```
   This updates your local database tables and updates the generated Prisma client.
3. **Seed data**: If your changes affect preset designs, update [prisma/seed.ts](file:///c:/Users/nanda/gitgraph.studio/prisma/seed.ts) and run:
   ```bash
   npx prisma db seed
   ```
4. **Use Prisma Studio**: For visual exploration of table entries:
   ```bash
   npx prisma studio
   ```

---

## 🧠 State Management Guidelines

GitGraph Studio uses **Zustand** inside the client React components for drawing canvas state, tool selections, and user sessions.
- **Atomic updates**: Do not trigger heavy full-store updates on rapid click events.
- **Undo/Redo Stack**: When drawing, push state transitions to the history stack. The history buffer size is capped to prevent memory leak issues.

---

## 🏷️ Issues & Label Strategy

When contributing, you can search for issues containing the following tags to guide your path:

| Label | Meaning |
|-------|---------|
| `good first issue` | Great introductory task for new project contributors |
| `help wanted` | Open issues awaiting volunteer ownership |
| `bug` | Unexpected behavior, crashes, or broken interfaces |
| `enhancement` | Request for new feature implementation |
| `documentation` | Typo fixes or documentation expansion |
| `needs review` | Finished PRs awaiting project maintainer feedback |
| `priority-high` | Critical bugs or blockers that must be resolved quickly |

---

## 🧪 Local Testing

Before submitting a pull request, run the verification commands to ensure all compiler targets pass cleanly:

```bash
# Typecheck files
npm run lint

# Build production bundle
npm run build
```
