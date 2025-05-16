import { z } from 'zod';

export const uuidSchema = {
  uuid: z.string().uuid('Please enter a valid UUID')
};

export const currencySchema = z.object({
  currency: z.string().nullable(),
  amount: z.number(),
  actual: z.number()
});

export const exchangeRateSchema = z.object({
  base: z.string(),
  counter: z.string(),
  rate: z.number()
});

export const addressSchema = z
  .object({
    address: z.string(),
    tag: z.string().nullable()
  })
  .nullable();

export const paymentSummarySchema = z.object({
  uuid: z.string().uuid(),
  merchantDisplayName: z.string(),
  merchantId: z.string(),
  dateCreated: z.number(),
  expiryDate: z.number(),
  quoteExpiryDate: z.number().nullable(),
  acceptanceExpiryDate: z.number().nullable(),
  quoteStatus: z.enum(['ACCEPTED', 'PENDING', 'TEMPLATE', 'EXPIRED']),
  reference: z.string(),
  type: z.string(),
  subType: z.string(),
  status: z.enum(['EXPIRED', 'PENDING', 'COMPLETED']),
  displayCurrency: currencySchema,
  walletCurrency: currencySchema,
  paidCurrency: currencySchema,
  feeCurrency: currencySchema,
  displayRate: exchangeRateSchema.nullable(),
  exchangeRate: exchangeRateSchema.nullable(),
  address: addressSchema,
  returnUrl: z.string(),
  redirectUrl: z.string(),
  transactions: z.array(z.unknown()),
  refund: z.unknown().nullable(),
  refunds: z.array(z.unknown()),
  walletId: z.string()
});

export const updatePaymentSummaryRequestSchema = z.object({
  currency: z.string().min(3, 'Currency must be at least 3 characters'),
  payInMethod: z.string().min(1, 'Payment method is required')
});

export const acceptPaymentSummaryRequestSchema = z.object({
  successUrl: z.string()
});

export const serverErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  parameter: z.string(),
  requestId: z.string(),
  errorList: z.array(
    z.object({
      code: z.string(),
      message: z.string(),
      parameter: z.string()
    })
  )
});
