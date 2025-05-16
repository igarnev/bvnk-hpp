import { describe, it, expect, vi, beforeEach } from 'vitest';
import { debouncedToast } from '@utils/helpers/debounce-toast';
import { toast } from '@hooks/useToast';
import { DEBOUNCE_TIME } from '@utils/constants';
import type { TToastOptions } from '@models/TToastOptions';

// Mock the toast function
vi.mock('@hooks/useToast', () => ({
  toast: vi.fn()
}));

describe('debounce-toast', () => {
  const mockToastOptions: TToastOptions = {
    title: 'Test Toast',
    description: 'This is a test toast',
    variant: 'destructive'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should show toast immediately on first call', () => {
    debouncedToast(mockToastOptions);

    expect(toast).toHaveBeenCalledTimes(1);
    expect(toast).toHaveBeenCalledWith(mockToastOptions);
  });

  it('should not show toast if called within debounce time', () => {
    // First call
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(1);

    // Second call within debounce time
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(2);
  });

  it('should show toast again after debounce time has passed', () => {
    // First call
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(1);

    // Advance time by less than debounce time
    vi.advanceTimersByTime(DEBOUNCE_TIME - 100);
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(2); // Still only called once

    // Advance time past debounce time
    vi.advanceTimersByTime(100);
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(3); // Called twice now
  });

  it('should show multiple toasts with different options after debounce time', () => {
    const firstOptions: TToastOptions = {
      ...mockToastOptions,
      title: 'First Toast'
    };
    const secondOptions: TToastOptions = {
      ...mockToastOptions,
      title: 'Second Toast'
    };

    // First call
    debouncedToast(firstOptions);
    expect(toast).toHaveBeenCalledWith(firstOptions);

    // Advance time past debounce time
    vi.advanceTimersByTime(DEBOUNCE_TIME);

    // Second call with different options
    debouncedToast(secondOptions);
    expect(toast).toHaveBeenCalledWith(secondOptions);
    expect(toast).toHaveBeenCalledTimes(2);
  });

  it('should reset debounce timer after showing toast', () => {
    // First call
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(1);

    // Advance time past debounce time
    vi.advanceTimersByTime(DEBOUNCE_TIME);

    // Second call
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(2);

    // Third call within debounce time
    debouncedToast(mockToastOptions);
    expect(toast).toHaveBeenCalledTimes(3); // Still only called twice
  });
});
