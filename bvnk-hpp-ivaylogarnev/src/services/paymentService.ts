import axios from 'axios';
import type {
  AcceptSummaryRequest,
  PaymentSummary,
  UpdateSummaryRequest
} from '@models/payment';

const API_BASE_URL = 'https://api.sandbox.bvnk.com/api/v1/pay';

export const paymentService = {
  getPaymentSummary: async (uuid: string): Promise<PaymentSummary> => {
    const response = await axios.get<PaymentSummary>(
      `${API_BASE_URL}/${uuid}/summary`
    );
    return response.data;
  },

  updatePaymentSummary: async (
    uuid: string,
    data: UpdateSummaryRequest
  ): Promise<PaymentSummary> => {
    const response = await axios.put<PaymentSummary>(
      `${API_BASE_URL}/${uuid}/update/summary`,
      data
    );
    return response.data;
  },

  acceptPaymentSummary: async (
    uuid: string,
    data: AcceptSummaryRequest
  ): Promise<PaymentSummary> => {
    const response = await axios.put<PaymentSummary>(
      `${API_BASE_URL}/${uuid}/accept/summary`,
      data
    );
    return response.data;
  }
};
