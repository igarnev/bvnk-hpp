import { Loader2 } from 'lucide-react';

import { usePaymentSummary } from '@hooks/usePaymentSummary';

import type { TUpdatePaymentSummary } from '@models/TUpdatePaymentSummary';

import { CardFooter } from '@components/ui/card';
import { CountdownTimer } from '@components/common/CountdownTimer';
import { CardSectionDivider } from '@components/common/CardSectionDivider';

type TAcceptQuotePaymentDetailsProps = {
  readonly currency: string;
  readonly updatePaymentSummary: TUpdatePaymentSummary;
};

export const AcceptQuotePaymentDetails = ({
  currency,
  updatePaymentSummary
}: TAcceptQuotePaymentDetailsProps) => {
  const { paymentSummary } = usePaymentSummary();

  const acceptanceExpiryDate = paymentSummary?.acceptanceExpiryDate;

  const handleExpire = () =>
    updatePaymentSummary.mutate({
      currency
    });

  return (
    <div className="flex flex-col">
      <CardSectionDivider />

      <CardFooter
        className="relative justify-between py-2"
        data-testid="amount-due-footer"
      >
        <div className="text-muted-foreground font-light">Amount due:</div>
        <div>
          {updatePaymentSummary.isPending ? (
            <Loader2
              className="h-4 w-4 animate-spin text-primary"
              data-testid="loader"
            />
          ) : (
            <>
              {paymentSummary?.paidCurrency.amount} {currency}
            </>
          )}
        </div>
      </CardFooter>

      <CardSectionDivider />

      <CardFooter
        className="relative justify-between py-2"
        data-testid="quote-expiry-footer"
      >
        <div className="text-muted-foreground font-light">
          Quote price expires in:
        </div>

        <CountdownTimer
          onExpire={handleExpire}
          expiryDate={acceptanceExpiryDate ?? 0}
          isLoading={updatePaymentSummary.isPending}
        />
      </CardFooter>

      <CardSectionDivider />
    </div>
  );
};
