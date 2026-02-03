import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestLocationPermission, getCurrentLocation } from '../utils/getCurrentLocation';
import { useLocation } from '../context/LocationContext';

const SplashScreen = ({ navigation }: any) => {
  const { location, setLocation } = useLocation();

  useEffect(() => {
    checkFirstTime();
     fetchLocation();
  }, []);

  

  const checkFirstTime = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

      setTimeout(() => {
        
        if (!hasLaunched) {
          AsyncStorage.setItem('hasLaunched', 'true');
          navigation.replace('Onboarding');
          return;
        }

        if (isLoggedIn === 'true') {
          navigation.replace('MainTabs');
          return;
        }

        navigation.replace('Login');
      }, 2000);
    } catch (error) {
      console.log('checkFirstTime error:', error);
      navigation.replace('Onboarding');
    }
  };

  const fetchLocation = async () => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) return;
  
      try {
        const { lat, lng } = await getCurrentLocation();
  
        console.log('Current location:', lat, lng);
  
       
        setLocation({
          latitude: lat,
          longitude: lng,
          address: 'Current Location',
        });
      } catch (err) {
        console.log('Location error', err);
      }
    };

  return (

    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/Splash.jpg')}
        style={styles.slide}
      >
        <View style={styles.centerContent}>
          <Image
            source={require('../assets/images/logo-white.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.bottomContent}>
          <Text style={styles.tagline}>Your Event Companion</Text>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide:{
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContent: {
    paddingBottom: 50,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 220,
    resizeMode: 'contain',
  },
  tagline: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
});

export default SplashScreen;
