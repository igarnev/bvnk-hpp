import type { NavigateFunction } from 'react-router-dom';
import type { AxiosError } from 'axios';

import type { IServerError } from '@models/IServerError';

import { EXPIRED_PAYMENT_ERROR_CODES, ROUTES } from '@utils/constants';

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
