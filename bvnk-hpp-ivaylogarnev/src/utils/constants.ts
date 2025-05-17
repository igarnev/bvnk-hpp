import type { TCurrencyOption } from '@models/TCurrency';

export const CURRENCY_OPTIONS: TCurrencyOption[] = [
  { value: 'BTC', label: 'Bitcoin (BTC)' },
  { value: 'ETH', label: 'Ethereum (ETH)' },
  { value: 'LTC', label: 'Litecoin (LTC)' }
];

export const ROUTES = {
  HOME: '/',
  PAYMENT_SUMMARY: '/payin/:uuid',
  PAYMENT_PAY: '/payin/:uuid/pay',
  PAYMENT_EXPIRED: '/expired',
  NOT_FOUND: '/not-found'
};

export const DEBOUNCE_TIME = 5000;
export const EXPIRED_PAYMENT_ERROR_CODES = [
  'MER-PAY-2017',
  'MER-PAY-2004'
] as const;
