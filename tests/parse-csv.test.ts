import { describe, it, expect } from 'vitest';
import { parseCSV, importEntities, mapLabelFromCSV, mapWriterFromCSV } from '@/lib/csv-import';

describe('CSV parsing utilities', () => {
  it('parseCSV should handle quoted commas', () => {
    const csv = `id,title\n1,"Hello, World"\n2,"Quoted, Title, With, Commas"`;
    const records = parseCSV(csv);
    expect(records.length).toBe(2);
    expect(records[0].title).toBe('Hello, World');
    expect(records[1].title).toBe('Quoted, Title, With, Commas');
  });

  it('importEntities should map labels correctly', () => {
    const csv = `Label ID,Name,Controlled\nLBL1,Label One,yes\nLBL2,Label Two,no`;
    const { entities, stats } = importEntities(csv, mapLabelFromCSV);
    expect(stats.imported).toBe(2);
    expect(entities[0].labelId).toBe('LBL1');
    expect(entities[0].isControlled).toBe(true);
    expect(entities[1].name).toBe('Label Two');
  });

  it('mapWriterFromCSV handles PRO field and optional columns (debug)', () => {
    const csv = `Writer ID,Name,PRO\nW1,Jane Doe,ASCAP`;
    const records = parseCSV(csv);
    // sanity check of parseCSV
    expect(records.length).toBe(1);
    expect(records[0]['Writer ID']).toBe('W1');

    const res = importEntities(csv, mapWriterFromCSV);
    // debug output to help if something goes wrong
    // eslint-disable-next-line no-console
    console.log('importEntities result:', JSON.stringify(res));

    expect(res.stats.imported).toBe(1);
    expect(res.entities[0].writerId).toBe('W1');
    expect(res.entities[0].name).toBe('Jane Doe');
    expect(res.entities[0].pro).toBe('ASCAP');
  });

  it('mapWriterFromCSV should not throw when passed a direct object', () => {
    const obj = { 'Writer ID': 'W1', 'Name': 'Jane Doe', 'PRO': 'ASCAP' } as Record<string, string>;
    const mapped = mapWriterFromCSV(obj);
    expect(mapped.writerId).toBe('W1');
    expect(mapped.pro).toBe('ASCAP');
  });
});
