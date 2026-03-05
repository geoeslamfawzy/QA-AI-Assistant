import { create } from 'zustand';

export interface FigmaFrame {
  id: string;
  name: string;
  width: number;
  height: number;
  thumbnail?: string;
}

interface FigmaState {
  frames: FigmaFrame[];
  isLoading: boolean;
  error: string | null;
}

interface FigmaActions {
  extractFrames: (figmaUrl: string) => Promise<void>;
  clearFrames: () => void;
  setFrames: (frames: FigmaFrame[]) => void;
}

type FigmaStore = FigmaState & FigmaActions;

export const useFigmaStore = create<FigmaStore>((set) => ({
  // State
  frames: [],
  isLoading: false,
  error: null,

  // Actions
  extractFrames: async (figmaUrl: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/figma/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ figmaUrl }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to extract frames');
      }

      set({ frames: data.frames, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  clearFrames: () => {
    set({ frames: [], error: null });
  },

  setFrames: (frames: FigmaFrame[]) => {
    set({ frames, error: null });
  },
}));
