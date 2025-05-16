import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { CountdownTimer } from '../CountdownTimer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders initial time correctly', () => {
    const expiryDate = Date.now() + 3600000; // 1 hour from now
    render(<CountdownTimer expiryDate={expiryDate} onExpire={() => {}} />);

    expect(screen.getByText('01:00:00')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(
      <CountdownTimer
        expiryDate={Date.now() + 3600000}
        onExpire={() => {}}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('counts down correctly', () => {
    const expiryDate = Date.now() + 5000; // 5 seconds from now
    render(<CountdownTimer expiryDate={expiryDate} onExpire={() => {}} />);

    // Initial time
    expect(screen.getByText('00:00:05')).toBeInTheDocument();

    // After 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('00:00:04')).toBeInTheDocument();

    // After 2 seconds
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText('00:00:03')).toBeInTheDocument();
  });

  it('calls onExpire when timer reaches zero', () => {
    const onExpire = vi.fn();
    const expiryDate = Date.now() + 2000; // 2 seconds from now

    render(<CountdownTimer expiryDate={expiryDate} onExpire={onExpire} />);

    // Advance past expiry
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onExpire).toHaveBeenCalled();
    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });

  it('cleans up interval on unmount', () => {
    const expiryDate = Date.now() + 3600000;
    const { unmount } = render(
      <CountdownTimer expiryDate={expiryDate} onExpire={() => {}} />
    );

    // Spy on clearInterval
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval');

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('handles zero or negative expiry date', () => {
    render(<CountdownTimer expiryDate={0} onExpire={() => {}} />);
    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });
});
