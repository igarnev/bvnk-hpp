import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router-dom';

import { HomePayButton } from '../HomePayButton';
import { ROUTES } from '@utils/constants';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

// Mock the Tooltip components
vi.mock('@components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

describe('HomePayButton', () => {
  const mockNavigate = vi.fn();
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const renderButton = (props: { uuid: string; error?: string }) => {
    return render(
      <MemoryRouter>
        <HomePayButton {...props} />
      </MemoryRouter>
    );
  };

  it('renders the pay button', () => {
    renderButton({ uuid: validUuid });
    expect(screen.getByRole('button', { name: 'Pay' })).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    renderButton({ uuid: validUuid });
    const button = screen.getByRole('button', { name: 'Pay' });
    expect(button).toHaveClass('w-full', 'bg-primary', 'text-white');
  });

  it('is disabled when uuid is empty', () => {
    renderButton({ uuid: '' });
    const button = screen.getByRole('button', { name: 'Pay' });
    expect(button).toBeDisabled();
  });

  it('is disabled when error is present', () => {
    renderButton({ uuid: validUuid, error: 'Invalid UUID' });
    const button = screen.getByRole('button', { name: 'Pay' });
    expect(button).toBeDisabled();
  });

  it('is enabled when uuid is valid and no error is present', () => {
    renderButton({ uuid: validUuid });
    const button = screen.getByRole('button', { name: 'Pay' });
    expect(button).not.toBeDisabled();
  });

  it('shows error tooltip when error is present', () => {
    const errorMessage = 'Invalid UUID';
    renderButton({ uuid: validUuid, error: errorMessage });
    expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
      errorMessage
    );
  });

  it('shows default tooltip when no error is present', () => {
    renderButton({ uuid: validUuid });
    expect(screen.getByTestId('tooltip-content')).toHaveTextContent(
      'Enter UUID'
    );
  });

  it('navigates to payment summary page when valid UUID is provided', () => {
    renderButton({ uuid: validUuid });

    fireEvent.click(screen.getByRole('button', { name: 'Pay' }));

    expect(mockNavigate).toHaveBeenCalledWith(
      ROUTES.PAYMENT_SUMMARY.replace(':uuid', validUuid)
    );
  });

  it('does not navigate when invalid UUID is provided', () => {
    renderButton({ uuid: 'invalid-uuid' });

    fireEvent.click(screen.getByRole('button', { name: 'Pay' }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not navigate when button is disabled', () => {
    renderButton({ uuid: '', error: 'Invalid UUID' });

    fireEvent.click(screen.getByRole('button', { name: 'Pay' }));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
