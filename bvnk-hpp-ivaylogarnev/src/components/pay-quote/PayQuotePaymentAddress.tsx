import { twJoin } from 'tailwind-merge';

import { CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { CardSectionDivider } from '@components/common/CardSectionDivider';

import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';

export const PayQuotePaymentAddress = () => {
  const { paymentSummary } = usePaymentSummary();
  const { copiedText, handleCopyToClipboard } = useCopyToClipboard();

  const address = paymentSummary?.address?.address;

  const handleCopyAddress = () => {
    if (address) {
      handleCopyToClipboard(address);
    }
  };

  return (
    <>
      <CardSectionDivider />

      <CardContent className="flex justify-between">
        <div className="text-muted-foreground font-light">
          {paymentSummary?.paidCurrency.currency} address:
        </div>
        <div
          className={twJoin(
            'flex items-center',
            copiedText && 'font-semibold text-primary'
          )}
        >
          <div>
            {address?.slice(0, 7)}...{address?.slice(-5)}
          </div>

          <Button
            variant="link"
            className={twJoin(
              'cursor-pointer p-2',
              copiedText && 'text-secondary'
            )}
            onClick={handleCopyAddress}
          >
            {copiedText ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
    </>
  );
};
