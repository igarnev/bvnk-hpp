import axios from 'axios';

import type { IPaymentSummary } from '@/models/IPaymentSummary';
import type { TAcceptPaymentSummaryRequest } from '@models/TAcceptPaymentSummaryRequest';
import type { TUpdatePaymentSummaryRequest } from '@/models/TUpdatePaymentSummaryRequest';

const API_BASE_URL = 'https://api.sandbox.bvnk.com/api/v1/pay';

export const paymentService = {
  getPaymentSummary: async (uuid: string): Promise<IPaymentSummary> => {
    const response = await axios.get<IPaymentSummary>(
      `${API_BASE_URL}/${uuid}/summary`
    );
    return response.data;
  },

  updatePaymentSummary: async (
    uuid: string,
    data: TUpdatePaymentSummaryRequest
  ): Promise<IPaymentSummary> => {
    const response = await axios.put<IPaymentSummary>(
      `${API_BASE_URL}/${uuid}/update/summary`,
      data
    );
    return response.data;
  },

  acceptPaymentSummary: async (
    uuid: string,
    data: TAcceptPaymentSummaryRequest
  ): Promise<IPaymentSummary> => {
    const response = await axios.put<IPaymentSummary>(
      `${API_BASE_URL}/${uuid}/accept/summary`,
      data
    );
    return response.data;
  }
};
