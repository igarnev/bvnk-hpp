import { useNavigate } from 'react-router-dom';

import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="flex w-1/4 min-w-96 p-4 mb-64">
        <h1 className="text-center">404 - Page Not Found</h1>
        <p className="text-center">
          The page you are looking for does not exist.
        </p>
        <Button onClick={() => navigate('/')}>Go back to home</Button>
      </Card>
    </div>
  );
};

export default NotFoundPage;
