import type { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import { handlePaymentError } from '@utils/helpers/error-payment';
import { ROUTES } from '@utils/constants-routes';

import type { TUuid } from '@models/TUuid';

export const useAcceptPayment = () => {
  const navigate = useNavigate();
  const { uuid } = useParams<TUuid>() as TUuid;

  const acceptPayment = useMutation({
    mutationFn: async () => {
      return await paymentService.acceptPaymentSummary(uuid, {
        successUrl: 'no_url_needed'
      });
    },
    onSuccess: (data) => {
      if (data) {
        navigate(ROUTES.PAYMENT_PAY.replace(':uuid', uuid));
      }
    },
    onError: (error: AxiosError) => handlePaymentError(error, navigate)
  });

  return {
    acceptPayment
  };
};
