import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Layout } from '../Layout';
import { ROUTES } from '@utils/constants';

// Mock the pages
vi.mock('@pages/HomePage', () => ({
  HomePage: () => <div>Home Page</div>
}));

vi.mock('@pages/AcceptQuotePage', () => ({
  AcceptQuotePage: () => <div>Accept Quote Page</div>
}));

vi.mock('@pages/PayQuotePage', () => ({
  PayQuotePage: () => <div>Pay Quote Page</div>
}));

vi.mock('@pages/ExpiredPage', () => ({
  ExpiredPage: () => <div>Expired Page</div>
}));

vi.mock('@pages/NotFoundPage', () => ({
  NotFoundPage: () => <div>Not Found Page</div>
}));

// Mock the guards
vi.mock('@components/guards/PaymentGuard', () => ({
  PaymentGuard: () => (
    <div data-testid="payment-guard">
      <Outlet />
    </div>
  )
}));

// Mock the header
vi.mock('@components/layout/Header', () => ({
  Header: () => <div data-testid="header">Header</div>
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const renderWithRouter = (initialRoute: string) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <Layout />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Layout', () => {
  it('renders the header', () => {
    renderWithRouter(ROUTES.HOME);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('renders the home page at the root route', () => {
    renderWithRouter(ROUTES.HOME);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders the accept quote page at the payment summary route', () => {
    renderWithRouter(ROUTES.PAYMENT_SUMMARY);
    const guard = screen.getByTestId('payment-guard');
    expect(guard).toBeInTheDocument();
    expect(screen.getByText('Accept Quote Page')).toBeInTheDocument();
  });

  it('renders the pay quote page at the payment pay route', () => {
    renderWithRouter(ROUTES.PAYMENT_PAY);
    const guard = screen.getByTestId('payment-guard');
    expect(guard).toBeInTheDocument();
    expect(screen.getByText('Pay Quote Page')).toBeInTheDocument();
  });

  it('renders the expired page at the payment expired route', () => {
    renderWithRouter(ROUTES.PAYMENT_EXPIRED);
    expect(screen.getByText('Expired Page')).toBeInTheDocument();
  });

  it('renders the not found page for unknown routes', () => {
    renderWithRouter('/unknown-route');
    expect(screen.getByText('Not Found Page')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    renderWithRouter(ROUTES.HOME);

    // Check main container classes
    const container = screen.getByTestId('header').parentElement;
    expect(container).toHaveClass('h-screen', 'bg-gray-100');

    // Check main element classes
    const main = screen.getByText('Home Page').closest('main');
    expect(main).toHaveClass('mt-16');
  });
});
