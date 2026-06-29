import axiosInstance from '../api/axiosInstance';
import { Platform } from 'react-native';

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

export const uploadKycDocumentsApi = async (userId: number, files: { aadhaarFront: string | null; aadhaarBack: string | null; panCard: string | null }) => {
  try {
    const response = await axiosInstance.post('/kyc/upload-mock', { user_id: userId, files });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to upload documents' };
  }
};

export const uploadKycFileApi = async (userId: number, documentType: string, fileAsset: any) => {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('documentType', documentType);

  let uri = fileAsset.uri;
  if (Platform.OS === 'ios') {
    uri = uri.replace('file://', '');
  }

  formData.append('file', {
    uri: uri,
    name: fileAsset.name || 'file.jpg',
    type: fileAsset.mimeType || 'image/jpeg',
  } as any);

  try {
    const response = await axiosInstance.post('/kyc/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Failed to upload ' + documentType };
  }
};
