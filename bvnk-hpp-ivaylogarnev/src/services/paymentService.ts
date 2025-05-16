import axios from 'axios';
import { type z } from 'zod';

import {
  paymentSummarySchema,
  updatePaymentSummaryRequestSchema,
  acceptPaymentSummaryRequestSchema
} from '@utils/schemas-zod';

import type { IPaymentSummary } from '@models/IPaymentSummary';
import type { TAcceptPaymentSummaryRequest } from '@models/TAcceptPaymentSummaryRequest';
import type { TUpdatePaymentSummaryRequest } from '@models/TUpdatePaymentSummaryRequest';

import { handleServiceError } from '@utils/helpers/handle-service-error';

const API_BASE_URL = 'https://api.sandbox.bvnk.com/api/v1/pay';

export const paymentService = {
  getPaymentSummary: async (
    uuid: string
  ): Promise<z.infer<typeof paymentSummarySchema> | undefined> => {
    try {
      const response = await axios.get<IPaymentSummary>(
        `${API_BASE_URL}/${uuid}/summary`
      );
      return paymentSummarySchema.parse(response.data);
    } catch (error) {
      handleServiceError(error);
    }
  },

  updatePaymentSummary: async (
    uuid: string,
    data: TUpdatePaymentSummaryRequest
  ): Promise<z.infer<typeof paymentSummarySchema> | undefined> => {
    try {
      const validatedRequest = updatePaymentSummaryRequestSchema.parse(data);
      const response = await axios.put<IPaymentSummary>(
        `${API_BASE_URL}/${uuid}/update/summary`,
        validatedRequest
      );
      return paymentSummarySchema.parse(response.data);
    } catch (error) {
      handleServiceError(error);
    }
  },

  acceptPaymentSummary: async (
    uuid: string,
    data: TAcceptPaymentSummaryRequest
  ): Promise<z.infer<typeof paymentSummarySchema> | undefined> => {
    try {
      const validatedRequest = acceptPaymentSummaryRequestSchema.parse(data);
      const response = await axios.put<IPaymentSummary>(
        `${API_BASE_URL}/${uuid}/accept/summary`,
        validatedRequest
      );
      return paymentSummarySchema.parse(response.data);
    } catch (error) {
      handleServiceError(error);
    }
  }
};
