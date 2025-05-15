import { useNavigate, useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import { handlePaymentError } from '@utils/helpers/error-payment';

import type { TUuid } from '@models/TUuid';
export const useUpdatePaymentSummary = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { uuid } = useParams<TUuid>() as TUuid;

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
    onError: (error: AxiosError) => handlePaymentError(error, navigate),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  });

  return {
    updatePaymentSummary
  };
};
