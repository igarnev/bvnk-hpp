import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { PayQuoteHeader } from '../PayQuoteHeader';

describe('PayQuoteHeader', () => {
  const renderHeader = (currency: string) => {
    return render(<PayQuoteHeader currency={currency} />);
  };

  it('renders the title with the correct currency', () => {
    renderHeader('BTC');
    expect(screen.getByText('Pay with BTC')).toBeInTheDocument();
  });

  it('renders the description with the correct currency', () => {
    renderHeader('BTC');
    expect(
      screen.getByText(
        'To complete this payment send the amount due to the BTC address provided below.'
      )
    ).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    renderHeader('BTC');

    // Check header container classes
    const header = screen
      .getByText('Pay with BTC')
      .closest('[data-slot="card-header"]');
    expect(header).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'text-center'
    );

    // Check title classes
    const title = screen.getByText('Pay with BTC');
    expect(title).toHaveClass('text-lg', 'mb-4', 'font-medium');

    // Check description classes
    const description = screen.getByText(
      'To complete this payment send the amount due to the BTC address provided below.'
    );
    expect(description).toHaveClass(
      'text-sm',
      'max-w-2xs',
      'mb-4',
      'text-muted-foreground',
      'font-light'
    );
  });

  it('renders correctly with different currency', () => {
    renderHeader('ETH');
    expect(screen.getByText('Pay with ETH')).toBeInTheDocument();
    expect(
      screen.getByText(
        'To complete this payment send the amount due to the ETH address provided below.'
      )
    ).toBeInTheDocument();
  });
});
