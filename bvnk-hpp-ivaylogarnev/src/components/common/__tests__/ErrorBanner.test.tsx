import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { ErrorBanner } from '../ErrorBanner';
import { ROUTES } from '@utils/constants';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('ErrorBanner', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders error message and button', () => {
    render(
      <MemoryRouter>
        <ErrorBanner />
      </MemoryRouter>
    );

    // Check for error message
    expect(
      screen.getByText('Error loading payment summary')
    ).toBeInTheDocument();

    // Check for warning icon (SVG)
    const warningIcon = screen
      .getByText('Error loading payment summary')
      .closest('[data-slot="card"]')
      ?.querySelector('svg');
    expect(warningIcon).toBeInTheDocument();

    // Check for button
    const button = screen.getByRole('button', { name: 'Go back' });
    expect(button).toBeInTheDocument();
  });

  it('navigates to home page when button is clicked', () => {
    render(
      <MemoryRouter>
        <ErrorBanner />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: 'Go back' });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('applies correct styling classes', () => {
    render(
      <MemoryRouter>
        <ErrorBanner />
      </MemoryRouter>
    );

    // Check container styling (outer div)
    const container = screen
      .getByRole('button', { name: 'Go back' })
      .closest('div')?.parentElement;
    expect(container).toHaveClass('flex', 'justify-center', 'items-center');

    // Check card styling
    const card = screen
      .getByText('Error loading payment summary')
      .closest('[data-slot="card"]');
    expect(card).toHaveClass('w-1/4', 'min-w-102', 'p-8', 'items-center');

    // Check button styling
    const button = screen.getByRole('button', { name: 'Go back' });
    expect(button).toHaveClass('mt-4', 'cursor-pointer');
  });
});
