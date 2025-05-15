import { useNavigate } from 'react-router-dom';

import { Button } from '@components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@components/ui/tooltip';

import { ROUTES } from '@utils/constants-routes';
import { uuidSchema } from '@utils/schemas-zod';

type THomePayButtonProps = {
  readonly uuid: string;
  readonly error?: string;
};

export const HomePayButton = ({ uuid, error }: THomePayButtonProps) => {
  const navigate = useNavigate();

  const handlePayButtonClick = () => {
    const result = uuidSchema.uuid.safeParse(uuid);
    if (result.success) {
      navigate(ROUTES.PAYMENT_SUMMARY.replace(':uuid', uuid));
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div>
            <Button
              onClick={handlePayButtonClick}
              disabled={!!error || !uuid}
              className="w-full bg-primary text-white"
            >
              Pay
            </Button>
          </div>
        </TooltipTrigger>
        {error && <TooltipContent>{error}</TooltipContent>}
        {!error && <TooltipContent>Enter UUID</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};
