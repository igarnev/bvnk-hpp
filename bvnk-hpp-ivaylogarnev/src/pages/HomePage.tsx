import { useUuidValidation } from '@hooks/useUuidValidation';

import { Input } from '@components/ui/input';
import { Card } from '@components/ui/card';
import { HomePayButton } from '@components/home/HomePayButton';

export const HomePage = () => {
  const { uuid, error: uuidError, handleUuidChange } = useUuidValidation();

  return (
    <div className="flex justify-center items-center">
      <Card className="flex w-1/4 min-w-96 p-4">
        <h1 className="text-center">BVNK Hosted Payment Page</h1>
        <Input
          placeholder="Enter a payment UUID"
          value={uuid}
          onChange={handleUuidChange}
          aria-invalid={!!uuidError}
          aria-describedby="uuid-error"
        />
        <HomePayButton uuid={uuid} error={uuidError} />
      </Card>
    </div>
  );
};
