import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import type { TUuid } from '@models/TUuid';
import { useMemo } from 'react';
import { uuidSchema } from '@/utils/schemas-zod';

export const usePaymentSummary = () => {
  const { uuid } = useParams<TUuid>() as TUuid;
  const isUuidValid = useMemo(() => {
    return uuidSchema.uuid.safeParse(uuid).success;
  }, [uuid]);

  const {
    data: paymentSummary,
    isLoading,
    error
  } = useQuery({
    queryKey: ['paymentSummary', uuid],
    queryFn: () => paymentService.getPaymentSummary(uuid),
    enabled: isUuidValid
  });

  return {
    paymentSummary,
    isLoading,
    error
  };
};
