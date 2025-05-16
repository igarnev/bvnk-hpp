import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAcceptPayment } from '../useAcceptPayment';
import { paymentService } from '@services/paymentService';
import { handlePaymentError } from '@utils/helpers/error-payment';
import type { IPaymentSummary } from '@models/IPaymentSummary';
import { EQuoteStatus } from '@models/EQuoteStatus';
import { EStatus } from '@models/EStatus';
import type { ICurrency } from '@models/ICurrency';
import type { Address } from '@models/IAddress';
import type { AxiosError } from 'axios';
import type { IServerError } from '@models/IServerError';

// Mock dependencies
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ uuid: 'test-uuid' })
}));

const mockMutate = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useMutation: ({
    mutationFn,
    onSuccess,
    onError
  }: {
    mutationFn: () => Promise<IPaymentSummary>;
    onSuccess?: (data: IPaymentSummary) => void;
    onError?: (error: AxiosError<IServerError>) => void;
  }) => ({
    mutate: mockMutate,
    mutateAsync: async () => {
      try {
        const result = await mutationFn();
        onSuccess?.(result);
        return result;
      } catch (error) {
        onError?.(error as AxiosError<IServerError>);
        throw error;
      }
    },
    isPending: false
  })
}));

vi.mock('@services/paymentService', () => ({
  paymentService: {
    acceptPaymentSummary: vi.fn()
  }
}));

vi.mock('@utils/helpers/error-payment', () => ({
  handlePaymentError: vi.fn()
}));

describe('useAcceptPayment', () => {
  const mockCurrency: ICurrency = {
    currency: 'USD',
    amount: 100,
    actual: 100
  };

  const mockAddress: Address = {
    address: 'test-address',
    tag: null,
    protocol: 'crypto',
    uri: 'test-address',
    alternatives: []
  };

  const mockPaymentSummary: IPaymentSummary = {
    uuid: 'test-uuid',
    merchantDisplayName: 'Test Merchant',
    merchantId: 'merchant-123',
    dateCreated: Date.now(),
    expiryDate: Date.now() + 3600000,
    quoteExpiryDate: null,
    acceptanceExpiryDate: null,
    quoteStatus: EQuoteStatus.PENDING,
    reference: 'ref-123',
    type: 'payment',
    subType: 'crypto',
    status: EStatus.PENDING,
    displayCurrency: mockCurrency,
    walletCurrency: mockCurrency,
    paidCurrency: mockCurrency,
    feeCurrency: mockCurrency,
    displayRate: null,
    exchangeRate: null,
    address: mockAddress,
    returnUrl: 'https://test.com/return',
    redirectUrl: 'https://test.com/redirect',
    transactions: [],
    refund: null,
    refunds: [],
    walletId: 'wallet-123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return acceptPayment mutation', () => {
    const { result } = renderHook(() => useAcceptPayment());

    expect(result.current.acceptPayment).toBeDefined();
    expect(typeof result.current.acceptPayment.mutate).toBe('function');
  });

  it('should call paymentService.acceptPaymentSummary with correct parameters', async () => {
    vi.mocked(paymentService.acceptPaymentSummary).mockResolvedValueOnce(
      mockPaymentSummary
    );

    const { result } = renderHook(() => useAcceptPayment());

    await result.current.acceptPayment.mutateAsync();

    expect(paymentService.acceptPaymentSummary).toHaveBeenCalledWith(
      'test-uuid',
      {
        successUrl: 'no_url_needed'
      }
    );
  });

  it('should navigate to payment page on successful mutation', async () => {
    vi.mocked(paymentService.acceptPaymentSummary).mockResolvedValueOnce(
      mockPaymentSummary
    );

    const { result } = renderHook(() => useAcceptPayment());

    await result.current.acceptPayment.mutateAsync();

    expect(mockNavigate).toHaveBeenCalledWith('/payin/test-uuid/pay');
  });

  it('should handle error and call handlePaymentError', async () => {
    const mockError = new Error('Test error');
    vi.mocked(paymentService.acceptPaymentSummary).mockRejectedValueOnce(
      mockError
    );

    const { result } = renderHook(() => useAcceptPayment());

    try {
      await result.current.acceptPayment.mutateAsync();
    } catch (error) {
      expect(handlePaymentError).toHaveBeenCalledWith(error, mockNavigate);
    }
  });
});
