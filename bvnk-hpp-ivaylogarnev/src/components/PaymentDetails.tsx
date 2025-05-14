import { Loader2 } from 'lucide-react';

import { CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';

import { formatTime } from '@utils/helpers/timer';

interface PaymentDetailsProps {
  readonly isPending: boolean;
  readonly amount?: number;
  readonly currency?: string;
  readonly timeLeft: number;
}

export const PaymentDetails = ({
  isPending,
  amount,
  currency,
  timeLeft
}: PaymentDetailsProps) => {
  return (
    <div className="flex flex-col">
      <Separator className="!w-[89%] my-1 bg-gray-200 mx-auto" />
      <CardFooter className="relative justify-between py-2">
        <div className="text-muted-foreground">Amount due:</div>
        <div>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {amount ?? 0} {currency ?? 'N/A'}
            </>
          )}
        </div>
      </CardFooter>

      <Separator className="!w-[89%] my-1 bg-gray-200 mx-auto" />
      <CardFooter className="relative justify-between py-2">
        <div className="text-muted-foreground">Quote price expires in:</div>
        <div>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            formatTime(timeLeft)
          )}
        </div>
      </CardFooter>
      <Separator className="!w-[89%] my-1 bg-gray-200 mx-auto" />
    </div>
  );
};
