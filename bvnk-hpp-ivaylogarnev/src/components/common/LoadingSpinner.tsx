import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div
      className="flex items-center justify-center"
      data-testid="loading-spinner"
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};
