import { twJoin } from 'tailwind-merge';

import { CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';

import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';

export const PayQuoteAmountDue = () => {
  const { paymentSummary } = usePaymentSummary();
  const { copiedText, handleCopyToClipboard } = useCopyToClipboard();

  const amount = paymentSummary?.paidCurrency.amount.toString();
  const currency = paymentSummary?.paidCurrency.currency;

  return (
    <>
      <div className="px-6">
        <Separator className=" bg-gray-200" />
      </div>

      <CardContent className="flex justify-between items-center">
        <div className="text-muted-foreground">Amount due:</div>
        <div
          className={twJoin(
            'flex items-center',
            copiedText && 'font-semibold text-primary'
          )}
        >
          {amount} {currency}
          {amount && (
            <Button
              variant="link"
              className={twJoin(
                'cursor-pointer p-2',
                copiedText && 'text-secondary'
              )}
              onClick={() => handleCopyToClipboard(amount)}
            >
              {copiedText ? 'Copied!' : 'Copy'}
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
};
