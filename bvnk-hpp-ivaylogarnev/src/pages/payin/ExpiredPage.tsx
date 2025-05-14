import { Card, CardDescription, CardTitle } from '@components/ui/card';
import WarningIcon from '@components/ui/warning-icon';

const ExpiredPage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-1/4 min-w-102 p-16 mb-64 items-center">
        <WarningIcon />
        <CardTitle className="text-center">Payment details expired</CardTitle>
        <CardDescription className="text-center">
          The payment details for your transaction have expired.
        </CardDescription>
      </Card>
    </div>
  );
};

export default ExpiredPage;
