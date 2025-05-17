import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError } from 'zod';
import type { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';
import { handleServiceError } from '../handle-service-error';
import { debouncedToast } from '../toast';

// Mock the debouncedToast function
vi.mock('../toast', () => ({
  debouncedToast: vi.fn()
}));

describe('handleServiceError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle Zod validation errors', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number'
      }
    ]);

    expect(() => handleServiceError(zodError)).toThrow(zodError);

    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Validation Error',
      description: 'Expected string, received number'
    });
  });

  it('should handle Zod validation errors with no message', () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Invalid input format.'
      }
    ]);

    expect(() => handleServiceError(zodError)).toThrow(zodError);

    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Validation Error',
      description: 'Invalid input format.'
    });
  });

  it('should handle Axios errors with response data', () => {
    const axiosError = new Error('Invalid payment details') as AxiosError;
    axiosError.isAxiosError = true;
    axiosError.response = {
      data: {
        message: 'Invalid payment details'
      },
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as AxiosRequestConfig
    } as AxiosResponse;

    expect(() => handleServiceError(axiosError)).toThrow();

    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Network Error',
      description: 'Invalid payment details'
    });
  });

  it('should handle Axios errors without response data', () => {
    const axiosError = new Error('Network error') as AxiosError;
    axiosError.isAxiosError = true;
    axiosError.response = {
      data: {},
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as AxiosRequestConfig
    } as AxiosResponse;

    expect(() => handleServiceError(axiosError)).toThrow();

    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Network Error',
      description:
        'Failed to communicate with the server. Please try again later.'
    });
  });

  it('should handle Axios errors without response', () => {
    const axiosError = new Error('Network error') as AxiosError;
    axiosError.isAxiosError = true;

    expect(() => handleServiceError(axiosError)).toThrow();

    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Network Error',
      description:
        'Failed to communicate with the server. Please try again later.'
    });
  });

  it('should handle unexpected errors', () => {
    const error = new Error('Unexpected error');

    expect(() => handleServiceError(error)).toThrow(error);

    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Unexpected Error',
      description: 'Something went wrong. Please try again.'
    });
  });

  it('should handle non-Error objects', () => {
    const error = new Error('Custom error');

    expect(() => handleServiceError(error)).toThrow(error);

    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Unexpected Error',
      description: 'Something went wrong. Please try again.'
    });
  });

  it('should clear mocks between tests - test 1', () => {
    const error = new Error('Test error');
    expect(() => handleServiceError(error)).toThrow(error);
    expect(debouncedToast).toHaveBeenCalledTimes(1);
  });

  it('should clear mocks between tests - test 2', () => {
    const error = new Error('Test error');
    expect(() => handleServiceError(error)).toThrow(error);
    expect(debouncedToast).toHaveBeenCalledTimes(1);
  });

  it('handles ZodError without message', () => {
    const zodError = new ZodError([]);

    expect(() => handleServiceError(zodError)).toThrow(zodError);
    expect(debouncedToast).toHaveBeenCalledWith({
      variant: 'destructive',
      title: 'Validation Error',
      description: 'Invalid input format.'
    });
  });
});
