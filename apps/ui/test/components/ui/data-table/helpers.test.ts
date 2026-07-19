import { describe, expect, it } from 'vitest';
import {
  alignmentClass,
  formatCellValue,
  getValueByPath,
} from '../../../../src/components/ui/data-table/helpers';

describe('components/ui/data-table/helpers', () => {
  describe('getValueByPath', () => {
    it('should return nested values for dot-separated paths', () => {
      const row = {
        user: {
          profile: {
            email: 'user@example.com',
          },
        },
      };

      const value = getValueByPath(row, 'user.profile.email');

      expect(value).toBe('user@example.com');
    });

    it('should return undefined when an intermediate path segment is missing', () => {
      const row = {
        user: {
          profile: undefined,
        },
      };

      const value = getValueByPath(row, 'user.profile.email');

      expect(value).toBeUndefined();
    });
  });

  describe('formatCellValue', () => {
    it('should return an empty string for null and undefined values', () => {
      expect(formatCellValue(null)).toBe('');
      expect(formatCellValue(undefined)).toBe('');
    });

    it('should format primitive and date values', () => {
      const date = new Date('2026-01-02T03:04:05.000Z');

      expect(formatCellValue('hello')).toBe('hello');
      expect(formatCellValue(42)).toBe('42');
      expect(formatCellValue(42n)).toBe('42');
      expect(formatCellValue(true)).toBe('Yes');
      expect(formatCellValue(false)).toBe('No');
      expect(formatCellValue(Symbol('status'))).toBe('status');
      expect(formatCellValue(date)).toBe('2026-01-02T03:04:05.000Z');
    });

    it('should stringify object values', () => {
      const value = formatCellValue({ state: 'active' });

      expect(value).toBe('{"state":"active"}');
    });
  });

  describe('alignmentClass', () => {
    it('should return text alignment classes for center and right', () => {
      expect(alignmentClass('center')).toBe('text-center');
      expect(alignmentClass('right')).toBe('text-right');
    });

    it('should return undefined for left alignment', () => {
      expect(alignmentClass('left')).toBeUndefined();
    });
  });
});
