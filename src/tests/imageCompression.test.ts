import { describe, it, expect } from 'vitest';
import { formatBytes } from '../utils/imageCompression';

describe('Image Compression Utilities', () => {
  it('should format bytes to readable human strings', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(2500000)).toBe('2.38 MB');
  });
});
