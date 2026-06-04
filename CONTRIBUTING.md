# Contributing to GitGraph Studio

First off, **thank you** for considering contributing to GitGraph Studio! 🎉

Every contribution matters — whether it's fixing a typo, improving documentation, reporting a bug, or building a new feature. This guide will help you get started.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Branch Naming](#-branch-naming)
- [Commit Conventions](#-commit-conventions)
- [Pull Request Process](#-pull-request-process)
- [Issue Guidelines](#-issue-guidelines)
- [Development Tips](#-development-tips)

---

## 📜 Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report unacceptable behavior to [nandan@gitgraph.studio](mailto:nandan@gitgraph.studio).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **Git** ([download](https://git-scm.com))
- A **[Supabase](https://supabase.com)** project (free tier is fine)
- **GitHub OAuth** app credentials ([create one](https://github.com/settings/developers))

### Setup

1. **Fork the repository**

   Click the "Fork" button at the top of the [GitGraph Studio repo](https://github.com/Nandansai08/gitgraph.studio).

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/gitgraph.studio.git
   cd gitgraph.studio
   ```

3. **Add the upstream remote**

   ```bash
   git remote add upstream https://github.com/Nandansai08/gitgraph.studio.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your Supabase and OAuth credentials. See [docs/getting-started.md](docs/getting-started.md) for a detailed walkthrough.

6. **Set up the database**

   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

7. **Start the dev server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) — you're ready to contribute! 🎉

---

## 🔄 Development Workflow

1. **Sync your fork** with the latest upstream changes:

   ```bash
   git checkout main
   git pull upstream main
   ```

2. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** and commit following our [commit conventions](#-commit-conventions).

4. **Test your changes** locally:

   ```bash
   npm run lint        # Lint & typecheck
   npm run build       # Ensure production build works
   ```

5. **Push your branch** and open a Pull Request:

   ```bash
   git push origin feat/your-feature-name
   ```

---

## 🌿 Branch Naming

Use descriptive branch names with a category prefix:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/keyboard-shortcuts` |
| `fix/` | Bug fixes | `fix/export-validation` |
| `docs/` | Documentation | `docs/api-reference` |
| `style/` | UI/styling changes | `style/dark-mode-tweaks` |
| `refactor/` | Code refactoring | `refactor/editor-state` |
| `test/` | Adding tests | `test/gallery-api` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

---

## 📝 Commit Conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons, etc. |
| `refactor` | Code refactoring (no feature/fix) |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, etc. |
| `perf` | Performance improvements |

### Examples

```
feat(editor): add keyboard shortcut for undo
fix(gallery): prevent duplicate fork creation
docs(readme): update environment variable guide
style(auth): improve sign-in form spacing
```

---

## 🔀 Pull Request Process

1. **Fill out the PR template** completely — summary, changes, screenshots (if UI), testing steps.
2. **Ensure CI passes** — all workflows (lint, typecheck, build) must be green.
3. **Keep PRs focused** — one feature or fix per PR. Smaller PRs are reviewed faster.
4. **Update documentation** if your change affects user-facing behavior.
5. **Respond to feedback** — maintainers may request changes. This is normal and collaborative!

### PR Checklist

- [ ] My code follows the project's code style
- [ ] I've tested my changes locally
- [ ] I've updated documentation (if applicable)
- [ ] I've added a descriptive PR title using commit conventions
- [ ] All CI checks pass

---

## 🐛 Issue Guidelines

### Reporting Bugs

Use the [Bug Report template](https://github.com/Nandansai08/gitgraph.studio/issues/new?template=bug_report.yml) and include:

- Clear description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Suggesting Features

Use the [Feature Request template](https://github.com/Nandansai08/gitgraph.studio/issues/new?template=feature_request.yml) and include:

- Clear description of the feature
- The problem it solves
- Proposed solution
- Alternative approaches considered

### Finding Issues to Work On

- 🏷️ [`good first issue`](https://github.com/Nandansai08/gitgraph.studio/labels/good%20first%20issue) — Great for newcomers
- 🏷️ [`help wanted`](https://github.com/Nandansai08/gitgraph.studio/labels/help%20wanted) — Ready for community contributions
- Comment on an issue to let others know you're working on it

---

## 💡 Development Tips

### Database Changes

When modifying the Prisma schema:

```bash
# Create a migration
npx prisma migrate dev --name describe-your-change

# Regenerate the client
npx prisma generate

# View your database
npx prisma studio
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run lint` | Run linter and typecheck |
| `npx prisma studio` | Open database viewer |
| `npx prisma migrate dev` | Run database migrations |

### Project Architecture

See [docs/architecture.md](docs/architecture.md) for a detailed overview of the codebase.

---

## 🎉 Recognition

All contributors are recognized in the project! Your GitHub avatar will appear in the contributors section of our README.

Thank you for helping make GitGraph Studio better! 💖
