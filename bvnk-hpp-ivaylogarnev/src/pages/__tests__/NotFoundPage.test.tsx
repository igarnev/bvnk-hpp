import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { NotFoundPage } from '../NotFoundPage';
import { ROUTES } from '@utils/constants';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

describe('NotFoundPage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the 404 page with correct content', () => {
    render(<NotFoundPage />);

    // Check for the main heading
    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();

    // Check for the description
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();

    // Check for the button
    expect(
      screen.getByRole('button', { name: 'Go back to home' })
    ).toBeInTheDocument();
  });

  it('navigates to home page when clicking the button', () => {
    render(<NotFoundPage />);

    // Click the button
    fireEvent.click(screen.getByRole('button', { name: 'Go back to home' }));

    // Check if navigate was called with correct arguments
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME, { replace: true });
  });

  it('has correct styling classes', () => {
    render(<NotFoundPage />);

    // Check main container classes
    const container = screen.getByText('404 - Page Not Found').parentElement
      ?.parentElement;
    expect(container).toHaveClass('flex', 'justify-center', 'items-center');

    // Check card classes
    const card = screen.getByText('404 - Page Not Found').parentElement;
    expect(card).toHaveClass('flex', 'w-1/4', 'min-w-96', 'p-4');

    // Check heading classes
    const heading = screen.getByText('404 - Page Not Found');
    expect(heading).toHaveClass('text-center', 'text-lg', 'font-normal');
  });
});
