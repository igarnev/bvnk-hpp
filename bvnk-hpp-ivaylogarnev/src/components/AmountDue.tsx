import { handleCopyText } from '@utils/helpers/copy-text';

import { CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';

interface AmountDueProps {
  readonly amount: number;
  readonly currency: string;
  readonly copied: { [key: string]: boolean };
  readonly setCopied: (value: { [key: string]: boolean }) => void;
}

export const AmountDue = ({
  amount,
  currency,
  copied,
  setCopied
}: AmountDueProps) => {
  return (
    <>
      <Separator className="!w-[89%] bg-gray-200 mx-auto" />
      <CardContent className="flex justify-between py-1">
        <div className="text-muted-foreground">Amount due:</div>
        <div
          className={`flex items-center ${
            copied['amount'] ? 'font-semibold text-[#6373e3]' : ''
          }`}
        >
          {amount} {currency}
          <Button
            variant="link"
            className={`cursor-pointer p-2 ${
              copied['amount'] ? 'text-[#6373e3]' : 'text-[#3f53dd]'
            }`}
            onClick={() =>
              handleCopyText(amount.toString(), 'amount', setCopied)
            }
          >
            {copied['amount'] ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </CardContent>
    </>
  );
};
