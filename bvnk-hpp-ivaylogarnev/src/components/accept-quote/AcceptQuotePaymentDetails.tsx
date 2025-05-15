import { Loader2 } from 'lucide-react';
import type { AxiosError } from 'axios';
import type { UseMutationResult } from '@tanstack/react-query';

import { CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { CountdownTimer } from '@components/common/CountdownTimer';

import { usePaymentSummary } from '@hooks/usePaymentSummary';

import type { IPaymentSummary } from '@models/IPaymentSummary';

type TAcceptQuotePaymentDetailsProps = {
  readonly currency: string;
  readonly updatePaymentSummary: UseMutationResult<
    IPaymentSummary,
    AxiosError,
    { currency: string }
  >;
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
      <div className="px-6">
        <Separator className=" bg-gray-200" />
      </div>

      <CardFooter className="relative justify-between py-2">
        <div className="text-muted-foreground">Amount due:</div>
        <div>
          {updatePaymentSummary.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {paymentSummary?.paidCurrency.amount} {currency}
            </>
          )}
        </div>
      </CardFooter>

      <div className="px-6">
        <Separator className=" bg-gray-200" />
      </div>

      <CardFooter className="relative justify-between py-2">
        <div className="text-muted-foreground">Quote price expires in:</div>
        <CountdownTimer
          expiryDate={acceptanceExpiryDate ?? 0}
          onExpire={handleExpire}
          isLoading={updatePaymentSummary.isPending}
        />
      </CardFooter>

      <div className="px-6">
        <Separator className="my-1 bg-gray-200" />
      </div>
    </div>
  );
};
