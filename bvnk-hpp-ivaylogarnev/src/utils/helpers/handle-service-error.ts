import axios from 'axios';
import { ZodError } from 'zod';

import { debouncedToast } from '@utils/helpers/debounce-toast';

export const handleServiceError = (error: unknown): unknown => {
  if (error instanceof ZodError) {
    debouncedToast({
      variant: 'destructive',
      title: 'Validation Error',
      description: error.issues[0]?.message ?? 'Invalid input format.'
    });
  } else if (axios.isAxiosError(error)) {
    debouncedToast({
      variant: 'destructive',
      title: 'Network Error',
      description:
        error.response?.data?.message ??
        'Failed to communicate with the server. Please try again later.'
    });
  } else {
    debouncedToast({
      variant: 'destructive',
      title: 'Unexpected Error',
      description: 'Something went wrong. Please try again.'
    });
  }

  throw error;
};
