import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import VendorScreen from '../screens/vendor/VendorScreen';
import ECardScreen from '../screens/ecard/ECardScreen';
import GuestScreen from '../screens/guest/GuestScreen';
import GuestHome from '../screens/home/GuestHomeScreen';
import AuthHome from '../screens/home/AuthHomeScreen';
import WebsiteScreen from '../screens/website/WebsiteScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = 'help';

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'E-Card') {
            iconName = 'card-giftcard';
          } else if (route.name === 'Guests') {
            iconName = 'people';
          } else if (route.name === 'Website') {
            iconName = 'language';
          } else if (route.name === 'Vendor') {
            iconName = 'store';
          } else {
            iconName = 'help';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF0762',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 60,
          paddingBottom: 10,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={isAuthenticated ? AuthHome : GuestHome} />
      <Tab.Screen name="E-Card" component={ECardScreen} />
      <Tab.Screen name="Guests" component={GuestScreen} />
      <Tab.Screen name="Website" component={WebsiteScreen} />
      <Tab.Screen name="Vendor" component={VendorScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;