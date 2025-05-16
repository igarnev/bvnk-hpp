import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { paymentService } from '../paymentService';
import { handleServiceError } from '@utils/helpers/handle-service-error';
import type { TUpdatePaymentSummaryRequest } from '@models/TUpdatePaymentSummaryRequest';
import type { TAcceptPaymentSummaryRequest } from '@models/TAcceptPaymentSummaryRequest';
import {
  paymentSummarySchema,
  updatePaymentSummaryRequestSchema,
  acceptPaymentSummaryRequestSchema
} from '@utils/schemas-zod';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock handleServiceError
vi.mock('@utils/helpers/handle-service-error', () => ({
  handleServiceError: vi.fn()
}));

// Mock Zod schemas
vi.mock('@utils/schemas-zod', () => ({
  paymentSummarySchema: {
    parse: vi.fn((data) => data)
  },
  updatePaymentSummaryRequestSchema: {
    parse: vi.fn((data) => data)
  },
  acceptPaymentSummaryRequestSchema: {
    parse: vi.fn((data) => data)
  }
}));

describe('paymentService', () => {
  const mockUuid = 'test-uuid';
  const mockPaymentSummary = {
    uuid: 'test-uuid',
    merchantDisplayName: 'Test Merchant',
    merchantId: 'merchant-123',
    dateCreated: Date.now(),
    expiryDate: Date.now() + 3600000,
    quoteExpiryDate: Date.now() + 3600000,
    acceptanceExpiryDate: Date.now() + 1800000,
    quoteStatus: 'PENDING' as const,
    status: 'PENDING' as const,
    reference: 'REF123',
    type: 'PAYMENT',
    subType: 'CRYPTO',
    displayCurrency: {
      amount: 100,
      actual: 100,
      currency: 'USD'
    },
    walletCurrency: {
      amount: 0.001,
      actual: 0.001,
      currency: 'BTC'
    },
    paidCurrency: {
      amount: 100,
      actual: 100,
      currency: 'USD'
    },
    feeCurrency: {
      amount: 0,
      actual: 0,
      currency: 'USD'
    },
    displayRate: {
      base: 'USD',
      counter: 'BTC',
      rate: 1
    },
    exchangeRate: {
      base: 'USD',
      counter: 'BTC',
      rate: 0.00001
    },
    address: {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      tag: null
    },
    returnUrl: 'https://example.com/return',
    redirectUrl: 'https://example.com/redirect',
    transactions: [],
    refunds: [],
    refund: null,
    walletId: 'wallet-123'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPaymentSummary', () => {
    it('should fetch and return payment summary', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockPaymentSummary });

      const result = await paymentService.getPaymentSummary(mockUuid);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://api.sandbox.bvnk.com/api/v1/pay/${mockUuid}/summary`
      );
      expect(result).toEqual(mockPaymentSummary);
    });

    it('should handle validation errors', async () => {
      const invalidData = { ...mockPaymentSummary, uuid: 123 }; // Invalid type for uuid
      mockedAxios.get.mockResolvedValueOnce({ data: invalidData });
      vi.mocked(paymentSummarySchema.parse).mockImplementationOnce(() => {
        throw new Error('Validation error');
      });

      const result = await paymentService.getPaymentSummary(mockUuid);

      expect(handleServiceError).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(networkError);

      const result = await paymentService.getPaymentSummary(mockUuid);

      expect(handleServiceError).toHaveBeenCalledWith(networkError);
      expect(result).toBeUndefined();
    });
  });

  describe('updatePaymentSummary', () => {
    const mockUpdateData: TUpdatePaymentSummaryRequest = {
      currency: 'BTC',
      payInMethod: 'CRYPTO'
    };

    it('should update and return payment summary', async () => {
      mockedAxios.put.mockResolvedValueOnce({ data: mockPaymentSummary });

      const result = await paymentService.updatePaymentSummary(
        mockUuid,
        mockUpdateData
      );

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `https://api.sandbox.bvnk.com/api/v1/pay/${mockUuid}/update/summary`,
        mockUpdateData
      );
      expect(result).toEqual(mockPaymentSummary);
    });

    it('should handle validation errors in request data', async () => {
      const invalidData = {
        currency: 'INVALID',
        payInMethod: 'INVALID'
      };
      mockedAxios.put.mockResolvedValueOnce({ data: mockPaymentSummary });
      vi.mocked(updatePaymentSummaryRequestSchema.parse).mockImplementationOnce(
        () => {
          throw new Error('Validation error');
        }
      );

      const result = await paymentService.updatePaymentSummary(
        mockUuid,
        invalidData as TUpdatePaymentSummaryRequest
      );

      expect(handleServiceError).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockedAxios.put.mockRejectedValueOnce(networkError);
      vi.mocked(updatePaymentSummaryRequestSchema.parse).mockImplementationOnce(
        () => {
          throw networkError;
        }
      );

      const result = await paymentService.updatePaymentSummary(
        mockUuid,
        mockUpdateData
      );

      expect(handleServiceError).toHaveBeenCalledWith(networkError);
      expect(result).toBeUndefined();
    });
  });

  describe('acceptPaymentSummary', () => {
    const mockAcceptData: TAcceptPaymentSummaryRequest = {
      successUrl: 'https://example.com/success'
    };

    it('should accept and return payment summary', async () => {
      mockedAxios.put.mockResolvedValueOnce({ data: mockPaymentSummary });
      vi.mocked(paymentSummarySchema.parse).mockReturnValueOnce(
        mockPaymentSummary
      );

      const result = await paymentService.acceptPaymentSummary(
        mockUuid,
        mockAcceptData
      );

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `https://api.sandbox.bvnk.com/api/v1/pay/${mockUuid}/accept/summary`,
        mockAcceptData
      );
      expect(result).toEqual(mockPaymentSummary);
    });

    it('should handle validation errors in request data', async () => {
      const invalidData = {
        successUrl: 'invalid-url'
      };
      mockedAxios.put.mockResolvedValueOnce({ data: mockPaymentSummary });
      vi.mocked(acceptPaymentSummaryRequestSchema.parse).mockImplementationOnce(
        () => {
          throw new Error('Validation error');
        }
      );

      const result = await paymentService.acceptPaymentSummary(
        mockUuid,
        invalidData as TAcceptPaymentSummaryRequest
      );

      expect(handleServiceError).toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network error');
      mockedAxios.put.mockRejectedValueOnce(networkError);
      vi.mocked(acceptPaymentSummaryRequestSchema.parse).mockImplementationOnce(
        () => {
          throw networkError;
        }
      );

      const result = await paymentService.acceptPaymentSummary(
        mockUuid,
        mockAcceptData
      );

      expect(handleServiceError).toHaveBeenCalledWith(networkError);
      expect(result).toBeUndefined();
    });
  });
});
