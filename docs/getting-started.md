# Getting Started

Welcome to the GitGraph Studio developer guide! This document will walk you through setting up your local development environment, configuring your databases and authentication, and running the application.

---

## Prerequisites

Before you start, make sure you have the following installed on your machine:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher) or another package manager (yarn, pnpm)
- **Git**
- A **Supabase** account (or any self-hosted PostgreSQL instance)
- A **GitHub** developer account (for OAuth configuration)

---

## Step 1: Clone the Repository

Clone the project from GitHub and navigate into the root directory:

```bash
git clone https://github.com/Nandansai08/gitgraph.studio.git
cd gitgraph.studio
```

---

## Step 2: Install Dependencies

Install the node packages using npm:

```bash
npm install
```

---

## Step 3: Configure Environment Variables

Create a new file named `.env` in the root of the project. You can copy the template from `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and fill in the following values:

### Database Settings
- `DATABASE_URL`: Connection string for Supabase's transaction pooler (port `6543`).
- `DIRECT_URL`: Connection string for direct database connection (port `5432`) used for running migrations.

Example:
```env
DATABASE_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### Auth.js Configuration
- `AUTH_SECRET`: A secure, random 32-character key. Generate it using:
  ```bash
  npx auth secret
  ```
- `NEXTAUTH_URL`: The URL of your application. For development, use `http://localhost:3000`.

### GitHub OAuth
Configure these values by creating a GitHub OAuth app at [github.com/settings/developers](https://github.com/settings/developers). Set the callback URL to `http://localhost:3000/api/auth/callback/github`.
- `AUTH_GITHUB_ID`: Your GitHub Client ID.
- `AUTH_GITHUB_SECRET`: Your GitHub Client Secret.

### Google OAuth (Optional)
Configure these by creating credentials in the Google Cloud Console. Callback URL: `http://localhost:3000/api/auth/callback/google`.
- `AUTH_GOOGLE_ID`: Your Google Client ID.
- `AUTH_GOOGLE_SECRET`: Your Google Client Secret.

### Supabase API Settings
Found under Project Settings -> API on your Supabase dashboard.
- `SUPABASE_URL`: Your Supabase API endpoint.
- `SUPABASE_ANON_KEY`: The anonymous API key.
- `SUPABASE_SERVICE_ROLE_KEY`: The service role API key.

---

## Step 4: Run Prisma Database Migrations

Apply the schema to your database instance and run the initial migration:

```bash
npx prisma migrate dev --name init
```

This will apply all migrations in `prisma/migrations` and automatically generate the Prisma client for you.

---

## Step 5: Seed the Database

Seed the preset designs (Nebula Flow, Space Invaders, Hello Git Logo, etc.) into the database:

```bash
npx prisma db seed
```

---

## Step 6: Start Local Development

Launch the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Common CLI Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Runs the Next.js app in development mode on port 3000 |
| `npm run build` | Compiles the production build |
| `npm run start` | Launches the compiled production application |
| `npm run lint` | Typechecks the codebase using TypeScript compiler |
| `npx prisma studio` | Launches a local database editor dashboard in your browser |
| `npx prisma db seed` | Seeds database with gallery preset graphs |
