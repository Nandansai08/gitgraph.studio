import { create } from 'zustand';
import { UserSession, UserSettings } from '@/src/types';

interface AppState {
  session: UserSession | null;
  settings: UserSettings;
  setSession: (session: UserSession | null) => void;
  setSettings: (settings: UserSettings) => void;
}

export const useAppStore = create<AppState>((set) => ({
  session: null,
  settings: {
    gridBorders: true,
    gridTheme: 'github',
    showTooltips: true,
    defaultIntensity: 4
  },
  setSession: (session) => set({ session }),
  setSettings: (settings) => set({ settings }),
}));
