# GitGraph Studio: Deployment Guide

This document describes the process of deploying GitGraph Studio as a production-ready, full-stack Next.js application on Azure App Service.

## Prerequisites

Before starting, ensure you have:
1. An active Azure subscription.
2. A PostgreSQL database server (e.g. Azure Database for PostgreSQL Flexible Server).
3. A GitHub Repository containing the codebase.
4. A registered GitHub OAuth Application credentials.

---

## 1. Environment Variables Configuration

Create a production `.env` file containing the following variables:

```env
# Database Connection String
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<dbname>?sslmode=require"

# NextAuth Global Secrets
AUTH_SECRET="your-32-character-random-auth-secretkey"
NEXTAUTH_URL="https://your-app-service-domain.azurewebsites.net"

# GitHub OAuth Credentials
AUTH_GITHUB_ID="github-client-id"
AUTH_GITHUB_SECRET="github-client-secret"

# Optional Cloud Storage (Reserved for future uploads, leave blank or populate dummy credentials)
AZURE_STORAGE_ACCOUNT_NAME="dummy"
AZURE_STORAGE_ACCOUNT_KEY="dummy"
AZURE_STORAGE_CONTAINER="dummy"

# Application Performance Monitoring
APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=...;IngestionEndpoint=..."
```

---

## 2. Local Database & Client Generation

Prior to building and deploying, generate the database clients:

1. **Verify Schema**:
   ```bash
   npx prisma validate
   ```
2. **Apply Migrations**:
   Run schema migrations to prepare the tables in the PostgreSQL target:
   ```bash
   npx prisma db push
   ```
3. **Generate Client**:
   Compile the type-safe Prisma client:
   ```bash
   npx prisma generate
   ```

---

## 3. Production Compilation

Verify compilation integrity by compiling Next.js locally:
```bash
npm run build
```
This produces a compiled, optimized production bundle inside the `.next` directory.

---

## 4. Azure App Service CI/CD Deployment

The deployment pipeline is configured automatically via GitHub Actions inside [.github/workflows/deploy.yml](file:///c:/Users/nanda/gitgraph.studio/.github/workflows/deploy.yml).

### Steps to Set Up GitHub Actions:
1. Log in to the Azure Portal.
2. Search for your **Azure App Service Web App**.
3. Under **Deployment Center**, select **GitHub Actions** as the provider, or download the **Publish Profile**.
4. In your GitHub repository settings, under **Secrets and variables -> Actions**, create the following secrets:
   - `AZURE_CREDENTIALS`: Azure service principal login credentials (JSON structure).
5. Push changes to the `main` branch. The CI/CD pipeline will automatically build the application and deploy it to the App Service.

---

## 5. Post-Deployment Troubleshooting

If the application displays startup errors on Azure:
1. Ensure the Node.js startup command in App Service configuration is set to:
   ```bash
   npx next start -p 8080
   ```
   *(Azure App Service maps port 80/443 traffic internally to container ports, default is 8080)*.
2. Check the logs under **Log Stream** or verify the **Application Insights** dashboard.

## 6. Supabase Row Level Security Recommendations

Enable RLS before exposing any production database:

- `users` and `profiles`: enable RLS and restrict writes to the owning user or server-side admin role.
- `designs`: enable RLS so public designs can be read while private designs stay owner-only.
- `likes`, `forks`, and `views`: allow inserts only through authenticated sessions or server actions.
- `comments` and `notifications`: scope access to the owning user and the design being viewed.
- `session_logs` and audit tables: keep server-only access; do not expose direct client writes.

Practical rule: if a table changes user-owned data or session history, enable RLS and define the policy before shipping.
