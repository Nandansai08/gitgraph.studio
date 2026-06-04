# GitGraph Studio: Backend System Documentation

This document describes the backend architecture, API route handlers, and Next.js Server Actions implemented for GitGraph Studio.

## Architecture Overview

GitGraph Studio utilizes **Next.js 15 App Router** for a unified React-based full-stack architecture. The backend is structured into two main communication mechanisms:
1. **Server Actions** (`use server`): Preferred for state mutations (e.g. saving, liking, commenting, forking) to enable direct call bindings and type safety with Zod.
2. **Route Handlers** (API Endpoints): Configured for HTTP clients and retrieval methods requiring query parameter variations (e.g., gallery feeds, fuzzy searches, user profiles).

---

## 1. API Route Handlers

All route handlers are declared under [app/api](file:///c:/Users/nanda/gitgraph.studio/app/api/).

### Auth Router: `/api/auth/*`
Managed dynamically by Auth.js (NextAuth v5). Handles OAuth flows, login redirects, callback resolution, and secure session management.

### Designs Router: `/api/designs`
- **GET**: 
  - Retrieve personal designs (drafts/public) of the authenticated user.
  - Query parameter `id` (e.g., `?id=cuid`) retrieves a specific design checking visibility permissions.
- **POST**:
  - Creates or updates a design in the PostgreSQL database.
  - Accepts a JSON payload containing `title`, `description`, `graphData`, and `visibility`.

### Gallery Router: `/api/gallery`
- **GET**: 
  - Retrieves the public feed.
  - Supports query filters:
    - `?page=`: Pagination page (default: 1).
    - `?sort=`: Feed sorting type (`trending`, `newest`, `liked`, `forked`).
    - `?tag=`: Filtering by tag name (default: `All`).
    - `?q=`: Query search text.

### User Profiles Router: `/api/users/[username]`
- **GET**:
  - Retrieves public user profiles.
  - Aggregates portfolio statistics including total designs, public templates, views, likes, and forks received across all creations.
  - Returns a list of the user's public designs.

### Search Router: `/api/search`
- **GET**:
  - Performs case-insensitive matching across design titles, descriptions, owner usernames, and tag categories.
  - Returns paginated results matching `?q=`.

### Comments Router: `/api/comments`
- **GET**:
  - Fetches paginated root comments (where `parentId` is null) for a design `?designId=cuid`, nesting replies inside them recursively.
- **DELETE**:
  - Deletes a comment `?id=cuid` if the authenticated session matches the comment owner.

---

## 2. Server Actions

Server Actions are implemented inside [app/actions.ts](file:///c:/Users/nanda/gitgraph.studio/app/actions.ts).

- **`saveDesignAction`**: Validates parameters using Zod. Performs updates on existing designs (verifying ownership) or creates new records. Creates history records inside the `DesignVersion` table.
- **`deleteDesignAction`**: Validates permission checks and deletes a design and cascade relations.
- **`toggleLikeAction`**: Toggles design likes. Prevents duplicate likes using composite constraints.
- **`toggleBookmarkAction`**: Toggles bookmarks, saving designs in the user's favorites catalog.
- **`commentAction`**: Posts a comment or reply to the database.
- **`forkDesignAction`**: Clones design records, connects them to a parent ID, copies tags, and tracks fork lineage.
- **`logViewAction`**: Ingests unique/anonymous design hits for dashboard tracking.
- **`updateUserProfileAction`**: Updates user display names, bios, and avatar URLs.

---

## 3. Data Validation

All inputs are validated strictly at runtime using **Zod**. Database schemas prevent:
- Unsafe text injections (length-capped fields).
- Unauthorized modifications (ownership constraints check).
- Invalid visibility states (Enum validation).
- Malformed graph matrices.
