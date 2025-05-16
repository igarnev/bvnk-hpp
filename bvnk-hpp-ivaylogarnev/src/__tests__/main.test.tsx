import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@radix-ui/react-toast';

// Mock the createRoot function
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn((rootElement) => {
    if (!rootElement) {
      throw new TypeError(
        "Failed to execute 'createRoot' on 'Document': The element provided was null."
      );
    }
    return {
      render: vi.fn()
    };
  })
}));

// Mock the App component
vi.mock('@/App', () => ({
  App: () => <div data-testid="app">App</div>
}));

// Mock the styles import
vi.mock('@styles/index.css', () => ({}));

describe('main', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock document.getElementById
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('creates a root and renders the app with all providers', async () => {
    // Import the main file to trigger the initialization
    await import('../main');

    // Verify createRoot was called with the root element
    expect(createRoot).toHaveBeenCalledWith(document.getElementById('root'));

    // Get the render function that was called
    const renderMock = (createRoot as jest.Mock).mock.results[0].value.render;
    expect(renderMock).toHaveBeenCalled();

    // Get the JSX that was passed to render
    const renderedJSX = renderMock.mock.calls[0][0];

    // Verify the JSX structure
    expect(renderedJSX.type).toBe(StrictMode);

    // Check ToastProvider
    const toastProvider = renderedJSX.props.children;
    expect(toastProvider.type).toBe(ToastProvider);

    // Check QueryClientProvider
    const queryClientProvider = toastProvider.props.children;
    expect(queryClientProvider.type).toBe(QueryClientProvider);
    expect(queryClientProvider.props.client).toBeInstanceOf(QueryClient);

    // Check BrowserRouter
    const browserRouter = queryClientProvider.props.children;
    expect(browserRouter.type).toBe(BrowserRouter);

    // Check App
    const app = browserRouter.props.children;
    expect(app.type.name).toBe('App');
  });
});
