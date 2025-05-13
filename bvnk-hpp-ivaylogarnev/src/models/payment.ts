export interface Currency {
    currency: string | null;
    amount: number;
    actual: number;
  }
  
  export interface ExchangeRate {
    base: string;
    counter: string;
    rate: number;
  }
  
  export interface Address {
    address: string;
    tag: string | null;
    protocol: string;
    uri: string;
    alternatives: unknown[];
  }
  
  export interface PaymentSummary {
    uuid: string;
    merchantDisplayName: string;
    merchantId: string;
    dateCreated: number;
    expiryDate: number;
    quoteExpiryDate: number | null;
    acceptanceExpiryDate: number | null;
    quoteStatus: 'TEMPLATE' | 'PENDING' | 'ACCEPTED' | 'EXPIRED';
    reference: string;
    type: string;
    subType: string;
    status: 'PENDING' | 'EXPIRED' | 'COMPLETED';
    displayCurrency: Currency;
    walletCurrency: Currency;
    paidCurrency: Currency;
    feeCurrency: Currency;
    displayRate: ExchangeRate | null;
    exchangeRate: ExchangeRate | null;
    address: Address | null;
    returnUrl: string;
    redirectUrl: string;
    transactions: unknown[];
    refund: unknown | null;
    refunds: unknown[];
  }
  
  export interface UpdateSummaryRequest {
    currency: string;
    payInMethod: string;
  }
  
  export interface AcceptSummaryRequest {
    successUrl: string;
  }
  