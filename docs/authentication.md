# GitGraph Studio: Authentication Documentation

This document describes the authentication system, GitHub OAuth configurations, secure middleware route protection, and session handling.

## Overview

Authentication is implemented using **Auth.js (NextAuth v5)** with the **Prisma Adapter** linking logins directly to the PostgreSQL Database. GitHub is configured as the OAuth identity provider.

---

## 1. OAuth Application Registration

To enable GitHub login:
1. Navigate to GitHub -> Settings -> Developer settings -> OAuth Apps -> **New OAuth App**.
2. Configure settings:
   - **Application Name**: `GitGraph Studio`
   - **Homepage URL**: `http://localhost:3000` (local development) or your Azure Web App URL.
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github` (or Azure Web App counterpart).
3. Generate a Client Secret.
4. Add these variables to your `.env` configuration file:
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`

---

## 2. Configuration (`auth.ts`)

The NextAuth initialization is configured inside [auth.ts](file:///c:/Users/nanda/gitgraph.studio/auth.ts). It:
- Integrates the `PrismaAdapter` with our global `prisma` client.
- Maps custom fields (like GitHub username handle and bio) from the GitHub OAuth payload into the user session:
  ```typescript
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        (session.user as any).username = (user as any).username || (user as any).name;
        (session.user as any).bio = (user as any).bio;
      }
      return session;
    },
  }
  ```

---

## 3. Middleware Protection (`middleware.ts`)

NextAuth routes checks are performed inside [middleware.ts](file:///c:/Users/nanda/gitgraph.studio/middleware.ts):
- Matches protected paths: `/editor/*`, `/settings/*`, and `/dashboard/*`.
- Redirects unauthenticated requests to `/login`.

---

## 4. Frontend Binding

In [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx):
- The `signIn` and `signOut` methods are imported from `next-auth/react`.
- When the user clicks the "Authorize with GitHub" button, `signIn("github")` is triggered, launching the GitHub OAuth login page.
- On successful login, Auth.js sets secure, HTTP-only session cookies.
- The `App` client component receives the session on page load and populates `userSession` state dynamically, keeping user details in sync across all tabs and editor toolbars.
- To sign out, users click the "Log Out" button on the profile page, which calls `signOut()` to wipe cookie sessions.
