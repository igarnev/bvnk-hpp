import { useNavigate } from 'react-router-dom';

import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';

import { ROUTES } from '@utils/constants-routes';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleOnExpire = () => navigate(ROUTES.HOME);

  return (
    <div className="flex justify-center items-center">
      <Card className="flex w-1/4 min-w-96 p-4">
        <h1 className="text-center">404 - Page Not Found</h1>
        <p className="text-center">
          The page you are looking for does not exist.
        </p>
        <Button onClick={handleOnExpire}>Go back to home</Button>
      </Card>
    </div>
  );
};
