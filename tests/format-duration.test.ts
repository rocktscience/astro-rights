import { describe, it, expect } from 'vitest';
import { formatDuration } from '@/lib/utils';

describe('formatDuration', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatDuration(125)).toBe('2:05');
    expect(formatDuration(60)).toBe('1:00');
  });

  it('formats hours when necessary', () => {
    expect(formatDuration(3725)).toBe('1:02:05');
  });
});