import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import type { TUuid } from '@models/TUuid';

export const usePaymentSummary = () => {
  const { uuid } = useParams<TUuid>() as TUuid;

  const {
    data: paymentSummary,
    isLoading,
    error
  } = useQuery({
    queryKey: ['paymentSummary', uuid],
    queryFn: () => paymentService.getPaymentSummary(uuid),
    enabled: !!uuid
  });

  return {
    paymentSummary,
    isLoading,
    error
  };
};
