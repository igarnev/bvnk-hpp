export interface Currency {
  readonly currency: string | null;
  readonly amount: number;
  readonly actual: number;
}

export interface ExchangeRate {
  readonly base: string;
  readonly counter: string;
  readonly rate: number;
}

export interface Address {
  readonly address: string;
  readonly tag: string | null;
  readonly protocol: string;
  readonly uri: string;
  readonly alternatives: unknown[];
}

export interface PaymentSummary {
  readonly uuid: string;
  readonly merchantDisplayName: string;
  readonly merchantId: string;
  readonly dateCreated: number;
  readonly expiryDate: number;
  readonly quoteExpiryDate: number | null;
  readonly acceptanceExpiryDate: number | null;
  readonly quoteStatus: 'TEMPLATE' | 'PENDING' | 'ACCEPTED' | 'EXPIRED';
  readonly reference: string;
  readonly type: string;
  readonly subType: string;
  readonly status: 'PENDING' | 'EXPIRED' | 'COMPLETED';
  readonly displayCurrency: Currency;
  readonly walletCurrency: Currency;
  readonly paidCurrency: Currency;
  readonly feeCurrency: Currency;
  readonly displayRate: ExchangeRate | null;
  readonly exchangeRate: ExchangeRate | null;
  readonly address: Address | null;
  readonly returnUrl: string;
  readonly redirectUrl: string;
  readonly transactions: unknown[];
  readonly refund: unknown | null;
  readonly refunds: unknown[];
}

export interface UpdatePaymentSummaryRequest {
  readonly currency: string;
  readonly payInMethod: string;
}

export interface AcceptPaymentSummaryRequest {
  readonly successUrl: string;
}
