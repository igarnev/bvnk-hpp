export const getCryptoPaymentUri = (
  currency: string,
  address: string,
  amount: string
): string => {
  switch (currency) {
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
