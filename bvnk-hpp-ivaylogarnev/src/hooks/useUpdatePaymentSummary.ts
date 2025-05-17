import { useNavigate, useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import { handlePaymentError } from '@utils/helpers/error-payment';

import type { TUuid } from '@models/TUuid';
import type { IServerError } from '@models/IServerError';

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
    onError: (error: AxiosError<IServerError>) =>
      handlePaymentError(error, navigate),
    retry: 3,
    // Exponential backoff for retry delays: 1s, 2s, 4s -> capped at 4s
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 4000)
  });

  return {
    updatePaymentSummary
  };
};
