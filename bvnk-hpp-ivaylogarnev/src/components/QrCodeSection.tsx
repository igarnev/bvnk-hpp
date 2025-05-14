import QRCode from 'react-qr-code';

import { CardContent } from '@components/ui/card';

interface QrCodeSectionProps {
  readonly address: string;
}

export const QrCodeSection = ({ address }: QrCodeSectionProps) => {
  return (
    <>
      <CardContent className="flex justify-center">
        <QRCode value={address} size={150} />
      </CardContent>
      <CardContent className="flex justify-center">
        <span className="text-muted-foreground text-xs">{address}</span>
      </CardContent>
    </>
  );
};
