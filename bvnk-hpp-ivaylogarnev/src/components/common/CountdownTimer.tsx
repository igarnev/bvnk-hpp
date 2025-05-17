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
  const hasExpiredRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (expiryDate) {
      const initialTimeLeft = getRemainingTime(Number(expiryDate));
      setTimeLeft(initialTimeLeft);
      hasExpiredRef.current = false;
    }
  }, [expiryDate]);

  useEffect(() => {
    if (timeLeft <= 0 || timerRef.current !== null) {
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          onExpire();
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
  }, [timeLeft, onExpire]);

  return (
    <div>
      {isLoading ? (
        <Loader2
          data-testid="loader"
          className="h-4 w-4 animate-spin text-primary"
        />
      ) : (
        formatTime(timeLeft)
      )}
    </div>
  );
};
