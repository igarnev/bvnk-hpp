import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { CardContent } from '@components/ui/card';

import { currencyOptions } from '@/utils/constants/constants';

interface CurrencySelectorProps {
  readonly selectedCurrency: string;
  readonly onCurrencyChange: (value: string) => void;
}

export const CurrencySelector = ({
  selectedCurrency,
  onCurrencyChange
}: CurrencySelectorProps) => {
  return (
    <CardContent>
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Pay with</label>
        <Select onValueChange={onCurrencyChange} value={selectedCurrency}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            {currencyOptions.map(
              (currency: { value: string; label: string }) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  );
};
