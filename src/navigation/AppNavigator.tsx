import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

import VendorListScreen from '../screens/vendor/VendorListScreen';
import VendorDetailScreen from '../screens/vendor/VendorDetailScreen';

import TermsScreen from '../screens/auth/TermsScreen';
import PrivacyScreen from '../screens/auth/PrivacyScreen';
import SearchScreen from '../screens/search/SearchScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ECardDetailScreen from '../screens/ecard/ECardDetailScreen';
import WebSiteDetailScreen from '../screens/website/WebSiteDetailScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import ChangeLocationScreen from '../screens/user/ChangeLocationScreen';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;

  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  OTP: undefined;
  ResetPassword: undefined;
  ProfileScreen: undefined;
  ChangeLocationScreen: undefined;

  MainTabs: undefined;

  VendorList: { categoryValue: string };
  VendorDetail: undefined;

  ECardDetailScreen: { cardId: string; cardData: any };
  WebSiteDetailScreen: { slug: string };
  Search: undefined;
  
  Terms: undefined;
  Privacy: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="ChangeLocationScreen" component={ChangeLocationScreen} />

        <Stack.Screen name="MainTabs">
          {() => <BottomTabNavigator isAuthenticated={isAuthenticated} />}
        </Stack.Screen>

        <Stack.Screen name="VendorList" component={VendorListScreen} />
        <Stack.Screen name="VendorDetail" component={VendorDetailScreen} />

        <Stack.Screen name="ECardDetailScreen" component={ECardDetailScreen} />
        <Stack.Screen name="WebSiteDetailScreen" component={WebSiteDetailScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />

        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;