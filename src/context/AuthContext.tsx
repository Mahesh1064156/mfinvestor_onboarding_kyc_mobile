import React, { createContext, useContext, useState } from 'react';
import { registerUser, RegisterPayload } from '../services/authService';

interface AuthContextType {
  loading: boolean;
  register: (data: RegisterPayload) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(false);

  const register = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      const response = await registerUser(data);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ loading, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};