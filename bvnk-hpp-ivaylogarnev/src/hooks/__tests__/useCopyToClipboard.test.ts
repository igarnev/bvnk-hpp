import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from '../useCopyToClipboard';

describe('useCopyToClipboard', () => {
  const mockClipboard = {
    writeText: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: mockClipboard
    });
  });

  it('should initialize with empty copiedText', () => {
    const { result } = renderHook(() => useCopyToClipboard());

    expect(result.current.copiedText).toBe('');
  });

  it('should copy text to clipboard and update copiedText state', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    const testText = 'test text';

    await act(async () => {
      result.current.handleCopyToClipboard(testText);
    });

    expect(mockClipboard.writeText).toHaveBeenCalledWith(testText);
    expect(result.current.copiedText).toBe(testText);
  });

  it('should clear copiedText after 1 second', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    const testText = 'test text';

    await act(async () => {
      result.current.handleCopyToClipboard(testText);
    });

    expect(result.current.copiedText).toBe(testText);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.copiedText).toBe('');
  });

  it('should not clear copiedText before 1 second', async () => {
    const { result } = renderHook(() => useCopyToClipboard());
    const testText = 'test text';

    await act(async () => {
      result.current.handleCopyToClipboard(testText);
    });

    expect(result.current.copiedText).toBe(testText);

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.copiedText).toBe(testText);
  });

  it('should clear timeout when component unmounts', async () => {
    const { result, unmount } = renderHook(() => useCopyToClipboard());
    const testText = 'test text';

    await act(async () => {
      result.current.handleCopyToClipboard(testText);
    });

    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
