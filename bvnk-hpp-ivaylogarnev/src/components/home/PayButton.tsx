import { Button } from '@components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@components/ui/tooltip';

interface SubmitButtonProps {
  readonly isDisabled: boolean;
  readonly onClick: () => void;
  readonly error?: string;
  readonly isEmpty?: boolean;
}

export const PayButton = ({
  isDisabled,
  onClick,
  error,
  isEmpty
}: SubmitButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div>
            <Button onClick={onClick} disabled={isDisabled} className="w-full">
              Pay
            </Button>
          </div>
        </TooltipTrigger>
        {error && <TooltipContent>{error}</TooltipContent>}
        {isEmpty && !error && <TooltipContent>Enter UUID</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};
