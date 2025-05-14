import { useEffect, useRef, useState } from 'react';

import { updateTimerFromExpiryDate } from '@utils/helpers/timer';

interface UseTimerProps {
  readonly expiryDate?: string | number | null;
  readonly onExpire?: () => void;
}

export const useTimer = ({ expiryDate, onExpire }: UseTimerProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (expiryDate) {
      updateTimerFromExpiryDate(Number(expiryDate), setTimeLeft);
    }

    if (timeLeft <= 0 || timerRef.current !== null) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (onExpire) {
            onExpire();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, expiryDate, onExpire]);

  return { timeLeft };
};
