import { useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { AxiosError } from 'axios';
import type { UseMutationResult } from '@tanstack/react-query';

import { CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { CountdownTimer } from '@components/common/CountdownTimer';

import { usePaymentSummary } from '@hooks/usePaymentSummary';

import type { PaymentSummary } from '@models/payment';

interface PaymentDetailsProps {
  readonly currency: string;
  readonly updatePaymentSummary: UseMutationResult<
    PaymentSummary,
    AxiosError,
    { currency: string }
  >;
}

export const PaymentDetails = ({
  currency,
  updatePaymentSummary
}: PaymentDetailsProps) => {
  const { paymentSummary } = usePaymentSummary();

  const acceptanceExpiryDate = useMemo(
    () => Number(paymentSummary?.acceptanceExpiryDate),
    [paymentSummary?.acceptanceExpiryDate]
  );

  const amountDue = useMemo(
    () => paymentSummary?.paidCurrency.amount,
    [paymentSummary?.paidCurrency.amount]
  );

  return (
    <div className="flex flex-col px-6">
      <Separator className="my-1 bg-gray-200 mx-auto" />
      <CardFooter className="relative justify-between py-2">
        <div className="text-muted-foreground">Amount due:</div>
        <div>
          {updatePaymentSummary.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {amountDue} {currency}
            </>
          )}
        </div>
      </CardFooter>

      <Separator className="my-1 bg-gray-200 mx-auto" />
      <CardFooter className="relative justify-between py-2">
        <div className="text-muted-foreground">Quote price expires in:</div>
        <CountdownTimer
          expiryDate={acceptanceExpiryDate}
          onExpire={() =>
            updatePaymentSummary.mutate({
              currency
            })
          }
          isPending={updatePaymentSummary.isPending}
        />
      </CardFooter>
      <Separator className="my-1 bg-gray-200 mx-auto" />
    </div>
  );
};
