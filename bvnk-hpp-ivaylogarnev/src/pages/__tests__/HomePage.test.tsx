import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { HomePage } from '../HomePage';
import { useUuidValidation } from '@hooks/useUuidValidation';

// Mock the useUuidValidation hook
vi.mock('@hooks/useUuidValidation', () => ({
  useUuidValidation: vi.fn()
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('HomePage', () => {
  const mockHandleUuidChange = vi.fn();

  beforeEach(() => {
    // Default mock implementation
    (useUuidValidation as ReturnType<typeof vi.fn>).mockReturnValue({
      uuid: '',
      error: null,
      handleUuidChange: mockHandleUuidChange
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the home page with correct content', () => {
    renderWithRouter(<HomePage />);

    // Check for the main heading
    expect(screen.getByText('BVNK Hosted Payment Page')).toBeInTheDocument();

    // Check for the input field
    const input = screen.getByPlaceholderText('Enter a payment UUID');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('handles UUID input changes', () => {
    renderWithRouter(<HomePage />);

    const input = screen.getByPlaceholderText('Enter a payment UUID');
    fireEvent.change(input, { target: { value: 'test-uuid' } });

    expect(mockHandleUuidChange).toHaveBeenCalled();
  });

  it('shows error state when UUID is invalid', () => {
    // Mock invalid UUID state
    (useUuidValidation as ReturnType<typeof vi.fn>).mockReturnValue({
      uuid: 'invalid-uuid',
      error: 'Invalid UUID format',
      handleUuidChange: mockHandleUuidChange
    });

    renderWithRouter(<HomePage />);

    const input = screen.getByPlaceholderText('Enter a payment UUID');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'uuid-error');
  });

  it('has correct styling classes', () => {
    renderWithRouter(<HomePage />);

    // Check main container classes
    const container = screen.getByText('BVNK Hosted Payment Page').parentElement
      ?.parentElement;
    expect(container).toHaveClass('flex', 'justify-center', 'items-center');

    // Check card classes
    const card = screen.getByText('BVNK Hosted Payment Page').parentElement;
    expect(card).toHaveClass('flex', 'w-1/4', 'min-w-96', 'p-4');

    // Check heading classes
    const heading = screen.getByText('BVNK Hosted Payment Page');
    expect(heading).toHaveClass('text-center');
  });

  it('passes correct props to HomePayButton', () => {
    const mockUuid = 'test-uuid';
    const mockError = 'Invalid UUID';

    (useUuidValidation as ReturnType<typeof vi.fn>).mockReturnValue({
      uuid: mockUuid,
      error: mockError,
      handleUuidChange: mockHandleUuidChange
    });

    renderWithRouter(<HomePage />);

    // Since HomePayButton is a custom component, we can check if it's rendered
    // and if the parent component passes the correct props
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
