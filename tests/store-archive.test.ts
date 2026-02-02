import { beforeEach, describe, expect, it } from 'vitest';

// Provide a minimal localStorage mock for the persistence middleware in tests
const __mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  } as Storage;
})();

// Attach to global before importing the store so the persist middleware can use it
;(globalThis as any).localStorage = __mockLocalStorage;

import { useStore } from '@/store';

describe('store archive/unarchive (works)', () => {
  beforeEach(() => {
    // Reset store to a clean state before each test
    useStore.getState().clearAllData();
    useStore.getState().clearWorkFilters();
  });

  it('archives a work and getFilteredWorks hides archived by default', () => {
    const { addWork, archiveWork, getFilteredWorks, setWorkFilters } = useStore.getState();

    const w = addWork({ workId: 'W1', title: 'Test Work', status: 'draft', versionType: 'ORI' });
    expect(useStore.getState().works.find((ws) => ws.id === w.id)?.archived).not.toBe(true);

    archiveWork(w.id);
    const stored = useStore.getState().works.find((ws) => ws.id === w.id);
    expect(stored).toBeDefined();
    expect(stored?.archived).toBe(true);

    // By default archived items are hidden
    setWorkFilters({});
    expect(getFilteredWorks().find((ws) => ws.id === w.id)).toBeUndefined();

    // When showArchived is true, archived items are included
    setWorkFilters({ showArchived: true });
    expect(getFilteredWorks().find((ws) => ws.id === w.id)).toBeDefined();
  });

  it('unarchives a work and it appears in filtered results', () => {
    const { addWork, archiveWork, unarchiveWork, getFilteredWorks, setWorkFilters } = useStore.getState();

    const w = addWork({ workId: 'W2', title: 'To Unarchive', status: 'draft', versionType: 'ORI' });
    archiveWork(w.id);

    // Ensure archived is visible when requested
    setWorkFilters({ showArchived: true });
    expect(getFilteredWorks().find((ws) => ws.id === w.id)).toBeDefined();

    // Unarchive and ensure it's included when showArchived is false
    unarchiveWork(w.id);
    setWorkFilters({ showArchived: false });
    expect(useStore.getState().works.find((ws) => ws.id === w.id)?.archived).toBe(false);
    expect(getFilteredWorks().find((ws) => ws.id === w.id)).toBeDefined();
  });
});
