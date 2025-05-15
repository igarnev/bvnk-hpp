import { usePaymentSummary } from '@hooks/usePaymentSummary';

import { CardHeader, CardTitle } from '@components/ui/card';

export const AcceptQuoteHeader = () => {
  const { paymentSummary } = usePaymentSummary();

  const displayAmount = paymentSummary?.displayCurrency.amount;
  const displayCurrency = paymentSummary?.displayCurrency.currency;

  return (
    <CardHeader className="flex flex-col items-center text-center">
      <CardTitle className="text-lg">Merchant Display Name</CardTitle>
      <div className="text-4xl font-bold">
        {displayAmount} {displayCurrency}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        For reference number:
        <span className="text-black pl-1">{paymentSummary?.reference}</span>
      </div>
    </CardHeader>
  );
};
