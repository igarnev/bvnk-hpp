import { usePaymentSummary } from '@/hooks/usePaymentSummary';
import { uuidSchema } from '@/utils/schemas/zod-schemas';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

export const PaymentInProgressGuard = () => {
  const { paymentSummary } = usePaymentSummary();
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const isExpired = useMemo(() => {
    return (
      paymentSummary?.status === 'EXPIRED' ||
      (paymentSummary?.acceptanceExpiryDate &&
        new Date(paymentSummary.acceptanceExpiryDate).getTime() <
          new Date().getTime())
    );
  }, [paymentSummary?.acceptanceExpiryDate, paymentSummary?.status]);

  useEffect(() => {
    // Validate UUID first
    const uuidValidation = uuidSchema.uuid.safeParse(uuid);
    if (!uuidValidation.success) {
      navigate('/not-found');
      return;
    }

    if (isExpired) {
      navigate('/expired');
      return;
    }

    if (paymentSummary?.quoteStatus === 'ACCEPTED') {
      navigate(`/payin/${uuid}/pay`);
    }
  }, [navigate, uuid, paymentSummary?.quoteStatus, isExpired]);

  return <Outlet />;
};
