import { describe, it, expect } from 'vitest';
import { importEntities, mapWorkFromCSV } from '@/lib/csv-import';

describe('Works import mapping', () => {
  it('should map works CSV correctly', () => {
    const csv = `Work ID,Title,ISWC,Version Type,Language\nW1,"Title, With Comma",T-000000001-0,ORI,EN`;
    const { entities, stats } = importEntities(csv, mapWorkFromCSV);

    expect(stats.imported).toBe(1);
    expect(entities[0].workId).toBe('W1');
    expect(entities[0].title).toBe('Title, With Comma');
    expect(entities[0].iswc).toBe('T-000000001-0');
  });
});
