import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { CardContent } from '@components/ui/card';

import { CURRENCY_OPTIONS } from '@utils/constants';

type TAcceptQuoteCurrencySelectorProps = {
  readonly selectedCurrency: string;
  readonly onCurrencyChange: (value: string) => void;
};

export const AcceptQuoteCurrencySelector = ({
  selectedCurrency,
  onCurrencyChange
}: TAcceptQuoteCurrencySelectorProps) => {
  return (
    <CardContent>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Pay with</label>
        <Select onValueChange={onCurrencyChange} value={selectedCurrency}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  );
};
