import QRCode from 'react-qr-code';

import { CardContent } from '@components/ui/card';

import { getCryptoPaymentUri } from '@utils/helpers/get-crypto-payment-uri';

type TPayQuoteQrCodeSectionProps = {
  readonly address: string;
  readonly currency: string;
  readonly amount: string;
};

export const PayQuoteQrCodeSection = ({
  currency,
  address,
  amount
}: TPayQuoteQrCodeSectionProps) => {
  return (
    <>
      <CardContent className="flex justify-center">
        <QRCode
          value={getCryptoPaymentUri(currency, address, amount)}
          size={150}
        />
      </CardContent>
      <CardContent className="flex justify-center mb-1">
        <span className="text-muted-foreground font-light text-xs">
          {address}
        </span>
      </CardContent>
    </>
  );
};
