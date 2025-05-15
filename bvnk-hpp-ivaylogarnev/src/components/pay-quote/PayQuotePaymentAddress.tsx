import { twJoin } from 'tailwind-merge';

import { CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';

import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { useCopyToClipboard } from '@hooks/useCopyToClipboard';

export const PayQuotePaymentAddress = () => {
  const { paymentSummary } = usePaymentSummary();
  const { copiedText, handleCopyToClipboard } = useCopyToClipboard();

  const address = paymentSummary?.address?.address;

  return (
    <>
      <div className="px-6">
        <Separator className="bg-gray-200" />
      </div>

      <CardContent className="flex justify-between">
        <div className="text-muted-foreground">
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

          {address && (
            <Button
              variant="link"
              className={twJoin(
                'cursor-pointer p-2',
                copiedText && 'text-secondary'
              )}
              onClick={() => handleCopyToClipboard(address)}
            >
              {copiedText ? 'Copied!' : 'Copy'}
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
};
