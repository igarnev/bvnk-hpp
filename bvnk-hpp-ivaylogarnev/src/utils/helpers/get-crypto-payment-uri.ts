export const getCryptoPaymentUri = (
  currency: string,
  address: string,
  amount: string
): string => {
  const upperCurrency = currency.toUpperCase();

  switch (upperCurrency) {
    case 'BTC':
      return `bitcoin:${address}?amount=${amount}`;
    case 'LTC':
      return `litecoin:${address}?amount=${amount}`;
    case 'ETH':
      return `ethereum:${address}?amount=${amount}`;
    default:
      return address;
  }
};
