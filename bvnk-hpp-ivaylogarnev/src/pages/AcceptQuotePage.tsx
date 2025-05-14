import { useState } from 'react';

import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useUpdatePaymentSummary } from '@hooks/useUpdatePaymentSummary';

import { Card } from '@components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBanner } from '@components/common/ErrorBanner';
import { AcceptQuoteHeader } from '@components/accept-quote/AcceptQuoteHeader';
import { CurrencySelector } from '@components/accept-quote/CurrencySelector';
import { PaymentDetails } from '@components/accept-quote/PaymentDetails';
import { ConfirmPaymentButton } from '@components/accept-quote/ConfirmPaymentButton';

export const AcceptQuotePage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const { isLoading, error } = usePaymentSummary();
  const { updatePaymentSummary } = useUpdatePaymentSummary();

  const handleSelectedCurrency = (value: string) => {
    setSelectedCurrency(value);
    updatePaymentSummary.mutate({ currency: value });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorBanner />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md mb-64">
        <AcceptQuoteHeader />

        <CurrencySelector
          selectedCurrency={selectedCurrency}
          onCurrencyChange={handleSelectedCurrency}
        />

        {selectedCurrency && (
          <PaymentDetails
            currency={selectedCurrency}
            updatePaymentSummary={updatePaymentSummary}
          />
        )}
        <ConfirmPaymentButton />
      </Card>
    </div>
  );
};
