import { useEffect, useState } from 'react';

import { uuidSchema } from '@utils/schemas-zod';

export const useUuidValidation = () => {
  const [uuid, setUuid] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleUuidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUuid(value);
  };

  useEffect(() => {
    if (!uuid) {
      return;
    }

    // Validate the UUID
    const result = uuidSchema.uuid.safeParse(uuid);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setError('');
  }, [uuid]);

  return {
    uuid,
    error,
    handleUuidChange
  };
};
