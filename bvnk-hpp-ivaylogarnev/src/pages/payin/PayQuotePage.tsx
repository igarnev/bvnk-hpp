import {
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@components/ui/card';
import { Separator } from '@components/ui/separator';

import type { PaymentSummary } from '@models/payment';

import { formatTime, updateTimerFromExpiryDate } from '@utils/helpers/timer';

const PayQuotePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (location.state?.paymentSummary) {
      setPaymentSummary(location.state.paymentSummary);
      console.log(location.state.paymentSummary);

      localStorage.setItem(
        'payInProgressSummary',
        JSON.stringify(location.state.paymentSummary)
      );
      if (location.state.paymentSummary.expiryDate) {
        updateTimerFromExpiryDate(
          location.state.paymentSummary.expiryDate,
          setTimeLeft
        );
      }
    }
  }, [location.state, uuid, navigate]);

  // Timer effect
  useEffect(() => {
    if (!location.state?.paymentSummary) {
      navigate(`/payin/${uuid}/expired`);
    }

    if (timeLeft <= 0 || timerRef.current !== null) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          navigate(`/payin/${uuid}/expired`);
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
  }, [timeLeft, paymentSummary?.acceptanceExpiryDate, navigate, uuid]);

  if (
    !location.state?.paymentSummary &&
    JSON.parse(localStorage.getItem('payInProgressSummary')!).uuid !== uuid
  ) {
    return <Navigate to={`/payin/${uuid}`} />;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-lg mb-4">
            Pay with {paymentSummary?.paidCurrency.currency}
          </CardTitle>

          <div className="mt-4 text-sm text-gray-500">
            To complete this payment send the amount due to the{' '}
            {paymentSummary?.paidCurrency.currency} address provided below.
          </div>
        </CardHeader>

        <Separator className="!w-[89%]   bg-gray-200 mx-auto" />
        <CardContent className="flex justify-between py-1 ">
          <div className="text-muted-foreground">Amount due:</div>
          <div>
            {paymentSummary?.paidCurrency.amount}{' '}
            {paymentSummary?.paidCurrency.currency}
          </div>
        </CardContent>
        <Separator className="!w-[89%] bg-gray-200 mx-auto" />

        <CardContent className="flex justify-between py-1 ">
          <div className="text-muted-foreground">
            {paymentSummary?.paidCurrency.currency} address:
          </div>
          <div>{paymentSummary?.address?.address.slice(0, 10)}...</div>
        </CardContent>

        <CardContent className="flex justify-center ">
          <QRCode value={paymentSummary?.address?.address ?? ''} size={150} />
        </CardContent>
        <CardContent className="flex justify-center ">
          <span className="text-muted-foreground">
            {paymentSummary?.address?.address}
          </span>
        </CardContent>

        <Separator className="!w-[89%] bg-gray-200 mx-auto" />

        <CardFooter className="relative justify-between  ">
          <div className="text-muted-foreground">Time left to pay:</div>
          <div>{formatTime(timeLeft)}</div>
        </CardFooter>

        <Separator className="!w-[89%] bg-gray-200 mx-auto" />
      </Card>
    </div>
  );
};

export default PayQuotePage;
