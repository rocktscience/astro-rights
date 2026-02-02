import { describe, it, expect } from 'vitest';
import { sortByKey } from '@/lib/utils';

describe('sortByKey', () => {
  const items = [
    { id: '1', title: 'Banana', workId: 'W002', updatedAt: '2024-01-01' },
    { id: '2', title: 'Apple', workId: 'W001', updatedAt: '2024-02-01' },
    { id: '3', title: 'Cherry', workId: 'W003', updatedAt: '2023-12-01' },
  ];

  it('sorts by title asc', () => {
    const sorted = sortByKey(items, 'title', 'asc');
    expect(sorted.map((i) => i.title)).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('sorts by workId desc', () => {
    const sorted = sortByKey(items, 'workId', 'desc');
    expect(sorted.map((i) => i.workId)).toEqual(['W003', 'W002', 'W001']);
  });

  it('sorts by updatedAt asc (date)', () => {
    const sorted = sortByKey(items, 'updatedAt', 'asc');
    expect(sorted.map((i) => i.id)).toEqual(['3', '1', '2']);
  });
});