import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@utils/constants-routes';

import { usePaymentSummary } from '@/hooks/usePaymentSummary';
import { CardFooter } from '@components/ui/card';
import { CountdownTimer } from '@components/common/CountdownTimer';
import { CardSectionDivider } from '@components/common/CardSectionDivider';

export const PayQuoteTimeRemaining = () => {
  const navigate = useNavigate();
  const { paymentSummary } = usePaymentSummary();

  const expiryDate = paymentSummary?.expiryDate;

  const handleOnExpire = () =>
    navigate(ROUTES.PAYMENT_EXPIRED, { replace: true });

  return (
    <>
      <CardSectionDivider />

      <CardFooter className="relative justify-between">
        <div className="text-muted-foreground font-light">Time left to pay</div>
        <CountdownTimer
          expiryDate={expiryDate ?? 0}
          onExpire={handleOnExpire}
        />
      </CardFooter>

      <CardSectionDivider />
    </>
  );
};
