import { useNavigate, useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import type { ServerError } from '@models/error';

export const useUpdatePaymentSummary = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { uuid } = useParams<{ uuid: string }>() as { uuid: string };

  const updatePaymentSummary = useMutation({
    mutationKey: ['updatePaymentSummary'],
    mutationFn: async ({ currency }: { currency: string }) => {
      return await paymentService.updatePaymentSummary(uuid, {
        currency,
        payInMethod: 'crypto'
      });
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['paymentSummary', uuid], data);
      }
    },
    onError: (error: AxiosError) => {
      const errorData = error.response?.data as ServerError;
      if (errorData?.code === 'MER-PAY-2017') {
        navigate('/expired');
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });

  return {
    updatePaymentSummary
  };
};
