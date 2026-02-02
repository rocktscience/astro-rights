import { describe, it, expect } from 'vitest';
import { parseNumberOrUndefined } from '@/lib/utils';

describe('utils.parseNumberOrUndefined', () => {
  it('parses numbers and preserves zero', () => {
    expect(parseNumberOrUndefined('0')).toBe(0);
    expect(parseNumberOrUndefined(' 0 ')).toBe(0);
    expect(parseNumberOrUndefined('15.5')).toBe(15.5);
    expect(parseNumberOrUndefined('')).toBeUndefined();
    expect(parseNumberOrUndefined(undefined)).toBeUndefined();
    expect(parseNumberOrUndefined('abc')).toBeUndefined();
  });
});
