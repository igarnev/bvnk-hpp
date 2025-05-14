import { useState } from 'react';

import { uuidSchema } from '@utils/zod-schemas';

export const useUuidValidation = () => {
  const [uuid, setUuid] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleUuidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUuid(value);

    // Validate the UUID
    const result = uuidSchema.uuid.safeParse(value);
    if (!result.success) {
      setError(result.error.errors[0].message);
    } else {
      setError('');
    }
  };

  return {
    uuid,
    error,
    handleUuidChange
  };
};
