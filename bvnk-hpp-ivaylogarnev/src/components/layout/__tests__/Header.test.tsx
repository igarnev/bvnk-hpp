import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { Header } from '../Header';

// Mock the logo import
vi.mock('@assets/bvnk-logo.svg', () => ({
  default: 'mocked-logo-path'
}));

const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
};

describe('Header', () => {
  it('renders the BVNK logo', () => {
    renderWithRouter();
    const logo = screen.getByAltText('BVNK Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'mocked-logo-path');
    expect(logo).toHaveAttribute('width', '120');
    expect(logo).toHaveAttribute('height', '32');
  });

  it('renders the payment page title', () => {
    renderWithRouter();
    expect(screen.getByText('Payment Page')).toBeInTheDocument();
  });

  it('navigates to home page when logo is clicked', () => {
    renderWithRouter();
    const logoButton = screen.getByRole('button', { name: 'Go to home page' });
    fireEvent.click(logoButton);

    // Since we're using MemoryRouter, we can check the current location
    expect(window.location.pathname).toBe('/');
  });

  it('has correct styling classes', () => {
    renderWithRouter();

    // Check header classes
    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'sticky',
      'top-0',
      'left-0',
      'w-full',
      'bg-white',
      'shadow-sm',
      'z-10',
      'p-4'
    );

    // Check container classes
    const container = header.firstElementChild;
    expect(container).toHaveClass(
      'container',
      'mx-auto',
      'flex',
      'items-center',
      'justify-between'
    );

    // Check title classes
    const title = screen.getByText('Payment Page');
    expect(title).toHaveClass('text-xl', 'font-semibold');
  });

  it('has correct layout structure', () => {
    renderWithRouter();

    // Check that the header has three sections with correct width classes
    const sections = screen
      .getAllByRole('generic')
      .filter((el) => el.className.includes('w-1/3'));
    expect(sections).toHaveLength(3);

    // Check that the middle section has center alignment
    expect(sections[1]).toHaveClass('text-center');

    // Check that the last section has right alignment
    expect(sections[2]).toHaveClass('text-right');
  });
});
