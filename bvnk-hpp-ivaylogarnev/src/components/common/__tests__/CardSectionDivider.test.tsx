import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CardSectionDivider } from '../CardSectionDivider';

describe('CardSectionDivider', () => {
  it('renders a separator with correct styling', () => {
    render(<CardSectionDivider />);

    // Check that the container div has the correct padding
    const container = screen.getByTestId('separator').parentElement;
    expect(container).toHaveClass('px-6');

    // Check that the separator has the correct background color
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('bg-gray-200');
  });
});
