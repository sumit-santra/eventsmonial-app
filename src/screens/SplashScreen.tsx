import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      setTimeout(() => {
        if (hasLaunched === null) {
          AsyncStorage.setItem('hasLaunched', 'true');
          navigation.replace('Onboarding');
        } else {
          navigation.replace('Login');
        }
      }, 2000);
    } catch (error) {
      navigation.replace('Onboarding');
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
