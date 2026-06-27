import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import PanScreen from '../screens/KYC/PanScreen';
import UploadKycScreen from '../screens/KYC/UploadKycScreen';
import StatusScreen from '../screens/Dashboard/StatusScreen';
import NotificationScreen from '../screens/Dashboard/NotificationScreen';

export type RootStackParamList = {
  Register: undefined;
  PanScreen: undefined;
  UploadKycScreen: undefined;
  StatusScreen: undefined;
  NotificationScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Register"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="PanScreen" component={PanScreen} />
      <Stack.Screen name="UploadKycScreen" component={UploadKycScreen} />
      <Stack.Screen name="StatusScreen" component={StatusScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
