import { usePaymentSummary } from '@/hooks/usePaymentSummary';
import { CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';

import { useNavigate } from 'react-router-dom';
import { CountdownTimer } from '../common/CountdownTimer';
import { useMemo } from 'react';

export const PayTimeRemaining = () => {
  const navigate = useNavigate();
  const { paymentSummary } = usePaymentSummary();

  const expiryDate = useMemo(
    () => Number(paymentSummary?.acceptanceExpiryDate),
    [paymentSummary?.acceptanceExpiryDate]
  );

  return (
    <>
      <Separator className="bg-gray-200 mx-auto" />
      <CardFooter className="relative justify-between">
        <div className="text-muted-foreground">Time left to pay:</div>
        <CountdownTimer
          expiryDate={expiryDate}
          onExpire={() => navigate(`/expired`)}
        />
      </CardFooter>
      <Separator className="bg-gray-200 mx-auto" />
    </>
  );
};
