import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PayQuotePaymentAddress } from '../PayQuotePaymentAddress';
import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';

// Mock the hooks
vi.mock('@hooks/usePaymentSummary');
vi.mock('@hooks/useCopyToClipboard');

const mockPaymentSummary = {
  address: {
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
  },
  paidCurrency: {
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
      <PayQuotePaymentAddress />
    </QueryClientProvider>
  );
};

describe('PayQuotePaymentAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePaymentSummary as unknown as jest.Mock).mockReturnValue({
      paymentSummary: mockPaymentSummary
    });
    (useCopyToClipboard as unknown as jest.Mock).mockReturnValue(
      mockCopyToClipboard
    );
  });

  it('renders the address section with currency', () => {
    renderWithProviders();
    const addressLabel = screen.getByText(/BTC\s+address:/);
    expect(addressLabel).toBeInTheDocument();
  });

  it('displays truncated address', () => {
    renderWithProviders();
    const addressContainer = screen.getByText(/bc1qxy2/).closest('div');
    expect(addressContainer).toHaveTextContent(/bc1qxy2.*\.\.\..*x0wlh/);
  });

  it('shows copy button when not copied', () => {
    renderWithProviders();
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('shows copied text when copied', () => {
    (useCopyToClipboard as unknown as jest.Mock).mockReturnValue({
      ...mockCopyToClipboard,
      copiedText: mockPaymentSummary.address.address
    });

    renderWithProviders();
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('calls handleCopyToClipboard with full address when copy button is clicked', () => {
    renderWithProviders();
    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);
    expect(mockCopyToClipboard.handleCopyToClipboard).toHaveBeenCalledWith(
      mockPaymentSummary.address.address
    );
  });

  it('applies correct styling when copied', () => {
    (useCopyToClipboard as unknown as jest.Mock).mockReturnValue({
      ...mockCopyToClipboard,
      copiedText: mockPaymentSummary.address.address
    });

    renderWithProviders();

    // Check address container styling
    const addressContainer = screen
      .getByText(/bc1qxy2/)
      .closest('[data-slot="card-content"]');
    expect(addressContainer).toHaveClass('flex', 'justify-between');

    // Check copy button styling
    const copyButton = screen.getByRole('button', { name: 'Copied!' });
    expect(copyButton).toHaveClass('text-secondary');
  });

  it('handles missing payment summary gracefully', () => {
    (usePaymentSummary as unknown as jest.Mock).mockReturnValue({
      paymentSummary: null
    });

    renderWithProviders();
    const addressLabel = screen.getByText(/address:/);
    expect(addressLabel).toBeInTheDocument();
    expect(screen.queryByText(/bc1qxy2/)).not.toBeInTheDocument();
  });
});
