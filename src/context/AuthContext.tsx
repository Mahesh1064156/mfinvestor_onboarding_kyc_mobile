import React, { createContext, useContext, useState } from 'react';
import { registerUser, RegisterPayload, loginUser, LoginPayload } from '../services/authService';

interface AuthContextType {
  loading: boolean;
  register: (data: RegisterPayload) => Promise<any>;
  login: (data: LoginPayload) => Promise<any>;
  userId: number | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const register = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      if (response && response.user_id) {
        setUserId(response.user_id);
      }
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginPayload) => {
    setLoading(true);
    try {
      const response = await loginUser(data);
      if (response && response.user_id) {
        setUserId(response.user_id);
      }
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ loading, register, login, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};