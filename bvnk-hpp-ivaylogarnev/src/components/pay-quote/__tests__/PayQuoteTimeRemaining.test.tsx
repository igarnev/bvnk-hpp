import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';

import { PayQuoteTimeRemaining } from '../PayQuoteTimeRemaining';
import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { ROUTES } from '@utils/constants';

// Mock the hooks
vi.mock('@hooks/usePaymentSummary');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

// Mock the CountdownTimer component
vi.mock('@components/common/CountdownTimer', () => ({
  CountdownTimer: ({ onExpire }: { onExpire: () => void }) => (
    <div data-testid="countdown-timer" onClick={onExpire}>
      Countdown Timer
    </div>
  )
}));

describe('PayQuoteTimeRemaining', () => {
  const mockNavigate = vi.fn();
  const mockExpiryDate = Date.now() + 3600000; // 1 hour from now

  beforeEach(() => {
    vi.clearAllMocks();
    (usePaymentSummary as unknown as jest.Mock).mockReturnValue({
      paymentSummary: {
        expiryDate: mockExpiryDate
      }
    });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <PayQuoteTimeRemaining />
      </MemoryRouter>
    );
  };

  it('renders the time remaining section', () => {
    renderComponent();
    expect(screen.getByText('Time left to pay')).toBeInTheDocument();
  });

  it('renders the countdown timer with correct props', () => {
    renderComponent();
    const timer = screen.getByTestId('countdown-timer');
    expect(timer).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    renderComponent();

    // Check footer container styling
    const footer = screen
      .getByText('Time left to pay')
      .closest('[data-slot="card-footer"]');
    expect(footer).toHaveClass('relative', 'justify-between');

    // Check time text styling
    const timeText = screen.getByText('Time left to pay');
    expect(timeText).toHaveClass('text-muted-foreground', 'font-light');
  });

  it('handles missing payment summary gracefully', () => {
    (usePaymentSummary as unknown as jest.Mock).mockReturnValue({
      paymentSummary: null
    });

    renderComponent();
    expect(screen.getByText('Time left to pay')).toBeInTheDocument();
    expect(screen.getByTestId('countdown-timer')).toBeInTheDocument();
  });

  it('navigates to expired page when timer expires', async () => {
    vi.useFakeTimers();
    renderComponent();

    // Trigger the onExpire callback
    const timer = screen.getByTestId('countdown-timer');
    await act(async () => {
      timer.click();
    });

    // Fast-forward past the setTimeout delay
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PAYMENT_EXPIRED, {
      replace: true
    });

    vi.useRealTimers();
  });
});
