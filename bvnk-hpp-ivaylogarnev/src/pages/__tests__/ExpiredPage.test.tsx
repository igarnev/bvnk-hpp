import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ExpiredPage } from '../ExpiredPage';

describe('ExpiredPage', () => {
  it('renders the expired page with correct content', () => {
    render(<ExpiredPage />);

    // Check for the main heading
    expect(screen.getByText('Payment details expired')).toBeInTheDocument();

    // Check for the description
    expect(
      screen.getByText('The payment details for your transaction have expired.')
    ).toBeInTheDocument();

    // Check for the warning icon (SVG)
    const warningIcon = document.querySelector('svg');
    expect(warningIcon).toBeInTheDocument();
    expect(warningIcon?.getAttribute('width')).toBe('48');
    expect(warningIcon?.getAttribute('height')).toBe('48');
  });

  it('has correct styling classes', () => {
    render(<ExpiredPage />);

    // Check main container classes
    const container = screen.getByText('Payment details expired').parentElement
      ?.parentElement;
    expect(container).toHaveClass('flex', 'justify-center', 'items-center');

    // Check card classes
    const card = screen.getByText('Payment details expired').parentElement;
    expect(card).toHaveClass('w-1/4', 'min-w-102', 'p-16', 'items-center');

    // Check title classes
    const title = screen.getByText('Payment details expired');
    expect(title).toHaveClass('text-center');

    // Check description classes
    const description = screen.getByText(
      'The payment details for your transaction have expired.'
    );
    expect(description).toHaveClass(
      'text-center',
      'text-muted-foreground',
      'font-light'
    );
  });
});
