import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@radix-ui/react-toast';

import { App } from '../App';

// Mock the Layout component
vi.mock('@components/layout/Layout', () => ({
  Layout: () => <div data-testid="layout">Layout</div>
}));

// Mock the Toaster component
vi.mock('@components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const renderWithProviders = () => {
  return render(
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ToastProvider>
  );
};

describe('App', () => {
  it('renders the Layout component', () => {
    renderWithProviders();
    const layout = screen.getByTestId('layout');
    expect(layout).toBeInTheDocument();
    expect(layout.textContent).toBe('Layout');
  });

  it('renders the Toaster component', () => {
    renderWithProviders();
    const toaster = screen.getByTestId('toaster');
    expect(toaster).toBeInTheDocument();
    expect(toaster.textContent).toBe('Toaster');
  });

  it('renders both components in the correct order', () => {
    const { container } = renderWithProviders();
    const layout = screen.getByTestId('layout');
    const toaster = screen.getByTestId('toaster');

    // Get the order of elements in the DOM
    const layoutIndex = Array.from(container.children).indexOf(layout);
    const toasterIndex = Array.from(container.children).indexOf(toaster);

    // Layout should come before Toaster
    expect(layoutIndex).toBeLessThan(toasterIndex);
  });
});
