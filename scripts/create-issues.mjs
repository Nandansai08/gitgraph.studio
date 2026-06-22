#!/usr/bin/env node
/**
 * Bulk-creates the GitGraph Studio starter issue set via the GitHub REST API.
 * Safe to re-run: skips any issue whose title already exists (open or closed).
 *
 * Usage:
 *   GITHUB_TOKEN=xxx REPO_OWNER=Nandansai08 REPO_NAME=gitgraph.studio node scripts/create-issues.mjs
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const DELAY_MS = 500;

if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
  console.error('Missing required env vars. Need GITHUB_TOKEN, REPO_OWNER, REPO_NAME.');
  process.exit(1);
}

const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
};

const issues = [
  // ---------- Good First Issues ----------
  {
    title: 'Add a "Copy as SVG" export option alongside existing Import/Export',
    body: `## Description
GitGraph Studio supports Import/Export of contribution-graph designs, but there's no quick way to copy the current design as an SVG for pasting directly into a README or design tool.

## Where to look
\`src/utils/graphSchema.ts\` (the graph data model) and the editor toolbar component referenced from \`components/app-client.tsx\`.

## Proposed Change
Add a "Copy as SVG" button next to the existing export controls that serializes the current grid state to an SVG string and copies it to the clipboard.

## Acceptance Criteria
- [ ] Button generates a valid, viewable SVG matching the current grid exactly
- [ ] Copies to clipboard with a brief "Copied!" confirmation
- [ ] Works for both Text-to-Graph and Image-to-Graph generated designs`,
    labels: ['good-first-issue', 'enhancement'],
    assignees: [],
  },
  {
    title: 'Show a like count badge on Community Gallery design cards',
    body: `## Description
The \`Like\` Prisma model exists and the Community Gallery lets users discover designs, but gallery cards don't appear to surface the like count, making popular designs hard to spot at a glance.

## Where to look
The gallery card component (search under \`app/\` or \`components/\` for where \`src/data/galleryData.ts\`-shaped designs are rendered) and the \`Like\` model in \`prisma/schema.prisma\`.

## Proposed Change
Add a small heart icon + count badge to each gallery card, sourced from the design's aggregated like count.

## Acceptance Criteria
- [ ] Badge shows accurate like count per design
- [ ] Updates optimistically when the current user likes/unlikes a design
- [ ] Gracefully shows "0" rather than nothing for unliked designs`,
    labels: ['good-first-issue', 'enhancement'],
    assignees: [],
  },
  {
    title: 'Add keyboard shortcut hints tooltip to the graph editor toolbar',
    body: `## Description
The project already ships several editor keyboard shortcuts (e.g. shift+Z for redo, per recent commit history), but there's no in-UI way for a new user to discover what shortcuts exist.

## Where to look
The editor toolbar in \`components/app-client.tsx\`.

## Proposed Change
Add a small "?" icon or "Shortcuts" button that opens a lightweight popover/modal listing all current keyboard shortcuts (undo, redo, tool selection, etc.).

## Acceptance Criteria
- [ ] Lists every currently implemented shortcut accurately
- [ ] Opens/closes without disrupting the current editor selection or undo history
- [ ] Accessible via keyboard (e.g. \`Esc\` closes it)`,
    labels: ['good-first-issue', 'enhancement'],
    assignees: [],
  },
  {
    title: 'Add a confirmation dialog before discarding unsaved changes on navigation',
    body: `## Description
A user actively editing a design in the contribution graph editor can navigate away (e.g. click "Community Gallery" in the nav) and silently lose unsaved edits, with no warning.

## Where to look
The editor state lives in \`lib/store.ts\`; navigation happens via Next.js routing in \`app/[[...slug]]/page.tsx\` or the nav component.

## Proposed Change
Track a "dirty" flag in the editor store and show a confirmation dialog (or use the browser's \`beforeunload\` for tab close) when the user tries to navigate away with unsaved changes.

## Acceptance Criteria
- [ ] Dialog appears only when there are genuinely unsaved changes
- [ ] User can choose to discard or stay and save
- [ ] No dialog on navigation immediately after a successful save`,
    labels: ['good-first-issue', 'enhancement'],
    assignees: [],
  },

  // ---------- Bug Reports ----------
  {
    title: 'Image-to-Graph conversion produces incorrect intensity mapping for images with transparency',
    body: `## Description
The "Image to Graph" feature converts pixel brightness to contribution-square intensity, but for PNG images with an alpha channel, transparent/semi-transparent pixels appear to be treated as if they were a dark/light opaque color rather than being excluded or treated as "no contribution," producing visually incorrect graphs.

## Steps to Reproduce
1. Open the Image to Graph tool.
2. Upload a PNG logo with a transparent background (alpha = 0 outside the logo shape).
3. Generate the graph.

## Expected Behavior
Fully transparent pixels should map to zero/empty contribution squares, not be interpreted using their (often black or white) underlying RGB values.

## Actual Behavior
Transparent regions render as filled (or unexpectedly dark/light) squares instead of empty ones.

## Environment
- Browser: any
- Component: image-to-graph conversion logic referenced from \`src/utils/\`

## Additional Context
Fix should composite against alpha (treat alpha=0 as empty) before computing brightness/intensity.`,
    labels: ['bug', 'needs-triage'],
    assignees: [],
  },
  {
    title: 'Custom date range picker allows selecting end dates before the start date',
    body: `## Description
The "Custom Date Ranges" feature lets users pick the start/end window for their generated graph, but the date picker doesn't appear to validate that the end date is after the start date.

## Steps to Reproduce
1. Open the date range settings.
2. Set the start date to a date later than the end date (e.g. start = 2026-06-01, end = 2025-01-01).
3. Generate the graph.

## Expected Behavior
Either the end date picker should be constrained to not allow dates before the selected start date, or generation should show a clear validation error.

## Actual Behavior
The invalid range is accepted, likely producing an empty or malformed graph.

## Environment
- Browser: any
- Component: date range settings UI, \`src/utils/graphSchema.ts\` validation (if any)`,
    labels: ['bug', 'needs-triage'],
    assignees: [],
  },
  {
    title: 'Forking a design does not copy DesignVersion history, breaking "view original" attribution',
    body: `## Description
The \`Fork\` model in \`prisma/schema.prisma\` links a forked \`Design\` back to its original, and the "Fork & Remix" feature is a core part of the Community Gallery experience — but it's unclear whether forking correctly snapshots the source design's current \`DesignVersion\` state, or whether subsequent edits to the original can retroactively change what a fork's "view original" link displays.

## Steps to Reproduce
1. Publish a design to the Community Gallery.
2. Fork it from another account.
3. Edit and re-save the original design significantly.
4. View the fork's "forked from" / "view original" link.

## Expected Behavior
The fork's attribution should reflect the original design as it existed at fork time, or clearly indicate the original has since changed — not silently show the original's current (different) state as if it were what was forked.

## Actual Behavior
(To confirm during triage) The "view original" link may point at the live, mutated original rather than a version snapshot.

## Environment
- Component: \`prisma/schema.prisma\` \`Fork\`/\`DesignVersion\` models, fork creation logic in \`app/actions.ts\``,
    labels: ['bug', 'needs-triage'],
    assignees: [],
  },

  // ---------- Feature Requests ----------
  {
    title: 'Add AI-assisted name/logo suggestions using the existing @google/genai dependency',
    body: `## Problem Statement
\`@google/genai\` is already a project dependency, but there's no AI-assisted feature in the editor today — users manually type text or upload images for Text-to-Graph / Image-to-Graph. Many users want a graph that "looks good" but don't have a specific phrase or image in mind.

## Proposed Solution
Add an "AI Suggest" action in the Text-to-Graph tool that, given a short prompt (e.g. "something festive for December" or a GitHub username), calls the Gemini API via \`@google/genai\` to suggest a short word/phrase or simple ASCII-art-style pattern optimized for the contribution-graph grid dimensions.

## Alternatives Considered
- A static curated list of preset phrases — much simpler, but doesn't leverage the genai dependency that's already installed and doesn't personalize to the user's input.

## Additional Context
Should degrade gracefully (hide the AI suggest button) if no Gemini API key is configured, similar to how other AI-optional features in the ecosystem fall back gracefully.

## Priority
- [x] priority:medium`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },
  {
    title: 'Add collaborative real-time editing for a single design',
    body: `## Problem Statement
Designs are currently edited by a single user at a time. Teams or friends collaborating on a logo/pixel-art design for a shared GitHub org currently have to pass a single account back and forth or fork/merge manually.

## Proposed Solution
Add real-time collaborative editing (e.g. via a WebSocket or polling-based sync layer) for designs shared with explicit collaborators, with cursor/selection presence indicators similar to collaborative whiteboard tools.

## Alternatives Considered
- Async-only collaboration via Fork + manual re-merge (already possible today) — works but is much higher friction for fast iteration.

## Additional Context
This is a significant feature requiring a new sync layer; should be scoped as its own milestone (v2/v3 roadmap territory per the README's roadmap section) rather than a single PR.

## Priority
- [x] priority:low`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },
  {
    title: 'Add a "Bookmark" collections view backed by the existing Bookmark model',
    body: `## Problem Statement
The \`Bookmark\` model already exists in \`prisma/schema.prisma\`, implying users can save designs from the Community Gallery, but there's no dedicated page to browse everything a user has bookmarked.

## Proposed Solution
Add a "My Bookmarks" page (alongside the user's own designs) listing all designs referenced by the current user's \`Bookmark\` rows, reusing the existing gallery card component.

## Alternatives Considered
- Surfacing bookmarks only as a filter on the main gallery feed — less discoverable than a dedicated personal collection page.

## Additional Context
Backend likely just needs a paginated query against \`Bookmark\` joined to \`Design\`; the data model is already in place.

## Priority
- [x] priority:medium`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },
  {
    title: 'Add scheduled GitHub Actions sync so a published design auto-applies on a recurring schedule',
    body: `## Problem Statement
The README lists "GitHub Actions Integration" as an existing feature, presumably for applying a design to a user's contribution graph via commits. Today this likely requires the user to manually trigger or re-run the workflow whenever they want the graph refreshed/extended into new weeks.

## Proposed Solution
Add an option when setting up the GitHub Actions integration to install a scheduled (cron) workflow that automatically extends/re-applies the active design into newly available weeks without manual re-triggering.

## Alternatives Considered
- Manual re-run only (current state) — simplest, but requires the user to remember to re-run periodically, defeating some of the "set it and forget it" appeal.

## Additional Context
Should respect GitHub Actions' minimum cron interval and clearly document the schedule in the generated workflow YAML for transparency.

## Priority
- [x] priority:low`,
    labels: ['enhancement', 'feature-request'],
    assignees: [],
  },

  // ---------- Documentation Issues ----------
  {
    title: 'Document the OAuth setup steps for both GitHub and Google providers in more detail',
    body: `## Which doc is missing or unclear?
\`docs/authentication.md\` is referenced from the README's documentation table, but based on the existing "Auth-Gated Features" README section, it's unclear whether the doc walks through creating OAuth apps for both GitHub and Google from scratch (callback URLs, required scopes, where to put client ID/secret in \`.env\`) at a level a first-time contributor can follow without prior NextAuth experience.

## What should it cover?
- Step-by-step OAuth app creation for both GitHub and Google in their respective developer consoles
- Exact callback/redirect URL format expected locally vs in production
- Which \`.env\` variables map to which provider, cross-referenced with \`auth.ts\`

## Who would benefit?
First-time contributors who want to test auth-gated features (saving, forking, gallery publishing) locally and currently have to read \`auth.ts\` directly to figure out the required env vars.`,
    labels: ['documentation'],
    assignees: [],
  },
  {
    title: 'Document the Design / DesignVersion data model and when new versions are created',
    body: `## Which doc is missing or unclear?
\`prisma/schema.prisma\` defines both \`Design\` and \`DesignVersion\` models, but there's no contributor-facing doc explaining the relationship — specifically, what triggers a new \`DesignVersion\` (every save? only on publish? only on fork?) and how that interacts with the Fork/Like/Comment/Tag models.

## What should it cover?
- When a new \`DesignVersion\` row is created vs when an existing one is updated in place
- How forking snapshots (or doesn't snapshot) version history — directly relevant to the Fork-attribution bug filed in this issue set
- How \`View\` counts and \`Tag\` associations relate to a \`Design\` vs a specific \`DesignVersion\`

## Who would benefit?
Contributors working on Fork, version history, or any feature touching the gallery/save flow, who currently have to infer behavior from \`app/actions.ts\` and the schema alone.`,
    labels: ['documentation'],
    assignees: [],
  },

  // ---------- Refactor / Tech Debt ----------
  {
    title: 'Extract Image-to-Graph pixel-intensity conversion into a pure, testable utility',
    body: `## Description
The Image-to-Graph brightness/intensity conversion logic (related to the transparency bug filed above) appears to live close to the upload/canvas-handling UI code rather than as a pure, independently testable function in \`src/utils/\`.

## Motivation
Pixel-math bugs (like the alpha-channel transparency issue) are hard to verify as fixed without unit tests against known pixel inputs, and the current coupling to canvas/DOM APIs makes that difficult.

## Proposed Change
- Extract the pixel-to-intensity conversion into a pure function in \`src/utils/\` taking raw RGBA pixel data and grid dimensions, returning the intensity grid.
- Add unit tests covering: fully opaque pixels, fully transparent pixels, semi-transparent pixels, and pure black/white edge cases.
- Have the UI component call this pure function instead of inlining the math.

## Acceptance Criteria
- [ ] No behavior change for fully-opaque images
- [ ] Transparency handling has explicit unit test coverage
- [ ] Function has no DOM/canvas dependency, making it trivially unit-testable`,
    labels: ['chore'],
    assignees: [],
  },
  {
    title: 'Consolidate duplicated graph-grid constants between editor and preview components',
    body: `## Description
\`components/graph-preview.tsx\` and the main editor in \`components/app-client.tsx\` both need to know grid dimensions, cell size, and color-intensity buckets matching GitHub's real contribution-graph rendering — these constants risk drifting out of sync if defined in more than one place.

## Motivation
A mismatch between the editor's grid and the live GitHub preview's grid would directly undermine the "GitHub Preview" feature's accuracy, which is one of the product's key trust signals.

## Proposed Change
- Move all grid/intensity constants into a single shared module (e.g. extend \`src/utils/graphSchema.ts\`) exported with explicit, documented types.
- Update both the editor and preview components to import from this single source.

## Acceptance Criteria
- [ ] No visual regression in either the editor grid or the GitHub preview
- [ ] Single source of truth for grid dimensions and intensity color buckets
- [ ] TypeScript types prevent the two components from silently diverging again`,
    labels: ['chore'],
    assignees: [],
  },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchExistingTitles() {
  const titles = new Set();
  let page = 1;

  while (true) {
    const res = await fetch(
      `${API_BASE}/issues?state=all&per_page=100&page=${page}`,
      { headers: HEADERS }
    );

    if (!res.ok) {
      throw new Error(`Failed to list existing issues: ${res.status} ${await res.text()}`);
    }

    const batch = await res.json();
    if (batch.length === 0) break;

    for (const issue of batch) {
      titles.add(issue.title);
    }

    if (batch.length < 100) break;
    page += 1;
  }

  return titles;
}

async function createIssue(issue) {
  const res = await fetch(`${API_BASE}/issues`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      title: issue.title,
      body: issue.body,
      labels: issue.labels,
      assignees: issue.assignees,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

async function main() {
  console.log(`Fetching existing issues for ${REPO_OWNER}/${REPO_NAME}...`);
  const existingTitles = await fetchExistingTitles();
  console.log(`Found ${existingTitles.size} existing issue(s).`);

  for (const issue of issues) {
    if (existingTitles.has(issue.title)) {
      console.log(`SKIP (duplicate): "${issue.title}"`);
      continue;
    }

    try {
      const created = await createIssue(issue);
      console.log(`CREATED #${created.number}: ${created.html_url}`);
    } catch (err) {
      console.error(`FAILED: "${issue.title}" — ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
