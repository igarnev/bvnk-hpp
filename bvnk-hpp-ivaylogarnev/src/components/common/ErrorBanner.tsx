import { useNavigate } from 'react-router-dom';

import { Card, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { WarningIcon } from '@components/ui/warning-icon';

import { ROUTES } from '@utils/constants-routes';

export const ErrorBanner = () => {
  const navigate = useNavigate();
  const handleButtonClick = () => navigate(ROUTES.HOME);

  return (
    <div className="flex justify-center items-center">
      <Card className="w-1/4 min-w-102 p-8 items-center">
        <WarningIcon />
        <CardTitle className="text-center">
          Error loading payment summary
        </CardTitle>
        <Button className="mt-4 cursor-pointer" onClick={handleButtonClick}>
          Go back
        </Button>
      </Card>
    </div>
  );
};
