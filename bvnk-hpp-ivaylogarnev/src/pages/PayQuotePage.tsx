import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { useTimer } from '@hooks/useTimer';

import type { PaymentSummary } from '@models/payment';

import { Card } from '@components/ui/card';
import { PayQuoteHeader } from '@components/pay-quote/PayQuoteHeader';
import { AmountDue } from '@components/pay-quote/AmountDue';
import { PaymentAddress } from '@components/pay-quote/PaymentAddress';
import { QrCodeSection } from '@components/pay-quote/QrCodeSection';
import { PayTimeRemaining } from '@components/pay-quote/PayTimeRemaining';

export const PayQuotePage = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(
    null
  );
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setPaymentSummary(
      JSON.parse(localStorage.getItem('payInProgressSummary') || '{}')
    );
  }, [uuid]);

  const { timeLeft } = useTimer({
    expiryDate: paymentSummary?.expiryDate,
    onExpire: () => {
      navigate(`/expired`);
    }
  });

  if (!paymentSummary?.address?.address) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f53dd]" />
      </div>
    );
  }

  const { address, paidCurrency } = paymentSummary;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white">
        <PayQuoteHeader currency={paidCurrency.currency || 'N/A'} />

        <AmountDue
          amount={paidCurrency.amount || 0}
          currency={paidCurrency.currency || 'N/A'}
          copied={copied}
          setCopied={setCopied}
        />

        <PaymentAddress
          address={address.address || ''}
          currency={paidCurrency.currency || 'N/A'}
          copied={copied}
          setCopied={setCopied}
        />

        <QrCodeSection address={address.address || ''} />

        <PayTimeRemaining timeLeft={timeLeft} />
      </Card>
    </div>
  );
};
