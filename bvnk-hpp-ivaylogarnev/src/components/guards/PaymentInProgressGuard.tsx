import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

import { usePaymentSummary } from '@hooks/usePaymentSummary';

import { ROUTES } from '@utils/constants-routes';
import { uuidSchema } from '@utils/schemas-zod';

import { EQuoteStatus } from '@models/EQuoteStatus';
import type { TUuid } from '@models/TUuid';
import { EStatus } from '@models/EStatus';

export const PaymentInProgressGuard = () => {
  const { uuid } = useParams<TUuid>() as TUuid;
  const navigate = useNavigate();
  const { paymentSummary } = usePaymentSummary();

  const isPaymentExpired = useMemo(() => {
    return (
      paymentSummary?.status === EStatus.EXPIRED ||
      (paymentSummary?.acceptanceExpiryDate &&
        new Date(paymentSummary.acceptanceExpiryDate).getTime() <
          new Date().getTime())
    );
  }, [paymentSummary?.acceptanceExpiryDate, paymentSummary?.status]);

  useEffect(() => {
    if (isPaymentExpired) {
      navigate(ROUTES.PAYMENT_EXPIRED);
    }
  }, [navigate, isPaymentExpired]);

  useEffect(() => {
    // Validate UUID first
    const uuidValidation = uuidSchema.uuid.safeParse(uuid);
    if (!uuidValidation.success) {
      navigate(ROUTES.NOT_FOUND);
      return;
    }
  }, [navigate, uuid]);

  useEffect(() => {
    if (paymentSummary?.quoteStatus === EQuoteStatus.ACCEPTED) {
      navigate(ROUTES.PAYMENT_PAY.replace(':uuid', uuid));
    }
  }, [navigate, uuid, paymentSummary?.quoteStatus]);

  return <Outlet />;
};
