import { CardHeader, CardTitle } from '@components/ui/card';

interface AcceptQuoteHeaderProps {
  readonly displayAmount?: number;
  readonly displayCurrency?: string;
  readonly reference?: string;
}

export const AcceptQuoteHeader = ({
  displayAmount,
  displayCurrency,
  reference
}: AcceptQuoteHeaderProps) => {
  return (
    <CardHeader className="flex flex-col items-center text-center">
      <CardTitle className="text-lg">Merchant Display Name</CardTitle>
      <div className="text-4xl font-bold">
        {displayAmount ?? 0} {displayCurrency ?? 'N/A'}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        For reference number:
        <span className="text-black pl-1">{reference ?? 'N/A'}</span>
      </div>
    </CardHeader>
  );
};
