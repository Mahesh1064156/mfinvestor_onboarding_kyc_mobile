import axiosInstance from '../api/axiosInstance';

export interface RegisterPayload {
  name: string;
  email: string;
  mobile: string;
  password: string;
  role_id: string;
}

export interface LoginPayload {
  emailOrMobile: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  try {
    const response = await axiosInstance.post('/admin/register', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const loginUser = async (data: LoginPayload) => {
  try {
    const response = await axiosInstance.post('/admin/login', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};