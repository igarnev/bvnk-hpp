import type { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import { handlePaymentError } from '@utils/helpers/error-payment';
import { ROUTES } from '@utils/constants';

import type { TUuid } from '@models/TUuid';
import type { IServerError } from '@models/IServerError';

export const useAcceptPayment = () => {
  const navigate = useNavigate();
  const { uuid } = useParams<TUuid>() as TUuid;
  const queryClient = useQueryClient();

  const acceptPayment = useMutation({
    mutationFn: async () => {
      return await paymentService.acceptPaymentSummary(uuid, {
        successUrl: 'no_url_needed'
      });
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(['paymentSummary', uuid], data);
        navigate(ROUTES.PAYMENT_PAY.replace(':uuid', uuid));
      }
    },
    onError: (error: AxiosError<IServerError>) =>
      handlePaymentError(error, navigate)
  });

  return {
    acceptPayment
  };
};
