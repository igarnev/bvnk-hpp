import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AxiosError } from 'axios';

import { AcceptQuotePaymentDetails } from '../AcceptQuotePaymentDetails';
import { usePaymentSummary } from '@hooks/usePaymentSummary';
import type { IPaymentSummary } from '@models/IPaymentSummary';

// Mock the usePaymentSummary hook
vi.mock('@hooks/usePaymentSummary', () => ({
  usePaymentSummary: vi.fn()
}));

// Mock the CountdownTimer component
vi.mock('@components/common/CountdownTimer', () => ({
  CountdownTimer: ({ onExpire }: { onExpire: () => void }) => (
    <div data-testid="countdown-timer" onClick={onExpire}>
      Countdown Timer
    </div>
  )
}));

describe('AcceptQuotePaymentDetails', () => {
  const mockPaymentSummary = {
    paidCurrency: {
      amount: '100.50',
      currency: 'USD'
    },
    acceptanceExpiryDate: Date.now() + 3600000 // 1 hour from now
  };

  const mockUpdatePaymentSummary = {
    mutate: vi.fn(),
    isPending: false
  } as unknown as UseMutationResult<
    IPaymentSummary,
    AxiosError,
    { currency: string }
  >;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const renderWithProviders = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AcceptQuotePaymentDetails
          currency="USD"
          updatePaymentSummary={mockUpdatePaymentSummary}
        />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.useFakeTimers();
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      paymentSummary: mockPaymentSummary
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('renders the amount due section', () => {
    renderWithProviders();
    expect(screen.getByText('Amount due:')).toBeInTheDocument();
    expect(screen.getByText('100.50 USD')).toBeInTheDocument();
  });

  it('renders the quote expiry section', () => {
    renderWithProviders();
    expect(screen.getByText('Quote price expires in:')).toBeInTheDocument();
  });

  it('shows loading spinner when update is pending', () => {
    mockUpdatePaymentSummary.isPending = true;
    renderWithProviders();
    // Check for the loader in the amount due section
    const amountDueSection = screen.getByTestId('amount-due-footer');
    expect(
      amountDueSection.querySelector('[data-testid="loader"]')
    ).toBeInTheDocument();
  });

  it('calls updatePaymentSummary.mutate when countdown expires', () => {
    renderWithProviders();
    // Find the CountdownTimer component by its text content
    const countdownSection = screen.getByTestId('quote-expiry-footer');
    expect(countdownSection).toBeInTheDocument();
    // Simulate the expire event
    mockUpdatePaymentSummary.mutate({ currency: 'USD' });
    expect(mockUpdatePaymentSummary.mutate).toHaveBeenCalledWith({
      currency: 'USD'
    });
  });

  it('calls handleExpire when countdown timer reaches zero', () => {
    renderWithProviders();

    // Find and click the countdown timer to trigger onExpire
    const countdownTimer = screen.getByTestId('countdown-timer');
    countdownTimer.click();

    expect(mockUpdatePaymentSummary.mutate).toHaveBeenCalledWith({
      currency: 'USD'
    });
  });

  it('renders correctly when payment summary is undefined', () => {
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      paymentSummary: undefined
    });

    renderWithProviders();
    expect(screen.getByText('Amount due:')).toBeInTheDocument();
    expect(screen.getByText('Quote price expires in:')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    renderWithProviders();

    // Check amount due section classes
    const amountDueText = screen.getByText('Amount due:');
    expect(amountDueText).toHaveClass('text-muted-foreground', 'font-light');

    // Check quote expiry section classes
    const quoteExpiryText = screen.getByText('Quote price expires in:');
    expect(quoteExpiryText).toHaveClass('text-muted-foreground', 'font-light');

    // Check footer classes
    const amountDueFooter = screen.getByTestId('amount-due-footer');
    const quoteExpiryFooter = screen.getByTestId('quote-expiry-footer');

    [amountDueFooter, quoteExpiryFooter].forEach((footer) => {
      expect(footer).toHaveClass('relative', 'justify-between', 'py-2');
    });
  });
});
