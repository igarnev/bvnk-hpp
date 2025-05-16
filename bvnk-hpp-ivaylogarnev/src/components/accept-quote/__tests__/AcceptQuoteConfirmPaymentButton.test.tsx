import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { AcceptQuoteConfirmPaymentButton } from '../AcceptQuoteConfirmPaymentButton';
import { useAcceptPayment } from '@hooks/useAcceptPayment';

// Mock the useAcceptPayment hook
vi.mock('@hooks/useAcceptPayment', () => ({
  useAcceptPayment: vi.fn()
}));

describe('AcceptQuoteConfirmPaymentButton', () => {
  const mockAcceptPayment = {
    mutate: vi.fn()
  };

  beforeEach(() => {
    // Default mock implementation
    (useAcceptPayment as ReturnType<typeof vi.fn>).mockReturnValue({
      acceptPayment: mockAcceptPayment
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with "Confirm" text when not pending', () => {
    render(
      <MemoryRouter>
        <AcceptQuoteConfirmPaymentButton
          isUpdatePaymentPending={false}
          currency="BTC"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('renders with "Processing..." text when pending', () => {
    render(
      <MemoryRouter>
        <AcceptQuoteConfirmPaymentButton
          isUpdatePaymentPending={true}
          currency="BTC"
        />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: 'Processing...' })
    ).toBeInTheDocument();
  });

  it('is disabled when update is pending', () => {
    render(
      <MemoryRouter>
        <AcceptQuoteConfirmPaymentButton
          isUpdatePaymentPending={true}
          currency="BTC"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when no currency is selected', () => {
    render(
      <MemoryRouter>
        <AcceptQuoteConfirmPaymentButton
          isUpdatePaymentPending={false}
          currency=""
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled after being clicked', () => {
    render(
      <MemoryRouter>
        <AcceptQuoteConfirmPaymentButton
          isUpdatePaymentPending={false}
          currency="BTC"
        />
      </MemoryRouter>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();
  });

  it('calls acceptPayment.mutate when clicked', () => {
    render(
      <MemoryRouter>
        <AcceptQuoteConfirmPaymentButton
          isUpdatePaymentPending={false}
          currency="BTC"
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(mockAcceptPayment.mutate).toHaveBeenCalledTimes(1);
  });

  it('has correct styling classes', () => {
    render(
      <MemoryRouter>
        <AcceptQuoteConfirmPaymentButton
          isUpdatePaymentPending={false}
          currency="BTC"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('button')).toHaveClass('w-full');
  });
});
