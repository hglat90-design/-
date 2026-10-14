// Safe Storage Utility that never throws DOMException in WebViews (AppCreator24, incognito, or restricted storage)

const memoryFallback = new Map<string, string>();

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {
      console.warn(`safeStorage.getItem error for ${key}, using memory fallback`, e);
    }
    return memoryFallback.get(key) || null;
  },

  setItem(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`safeStorage.setItem error for ${key}, using memory fallback`, e);
    }
    memoryFallback.set(key, value);
  },

  removeItem(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {
      console.warn(`safeStorage.removeItem error for ${key}`, e);
    }
    memoryFallback.delete(key);
  },
};
