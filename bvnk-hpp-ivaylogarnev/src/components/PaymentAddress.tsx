import { CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { handleCopyText } from '@utils/helpers/copy-text';

interface PaymentAddressProps {
  readonly address: string;
  readonly currency: string;
  readonly copied: { [key: string]: boolean };
  readonly setCopied: (value: { [key: string]: boolean }) => void;
}

export const PaymentAddress = ({
  address,
  currency,
  copied,
  setCopied
}: PaymentAddressProps) => {
  return (
    <>
      <Separator className="!w-[89%] bg-gray-200 mx-auto" />
      <CardContent className="flex justify-between py-1">
        <div className="text-muted-foreground">{currency} address:</div>
        <div
          className={`flex items-center ${
            copied['address'] ? 'font-semibold text-[#6373e3]' : ''
          }`}
        >
          <div>
            {address.slice(0, 7)}...{address.slice(-5)}
          </div>
          <Button
            variant="link"
            className={`cursor-pointer p-2 ${
              copied['address'] ? 'text-[#6373e3]' : 'text-[#3f53dd]'
            }`}
            onClick={() => handleCopyText(address, 'address', setCopied)}
          >
            {copied['address'] ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
    </>
  );
};
