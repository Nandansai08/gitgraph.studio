# GitGraph Studio: Portable Export Schema

This document describes the portable representation of GitGraph Studio designs (`schemaVersion: 1`). Any design imported or exported from the canvas as a JSON file must adhere strictly to this schema contract.

---

## JSON Structure

Here is a fully populated example of a GitGraph export file:

```json
{
  "schemaVersion": 1,
  "version": "1.0",
  "metadata": {
    "name": "Nebula Flow",
    "description": "A beautiful cosine wave traversing the entire contribution timeline",
    "author": "Nandan",
    "createdAt": "2026-06-04T18:30:00.000Z",
    "updatedAt": "2026-06-04T19:00:00.000Z"
  },
  "startDate": "2025-06-01",
  "endDate": "2026-05-31",
  "dimensions": {
    "weeks": 53,
    "days": 7
  },
  "pixels": [
    { "w": 0, "d": 0, "level": 1 },
    { "w": 0, "d": 1, "level": 2 },
    { "w": 1, "d": 2, "level": 4 },
    { "w": 25, "d": 3, "level": 3 }
  ]
}
```

---

## Schema Properties

### `schemaVersion`
- **Type**: `integer`
- **Required**: Yes
- **Allowed Value**: `1`
- **Description**: The major format version. Used for future backwards-compatible migrations.

### `version`
- **Type**: `string`
- **Required**: Yes
- **Description**: Semantic version string representing minor tooling/generator levels (e.g. `"1.0"`).

### `metadata`
- **Type**: `object`
- **Required**: Yes
- **Properties**:
  - `name` (`string`, required): The title of the design.
  - `description` (`string`, optional): A short description of the art.
  - `author` (`string`, optional): Creator's handle or username.
  - `createdAt` (`string`, ISO 8601 timestamp): When the design was initialized.
  - `updatedAt` (`string`, ISO 8601 timestamp): When the design was last modified.

### `startDate`
- **Type**: `string` (Format: `YYYY-MM-DD`)
- **Required**: Yes
- **Description**: The inclusive starting date of the contribution graph timeline.

### `endDate`
- **Type**: `string` (Format: `YYYY-MM-DD`)
- **Required**: Yes
- **Description**: The inclusive ending date of the timeline. Must be equal to or after `startDate`.

### `dimensions`
- **Type**: `object`
- **Required**: Yes
- **Properties**:
  - `weeks` (`integer`): Columns in the contribution grid (usually `53`).
  - `days` (`integer`): Rows in the grid. Must be exactly `7`.

### `pixels`
- **Type**: `array` of `object`
- **Required**: Yes
- **Description**: Stores only cells that have non-zero contribution levels. Empty cells (level `0`) are omitted to keep export payload sizes compact.
- **Pixel Object Structure**:
  - `w` (`integer`): Week column index from `0` to `weeks - 1`.
  - `d` (`integer`): Day of the week index from `0` (Sunday) to `6` (Saturday).
  - `level` (`integer`): Intensity level. Must be `1`, `2`, `3`, or `4`.

---

## Verification & Parsing

TypeScript structures and helper validation methods are located in [src/utils/graphSchema.ts](file:///c:/Users/nanda/gitgraph.studio/src/utils/graphSchema.ts).

To validate any external JSON input at runtime, use:
```typescript
import { validateGraphExport } from '@/utils/graphSchema';

const parseResult = JSON.parse(uploadedFileText);
const validation = validateGraphExport(parseResult);

if (!validation.valid) {
  console.error("Invalid export format:", validation.errors);
} else {
  console.log("Graph imported successfully!");
}
```
