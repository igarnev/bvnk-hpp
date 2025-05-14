import axios from 'axios';
import type {
  PaymentSummary,
  AcceptPaymentSummaryRequest,
  UpdatePaymentSummaryRequest
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
    data: UpdatePaymentSummaryRequest
  ): Promise<PaymentSummary> => {
    const response = await axios.put<PaymentSummary>(
      `${API_BASE_URL}/${uuid}/update/summary`,
      data
    );
    return response.data;
  },

  acceptPaymentSummary: async (
    uuid: string,
    data: AcceptPaymentSummaryRequest
  ): Promise<PaymentSummary> => {
    const response = await axios.put<PaymentSummary>(
      `${API_BASE_URL}/${uuid}/accept/summary`,
      data
    );
    return response.data;
  }
};
