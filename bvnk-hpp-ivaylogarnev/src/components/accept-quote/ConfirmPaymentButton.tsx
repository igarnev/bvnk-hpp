import { CardFooter } from '@components/ui/card';
import { Button } from '@components/ui/button';

interface ConfirmPaymentButtonProps {
  readonly isPending: boolean;
  readonly onConfirm: () => void;
}

export const ConfirmPaymentButton = ({
  isPending,
  onConfirm
}: ConfirmPaymentButtonProps) => {
  return (
    <CardFooter className="relative justify-between mt-4">
      <Button className="w-full" onClick={onConfirm} disabled={isPending}>
        {isPending ? 'Processing...' : 'Confirm'}
      </Button>
    </CardFooter>
  );
};
