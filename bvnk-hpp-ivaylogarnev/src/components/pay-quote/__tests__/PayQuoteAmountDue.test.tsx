import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PayQuoteAmountDue } from '../PayQuoteAmountDue';
import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';

// Mock the hooks
vi.mock('@hooks/usePaymentSummary');
vi.mock('@hooks/useCopyToClipboard');

const mockPaymentSummary = {
  paidCurrency: {
    amount: '100.50',
    currency: 'BTC'
  }
};

const mockCopyToClipboard = {
  copiedText: '',
  handleCopyToClipboard: vi.fn()
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
      <PayQuoteAmountDue />
    </QueryClientProvider>
  );
};

describe('PayQuoteAmountDue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePaymentSummary as unknown as jest.Mock).mockReturnValue({
      paymentSummary: mockPaymentSummary
    });
    (useCopyToClipboard as unknown as jest.Mock).mockReturnValue(
      mockCopyToClipboard
    );
  });

  it('renders the amount due section', () => {
    renderWithProviders();
    expect(screen.getByText('Amount due:')).toBeInTheDocument();
  });

  it('displays the correct amount and currency', () => {
    renderWithProviders();
    expect(screen.getByText('100.50 BTC')).toBeInTheDocument();
  });

  it('shows copy button when not copied', () => {
    renderWithProviders();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('shows copied text when copied', () => {
    (useCopyToClipboard as unknown as jest.Mock).mockReturnValue({
      ...mockCopyToClipboard,
      copiedText: '100.50'
    });

    renderWithProviders();
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('calls handleCopyToClipboard when copy button is clicked', () => {
    renderWithProviders();
    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);
    expect(mockCopyToClipboard.handleCopyToClipboard).toHaveBeenCalledWith(
      '100.50'
    );
  });

  it('applies correct styling when copied', () => {
    (useCopyToClipboard as unknown as jest.Mock).mockReturnValue({
      ...mockCopyToClipboard,
      copiedText: '100.50'
    });

    renderWithProviders();

    // Check amount text styling
    const amountText = screen.getByText('100.50 BTC');
    expect(amountText).toHaveClass('font-semibold', 'text-primary');

    // Check copy button styling
    const copyButton = screen.getByRole('button', { name: 'Copied!' });
    expect(copyButton).toHaveClass('text-secondary');
  });

  it('handles missing payment summary gracefully', () => {
    (usePaymentSummary as unknown as jest.Mock).mockReturnValue({
      paymentSummary: null
    });

    renderWithProviders();
    expect(screen.getByText('Amount due:')).toBeInTheDocument();
    expect(screen.queryByText('100.50 BTC')).not.toBeInTheDocument();
  });
});
