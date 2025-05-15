import type { NavigateFunction } from 'react-router-dom';
import type { AxiosError } from 'axios';

import type { IServerError } from '@models/IServerError';

import { ROUTES } from '@utils/constants-routes';

export const handlePaymentError = (
  error: AxiosError,
  navigate: NavigateFunction
) => {
  const errorData = error.response?.data as IServerError;
  if (
    errorData?.code === 'MER-PAY-2017' ||
    errorData?.code === 'MER-PAY-2004'
  ) {
    navigate(ROUTES.PAYMENT_EXPIRED);
  }
};
