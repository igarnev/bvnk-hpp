import { useNavigate } from 'react-router-dom';

import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@components/ui/tooltip';
import { Card } from '@components/ui/card';

import { useUuidValidation } from '@hooks/useUuidValidation';

import { uuidSchema } from '@utils/zod-schemas';

const HomePage = () => {
  const { uuid, error: uuidError, handleUuidChange } = useUuidValidation();
  const navigate = useNavigate();
  const handleSubmit = () => {
    const result = uuidSchema.uuid.safeParse(uuid);
    if (result.success) {
      navigate(`/payin/${uuid}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="flex w-1/4 min-w-96 p-4 mb-64">
        <h1>BVNK Hosted Payment Page</h1>
        <Input
          placeholder="Enter a payment UUID"
          value={uuid}
          onChange={handleUuidChange}
          aria-invalid={!!uuidError}
        />

        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div>
                <Button
                  onClick={handleSubmit}
                  disabled={!!uuidError}
                  className="w-full"
                >
                  Pay
                </Button>
              </div>
            </TooltipTrigger>
            {uuidError && (
              <TooltipContent>
                <p>{uuidError}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </Card>
    </div>
  );
};

export default HomePage;
