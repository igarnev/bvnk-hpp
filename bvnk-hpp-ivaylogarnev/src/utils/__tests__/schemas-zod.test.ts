import { describe, it, expect } from 'vitest';
import {
  uuidSchema,
  currencySchema,
  exchangeRateSchema,
  addressSchema,
  paymentSummarySchema,
  updatePaymentSummaryRequestSchema,
  acceptPaymentSummaryRequestSchema,
  serverErrorSchema
} from '../schemas-zod';

describe('Zod Schemas', () => {
  describe('uuidSchema', () => {
    it('validates a valid UUID', () => {
      const result = uuidSchema.uuid.safeParse(
        '123e4567-e89b-12d3-a456-426614174000'
      );
      expect(result.success).toBe(true);
    });

    it('rejects an invalid UUID', () => {
      const result = uuidSchema.uuid.safeParse('invalid-uuid');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Please enter a valid UUID'
        );
      }
    });
  });

  describe('currencySchema', () => {
    it('validates valid currency data', () => {
      const validData = {
        currency: 'USD',
        amount: 100,
        actual: 100
      };
      const result = currencySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('allows null currency', () => {
      const validData = {
        currency: null,
        amount: 100,
        actual: 100
      };
      const result = currencySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid currency data', () => {
      const invalidData = {
        currency: 'USD',
        amount: '100', // should be number
        actual: 100
      };
      const result = currencySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('exchangeRateSchema', () => {
    it('validates valid exchange rate data', () => {
      const validData = {
        base: 'USD',
        counter: 'EUR',
        rate: 0.85
      };
      const result = exchangeRateSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid exchange rate data', () => {
      const invalidData = {
        base: 'USD',
        counter: 'EUR',
        rate: '0.85' // should be number
      };
      const result = exchangeRateSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('addressSchema', () => {
    it('validates valid address data', () => {
      const validData = {
        address: '0x123...',
        tag: 'tag123'
      };
      const result = addressSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('allows null tag', () => {
      const validData = {
        address: '0x123...',
        tag: null
      };
      const result = addressSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('allows null address object', () => {
      const result = addressSchema.safeParse(null);
      expect(result.success).toBe(true);
    });

    it('rejects invalid address data', () => {
      const invalidData = {
        address: 123, // should be string
        tag: 'tag123'
      };
      const result = addressSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('paymentSummarySchema', () => {
    it('validates valid payment summary data', () => {
      const validData = {
        uuid: '123e4567-e89b-12d3-a456-426614174000',
        merchantDisplayName: 'Test Merchant',
        merchantId: 'merch123',
        dateCreated: 1234567890,
        expiryDate: 1234567890,
        quoteExpiryDate: 1234567890,
        acceptanceExpiryDate: 1234567890,
        quoteStatus: 'ACCEPTED',
        reference: 'ref123',
        type: 'type1',
        subType: 'subtype1',
        status: 'PENDING',
        displayCurrency: {
          currency: 'USD',
          amount: 100,
          actual: 100
        },
        walletCurrency: {
          currency: 'BTC',
          amount: 0.001,
          actual: 0.001
        },
        paidCurrency: {
          currency: 'BTC',
          amount: 0.001,
          actual: 0.001
        },
        feeCurrency: {
          currency: 'USD',
          amount: 1,
          actual: 1
        },
        displayRate: {
          base: 'USD',
          counter: 'BTC',
          rate: 0.00001
        },
        exchangeRate: {
          base: 'USD',
          counter: 'BTC',
          rate: 0.00001
        },
        address: {
          address: '0x123...',
          tag: null
        },
        returnUrl: 'https://example.com/return',
        redirectUrl: 'https://example.com/redirect',
        transactions: [],
        refund: null,
        refunds: [],
        walletId: 'wallet123'
      };
      const result = paymentSummarySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid payment summary data', () => {
      const invalidData = {
        uuid: 'invalid-uuid',
        merchantDisplayName: 'Test Merchant'
        // missing required fields
      };
      const result = paymentSummarySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('updatePaymentSummaryRequestSchema', () => {
    it('validates valid update request data', () => {
      const validData = {
        currency: 'USD',
        payInMethod: 'method1'
      };
      const result = updatePaymentSummaryRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid currency length', () => {
      const invalidData = {
        currency: 'US', // too short
        payInMethod: 'method1'
      };
      const result = updatePaymentSummaryRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Currency must be at least 3 characters'
        );
      }
    });

    it('rejects empty payment method', () => {
      const invalidData = {
        currency: 'USD',
        payInMethod: '' // empty
      };
      const result = updatePaymentSummaryRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          'Payment method is required'
        );
      }
    });
  });

  describe('acceptPaymentSummaryRequestSchema', () => {
    it('validates valid accept request data', () => {
      const validData = {
        successUrl: 'https://example.com/success'
      };
      const result = acceptPaymentSummaryRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid accept request data', () => {
      const invalidData = {
        successUrl: 123 // should be string
      };
      const result = acceptPaymentSummaryRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('serverErrorSchema', () => {
    it('validates valid server error data', () => {
      const validData = {
        code: 'ERROR_CODE',
        message: 'Error message',
        parameter: 'param1',
        requestId: 'req123',
        errorList: [
          {
            code: 'ERROR_CODE',
            message: 'Error message',
            parameter: 'param1'
          }
        ]
      };
      const result = serverErrorSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid server error data', () => {
      const invalidData = {
        code: 'ERROR_CODE',
        message: 'Error message',
        parameter: 'param1',
        requestId: 'req123',
        errorList: [
          {
            code: 'ERROR_CODE',
            message: 'Error message',
            parameter: 123 // should be string
          }
        ]
      };
      const result = serverErrorSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
