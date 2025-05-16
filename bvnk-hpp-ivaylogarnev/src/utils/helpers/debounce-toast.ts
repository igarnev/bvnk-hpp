import { toast } from '@hooks/useToast';

import { DEBOUNCE_TIME } from '@utils/constants';

import type { TToastOptions } from '@models/TToastOptions';

const createDebouncedToast = () => {
  let lastToastTime = 0;

  return (options: TToastOptions) => {
    const now = Date.now();
    if (now - lastToastTime >= DEBOUNCE_TIME) {
      toast(options);
      lastToastTime = now;
    }
  };
};

export const debouncedToast = createDebouncedToast();
