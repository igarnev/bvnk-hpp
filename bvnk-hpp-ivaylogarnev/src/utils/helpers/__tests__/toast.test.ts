import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { debouncedToast } from '../toast';
import { toast } from '@hooks/useToast';
import { DEBOUNCE_TIME } from '@utils/constants';

vi.mock('@hooks/useToast', () => ({
  toast: vi.fn()
}));

describe('debouncedToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    (toast as ReturnType<typeof vi.fn>).mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call toast the first time', () => {
    debouncedToast({ title: 'First toast' });
    expect(toast).toHaveBeenCalledWith({ title: 'First toast' });
  });
});
