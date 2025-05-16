import { useState } from 'react';

import { CardFooter } from '@components/ui/card';
import { Button } from '@components/ui/button';

import { useAcceptPayment } from '@hooks/useAcceptPayment';

type TAcceptQuoteConfirmPaymentButtonProps = {
  readonly isUpdatePaymentPending: boolean;
  readonly currency: string;
};

export const AcceptQuoteConfirmPaymentButton = ({
  isUpdatePaymentPending,
  currency
}: TAcceptQuoteConfirmPaymentButtonProps) => {
  const { acceptPayment } = useAcceptPayment();
  const [isClicked, setIsClicked] = useState(false);

  const handleAcceptPaymentClick = () => {
    setIsClicked(true);
    acceptPayment.mutate();
  };

  return (
    <CardFooter>
      <Button
        className="w-full"
        onClick={handleAcceptPaymentClick}
        disabled={isUpdatePaymentPending || !currency || isClicked}
      >
        {isUpdatePaymentPending ? 'Processing...' : 'Confirm'}
      </Button>
    </CardFooter>
  );
};
