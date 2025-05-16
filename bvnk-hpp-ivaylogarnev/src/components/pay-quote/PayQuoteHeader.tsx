import { CardHeader, CardTitle } from '@components/ui/card';

type TPayQuoteHeaderProps = {
  readonly currency: string;
};

export const PayQuoteHeader = ({ currency }: TPayQuoteHeaderProps) => {
  return (
    <CardHeader className="flex flex-col items-center text-center">
      <CardTitle className="text-lg mb-4 font-medium">
        Pay with {currency}
      </CardTitle>
      <div className="text-sm max-w-2xs mb-4 text-muted-foreground font-light">
        To complete this payment send the amount due to the {currency} address
        provided below.
      </div>
    </CardHeader>
  );
};
