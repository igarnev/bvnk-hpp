import { describe, it, expect, vi } from 'vitest';
import { handlePaymentError } from '../error-payment';
import { ROUTES } from '@utils/constants';
import type { AxiosError } from 'axios';
import type { IServerError } from '@models/IServerError';

describe('error-payment', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should navigate to payment expired page when error code is MER-PAY-2017', () => {
    const error = {
      response: {
        data: {
          code: 'MER-PAY-2017'
        }
      }
    } as AxiosError<IServerError>;

    handlePaymentError(error, mockNavigate);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PAYMENT_EXPIRED, {
      replace: true
    });
  });

  it('should navigate to payment expired page when error code is MER-PAY-2004', () => {
    const error = {
      response: {
        data: {
          code: 'MER-PAY-2004'
        }
      }
    } as AxiosError<IServerError>;

    handlePaymentError(error, mockNavigate);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PAYMENT_EXPIRED, {
      replace: true
    });
  });

  it('should navigate to payment expired page when error code is in errorList', () => {
    const error = {
      response: {
        data: {
          errorList: [
            {
              code: 'MER-PAY-2017'
            }
          ]
        }
      }
    } as AxiosError<IServerError>;

    handlePaymentError(error, mockNavigate);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PAYMENT_EXPIRED, {
      replace: true
    });
  });

  it('should not navigate when error code is not in expired payment error codes', () => {
    const error = {
      response: {
        data: {
          code: 'SOME-OTHER-ERROR'
        }
      }
    } as AxiosError<IServerError>;

    handlePaymentError(error, mockNavigate);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not navigate when error has no response data', () => {
    const error = {
      response: {}
    } as AxiosError<IServerError>;

    handlePaymentError(error, mockNavigate);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should not navigate when error has no response', () => {
    const error = {} as AxiosError<IServerError>;

    handlePaymentError(error, mockNavigate);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should prioritize error code from response.data.code over errorList', () => {
    const error = {
      response: {
        data: {
          code: 'MER-PAY-2017',
          errorList: [
            {
              code: 'SOME-OTHER-ERROR'
            }
          ]
        }
      }
    } as AxiosError<IServerError>;

    handlePaymentError(error, mockNavigate);

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PAYMENT_EXPIRED, {
      replace: true
    });
  });
});
