import { Loader2 } from 'lucide-react';

import { Card } from '@components/ui/card';
import { PayQuoteHeader } from '@components/pay-quote/PayQuoteHeader';
import { PayQuoteAmountDue } from '@components/pay-quote/PayQuoteAmountDue';
import { PayQuoteQrCodeSection } from '@components/pay-quote/PayQuoteQrCodeSection';
import { PayQuoteTimeRemaining } from '@components/pay-quote/PayQuoteTimeRemaining';
import { PayQuotePaymentAddress } from '@components/pay-quote/PayQuotePaymentAddress';

import { usePaymentSummary } from '@hooks/usePaymentSummary';

export const PayQuotePage = () => {
  const { paymentSummary } = usePaymentSummary();

  const address = paymentSummary?.address?.address;
  const currency = paymentSummary?.paidCurrency.currency;

  if (!address) {
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      {currency && (
        <Card className="w-full max-w-md bg-white gap-2">
          <PayQuoteHeader currency={currency} />

          <PayQuoteAmountDue />

          <PayQuotePaymentAddress />

          <PayQuoteQrCodeSection
            address={address}
            currency={currency}
            amount={paymentSummary?.paidCurrency.amount.toString()}
          />

          <PayQuoteTimeRemaining />
        </Card>
      )}
    </div>
  );
};
