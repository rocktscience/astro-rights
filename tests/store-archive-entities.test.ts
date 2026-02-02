import { beforeEach, describe, expect, it } from 'vitest';

// localStorage mock for persistence middleware
const __mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  } as Storage;
})();

(globalThis as unknown as { localStorage?: Storage }).localStorage = __mockLocalStorage;

import { useStore } from '@/store';

type Store = ReturnType<typeof useStore.getState>;

describe('store archive/unarchive (entities)', () => {
  beforeEach(() => {
    useStore.getState().clearAllData();
  });

  const entityTests = [
    {
      name: 'release',
      add: (s: Store) => s.addRelease({ releaseId: 'R1', releaseName: 'Test Release', releaseType: 'album', recordingIds: [], isControlled: false }),
      list: (s: Store) => s.releases,
      archive: (s: Store, id: string) => s.archiveRelease(id),
      unarchive: (s: Store, id: string) => s.unarchiveRelease(id),
    },
    {
      name: 'publisher',
      add: (s: Store) => s.addPublisher({ publisherId: 'P1', name: 'Pubco', isControlled: false, role: 'E', publishingShareIds: [] }),
      list: (s: Store) => s.publishers,
      archive: (s: Store, id: string) => s.archivePublisher(id),
      unarchive: (s: Store, id: string) => s.unarchivePublisher(id),
    },
    {
      name: 'label',
      add: (s: Store) => s.addLabel({ labelId: 'L1', name: 'LabelCo', isControlled: false, recordingIds: [], releaseIds: [] }),
      list: (s: Store) => s.labels,
      archive: (s: Store, id: string) => s.archiveLabel(id),
      unarchive: (s: Store, id: string) => s.unarchiveLabel(id),
    },
    {
      name: 'recording',
      add: (s: Store) => s.addRecording({ recordingId: 'REC1', title: 'Rec', duration: '120', isControlled: false, artistIds: [] }),
      list: (s: Store) => s.recordings,
      archive: (s: Store, id: string) => s.archiveRecording(id),
      unarchive: (s: Store, id: string) => s.unarchiveRecording(id),
    },
    {
      name: 'agreement',
      add: (s: Store) => s.addAgreement({ agreementId: 'A1', title: 'Agreement', type: 'publishing', status: 'draft', agreementTerritoryIds: [], agreementPartyIds: [], numberOfWorks: 0, workIds: [], releaseIds: [] }),
      list: (s: Store) => s.agreements,
      archive: (s: Store, id: string) => s.archiveAgreement(id),
      unarchive: (s: Store, id: string) => s.unarchiveAgreement(id),
    },
    {
      name: 'writer',
      add: (s: Store) => s.addWriter({ writerId: 'W1', lastName: 'Doe', firstName: 'Jane', name: 'Jane Doe', isControlled: false, writerShareIds: [] }),
      list: (s: Store) => s.writers,
      archive: (s: Store, id: string) => s.archiveWriter(id),
      unarchive: (s: Store, id: string) => s.unarchiveWriter(id),
    },

  ];

  for (const t of entityTests) {
    it(`archives and unarchives a ${t.name}`, () => {
      const s = useStore.getState();
      const item = t.add(s);
      expect(t.list(useStore.getState()).find((i: unknown) => ((i as { id: string }).id === item.id))?.archived).not.toBe(true);

      t.archive(s, item.id);
      expect(t.list(useStore.getState()).find((i: unknown) => ((i as { id: string }).id === item.id))?.archived).toBe(true);

      t.unarchive(s, item.id);
      expect(t.list(useStore.getState()).find((i: unknown) => ((i as { id: string }).id === item.id))?.archived).toBe(false);
    });
  }

  it('archiveAllData archives all supported entities', () => {
    const s = useStore.getState();
    const r = s.addRelease({ releaseId: 'R2', releaseName: 'R2', releaseType: 'single', recordingIds: [], isControlled: false });
    const w = s.addWriter({ writerId: 'W2', lastName: 'X', firstName: 'Y', name: 'Y X', isControlled: false, writerShareIds: [] });
    const p = s.addPublisher({ publisherId: 'P2', name: 'P2', isControlled: false, role: 'E', publishingShareIds: [] });

    s.archiveAllData();

    const current = useStore.getState();
    expect(current.releases.find(r2 => r2.id === r.id)?.archived).toBe(true);
    expect(current.writers.find(w2 => w2.id === w.id)?.archived).toBe(true);
    expect(current.publishers.find(p2 => p2.id === p.id)?.archived).toBe(true);
  });
});
