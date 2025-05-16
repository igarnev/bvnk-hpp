import { useNavigate } from 'react-router-dom';

import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';

import { ROUTES } from '@utils/constants';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => navigate(ROUTES.HOME, { replace: true });

  return (
    <div className="flex justify-center items-center">
      <Card className="flex w-1/4 min-w-96 p-4">
        <h1 className="text-center text-lg font-normal">
          404 - Page Not Found
        </h1>
        <p className="text-center">
          The page you are looking for does not exist.
        </p>
        <Button onClick={handleGoBack}>Go back to home</Button>
      </Card>
    </div>
  );
};
