import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PayQuotePage } from '../PayQuotePage';
import { usePaymentSummary } from '@hooks/usePaymentSummary';

// Mock the hooks
vi.mock('@hooks/usePaymentSummary', () => ({
  usePaymentSummary: vi.fn()
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{component}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('PayQuotePage', () => {
  const mockPaymentSummary = {
    address: {
      address: 'test-address'
    },
    paidCurrency: {
      currency: 'BTC',
      amount: '1.5'
    }
  };

  beforeEach(() => {
    // Default mock implementation
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      paymentSummary: mockPaymentSummary
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('renders loading spinner when address is not available', () => {
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      paymentSummary: { ...mockPaymentSummary, address: null }
    });

    renderWithProviders(<PayQuotePage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders the main content when data is loaded', () => {
    renderWithProviders(<PayQuotePage />);

    // Check for the header
    expect(screen.getByText('Pay with BTC')).toBeInTheDocument();

    // Check for amount due section
    expect(screen.getByText('Amount due:')).toBeInTheDocument();
    expect(screen.getByText('1.5 BTC')).toBeInTheDocument();

    // Check for payment address section
    expect(screen.getByText('BTC address:')).toBeInTheDocument();
    expect(screen.getByText('test-address')).toBeInTheDocument();

    // Check for QR code section
    const qrCode = document.querySelector('svg[height="150"][width="150"]');
    expect(qrCode).toBeInTheDocument();
  });

  it('does not render content when currency is not available', () => {
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      paymentSummary: {
        address: { address: 'test-address' }
      }
    });

    renderWithProviders(<PayQuotePage />);
    expect(screen.queryByText('Pay with')).not.toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    renderWithProviders(<PayQuotePage />);

    // Check main container classes
    const container = screen
      .getByText('Pay with BTC')
      .closest('[data-slot="card"]')?.parentElement;
    expect(container).toHaveClass(
      'flex',
      'items-center',
      'justify-center',
      'bg-gray-100'
    );

    // Check card classes
    const card = screen.getByText('Pay with BTC').closest('[data-slot="card"]');
    expect(card).toHaveClass('w-full', 'max-w-md', 'bg-white', 'gap-2');
  });
});
