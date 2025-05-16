import { usePaymentSummary } from '@hooks/usePaymentSummary';

import { CardHeader, CardTitle } from '@components/ui/card';

export const AcceptQuoteHeader = () => {
  const { paymentSummary } = usePaymentSummary();

  const displayAmount = paymentSummary?.displayCurrency.amount;
  const displayCurrency = paymentSummary?.displayCurrency.currency;

  return (
    <CardHeader className="flex flex-col items-center text-center">
      <CardTitle className="text-lg font-medium">
        Merchant Display Name
      </CardTitle>

      <div className="flex justify-center items-end gap-2">
        <div className="text-3xl font-medium">{displayAmount}</div>
        <div className="text-xl font-medium">{displayCurrency}</div>
      </div>

      <div className="mt-4 text-sm text-muted-foreground font-light">
        For reference number:
        <span className="text-black pl-1">{paymentSummary?.reference}</span>
      </div>
    </CardHeader>
  );
};
