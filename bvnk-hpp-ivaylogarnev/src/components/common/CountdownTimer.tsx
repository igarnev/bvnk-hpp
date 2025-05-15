import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { formatTime, getRemainingTime } from '@utils/helpers/timer';

type TCountdownTimerProps = {
  readonly expiryDate: number;
  readonly onExpire: () => void;
  readonly isLoading?: boolean;
};

export const CountdownTimer = ({
  expiryDate,
  onExpire,
  isLoading
}: TCountdownTimerProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (expiryDate) {
      const initialTimeLeft = getRemainingTime(Number(expiryDate));
      setTimeLeft(initialTimeLeft);
    }
  }, [expiryDate]);

  useEffect(() => {
    if (timeLeft <= 0 || timerRef.current !== null) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // This is to ensure that the onExpire function is called after the timer has expired
          setTimeout(() => {
            onExpire();
          }, 0);
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

  return (
    <div>
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        formatTime(timeLeft)
      )}
    </div>
  );
};
