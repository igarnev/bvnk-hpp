import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useTimer } from '@hooks/useTimer';

import { Card } from '@components/ui/card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorBanner } from '@components/common/ErrorBanner';
import { AcceptQuoteHeader } from '@components/accept-quote/AcceptQuoteHeader';
import { CurrencySelector } from '@components/accept-quote/CurrencySelector';
import { PaymentDetails } from '@components/accept-quote/PaymentDetails';
import { ConfirmPaymentButton } from '@components/accept-quote/ConfirmPaymentButton';

export const AcceptQuotePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  const {
    paymentSummary,
    isLoading,
    error,
    updatePaymentSummary,
    acceptPaymentData
  } = usePaymentSummary({ uuid });

  const { timeLeft } = useTimer({
    expiryDate: paymentSummary?.acceptanceExpiryDate,
    onExpire: () => {
      if (selectedCurrency) {
        updatePaymentSummary.mutate({
          currency: selectedCurrency
        });
      }
    }
  });

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
    <div className="flex flex-col items-center justify-center h-screen ">
      <Card className="w-full max-w-md mb-64">
        <AcceptQuoteHeader
          displayAmount={paymentSummary?.displayCurrency.amount || 0}
          displayCurrency={
            paymentSummary?.displayCurrency.currency || undefined
          }
          reference={paymentSummary?.reference}
        />

        <CurrencySelector
          selectedCurrency={selectedCurrency}
          onCurrencyChange={handleSelectedCurrency}
        />

        {selectedCurrency && (
          <>
            <PaymentDetails
              isPending={updatePaymentSummary.isPending}
              amount={paymentSummary?.paidCurrency.amount}
              currency={paymentSummary?.paidCurrency.currency || undefined}
              timeLeft={timeLeft}
            />

            <ConfirmPaymentButton
              isPending={acceptPaymentData.isPending}
              onConfirm={() => acceptPaymentData.mutate()}
            />
          </>
        )}
      </Card>
    </div>
  );
};
