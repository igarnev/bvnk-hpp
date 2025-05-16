import { cn } from '../config-shadcn';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
  });

  it('should handle conditional classes', () => {
    expect(
      cn('base-class', { 'active-class': true, 'inactive-class': false })
    ).toBe('base-class active-class');
  });

  it('should handle Tailwind class conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle undefined and null values', () => {
    expect(cn('base-class', undefined, null)).toBe('base-class');
  });

  it('should handle empty strings', () => {
    expect(cn('base-class', '')).toBe('base-class');
  });

  it('should handle multiple class conflicts', () => {
    expect(cn('px-2 py-1 bg-red-500', 'px-4 py-2 bg-blue-500')).toBe(
      'px-4 py-2 bg-blue-500'
    );
  });
});
