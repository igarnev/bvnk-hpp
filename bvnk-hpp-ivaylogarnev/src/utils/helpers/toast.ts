import { toast } from '@hooks/useToast';

import { DEBOUNCE_TIME } from '@utils/constants';

let lastToastTime = 0;

export const debouncedToast = (args: Parameters<typeof toast>[0]) => {
  const now = Date.now();
  if (now - lastToastTime > DEBOUNCE_TIME) {
    lastToastTime = now;
    toast(args);
  }
};
