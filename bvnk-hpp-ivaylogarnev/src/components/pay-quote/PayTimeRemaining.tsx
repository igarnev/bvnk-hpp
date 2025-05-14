import { CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';

import { formatTime } from '@utils/helpers/timer';

interface PayTimeRemainingProps {
  readonly timeLeft: number;
}

export const PayTimeRemaining = ({ timeLeft }: PayTimeRemainingProps) => {
  return (
    <>
      <Separator className="!w-[89%] bg-gray-200 mx-auto" />
      <CardFooter className="relative justify-between">
        <div className="text-muted-foreground">Time left to pay:</div>
        <div>{formatTime(timeLeft)}</div>
      </CardFooter>
      <Separator className="!w-[89%] bg-gray-200 mx-auto" />
    </>
  );
};
