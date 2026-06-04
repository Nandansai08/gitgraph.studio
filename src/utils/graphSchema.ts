/**
 * GitGraph Studio — Official Graph Export Schema
 * -----------------------------------------------
 * This module is the single source of truth for the GitGraph Studio
 * portable design format (schemaVersion 1).
 *
 * Every exported .json file MUST conform to GraphExport.
 * All future features (Gallery, Fork, Remix, Import, GitHub Actions generation,
 * Community Sharing, Versioning) depend on this contract.
 */

// ─── TypeScript Interfaces ─────────────────────────────────────────────────

export interface GraphMetadata {
  /** Human-readable design name (required) */
  name: string;
  /** Optional short description of the design */
  description: string;
  /** Optional author username or display name */
  author: string;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** ISO 8601 last-updated timestamp */
  updatedAt: string;
}

export interface GraphPixel {
  /** Week index — 0 to (dimensions.weeks - 1) */
  w: number;
  /** Day index — 0 (Sunday) to 6 (Saturday) */
  d: number;
  /** Contribution intensity level — 1 (min) to 4 (max). Empty cells are omitted. */
  level: 1 | 2 | 3 | 4;
}

export interface GraphDimensions {
  /** Total number of week columns (typically 53) */
  weeks: number;
  /** Total number of day rows (always 7) */
  days: number;
}

export interface GraphExport {
  /** Integer schema version — used for future migrations */
  schemaVersion: 1;
  /** Semver string for display / tooling */
  version: string;
  /** Design authorship and lifecycle metadata */
  metadata: GraphMetadata;
  /** ISO date string — inclusive range start (YYYY-MM-DD) */
  startDate: string;
  /** ISO date string — inclusive range end (YYYY-MM-DD) */
  endDate: string;
  /** Grid dimensions derived from the date range */
  dimensions: GraphDimensions;
  /** Active (non-empty) contribution cells only */
  pixels: GraphPixel[];
}

// ─── Validation ───────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TS_RE   = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

/** Validate a raw parsed JSON object against the GraphExport schema. */
export function validateGraphExport(raw: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { valid: false, errors: ['Root must be a JSON object.'] };
  }

  const obj = raw as Record<string, unknown>;

  // schemaVersion
  if (obj.schemaVersion !== 1) {
    errors.push(
      `schemaVersion must be 1, got: ${JSON.stringify(obj.schemaVersion)}. ` +
      'Only schemaVersion 1 is supported. Please re-export the design from GitGraph Studio.'
    );
  }

  // version
  if (typeof obj.version !== 'string' || !obj.version) {
    errors.push('version must be a non-empty string (e.g. "1.0").');
  }

  // metadata
  if (typeof obj.metadata !== 'object' || obj.metadata === null || Array.isArray(obj.metadata)) {
    errors.push('metadata must be an object.');
  } else {
    const m = obj.metadata as Record<string, unknown>;
    if (typeof m.name !== 'string' || !m.name.trim()) {
      errors.push('metadata.name is required and must be a non-empty string.');
    }
    if (typeof m.description !== 'string') {
      errors.push('metadata.description must be a string (may be empty).');
    }
    if (typeof m.author !== 'string') {
      errors.push('metadata.author must be a string (may be empty).');
    }
    if (typeof m.createdAt !== 'string' || !ISO_TS_RE.test(m.createdAt)) {
      errors.push('metadata.createdAt must be an ISO 8601 timestamp string.');
    }
    if (typeof m.updatedAt !== 'string' || !ISO_TS_RE.test(m.updatedAt)) {
      errors.push('metadata.updatedAt must be an ISO 8601 timestamp string.');
    }
  }

  // startDate / endDate
  if (typeof obj.startDate !== 'string' || !ISO_DATE_RE.test(obj.startDate)) {
    errors.push('startDate must be a YYYY-MM-DD date string.');
  }
  if (typeof obj.endDate !== 'string' || !ISO_DATE_RE.test(obj.endDate)) {
    errors.push('endDate must be a YYYY-MM-DD date string.');
  }
  if (
    typeof obj.startDate === 'string' &&
    typeof obj.endDate === 'string' &&
    ISO_DATE_RE.test(obj.startDate) &&
    ISO_DATE_RE.test(obj.endDate) &&
    obj.startDate > obj.endDate
  ) {
    errors.push('startDate must be before or equal to endDate.');
  }

  // dimensions
  if (typeof obj.dimensions !== 'object' || obj.dimensions === null || Array.isArray(obj.dimensions)) {
    errors.push('dimensions must be an object.');
  } else {
    const d = obj.dimensions as Record<string, unknown>;
    if (typeof d.weeks !== 'number' || d.weeks < 1 || d.weeks > 54 || !Number.isInteger(d.weeks)) {
      errors.push('dimensions.weeks must be an integer between 1 and 54.');
    }
    if (d.days !== 7) {
      errors.push('dimensions.days must be exactly 7.');
    }
  }

  // pixels
  if (!Array.isArray(obj.pixels)) {
    errors.push('pixels must be an array.');
  } else {
    const weeks = typeof (obj.dimensions as any)?.weeks === 'number'
      ? (obj.dimensions as any).weeks
      : 53;

    obj.pixels.forEach((px: unknown, i: number) => {
      if (typeof px !== 'object' || px === null || Array.isArray(px)) {
        errors.push(`pixels[${i}]: must be an object.`);
        return;
      }
      const p = px as Record<string, unknown>;
      if (typeof p.w !== 'number' || !Number.isInteger(p.w) || p.w < 0 || p.w >= weeks) {
        errors.push(`pixels[${i}].w must be an integer 0–${weeks - 1}, got ${p.w}.`);
      }
      if (typeof p.d !== 'number' || !Number.isInteger(p.d) || p.d < 0 || p.d > 6) {
        errors.push(`pixels[${i}].d must be an integer 0–6, got ${p.d}.`);
      }
      if (typeof p.level !== 'number' || ![1, 2, 3, 4].includes(p.level as number)) {
        errors.push(`pixels[${i}].level must be 1, 2, 3, or 4, got ${p.level}.`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

// ─── Parser ───────────────────────────────────────────────────────────────

export interface ParseResult {
  success: boolean;
  data?: GraphExport;
  errors?: string[];
}

/**
 * Parse and validate a raw JSON string as a GraphExport.
 * Returns a typed result with detailed error messages on failure.
 */
export function parseGraphExport(jsonText: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(jsonText);
  } catch (e) {
    return { success: false, errors: ['Invalid JSON: ' + (e as Error).message] };
  }

  const result = validateGraphExport(raw);
  if (!result.valid) {
    return { success: false, errors: result.errors };
  }

  return { success: true, data: raw as GraphExport };
}

// ─── Builder ──────────────────────────────────────────────────────────────

export interface BuildExportOptions {
  name: string;
  description?: string;
  author?: string;
  startDate: string;
  endDate: string;
  weeks: number;
  days: number;
  pixels: GraphPixel[];
  createdAt?: string; // if provided, preserved; otherwise uses now
}

/**
 * Build a valid GraphExport object. Use this to generate the export payload
 * instead of constructing the object manually — guarantees schema compliance.
 */
export function buildGraphExport(opts: BuildExportOptions): GraphExport {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    version: '1.0',
    metadata: {
      name: opts.name,
      description: opts.description ?? '',
      author: opts.author ?? '',
      createdAt: opts.createdAt ?? now,
      updatedAt: now,
    },
    startDate: opts.startDate,
    endDate: opts.endDate,
    dimensions: {
      weeks: opts.weeks,
      days: opts.days,
    },
    pixels: opts.pixels,
  };
}
