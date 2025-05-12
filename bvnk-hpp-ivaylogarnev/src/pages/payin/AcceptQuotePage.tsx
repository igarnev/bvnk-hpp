import { useParams } from 'react-router-dom';
import { useState } from 'react';

import { currencyOptions } from '@utils/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

const AcceptQuotePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Accept Quote</h1>

      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-lg mb-4">Merchant Display Name</CardTitle>
          <div className="text-4xl font-bold">200 EUR</div>
          <div className="mt-4 text-sm text-gray-500">
            For reference number: <span className="font-medium">REF292970</span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Pay with</label>
            <Select
              onValueChange={setSelectedCurrency}
              value={selectedCurrency}
            >
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
      </Card>
    </div>
  );
};

export default AcceptQuotePage;
