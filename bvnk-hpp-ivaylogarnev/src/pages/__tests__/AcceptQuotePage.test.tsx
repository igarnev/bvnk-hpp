import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AcceptQuotePage } from '../AcceptQuotePage';
import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useUpdatePaymentSummary } from '@hooks/useUpdatePaymentSummary';

// Mock the hooks
vi.mock('@hooks/usePaymentSummary', () => ({
  usePaymentSummary: vi.fn()
}));

vi.mock('@hooks/useUpdatePaymentSummary', () => ({
  useUpdatePaymentSummary: vi.fn()
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

describe('AcceptQuotePage', () => {
  const mockUpdatePaymentSummary = {
    mutate: vi.fn(),
    isPending: false
  };

  beforeEach(() => {
    // Default mock implementation
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      error: null
    });

    (useUpdatePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      updatePaymentSummary: mockUpdatePaymentSummary
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('renders loading spinner when loading', () => {
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
      error: null
    });

    renderWithProviders(<AcceptQuotePage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error banner when there is an error', () => {
    (usePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      error: new Error('Test error')
    });

    renderWithProviders(<AcceptQuotePage />);
    expect(
      screen.getByText('Error loading payment summary')
    ).toBeInTheDocument();
  });

  it('renders the main content when data is loaded', () => {
    renderWithProviders(<AcceptQuotePage />);

    // Check for the header
    expect(screen.getByText('Merchant Display Name')).toBeInTheDocument();

    // Check for the currency selector
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select Currency')).toBeInTheDocument();

    // Payment details should not be visible initially
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();

    // Check for the confirm payment button
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('shows payment details when currency is selected', () => {
    renderWithProviders(<AcceptQuotePage />);

    // Select a currency
    const currencySelector = screen.getByRole('combobox');
    fireEvent.click(currencySelector);

    // Select a currency option
    const option = screen.getByRole('option', { name: 'Bitcoin (BTC)' });
    fireEvent.click(option);

    // Payment details should now be visible
    expect(screen.getByText('Amount due:')).toBeInTheDocument();
  });

  it('handles currency change correctly', () => {
    renderWithProviders(<AcceptQuotePage />);

    const currencySelector = screen.getByRole('combobox');
    fireEvent.click(currencySelector);

    // Select a currency option
    const option = screen.getByRole('option', { name: 'Bitcoin (BTC)' });
    fireEvent.click(option);

    expect(mockUpdatePaymentSummary.mutate).toHaveBeenCalledWith({
      currency: 'BTC'
    });
  });

  it('disables confirm button when update is pending', () => {
    (useUpdatePaymentSummary as ReturnType<typeof vi.fn>).mockReturnValue({
      updatePaymentSummary: {
        ...mockUpdatePaymentSummary,
        isPending: true
      }
    });

    renderWithProviders(<AcceptQuotePage />);

    const confirmButton = screen.getByRole('button', { name: 'Processing...' });
    expect(confirmButton).toBeDisabled();
  });

  it('has correct styling classes', () => {
    renderWithProviders(<AcceptQuotePage />);

    // Check main container classes
    const container = screen
      .getByText('Merchant Display Name')
      .closest('[data-slot="card"]')?.parentElement;
    expect(container).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center'
    );

    // Check card classes
    const card = screen
      .getByText('Merchant Display Name')
      .closest('[data-slot="card"]');
    expect(card).toHaveClass('w-full', 'max-w-md');
  });
});
