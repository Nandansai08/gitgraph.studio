# 🚀 Good First Issues Backlog

This document lists **20 high-quality, beginner-friendly issues** designed to welcome new contributors to GitGraph Studio. Each issue contains a clear summary, file references, and implementation guidance.

---

## 🎨 Category: UI / UX Improvements

### 1. Improve Canvas Empty State UI
- **Description**: When the editor canvas is empty, show a subtle guide or watermark pattern indicating how to start drawing.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Add a CSS absolute background layout with a light text instruction (e.g. *"Click or drag on cells to paint"*) when the grid array contains only level-0 cells.

### 2. Add Tooltips to Drawing Tools
- **Description**: Add descriptive tooltips to the tool buttons (Draw, Erase, Fill, Stamp) to explain their shortcuts and functionality.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Use native `title` attributes or integrate a lightweight accessible tooltip wrapper around button tags.

### 3. Improve Mobile Canvas Viewport Responsiveness
- **Description**: The 53x7 grid is too wide for standard mobile screens, causing horizontal scrolling.
- **Difficulty**: Medium
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Implement dynamic zoom scaling (e.g., CSS `transform: scale()`) or allow horizontal swiping/zooming on screens smaller than 768px.

### 4. Create Active State Indicator for Selected Intensity Levels
- **Description**: Add a prominent visual outline to the currently selected green intensity level block (0 to 4).
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Add dynamic ring styling (e.g., `ring-2 ring-offset-2 ring-emerald-400`) based on whether the level matches the active state variable.

### 5. Standardize Layout Spacing on Settings Page
- **Description**: Align margin/padding variables on the `/settings` routes to match the spacing standards of the dashboard layout.
- **Difficulty**: Easy
- **File(s) to edit**: app pages under settings
- **Hint**: Verify CSS class mappings and replace scattered `pt-X` tags with consistent utility classes.

---

## ⌨️ Category: Keyboard Shortcuts & Accessibility

### 6. Implement Basic Drawing Canvas Keyboard Shortcuts
- **Description**: Support keyboard hotkeys to quickly switch tools (e.g., `D` for Draw, `E` for Erase, `F` for Fill).
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Implement a React `useEffect` mapping `keydown` events to state setters.

### 7. Support Undo/Redo via Standard CMD/CTRL + Z
- **Description**: Bind typical key combinations (`Ctrl+Z` / `Cmd+Z` for undo, `Ctrl+Y` / `Cmd+Shift+Z` for redo) to canvas operations.
- **Difficulty**: Medium
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Check keys in `keydown` handler: `e.ctrlKey || e.metaKey` combined with `e.key === 'z'`.

### 8. Add ARIA Roles to Grid Cells for Screen Readers
- **Description**: Add proper accessibility labels so screen readers can navigate contribution cells.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Map cell attributes: `role="gridcell"`, `aria-label="Week X, Day Y, level Z"`.

### 9. Add Contrast-Safe Focus States to Controls
- **Description**: Ensure all clickable controls (buttons, links, text inputs) show a highly visible outline when focused using keyboard navigation.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx) & shared components
- **Hint**: Ensure elements use styling classes like `focus-visible:outline-none focus-visible:ring-2`.

---

## 🔒 Category: Export, Validation & Utilities

### 10. Implement Client-Side File Extension Validation on Import
- **Description**: Restrict imports to only `.json` file formats and display an warning alert toast if invalid formats are dragged in.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Inspect file name endings or `file.type === "application/json"` inside file drop handlers.

### 11. Limit Title and Description String Lengths on Save
- **Description**: Prevent saving designs with excessively long titles or descriptions that could break dashboard layouts.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx), [src/utils/graphSchema.ts](file:///c:/Users/nanda/gitgraph.studio/src/utils/graphSchema.ts)
- **Hint**: Enforce UI length bounds (e.g. `maxLength={50}` for title, `maxLength={250}` for description).

### 12. Auto-Detect and Populate Author Name on Export
- **Description**: When exporting to JSON, automatically set the author property to the current user's profile handle.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Pass username from auth session context to the `buildGraphExport` function.

### 13. Copy GitHub Actions Workflow to Clipboard
- **Description**: Add a "Copy to Clipboard" button next to the generated GitHub Actions workflow code output block.
- **Difficulty**: Easy
- **File(s) to edit**: [src/App.tsx](file:///c:/Users/nanda/gitgraph.studio/src/App.tsx)
- **Hint**: Use browser standard `navigator.clipboard.writeText()` logic and render a success indicator.

---

## 📑 Category: Backend & API Enhancements

### 14. Prevent Non-Owners from Deleting Designs
- **Description**: Add verification checks in backend actions to prevent malicious user requests from deleting other users' designs.
- **Difficulty**: Medium
- **File(s) to edit**: [app/actions.ts](file:///c:/Users/nanda/gitgraph.studio/app/actions.ts)
- **Hint**: Ensure `session.user.id` matches the design owner ID before completing database delete mutations.

### 15. Create API Endpoint for Health Check
- **Description**: Expose a quick health verification route `/api/health` returning system availability status.
- **Difficulty**: Easy
- **File(s) to edit**: [app/api/health/route.ts] [NEW]
- **Hint**: Create a Next.js route handler returning `Response.json({ status: "ok", timestamp: ... })`.

### 16. Support Custom Paginated Views in Gallery Routing
- **Description**: Add query parameter parsing (e.g., `?page=2&limit=12`) to gallery lists to support pagination.
- **Difficulty**: Medium
- **File(s) to edit**: [app/api/gallery/route.ts]
- **Hint**: Read query params in search URL and apply Prisma schema pagination rules: `take` and `skip`.

---

## 🧪 Category: Docs & Examples

### 17. Add Mock Export JSON Dataset to Project Assets
- **Description**: Store a pre-made complex pixel art design JSON file in `public/presets/` for demonstration imports.
- **Difficulty**: Easy
- **File(s) to edit**: `public/presets/heart-art.json` [NEW]
- **Hint**: Generate a sample export JSON output and document it.

### 18. Fix Typo In NextAuth Client-Id Documentation
- **Description**: Correct references to client identifiers in settings templates.
- **Difficulty**: Easy
- **File(s) to edit**: [docs/authentication.md](file:///c:/Users/nanda/gitgraph.studio/docs/authentication.md)
- **Hint**: Read docs pages and replace outdated placeholder labels.

### 19. Add Database Diagram Image to Architecture Document
- **Description**: Link or embed a visual Prisma entity-relationship diagram inside system documentation.
- **Difficulty**: Easy
- **File(s) to edit**: [docs/architecture.md](file:///c:/Users/nanda/gitgraph.studio/docs/architecture.md)
- **Hint**: Generate diagram structure representation using Mermaid markdown syntax.

### 20. Document Supabase Database Row Level Security (RLS) Recommendations
- **Description**: Outline recommended Supabase security access rules for postgres tables in deployment documents.
- **Difficulty**: Easy
- **File(s) to edit**: [docs/deployment.md](file:///c:/Users/nanda/gitgraph.studio/docs/deployment.md)
- **Hint**: Write a checklist outlining which tables require RLS rules enabled.
