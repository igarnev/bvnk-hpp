import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AcceptQuoteHeader } from '../AcceptQuoteHeader';
import { usePaymentSummary } from '@hooks/usePaymentSummary';

// Mock the usePaymentSummary hook
vi.mock('@hooks/usePaymentSummary', () => ({
  usePaymentSummary: vi.fn()
}));

describe('AcceptQuoteHeader', () => {
  const mockPaymentSummary = {
    displayCurrency: {
      amount: '100.50',
      currency: 'USD'
    },
    reference: 'REF123'
  };

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
        <AcceptQuoteHeader />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      paymentSummary: mockPaymentSummary
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('renders the merchant name', () => {
    renderWithProviders();
    expect(screen.getByText('Merchant Display Name')).toBeInTheDocument();
  });

  it('renders the payment amount and currency', () => {
    renderWithProviders();
    expect(screen.getByText('100.50')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('renders the reference number', () => {
    renderWithProviders();
    expect(screen.getByText('For reference number:')).toBeInTheDocument();
    expect(screen.getByText('REF123')).toBeInTheDocument();
  });

  it('renders correctly when payment summary is undefined', () => {
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      paymentSummary: undefined
    });

    renderWithProviders();
    expect(screen.getByText('Merchant Display Name')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    renderWithProviders();

    // Check header container classes
    const header = screen
      .getByText('Merchant Display Name')
      .closest('[data-slot="card-header"]');
    expect(header).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'text-center'
    );

    // Check title classes
    const title = screen.getByText('Merchant Display Name');
    expect(title).toHaveClass('text-lg', 'font-medium');

    // Check amount container classes
    const amountContainer = screen.getByText('100.50').parentElement;
    expect(amountContainer).toHaveClass(
      'flex',
      'justify-center',
      'items-end',
      'gap-2'
    );

    // Check amount classes
    const amount = screen.getByText('100.50');
    expect(amount).toHaveClass('text-3xl', 'font-medium');

    // Check currency classes
    const currency = screen.getByText('USD');
    expect(currency).toHaveClass('text-xl', 'font-medium');

    // Check reference text classes
    const referenceText = screen.getByText('For reference number:');
    expect(referenceText).toHaveClass(
      'text-sm',
      'text-muted-foreground',
      'font-light'
    );

    // Check reference container classes
    const referenceContainer = referenceText.closest('div');
    expect(referenceContainer).toHaveClass('mt-4');
  });
});
