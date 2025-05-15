import type { EQuoteStatus } from './EQuoteStatus';
import type { Address } from './IAddress';
import type { ExchangeRate } from './IEchangeRate';
import type { ICurrency } from './ICurrency';
import type { EStatus } from './EStatus';

export interface IPaymentSummary {
  readonly uuid: string;
  readonly merchantDisplayName: string;
  readonly merchantId: string;
  readonly dateCreated: number;
  readonly expiryDate: number;
  readonly quoteExpiryDate: number | null;
  readonly acceptanceExpiryDate: number | null;
  readonly quoteStatus: EQuoteStatus;
  readonly reference: string;
  readonly type: string;
  readonly subType: string;
  readonly status: EStatus;
  readonly displayCurrency: ICurrency;
  readonly walletCurrency: ICurrency;
  readonly paidCurrency: ICurrency;
  readonly feeCurrency: ICurrency;
  readonly displayRate: ExchangeRate | null;
  readonly exchangeRate: ExchangeRate | null;
  readonly address: Address | null;
  readonly returnUrl: string;
  readonly redirectUrl: string;
  readonly transactions: unknown[];
  readonly refund: unknown | null;
  readonly refunds: unknown[];
  readonly walletId: string;
}
