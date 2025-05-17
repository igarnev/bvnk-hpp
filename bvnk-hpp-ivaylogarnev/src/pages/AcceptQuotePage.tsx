import { useState } from 'react';

import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useUpdatePaymentSummary } from '@hooks/useUpdatePaymentSummary';

import type { TUpdatePaymentSummary } from '@models/TUpdatePaymentSummary';

import { Card } from '@components/ui/card';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { ErrorBanner } from '@components/common/ErrorBanner';
import { AcceptQuoteHeader } from '@components/accept-quote/AcceptQuoteHeader';
import { AcceptQuoteCurrencySelector } from '@components/accept-quote/AcceptQuoteCurrencySelector';
import { AcceptQuotePaymentDetails } from '@components/accept-quote/AcceptQuotePaymentDetails';
import { AcceptQuoteConfirmPaymentButton } from '@components/accept-quote/AcceptQuoteConfirmPaymentButton';

export const AcceptQuotePage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const { isLoading, error } = usePaymentSummary();
  const { updatePaymentSummary } = useUpdatePaymentSummary();

  const handleCurrencyChange = (value: string) => {
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
    <div className="flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <AcceptQuoteHeader />

        <AcceptQuoteCurrencySelector
          selectedCurrency={selectedCurrency}
          onCurrencyChange={handleCurrencyChange}
        />

        {selectedCurrency && (
          <AcceptQuotePaymentDetails
            currency={selectedCurrency}
            updatePaymentSummary={updatePaymentSummary as TUpdatePaymentSummary}
          />
        )}
        <AcceptQuoteConfirmPaymentButton
          currency={selectedCurrency}
          isUpdatePaymentPending={updatePaymentSummary.isPending}
        />
      </Card>
    </div>
  );
};
