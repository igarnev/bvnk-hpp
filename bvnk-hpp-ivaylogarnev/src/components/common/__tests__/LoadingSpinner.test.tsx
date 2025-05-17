import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the loading spinner', () => {
    render(<LoadingSpinner />);

    // Check for the container
    const container = screen.getByTestId('loading-spinner');
    expect(container).toBeInTheDocument();

    // Check for the loader icon
    const loader = container.querySelector('svg');
    expect(loader).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    render(<LoadingSpinner />);

    // Check container styling
    const container = screen.getByTestId('loading-spinner');
    expect(container).toHaveClass('flex', 'items-center', 'justify-center');

    // Check loader icon styling
    const loader = container.querySelector('svg');
    expect(loader).toHaveClass('h-24', 'w-24', 'animate-spin', 'text-primary');
  });
});
