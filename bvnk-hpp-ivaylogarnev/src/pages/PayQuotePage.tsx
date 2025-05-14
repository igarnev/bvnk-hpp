import { useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Card } from '@components/ui/card';
import { PayQuoteHeader } from '@components/pay-quote/PayQuoteHeader';
import { AmountDue } from '@components/pay-quote/AmountDue';
import { PaymentAddress } from '@components/pay-quote/PaymentAddress';
import { QrCodeSection } from '@components/pay-quote/QrCodeSection';
import { PayTimeRemaining } from '@components/pay-quote/PayTimeRemaining';

import { usePaymentSummary } from '@hooks/usePaymentSummary';

export const PayQuotePage = () => {
  const { paymentSummary } = usePaymentSummary();
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  const address = useMemo(
    () => paymentSummary?.address?.address,
    [paymentSummary]
  );

  const currency = useMemo(
    () => paymentSummary?.paidCurrency.currency,
    [paymentSummary]
  );

  if (!address) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#3f53dd]" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-md bg-white px-6">
        <PayQuoteHeader currency={currency || 'N/A'} />

        <AmountDue copied={copied} setCopied={setCopied} />

        <PaymentAddress copied={copied} setCopied={setCopied} />

        <QrCodeSection address={address || ''} />

        <PayTimeRemaining />
      </Card>
    </div>
  );
};
