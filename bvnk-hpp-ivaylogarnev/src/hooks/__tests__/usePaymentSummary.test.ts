import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usePaymentSummary } from '../usePaymentSummary';
import { paymentService } from '@services/paymentService';
import type { IPaymentSummary } from '@models/IPaymentSummary';
import { EQuoteStatus } from '@models/EQuoteStatus';
import { EStatus } from '@models/EStatus';

// Mock the dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn()
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

vi.mock('@services/paymentService', () => ({
  paymentService: {
    getPaymentSummary: vi.fn()
  }
}));

describe('usePaymentSummary', () => {
  const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
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
    displayCurrency: {
      currency: 'USD',
      amount: 100.0,
      actual: 100.0
    },
    walletCurrency: {
      currency: 'USD',
      amount: 100.0,
      actual: 100.0
    },
    paidCurrency: {
      currency: 'BTC',
      amount: 0.001,
      actual: 0.001
    },
    feeCurrency: {
      currency: 'USD',
      amount: 1.0,
      actual: 1.0
    },
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
  });

  it('should set up mocks correctly', () => {
    expect(useParams).toBeDefined();
    expect(useQuery).toBeDefined();
    expect(paymentService.getPaymentSummary).toBeDefined();
  });

  it('should reset mocks before each test', () => {
    // Call some mocks
    useParams();
    useQuery({ queryKey: ['test'], queryFn: () => {} });
    paymentService.getPaymentSummary(mockUuid);

    // Clear mocks
    vi.clearAllMocks();

    // Verify mocks were cleared
    expect(useParams).not.toHaveBeenCalled();
    expect(useQuery).not.toHaveBeenCalled();
    expect(paymentService.getPaymentSummary).not.toHaveBeenCalled();
  });

  it('should set up mock return values correctly', () => {
    (useParams as jest.Mock).mockReturnValue({ uuid: mockUuid });
    (useQuery as jest.Mock).mockReturnValue({
      data: mockPaymentSummary,
      isLoading: false,
      error: null
    });
    (paymentService.getPaymentSummary as jest.Mock).mockResolvedValue(
      mockPaymentSummary
    );

    expect(useParams()).toEqual({ uuid: mockUuid });
    expect(useQuery({ queryKey: ['test'], queryFn: () => {} })).toEqual({
      data: mockPaymentSummary,
      isLoading: false,
      error: null
    });
    expect(paymentService.getPaymentSummary(mockUuid)).resolves.toBe(
      mockPaymentSummary
    );
  });

  it('should initialize with empty states when UUID is invalid', () => {
    (useParams as jest.Mock).mockReturnValue({ uuid: 'invalid-uuid' });
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null
    });

    const { result } = renderHook(() => usePaymentSummary());

    expect(result.current.paymentSummary).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['paymentSummary', 'invalid-uuid'],
      queryFn: expect.any(Function),
      enabled: false
    });
  });

  it('should fetch payment summary when UUID is valid', () => {
    (useParams as jest.Mock).mockReturnValue({ uuid: mockUuid });
    (useQuery as jest.Mock).mockReturnValue({
      data: mockPaymentSummary,
      isLoading: false,
      error: null
    });

    const { result } = renderHook(() => usePaymentSummary());

    expect(result.current.paymentSummary).toEqual(mockPaymentSummary);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['paymentSummary', mockUuid],
      queryFn: expect.any(Function),
      enabled: true
    });
  });

  it('should handle loading state', () => {
    (useParams as jest.Mock).mockReturnValue({ uuid: mockUuid });
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    });

    const { result } = renderHook(() => usePaymentSummary());

    expect(result.current.paymentSummary).toBeUndefined();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should handle error state', () => {
    const mockError = new Error('Failed to fetch payment summary');
    (useParams as jest.Mock).mockReturnValue({ uuid: mockUuid });
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError
    });

    const { result } = renderHook(() => usePaymentSummary());

    expect(result.current.paymentSummary).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(mockError);
  });

  it('should call paymentService.getPaymentSummary with correct UUID', async () => {
    (useParams as jest.Mock).mockReturnValue({ uuid: mockUuid });
    (paymentService.getPaymentSummary as jest.Mock).mockResolvedValue(
      mockPaymentSummary
    );
    (useQuery as jest.Mock).mockImplementation(({ queryFn }) => ({
      data: queryFn(),
      isLoading: false,
      error: null
    }));

    renderHook(() => usePaymentSummary());

    expect(paymentService.getPaymentSummary).toHaveBeenCalledWith(mockUuid);
  });
});
