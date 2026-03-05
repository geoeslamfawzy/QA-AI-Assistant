import { create } from 'zustand';

interface JiraConfig {
  domain: string;
  apiToken: string;
  email: string;
}

interface FigmaConfig {
  accessToken: string;
}

interface BehaviorConfig {
  autoFetchFigma: boolean;
  includeProjectContext: boolean;
  autoTagComments: boolean;
  includeScreenshots: boolean;
}

interface SettingsState {
  jira: JiraConfig;
  figma: FigmaConfig;
  behavior: BehaviorConfig;
  activeModules: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isJiraConnected: boolean;
  isFigmaConnected: boolean;
}

interface SettingsActions {
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
  setJiraConfig: (config: Partial<JiraConfig>) => void;
  setFigmaConfig: (config: Partial<FigmaConfig>) => void;
  setBehaviorConfig: (config: Partial<BehaviorConfig>) => void;
  toggleModule: (module: string) => void;
  checkConnections: () => Promise<void>;
}

type SettingsStore = SettingsState & SettingsActions;

const initialState: SettingsState = {
  jira: {
    domain: '',
    apiToken: '',
    email: '',
  },
  figma: {
    accessToken: '',
  },
  behavior: {
    autoFetchFigma: true,
    includeProjectContext: true,
    autoTagComments: true,
    includeScreenshots: false,
  },
  activeModules: ['B2B Corporate Portal', 'B2C Web Interface', 'Admin Panel'],
  isLoading: false,
  isSaving: false,
  error: null,
  isJiraConnected: false,
  isFigmaConnected: false,
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...initialState,

  loadSettings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/settings');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load settings');
      }

      const { settings } = data;

      set({
        jira: settings.jira || initialState.jira,
        figma: settings.figma || initialState.figma,
        behavior: settings.behavior || initialState.behavior,
        activeModules: settings.activeModules || initialState.activeModules,
        isLoading: false,
      });

      // Check connections after loading
      get().checkConnections();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  saveSettings: async () => {
    const { jira, figma, behavior, activeModules } = get();

    set({ isSaving: true, error: null });

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jira,
          figma,
          behavior,
          activeModules,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to save settings');
      }

      set({ isSaving: false });

      // Re-check connections after saving
      get().checkConnections();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isSaving: false,
      });
    }
  },

  setJiraConfig: (config) =>
    set((state) => ({
      jira: { ...state.jira, ...config },
    })),

  setFigmaConfig: (config) =>
    set((state) => ({
      figma: { ...state.figma, ...config },
    })),

  setBehaviorConfig: (config) =>
    set((state) => ({
      behavior: { ...state.behavior, ...config },
    })),

  toggleModule: (module) =>
    set((state) => ({
      activeModules: state.activeModules.includes(module)
        ? state.activeModules.filter((m) => m !== module)
        : [...state.activeModules, module],
    })),

  checkConnections: async () => {
    const { jira, figma } = get();

    // Simple check: if credentials are provided, assume connected (mock mode)
    const isJiraConnected = !!(jira.domain && jira.apiToken && jira.email);
    const isFigmaConnected = !!figma.accessToken;

    set({ isJiraConnected, isFigmaConnected });
  },
}));
