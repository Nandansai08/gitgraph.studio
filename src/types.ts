// Re-export the canonical schema interfaces so the rest of the app
// can import them from types.ts as before.
export type {
  GraphMetadata,
  GraphPixel,
  GraphDimensions,
  GraphExport,
} from './utils/graphSchema';

// ─── Internal app types ───────────────────────────────────────────────────

/** Legacy alias kept for backward compatibility inside the editor state. */
export interface GridPixel {
  w: number;
  d: number;
  level: number;
}

export type Tool = 'brush' | 'eraser' | 'fill' | 'shape';

export type FontStyle = '5x7' | '3x5' | 'blocky';

export interface GalleryItem {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  likes: number;
  downloads: number;
  tags: string[];
  pixels: GridPixel[];
  imageUrl: string;
  description?: string;
  isTemplate?: boolean;
}

/** localStorage draft — aligned with GraphExport, legacy `year` field removed. */
export interface SavedDesign {
  id: string;
  name: string;
  pixels: GridPixel[];
  updatedAt: string;
  startDate: string;
  endDate: string;
}

export interface UndoState {
  pixels: GridPixel[];
}

export interface UserSession {
  username: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface UserSettings {
  gridBorders: boolean;
  gridTheme: 'github' | 'slate' | 'indigo' | 'amber' | 'crimson';
  showTooltips: boolean;
  defaultIntensity: number;
}
