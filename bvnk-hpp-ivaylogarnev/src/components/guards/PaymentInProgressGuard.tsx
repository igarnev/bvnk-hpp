import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

import { usePaymentSummary } from '@hooks/usePaymentSummary';

import { ROUTES } from '@utils/constants';
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

  // Navigate to the not found page if the UUID is invalid
  useEffect(() => {
    const uuidValidation = uuidSchema.uuid.safeParse(uuid);
    if (!uuidValidation.success) {
      navigate(ROUTES.NOT_FOUND, { replace: true });
    }
  }, [navigate, uuid]);

  // Navigate to the payment page if the quote is accepted and you are trying to access other pages
  useEffect(() => {
    if (paymentSummary?.quoteStatus === EQuoteStatus.ACCEPTED) {
      navigate(ROUTES.PAYMENT_PAY.replace(':uuid', uuid));
    }
  }, [navigate, uuid, paymentSummary?.quoteStatus]);

  // Navigate to the payment expired page if the payment is expired
  useEffect(() => {
    if (isPaymentExpired) {
      navigate(ROUTES.PAYMENT_EXPIRED, { replace: true });
    }
  }, [navigate, isPaymentExpired]);

  return <Outlet />;
};
