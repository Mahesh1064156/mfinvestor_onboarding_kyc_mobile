import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import RegisterScreen from './src/screens/Auth/RegisterScreen'

export default function App() {
  return (
    <AuthProvider>
      <RegisterScreen />
    </AuthProvider>
  );
}