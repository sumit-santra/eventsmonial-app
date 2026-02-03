import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import VendorScreen from '../screens/vendor/VendorScreen';
import ECardScreen from '../screens/ecard/ECardScreen';
import GuestScreen from '../screens/guest/GuestScreen';
import GuestHome from '../screens/home/GuestHomeScreen';
import AuthHome from '../screens/home/AuthHomeScreen';
import WebsiteScreen from '../screens/website/WebsiteScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      setIsAuthenticated(isLoggedIn === 'true');
    } catch (error) {
      console.log('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  // 🔄 Loader while checking auth
  if (isAuthenticated === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF0762" />
      </View>
    );
  }

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
          height: 90,
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

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});