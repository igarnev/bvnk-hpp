import type { NavigateFunction } from 'react-router-dom';
import type { AxiosError } from 'axios';

import type { IServerError } from '@models/IServerError';

import { ROUTES } from '@utils/constants-routes';

const EXPIRED_PAYMENT_ERROR_CODES = ['MER-PAY-2017', 'MER-PAY-2004'] as const;

export const handlePaymentError = (
  error: AxiosError<IServerError>,
  navigate: NavigateFunction
) => {
  const errorCode =
    error.response?.data?.code || error.response?.data?.errorList?.[0]?.code;

  if (
    errorCode &&
    EXPIRED_PAYMENT_ERROR_CODES.includes(
      errorCode as (typeof EXPIRED_PAYMENT_ERROR_CODES)[number]
    )
  ) {
    navigate(ROUTES.PAYMENT_EXPIRED, { replace: true });
    return;
  }
};
