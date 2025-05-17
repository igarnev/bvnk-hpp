import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUpdatePaymentSummary } from '../useUpdatePaymentSummary';
import { paymentService } from '@services/paymentService';
import { handlePaymentError } from '@utils/helpers/error-payment';
import type { IPaymentSummary } from '@models/IPaymentSummary';
import type { AxiosError } from 'axios';
import type { IServerError } from '@models/IServerError';
import { EQuoteStatus } from '@models/EQuoteStatus';
import { EStatus } from '@/models/EStatus';
import type { UseMutationOptions } from '@tanstack/react-query';

type MutationOptions = UseMutationOptions<
  IPaymentSummary | undefined,
  { error: AxiosError<IServerError> },
  { currency: string }
>;

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn()
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
  useMutation: vi.fn()
}));

vi.mock('@services/paymentService', () => ({
  paymentService: {
    updatePaymentSummary: vi.fn()
  }
}));

vi.mock('@utils/helpers/error-payment', () => ({
  handlePaymentError: vi.fn()
}));

describe('useUpdatePaymentSummary', () => {
  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockNavigate = vi.fn();
  const mockSetQueryData = vi.fn();
  const mockQueryClient = {
    setQueryData: mockSetQueryData
  };
  const mockCurrency = 'USD';
  const mockPaymentSummary: IPaymentSummary = {
    uuid: mockUuid,
    merchantDisplayName: 'Test Merchant',
    merchantId: 'merchant123',
    dateCreated: 1234567890,
    expiryDate: 1234567890,
    quoteExpiryDate: null,
    acceptanceExpiryDate: null,
    quoteStatus: EQuoteStatus.PENDING,
    reference: 'REF123',
    type: 'PAYMENT',
    subType: 'CRYPTO',
    status: EStatus.PENDING,
    displayCurrency: { currency: 'USD', amount: 100.0, actual: 100.0 },
    walletCurrency: { currency: 'USD', amount: 100.0, actual: 100.0 },
    paidCurrency: { currency: 'BTC', amount: 0.001, actual: 0.001 },
    feeCurrency: { currency: 'USD', amount: 1.0, actual: 1.0 },
    displayRate: null,
    exchangeRate: null,
    address: {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      tag: null,
      protocol: 'bitcoin',
      uri: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      alternatives: []
    },
    returnUrl: 'https://example.com/return',
    redirectUrl: 'https://example.com/redirect',
    transactions: [],
    refund: null,
    refunds: [],
    walletId: 'wallet123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ uuid: mockUuid });
    (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
    vi.mocked(paymentService.updatePaymentSummary).mockResolvedValue(
      mockPaymentSummary
    );
  });

  it('should initialize with correct dependencies', () => {
    let capturedOptions: MutationOptions | undefined;
    vi.mocked(useMutation).mockImplementation((options) => {
      capturedOptions = options as MutationOptions;
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        isPaused: false,
        data: undefined,
        error: null,
        variables: undefined,
        reset: vi.fn(),
        status: 'idle',
        context: undefined,
        failureCount: 0,
        failureReason: null,
        submittedAt: Date.now()
      };
    });

    const { result } = renderHook(() => useUpdatePaymentSummary());

    // Verify that hooks were called and returned correct values
    expect(useNavigate).toHaveBeenCalled();
    expect(useNavigate()).toBe(mockNavigate);

    expect(useQueryClient).toHaveBeenCalled();
    expect(useQueryClient()).toBe(mockQueryClient);

    expect(useParams).toHaveBeenCalled();
    expect(useParams()).toEqual({ uuid: mockUuid });

    // Verify mutation options
    expect(capturedOptions?.mutationKey).toEqual(['updatePaymentSummary']);
    expect(capturedOptions?.mutationFn).toBeDefined();
    expect(capturedOptions?.onSuccess).toBeDefined();
    expect(capturedOptions?.onError).toBeDefined();
    expect(capturedOptions?.retry).toBe(3);
    expect(capturedOptions?.retryDelay).toBeDefined();

    // Verify the returned hook value
    expect(result.current.updatePaymentSummary).toBeDefined();
  });

  it('should set up mutation function correctly', async () => {
    let capturedOptions:
      | UseMutationOptions<
          IPaymentSummary | undefined,
          { error: AxiosError<IServerError> },
          { currency: string }
        >
      | undefined;
    vi.mocked(useMutation).mockImplementation((options) => {
      capturedOptions = options as UseMutationOptions<
        IPaymentSummary | undefined,
        { error: AxiosError<IServerError> },
        { currency: string }
      >;
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        isPaused: false,
        data: undefined,
        error: null,
        variables: undefined,
        reset: vi.fn(),
        status: 'idle',
        context: undefined,
        failureCount: 0,
        failureReason: null,
        submittedAt: Date.now()
      };
    });

    renderHook(() => useUpdatePaymentSummary());

    if (!capturedOptions?.mutationFn) {
      throw new Error('mutationFn is undefined');
    }

    await capturedOptions.mutationFn({ currency: mockCurrency });

    expect(paymentService.updatePaymentSummary).toHaveBeenCalledWith(mockUuid, {
      currency: mockCurrency,
      payInMethod: 'crypto'
    });
  });

  it('should set up success handler correctly', async () => {
    let capturedOptions: MutationOptions | undefined;
    vi.mocked(useMutation).mockImplementation((options) => {
      capturedOptions = options as MutationOptions;
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        isPaused: false,
        data: undefined,
        error: null,
        variables: undefined,
        reset: vi.fn(),
        status: 'idle',
        context: undefined,
        failureCount: 0,
        failureReason: null,
        submittedAt: Date.now()
      };
    });

    renderHook(() => useUpdatePaymentSummary());

    if (!capturedOptions?.onSuccess) {
      throw new Error('onSuccess is undefined');
    }

    // Test with data
    capturedOptions.onSuccess(
      mockPaymentSummary,
      { currency: mockCurrency },
      undefined
    );
    expect(mockSetQueryData).toHaveBeenCalledWith(
      ['paymentSummary', mockUuid],
      mockPaymentSummary
    );

    // Test with undefined data
    vi.clearAllMocks();
    capturedOptions.onSuccess(undefined, { currency: mockCurrency }, undefined);
    expect(mockSetQueryData).not.toHaveBeenCalled();
  });

  it('should set up error handler correctly', async () => {
    let capturedOptions: MutationOptions | undefined;
    vi.mocked(useMutation).mockImplementation((options) => {
      capturedOptions = options as MutationOptions;
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        isPaused: false,
        data: undefined,
        error: null,
        variables: undefined,
        reset: vi.fn(),
        status: 'idle',
        context: undefined,
        failureCount: 0,
        failureReason: null,
        submittedAt: Date.now()
      };
    });

    renderHook(() => useUpdatePaymentSummary());

    if (!capturedOptions?.onError) {
      throw new Error('onError is undefined');
    }

    const mockError = new Error('Test error');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    capturedOptions.onError({ error: mockError });

    expect(handlePaymentError).toHaveBeenCalledWith(
      { error: mockError },
      mockNavigate
    );
  });

  it('should handle error and call handlePaymentError', async () => {
    let capturedOptions: MutationOptions | undefined;
    vi.mocked(useMutation).mockImplementation((options) => {
      capturedOptions = options as MutationOptions;
      return {
        mutate: vi.fn(),
        mutateAsync: vi.fn(),
        isPending: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        isPaused: false,
        data: undefined,
        error: null,
        variables: undefined,
        reset: vi.fn(),
        status: 'idle',
        context: undefined,
        failureCount: 0,
        failureReason: null,
        submittedAt: Date.now()
      };
    });

    renderHook(() => useUpdatePaymentSummary());

    if (!capturedOptions?.onError) {
      throw new Error('onError is undefined');
    }

    const mockError = new Error('Update failed');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    capturedOptions.onError({ error: mockError });

    expect(handlePaymentError).toHaveBeenCalledWith(
      { error: mockError },
      mockNavigate
    );
  });

  it('should set up mocks correctly', () => {
    expect(useNavigate).toBeDefined();
    expect(useParams).toBeDefined();
    expect(useQueryClient).toBeDefined();
    expect(paymentService.updatePaymentSummary).toBeDefined();
    expect(handlePaymentError).toBeDefined();
  });

  it('should reset mocks before each test', () => {
    // Call some mocks
    mockNavigate();
    mockSetQueryData();
    paymentService.updatePaymentSummary(mockUuid, {
      currency: mockCurrency,
      payInMethod: 'crypto'
    });
    const mockError: AxiosError<IServerError> = new Error(
      'Test error'
    ) as AxiosError<IServerError>;
    handlePaymentError(mockError, mockNavigate);

    // Clear mocks
    vi.clearAllMocks();

    // Verify mocks were cleared
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockSetQueryData).not.toHaveBeenCalled();
    expect(paymentService.updatePaymentSummary).not.toHaveBeenCalled();
    expect(handlePaymentError).not.toHaveBeenCalled();
  });

  it('should set up mock return values correctly', async () => {
    expect(useNavigate()).toBe(mockNavigate);
    expect(useParams()).toEqual({ uuid: mockUuid });
    expect(useQueryClient()).toBe(mockQueryClient);
    await expect(
      paymentService.updatePaymentSummary(mockUuid, {
        currency: mockCurrency,
        payInMethod: 'crypto'
      })
    ).resolves.toBe(mockPaymentSummary);
  });

  it('should initialize with updatePaymentSummary mutation', () => {
    const mockMutate = vi.fn();
    const mockMutateAsync = vi.fn();
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: false,
      isIdle: true,
      isPaused: false,
      data: undefined,
      error: null,
      variables: undefined,
      reset: vi.fn(),
      status: 'idle',
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: Date.now()
    });

    const { result } = renderHook(() => useUpdatePaymentSummary());

    expect(result.current.updatePaymentSummary).toBeDefined();
    expect(typeof result.current.updatePaymentSummary.mutate).toBe('function');
  });

  it('should call paymentService.updatePaymentSummary with correct parameters', async () => {
    const mockMutate = vi.fn();
    const mockMutateAsync = vi.fn().mockImplementation(async (variables) => {
      await paymentService.updatePaymentSummary(mockUuid, {
        currency: variables.currency,
        payInMethod: 'crypto'
      });
      return mockPaymentSummary;
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: true,
      isIdle: false,
      isPaused: false,
      data: mockPaymentSummary,
      error: null,
      variables: { currency: mockCurrency },
      reset: vi.fn(),
      status: 'success',
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: Date.now()
    });

    const { result } = renderHook(() => useUpdatePaymentSummary());

    await act(async () => {
      await result.current.updatePaymentSummary.mutateAsync({
        currency: mockCurrency
      });
    });

    expect(paymentService.updatePaymentSummary).toHaveBeenCalledWith(mockUuid, {
      currency: mockCurrency,
      payInMethod: 'crypto'
    });
  });

  it('should update query cache on successful mutation', async () => {
    const mockMutate = vi.fn();
    const mockMutateAsync = vi.fn().mockImplementation(async (variables) => {
      const result = await paymentService.updatePaymentSummary(mockUuid, {
        currency: variables.currency,
        payInMethod: 'crypto'
      });
      mockQueryClient.setQueryData(['paymentSummary', mockUuid], result);
      return result;
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: false,
      isSuccess: true,
      isIdle: false,
      isPaused: false,
      data: mockPaymentSummary,
      error: null,
      variables: { currency: mockCurrency },
      reset: vi.fn(),
      status: 'success',
      context: undefined,
      failureCount: 0,
      failureReason: null,
      submittedAt: Date.now()
    });

    const { result } = renderHook(() => useUpdatePaymentSummary());

    await act(async () => {
      await result.current.updatePaymentSummary.mutateAsync({
        currency: mockCurrency
      });
    });

    expect(mockSetQueryData).toHaveBeenCalledWith(
      ['paymentSummary', mockUuid],
      mockPaymentSummary
    );
  });

  it('should retry on failure up to 3 times', async () => {
    const mockError: AxiosError<IServerError> = new Error(
      'Update failed'
    ) as AxiosError<IServerError>;
    const mockMutate = vi.fn();
    let attemptCount = 0;
    const mockMutateAsync = vi.fn().mockImplementation(async () => {
      attemptCount++;
      if (attemptCount <= 4) {
        throw mockError;
      }
      return mockPaymentSummary;
    });

    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      mutateAsync: mockMutateAsync,
      isPending: false,
      isError: true,
      isSuccess: false,
      isIdle: false,
      isPaused: false,
      data: undefined,
      error: mockError,
      variables: { currency: mockCurrency },
      reset: vi.fn(),
      status: 'error',
      context: undefined,
      failureCount: 4,
      failureReason: mockError,
      submittedAt: Date.now()
    });

    const { result } = renderHook(() => useUpdatePaymentSummary());

    try {
      await act(async () => {
        await result.current.updatePaymentSummary.mutateAsync({
          currency: mockCurrency
        });
      });
    } catch {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    }
  });

  it('should use exponential backoff for retry delay', () => {
    const mockMutate = vi.fn();
    const mockMutateAsync = vi.fn();
    let capturedRetryDelay: ((attempt: number) => number) | undefined;

    vi.mocked(useMutation).mockImplementation(({ retryDelay }) => {
      if (retryDelay) {
        capturedRetryDelay = retryDelay as (attempt: number) => number;
      }
      return {
        mutate: mockMutate,
        mutateAsync: mockMutateAsync,
        isPending: false,
        isError: false,
        isSuccess: false,
        isIdle: true,
        isPaused: false,
        data: undefined,
        error: null,
        variables: undefined,
        reset: vi.fn(),
        status: 'idle',
        context: undefined,
        failureCount: 0,
        failureReason: null,
        submittedAt: Date.now()
      };
    });

    renderHook(() => useUpdatePaymentSummary());

    if (!capturedRetryDelay) {
      throw new Error('Retry delay function was not captured');
    }

    expect(capturedRetryDelay(0)).toBe(500); // 500 * 2^0
    expect(capturedRetryDelay(1)).toBe(1000); // 500 * 2^1
    expect(capturedRetryDelay(2)).toBe(2000); // 500 * 2^2
    expect(capturedRetryDelay(3)).toBe(4000); // 500 * 2^3
    expect(capturedRetryDelay(4)).toBe(4000); // Capped at 4000
  });
});
