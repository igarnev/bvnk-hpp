import { CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { handleCopyText } from '@utils/helpers/copy-text';
import { usePaymentSummary } from '@/hooks/usePaymentSummary';
import { useMemo } from 'react';

interface PaymentAddressProps {
  readonly copied: { [key: string]: boolean };
  readonly setCopied: (value: { [key: string]: boolean }) => void;
}

export const PaymentAddress = ({ copied, setCopied }: PaymentAddressProps) => {
  const { paymentSummary } = usePaymentSummary();

  const address = useMemo(
    () => paymentSummary?.address?.address,
    [paymentSummary?.address?.address]
  );

  return (
    <>
      <Separator className=" bg-gray-200 mx-auto" />
      <CardContent className="flex justify-between py-1">
        <div className="text-muted-foreground">
          {paymentSummary?.paidCurrency.currency} address:
        </div>
        <div
          className={`flex items-center ${
            copied['address'] ? 'font-semibold text-[#6373e3]' : ''
          }`}
        >
          <div>
            {address?.slice(0, 7)}...{address?.slice(-5)}
          </div>
          <Button
            variant="link"
            className={`cursor-pointer p-2 ${
              copied['address'] ? 'text-[#6373e3]' : 'text-[#3f53dd]'
            }`}
            onClick={() => handleCopyText(address || '', 'address', setCopied)}
          >
            {copied['address'] ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
    </>
  );
};
