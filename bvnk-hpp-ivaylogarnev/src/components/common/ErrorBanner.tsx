import { useNavigate } from 'react-router-dom';

import { Card, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { WarningIcon } from '@components/ui/warning-icon';

export const ErrorBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-1/4 min-w-102 p-8 mb-64 items-center">
        <WarningIcon />
        <CardTitle className="text-center">
          Error loading payment summary
        </CardTitle>
        <Button className="mt-4" onClick={() => navigate('/')}>
          Go back
        </Button>
      </Card>
    </div>
  );
};
