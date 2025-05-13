import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';

import { formatTime, updateTimerFromExpiryDate } from '@utils/helpers/timer';
import { currencyOptions } from '@utils/constants';
import { paymentService } from '@/services/paymentService';

const AcceptQuotePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();

  const { data: paymentSummary } = useQuery({
    queryKey: ['paymentSummary', uuid],
    queryFn: () => paymentService.getPaymentSummary(uuid!),
    enabled: !!uuid
  });

  const updatePaymentSummary = useMutation({
    mutationFn: async () => {
      if (!uuid || !selectedCurrency) return null;

      const data = await paymentService.updatePaymentSummary(uuid, {
        currency: selectedCurrency,
        payInMethod: 'crypto'
      });

      if (data?.acceptanceExpiryDate) {
        updateTimerFromExpiryDate(data.acceptanceExpiryDate, setTimeLeft);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSummary', uuid] });
    }
  });

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || timerRef.current !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // When timer reaches zero and currency is selected, update payment
          if (selectedCurrency) {
            updatePaymentSummary.mutate();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, selectedCurrency, updatePaymentSummary]);

  // Handle currency selection
  const handleSelectedCurrency = (value: string) => {
    setSelectedCurrency(value);
    updatePaymentSummary.mutate();
  };

  const handleConfirm = async () => {
    const data = await paymentService.acceptPaymentSummary(uuid!, {
      successUrl: 'no_url_needed'
    });

    if (data) {
      navigate(`/payin/${uuid}/pay`, {
        state: {
          paymentSummary: data
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-lg mb-4">Merchant Display Name</CardTitle>
          <div className="text-4xl font-bold">
            {paymentSummary?.displayCurrency.amount ?? 0}{' '}
            {paymentSummary?.displayCurrency.currency ?? 'N/A'}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            For reference number:{' '}
            <span className="font-medium">
              {paymentSummary?.reference ?? 'N/A'}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Pay with</label>
            <Select
              onValueChange={handleSelectedCurrency}
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

        {selectedCurrency && (
          <div className="flex flex-col">
            <Separator className="!w-[89%] my-1 bg-gray-200 mx-auto" />

            <CardFooter className="relative justify-between py-2 ">
              <div className="text-muted-foreground">Amount due:</div>
              <div>
                {updatePaymentSummary.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {paymentSummary?.paidCurrency.amount}{' '}
                    {paymentSummary?.paidCurrency.currency}
                  </>
                )}
              </div>
            </CardFooter>

            <Separator className="!w-[89%] my-1  bg-gray-200 mx-auto" />
            <CardFooter className="relative justify-between py-2 ">
              <div className="text-muted-foreground">
                Quote price expires in:
              </div>
              <div>
                {updatePaymentSummary.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  formatTime(timeLeft)
                )}
              </div>
            </CardFooter>
            <Separator className="!w-[89%] my-1 bg-gray-200 mx-auto" />

            <CardFooter className="relative justify-between mt-4">
              <Button className="w-full" onClick={handleConfirm}>
                Confirm
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AcceptQuotePage;
