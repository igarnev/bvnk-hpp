import { CardFooter } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { useAcceptPayment } from '@/hooks/useAcceptPayment';

export const ConfirmPaymentButton = () => {
  const { acceptPayment } = useAcceptPayment();

  return (
    <CardFooter className="relative justify-between mt-4">
      <Button
        className="w-full"
        onClick={() => acceptPayment.mutateAsync()}
        disabled={acceptPayment.isPending}
      >
        {acceptPayment.isPending ? 'Processing...' : 'Confirm'}
      </Button>
    </CardFooter>
  );
};
