import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { PayQuoteQrCodeSection } from '../PayQuoteQrCodeSection';
import { getCryptoPaymentUri } from '@utils/helpers/get-crypto-payment-uri';

// Mock the QRCode component
vi.mock('react-qr-code', () => ({
  default: ({ value }: { value: string }) => (
    <div data-testid="qr-code" data-value={value} />
  )
}));

describe('PayQuoteQrCodeSection', () => {
  const mockProps = {
    currency: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    amount: '0.001'
  };

  it('renders the QR code with correct payment URI', () => {
    render(<PayQuoteQrCodeSection {...mockProps} />);

    const qrCode = screen.getByTestId('qr-code');
    const expectedUri = getCryptoPaymentUri(
      mockProps.currency,
      mockProps.address,
      mockProps.amount
    );

    expect(qrCode).toHaveAttribute('data-value', expectedUri);
  });

  it('displays the full address below the QR code', () => {
    render(<PayQuoteQrCodeSection {...mockProps} />);

    expect(screen.getByText(mockProps.address)).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<PayQuoteQrCodeSection {...mockProps} />);

    // Check QR code container styling
    const qrCodeContainer = screen
      .getByTestId('qr-code')
      .closest('[data-slot="card-content"]');
    expect(qrCodeContainer).toHaveClass('flex', 'justify-center');

    // Check address text styling
    const addressText = screen.getByText(mockProps.address);
    expect(addressText).toHaveClass(
      'text-muted-foreground',
      'font-light',
      'text-xs'
    );
  });

  it('renders correctly with different currencies', () => {
    const ethProps = {
      ...mockProps,
      currency: 'ETH',
      address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
    };

    render(<PayQuoteQrCodeSection {...ethProps} />);

    const qrCode = screen.getByTestId('qr-code');
    const expectedUri = getCryptoPaymentUri(
      ethProps.currency,
      ethProps.address,
      ethProps.amount
    );

    expect(qrCode).toHaveAttribute('data-value', expectedUri);
    expect(screen.getByText(ethProps.address)).toBeInTheDocument();
  });
});
