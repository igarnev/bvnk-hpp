import { useNavigate } from 'react-router-dom';
import type { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { paymentService } from '@services/paymentService';

import type { ServerError } from '@models/error';

interface UsePaymentSummaryProps {
  readonly uuid: string | undefined;
}

export const usePaymentSummary = ({ uuid }: UsePaymentSummaryProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get the payment summary
  const {
    data: paymentSummary,
    isLoading,
    error
  } = useQuery({
    queryKey: ['paymentSummary', uuid],
    queryFn: () => paymentService.getPaymentSummary(uuid!),
    enabled: !!uuid
  });

  // Update the payment summary
  const updatePaymentSummary = useMutation({
    mutationFn: async ({ currency }: { currency: string }) => {
      if (!uuid || !currency) {
        return null;
      }

      const data = await paymentService.updatePaymentSummary(uuid, {
        currency,
        payInMethod: 'crypto'
      });

      return data;
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

  // Accept the payment summary
  const acceptPaymentData = useMutation({
    mutationFn: async () => {
      if (!uuid) return null;
      const paymentSummary = await paymentService.acceptPaymentSummary(uuid, {
        successUrl: 'no_url_needed'
      });
      return paymentSummary;
    },
    onSuccess: (paymentSummary) => {
      if (paymentSummary) {
        localStorage.setItem(
          'payInProgressSummary',
          JSON.stringify(paymentSummary)
        );
        navigate(`/payin/${uuid}/pay`);
      }
    }
  });

  return {
    paymentSummary,
    isLoading,
    error,
    updatePaymentSummary,
    acceptPaymentData
  };
};
