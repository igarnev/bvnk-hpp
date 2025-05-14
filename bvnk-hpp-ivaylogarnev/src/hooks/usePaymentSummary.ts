import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@services/paymentService';

export const usePaymentSummary = () => {
  const { uuid } = useParams<{ uuid: string }>() as { uuid: string };
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
