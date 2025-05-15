import { useNavigate } from 'react-router-dom';

import { usePaymentSummary } from '@/hooks/usePaymentSummary';
import { CardFooter } from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { CountdownTimer } from '@components/common/CountdownTimer';

import { ROUTES } from '@utils/constants-routes';

export const PayQuoteTimeRemaining = () => {
  const navigate = useNavigate();
  const { paymentSummary } = usePaymentSummary();

  const expiryDate = paymentSummary?.expiryDate;
  const handleOnExpire = () => navigate(ROUTES.PAYMENT_EXPIRED);

  return (
    <>
      <div className="px-6">
        <Separator className=" bg-gray-200" />
      </div>

      <CardFooter className="relative justify-between">
        <div className="text-muted-foreground">Time left to pay:</div>
        {expiryDate && (
          <CountdownTimer expiryDate={expiryDate} onExpire={handleOnExpire} />
        )}
      </CardFooter>

      <div className="px-6">
        <Separator className=" bg-gray-200" />
      </div>
    </>
  );
};
