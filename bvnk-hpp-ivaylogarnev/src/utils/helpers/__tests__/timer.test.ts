import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatTime, getRemainingTime } from '../timer';

describe('timer helper', () => {
  describe('formatTime', () => {
    it('should format seconds into HH:MM:SS format', () => {
      expect(formatTime(0)).toBe('00:00:00');
      expect(formatTime(59)).toBe('00:00:59');
      expect(formatTime(60)).toBe('00:01:00');
      expect(formatTime(3599)).toBe('00:59:59');
      expect(formatTime(3600)).toBe('01:00:00');
      expect(formatTime(3661)).toBe('01:01:01');
      expect(formatTime(7200)).toBe('02:00:00');
    });

    it('should handle large numbers of seconds', () => {
      expect(formatTime(86400)).toBe('24:00:00');
      expect(formatTime(90061)).toBe('25:01:01');
    });

    it('should handle negative numbers', () => {
      expect(formatTime(-1)).toBe('00:00:00');
      expect(formatTime(-60)).toBe('00:00:00');
    });
  });

  describe('getRemainingTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should calculate remaining time correctly', () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);

      const expiryDate = new Date('2024-01-01T12:01:00Z').getTime(); // 1 minute later
      expect(getRemainingTime(expiryDate)).toBe(60);

      const expiryDate2 = new Date('2024-01-01T12:00:30Z').getTime(); // 30 seconds later
      expect(getRemainingTime(expiryDate2)).toBe(30);
    });

    it('should return 0 for past expiry dates', () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);

      const pastDate = new Date('2024-01-01T11:59:00Z').getTime(); // 1 minute ago
      expect(getRemainingTime(pastDate)).toBe(0);
    });

    it('should handle current time being equal to expiry time', () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);

      expect(getRemainingTime(now)).toBe(0);
    });

    it('should handle large time differences', () => {
      const now = new Date('2024-01-01T12:00:00Z').getTime();
      vi.setSystemTime(now);

      const futureDate = new Date('2024-01-01T13:00:00Z').getTime(); // 1 hour later
      expect(getRemainingTime(futureDate)).toBe(3600);

      const futureDate2 = new Date('2024-01-02T12:00:00Z').getTime(); // 24 hours later
      expect(getRemainingTime(futureDate2)).toBe(86400);
    });
  });
});
