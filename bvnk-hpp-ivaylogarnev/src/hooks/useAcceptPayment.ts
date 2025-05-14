import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

export const useAcceptPayment = () => {
  const navigate = useNavigate();
  const { uuid } = useParams<{ uuid: string }>() as { uuid: string };

  const acceptPayment = useMutation({
    mutationFn: async () => {
      return await paymentService.acceptPaymentSummary(uuid, {
        successUrl: 'no_url_needed'
      });
    },
    onSuccess: (paymentSummary) => {
      if (paymentSummary) {
        navigate(`/payin/${uuid}/pay`);
      }
    }
  });

  return {
    acceptPayment
  };
};
