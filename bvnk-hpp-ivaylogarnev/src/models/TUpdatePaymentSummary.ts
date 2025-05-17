import type { UseMutationResult } from '@tanstack/react-query';
import type { IPaymentSummary } from '@models/IPaymentSummary';
import type { AxiosError } from 'axios';

export type TUpdatePaymentSummary = UseMutationResult<
  IPaymentSummary,
  AxiosError,
  { currency: string }
>;
