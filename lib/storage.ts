// lib/storage.ts

interface StorageResult {
  key: string;
  value?: string;
  deleted?: boolean;
}

export const storage = {
  get: async (key: string): Promise<StorageResult | null> => {
    if (typeof window === 'undefined') return null;
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (error) {
      console.error('Error getting from storage:', error);
      return null;
    }
  },

  set: async (key: string, value: string): Promise<StorageResult | null> => {
    if (typeof window === 'undefined') return null;
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (error) {
      console.error('Error setting storage:', error);
      return null;
    }
  },

  delete: async (key: string): Promise<StorageResult | null> => {
    if (typeof window === 'undefined') return null;
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (error) {
      console.error('Error deleting from storage:', error);
      return null;
    }
  }
};