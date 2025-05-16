import { Card, CardDescription, CardTitle } from '@components/ui/card';
import { WarningIcon } from '@components/ui/warning-icon';

export const ExpiredPage = () => {
  return (
    <div className="flex justify-center items-center">
      <Card className="w-1/4 min-w-102 p-16 items-center">
        <WarningIcon />
        <CardTitle className="text-center">Payment details expired</CardTitle>
        <CardDescription className="text-center text-muted-foreground font-light">
          The payment details for your transaction have expired.
        </CardDescription>
      </Card>
    </div>
  );
};
