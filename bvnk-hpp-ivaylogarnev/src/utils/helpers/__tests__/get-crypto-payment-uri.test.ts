import { describe, it, expect } from 'vitest';
import { getCryptoPaymentUri } from '../get-crypto-payment-uri';

describe('get-crypto-payment-uri', () => {
  const mockAddress = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
  const mockAmount = '0.001';

  it('should generate correct Bitcoin payment URI', () => {
    const result = getCryptoPaymentUri('BTC', mockAddress, mockAmount);
    expect(result).toBe(`bitcoin:${mockAddress}?amount=${mockAmount}`);
  });

  it('should generate correct Ethereum payment URI', () => {
    const result = getCryptoPaymentUri('ETH', mockAddress, mockAmount);
    expect(result).toBe(`ethereum:${mockAddress}?amount=${mockAmount}`);
  });

  it('should generate correct Litecoin payment URI', () => {
    const result = getCryptoPaymentUri('LTC', mockAddress, mockAmount);
    expect(result).toBe(`litecoin:${mockAddress}?amount=${mockAmount}`);
  });

  it('should return just the address for unsupported currencies', () => {
    const result = getCryptoPaymentUri('XRP', mockAddress, mockAmount);
    expect(result).toBe(mockAddress);
  });

  it('should handle different amount formats', () => {
    const amounts = ['0.001', '1.5', '1000', '0.00000001'];

    amounts.forEach((amount) => {
      const result = getCryptoPaymentUri('BTC', mockAddress, amount);
      expect(result).toBe(`bitcoin:${mockAddress}?amount=${amount}`);
    });
  });

  it('should handle different address formats', () => {
    const addresses = [
      'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Bitcoin
      '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Ethereum
      'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' // Litecoin
    ];

    addresses.forEach((address) => {
      const result = getCryptoPaymentUri('BTC', address, mockAmount);
      expect(result).toBe(`bitcoin:${address}?amount=${mockAmount}`);
    });
  });

  it('should handle case-insensitive currency codes', () => {
    const result = getCryptoPaymentUri('btc', mockAddress, mockAmount);
    expect(result).toBe(`bitcoin:${mockAddress}?amount=${mockAmount}`);
  });
});
