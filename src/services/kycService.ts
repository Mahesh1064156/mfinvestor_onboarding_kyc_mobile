import axiosInstance from '../api/axiosInstance';

export interface SubmitKycPayload {
  user_id: number;
  pan_number: string;
}

export const submitKycApi = async (payload: SubmitKycPayload) => {
  try {
    const response = await axiosInstance.post('/kyc/submit', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to submit PAN verification' };
  }
};

export const fetchKycStatusApi = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`/kyc/${userId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to fetch KYC details' };
  }
};
