import { twJoin } from 'tailwind-merge';

import { CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { CardSectionDivider } from '@/components/common/CardSectionDivider';

import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';

export const PayQuoteAmountDue = () => {
  const { paymentSummary } = usePaymentSummary();
  const { copiedText, handleCopyToClipboard } = useCopyToClipboard();

  const amount = paymentSummary?.paidCurrency.amount.toString();
  const currency = paymentSummary?.paidCurrency.currency;

  const handleCopyAmount = () => {
    if (amount) {
      handleCopyToClipboard(amount);
    }
  };

  return (
    <>
      <CardSectionDivider />

      <CardContent className="flex justify-between items-center">
        <div className="text-muted-foreground font-light">Amount due:</div>
        <div
          className={twJoin(
            'flex items-center',
            copiedText && 'font-semibold text-primary'
          )}
        >
          {amount} {currency}
          <Button
            variant="link"
            className={twJoin(
              'cursor-pointer p-2',
              copiedText && 'text-secondary'
            )}
            onClick={handleCopyAmount}
          >
            {copiedText ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
    </>
  );
};
