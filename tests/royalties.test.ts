import { describe, it, expect } from 'vitest';
import { parseRoyaltyCSV } from '@/lib/royalty-calculator';

describe('Royalty CSV parsing', () => {
  it('parseRoyaltyCSV handles quoted titles and numeric parsing', () => {
    const csv = `WorkID,Title,Amount,Net,Right Type\nRW-1,"Symphony, No. 1",1000,900,PR\nRW-2,"Song, Part II",2000,1800,MR`;
    const { rows, errors } = parseRoyaltyCSV(csv, { workTitle: 'Title', grossAmount: 'Amount', netAmount: 'Net', rightType: 'Right Type' });
    expect(errors.length).toBe(0);
    expect(rows.length).toBe(2);
    expect(rows[0].workTitle).toBe('Symphony, No. 1');
    expect(rows[0].grossAmount).toBe(1000);
    expect(rows[1].rightType).toBe('MR');
  });
});
