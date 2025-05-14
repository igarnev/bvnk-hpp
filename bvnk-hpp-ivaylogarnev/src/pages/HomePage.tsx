import { useNavigate } from 'react-router-dom';

import { Input } from '@components/ui/input';
import { Card } from '@components/ui/card';
import { PayButton } from '@components/PayButton';

import { useUuidValidation } from '@hooks/useUuidValidation';

import { uuidSchema } from '@utils/zod-schemas';

const HomePage = () => {
  const { uuid, error: uuidError, handleUuidChange } = useUuidValidation();
  const navigate = useNavigate();

  const handlePayButtonClick = () => {
    const result = uuidSchema.uuid.safeParse(uuid);
    if (result.success) {
      navigate(`/payin/${uuid}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="flex w-1/4 min-w-96 p-4 mb-64">
        <h1 className="text-center">BVNK Hosted Payment Page</h1>
        <Input
          placeholder="Enter a payment UUID"
          value={uuid}
          onChange={handleUuidChange}
          aria-invalid={!!uuidError}
        />
        <PayButton
          isDisabled={!!uuidError}
          onClick={handlePayButtonClick}
          error={uuidError}
          isEmpty={!uuid}
        />
      </Card>
    </div>
  );
};

export default HomePage;
