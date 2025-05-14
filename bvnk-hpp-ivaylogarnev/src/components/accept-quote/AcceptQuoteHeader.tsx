import { usePaymentSummary } from '@/hooks/usePaymentSummary';
import { CardHeader, CardTitle } from '@components/ui/card';
import { useMemo } from 'react';

export const AcceptQuoteHeader = () => {
  const { paymentSummary } = usePaymentSummary();

  const displayAmount = useMemo(
    () => paymentSummary?.displayCurrency.amount,
    [paymentSummary?.displayCurrency.amount]
  );

  const displayCurrency = useMemo(
    () => paymentSummary?.displayCurrency.currency,
    [paymentSummary?.displayCurrency.currency]
  );

  const reference = useMemo(
    () => paymentSummary?.reference,
    [paymentSummary?.reference]
  );

  return (
    <CardHeader className="flex flex-col items-center text-center">
      <CardTitle className="text-lg">Merchant Display Name</CardTitle>
      <div className="text-4xl font-bold">
        {displayAmount ?? 0} {displayCurrency ?? 'N/A'}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        For reference number:
        <span className="text-black pl-1">{reference ?? 'N/A'}</span>
      </div>
    </CardHeader>
  );
};
