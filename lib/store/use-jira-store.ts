import { create } from 'zustand';

export interface JiraTicket {
  ticketId: string;
  title: string;
  status: string;
  type: string;
  sprint: string;
  assignee: string;
  userStory: string;
  acceptanceCriteria: string[];
  module: string;
}

interface JiraState {
  currentTicket: JiraTicket | null;
  isLoading: boolean;
  error: string | null;
}

interface JiraActions {
  fetchTicket: (ticketId: string) => Promise<void>;
  clearTicket: () => void;
  setTicket: (ticket: JiraTicket) => void;
}

type JiraStore = JiraState & JiraActions;

export const useJiraStore = create<JiraStore>((set) => ({
  // State
  currentTicket: null,
  isLoading: false,
  error: null,

  // Actions
  fetchTicket: async (ticketId: string) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('/api/jira/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch ticket');
      }

      set({ currentTicket: data.ticket, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      });
    }
  },

  clearTicket: () => {
    set({ currentTicket: null, error: null });
  },

  setTicket: (ticket: JiraTicket) => {
    set({ currentTicket: ticket, error: null });
  },
}));
