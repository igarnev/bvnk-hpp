export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Helper function to update timer from expiry date
export const updateTimerFromExpiryDate = (
  expiryDate: number,
  setTimeLeft: (time: number) => void
) => {
  const expiryTime = new Date(expiryDate).getTime();
  const currentTime = new Date().getTime();
  const remainingTime = Math.max(
    0,
    Math.floor((expiryTime - currentTime) / 1000)
  );

  setTimeLeft(remainingTime);
};
