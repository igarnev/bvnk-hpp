import { useState, useEffect, useRef } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@components/ui/card';
import { Separator } from '@components/ui/separator';
import { Button } from '@components/ui/button';

import type { PaymentSummary } from '@models/payment';

import { formatTime, updateTimerFromExpiryDate } from '@utils/helpers/timer';

const PayQuotePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  // Set the payment summary
  useEffect(() => {
    if (location.state?.paymentSummary) {
      setPaymentSummary(location.state.paymentSummary);
      localStorage.setItem(
        'payInProgressSummary',
        JSON.stringify(location.state.paymentSummary)
      );
    } else {
      setPaymentSummary(
        JSON.parse(localStorage.getItem('payInProgressSummary') || '{}')
      );
    }
  }, [location.state, uuid, navigate]);

  // Update the timer
  useEffect(() => {
    if (paymentSummary?.expiryDate) {
      updateTimerFromExpiryDate(paymentSummary.expiryDate, setTimeLeft);
    }
  }, [paymentSummary?.expiryDate]);

  // Timer effect
  useEffect(() => {
    if (
      paymentSummary?.expiryDate &&
      new Date(paymentSummary.expiryDate).getTime() < Date.now()
    ) {
      navigate(`/expired`);
    }

    if (timeLeft > 0 && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            navigate(`/expired`);
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, navigate, location.state?.paymentSummary, paymentSummary]);

  // If the user has no payment in progress, navigate to the accept quote page
  if (
    !location.state?.paymentSummary &&
    JSON.parse(localStorage.getItem('payInProgressSummary') || '{}')?.uuid !==
      uuid
  ) {
    return <Navigate to={`/payin/${uuid}`} />;
  }

  const handleCopy = (value: string, buttonId: string) => {
    navigator.clipboard.writeText(value);
    setCopied((prev) => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setCopied((prev) => ({ ...prev, [buttonId]: false }));
    }, 1000);
  };

  // Show loading state if paymentSummary or QR code is not ready
  if (!paymentSummary?.address?.address) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f53dd]" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="flex flex-col items-center text-center">
          <CardTitle className="text-lg mb-4">
            Pay with {paymentSummary?.paidCurrency.currency}
          </CardTitle>
          <div className="text-sm max-w-2xs text-gray-500">
            To complete this payment send the amount due to the{' '}
            {paymentSummary?.paidCurrency.currency} address provided below.
          </div>
        </CardHeader>

        <Separator className="!w-[89%] bg-gray-200 mx-auto" />
        <CardContent className="flex justify-between py-1">
          <div className="text-muted-foreground">Amount due:</div>
          <div className="flex items-center">
            {paymentSummary?.paidCurrency.amount}{' '}
            {paymentSummary?.paidCurrency.currency}
            <Button
              variant="link"
              className={`cursor-pointer p-2 ${
                copied['amount'] ? 'text-[#6373e3]' : 'text-[#3f53dd]'
              }`}
              onClick={() =>
                handleCopy(
                  paymentSummary?.paidCurrency.amount.toString() ?? '',
                  'amount'
                )
              }
            >
              {copied['amount'] ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardContent>
        <Separator className="!w-[89%] bg-gray-200 mx-auto" />

        <CardContent className="flex justify-between py-1">
          <div className="text-muted-foreground">
            {paymentSummary?.paidCurrency.currency} address:
          </div>
          <div className="flex items-center">
            <div>
              {paymentSummary?.address?.address.slice(0, 7)}...
              {paymentSummary?.address?.address.slice(-5)}
            </div>
            <Button
              variant="link"
              className={`cursor-pointer p-2 ${
                copied['address'] ? 'text-[#6373e3]' : 'text-[#3f53dd]'
              }`}
              onClick={() =>
                handleCopy(paymentSummary?.address?.address ?? '', 'address')
              }
            >
              {copied['address'] ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </CardContent>

        <CardContent className="flex justify-center">
          <QRCode value={paymentSummary?.address?.address ?? ''} size={150} />
        </CardContent>
        <CardContent className="flex justify-center">
          <span className="text-muted-foreground text-xs">
            {paymentSummary?.address?.address}
          </span>
        </CardContent>

        <Separator className="!w-[89%] bg-gray-200 mx-auto" />

        <CardFooter className="relative justify-between">
          <div className="text-muted-foreground">Time left to pay:</div>
          <div>{formatTime(timeLeft)}</div>
        </CardFooter>

        <Separator className="!w-[89%] bg-gray-200 mx-auto" />
      </Card>
    </div>
  );
};

export default PayQuotePage;
