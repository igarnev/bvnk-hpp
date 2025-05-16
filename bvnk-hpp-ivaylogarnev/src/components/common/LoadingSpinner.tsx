import { Loader2 } from 'lucide-react';

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader2 className="h-24 w-24 animate-spin text-primary" />
    </div>
  );
};
