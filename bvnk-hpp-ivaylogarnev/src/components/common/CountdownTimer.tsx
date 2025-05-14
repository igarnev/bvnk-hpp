import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { formatTime, updateTimerFromExpiryDate } from '@utils/helpers/timer';

interface CountdownTimerProps {
  readonly expiryDate: number;
  readonly onExpire: () => void;
  readonly isPending?: boolean;
}

export const CountdownTimer = ({
  expiryDate,
  onExpire,
  isPending
}: CountdownTimerProps) => {
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

  return (
    <div>
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        formatTime(timeLeft)
      )}
    </div>
  );
};
