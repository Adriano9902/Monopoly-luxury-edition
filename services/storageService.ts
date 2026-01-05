
interface StoredSession {
  gameId: string;
  playerId: number;
  playerName: string;
}

const STORAGE_KEY = 'monopoly_extreme_session_v2';

export const storageService = {
  saveSession: (session: StoredSession): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error("Failed to save session:", error);
      return false;
    }
  },

  loadSession: (): StoredSession | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as StoredSession;
    } catch (error) {
      console.error("Failed to load session:", error);
      return null;
    }
  },

  clearSession: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Legacy/Unused stub for compatibility if needed, or remove
  saveGame: () => false,
  loadGame: () => null,
  hasSavedGame: () => false,
  clearSavedGame: () => {}
};
