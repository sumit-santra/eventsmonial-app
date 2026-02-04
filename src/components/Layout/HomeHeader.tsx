import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useLocation } from '../../context/LocationContext';

import AsyncStorage from '@react-native-async-storage/async-storage';


const categories = [
  { id: 1, label: 'All', link: 'MainTabs', image: require('../../assets/images/all.png') },
  { id: 2, label: 'E-Card', link: 'E-Card', image: require('../../assets/images/ecard.png') },
  { id: 3, label: 'Guest', link: 'Guests', image: require('../../assets/images/guest.png') },
  { id: 4, label: 'Website', link: 'Website', image: require('../../assets/images/website.png') },
  { id: 5, label: 'Vendors', link: 'Vendor', image: require('../../assets/images/vendors.png') },
  { id: 6, label: 'Website', link: 'Website', image: require('../../assets/images/website.png') },
  { id: 7, label: 'Vendors', link: 'Vendor', image: require('../../assets/images/vendors.png') },
];

type User = {
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
};

const DEFAULT_USER_IMAGE = require('../../assets/images/default-user.png');

const HomeHeader = ({navigation, showCategories = true, isCategories = true, isBackButton = false }: { navigation: any; showCategories?: boolean; isCategories?: boolean; isBackButton?: boolean }) => {
  const [active, setActive] = useState(1);
  const animatedValues = useRef<{ [key: number]: { scale: Animated.Value; color: Animated.Value; height: Animated.Value } }>({});
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { location, setLocation } = useLocation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    categories.forEach(item => {
      if (!animatedValues.current[item.id]) {
        animatedValues.current[item.id] = {
          scale: new Animated.Value(1),
          color: new Animated.Value(0),
          height: new Animated.Value(showCategories ? 1 : 0),
        };
      }
      
      const isActive = active === item.id;
      Animated.parallel([
        Animated.timing(animatedValues.current[item.id].scale, {
          toValue: isActive ? 1.05 : 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues.current[item.id].color, {
          toValue: isActive ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues.current[item.id].height, {
          toValue: showCategories ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    });
  }, [active, showCategories]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isLoggedIn');
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setIsLoggedIn(value === 'true');
    } catch (e) {
      console.log('Login status error', e);
    }
  };

  // console.log(user);

  return (
    <ImageBackground 
      source={require('../../assets/images/header-bg.png')}
      style={styles.headerBg}
    >
      <View style={styles.container}>
     
        <View style={styles.topRow}>
          <Image
            source={require('../../assets/images/Logo-icon.png')} 
            style={styles.logo}
          />

          <TouchableOpacity style={styles.location} onPress={() => navigation.navigate('ChangeLocationScreen')}>
            <MaterialIcons name="location-on" size={18} color="#FF0762" />
            <Text style={styles.locationText} numberOfLines={1}>
              {location.address}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} />
          </TouchableOpacity>

          <View style={styles.icons}>

            {isLoggedIn ? (
              <>
                <TouchableOpacity onPress={() => navigation.navigate('WishlistScreen')}>
                  <MaterialIcons name="favorite-border" size={24} color="#888888" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.bell} onPress={() => navigation.navigate('NotificationScreen')}>
                  <MaterialIcons name="notifications-none" size={24} color="#888888" />
                  <View style={styles.dot} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
                  <Image
                      source={
                        user?.image
                          ? { uri: user.image }
                          : DEFAULT_USER_IMAGE
                      }
                      style={styles.profileImage}
                    />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            )}

            
          </View>
        </View>
      
        <View style={{ marginTop: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
          {isBackButton && (
            <TouchableOpacity style={styles.iconTopLeft} onPress={() => navigation.goBack()}>
              <MaterialIcons name="west" size={22} color="#888888" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.searchBox}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="search" size={20} color="#999" />
            <TextInput
              placeholder='Search any "Vendor"'
              placeholderTextColor="#999"
              style={styles.input}
              editable={false}
            />
            <MaterialIcons name="mic" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      
        {isCategories && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map(item => {
              

              const scale = animatedValues.current[item.id]?.scale || new Animated.Value(1);

              const height = animatedValues.current[item.id]?.height || new Animated.Value(1);

              return (
              <TouchableOpacity
                key={item.id}
                style={styles.category}
                onPress={() => navigation.navigate(item.link, { categoryValue: item.label })}
              >
                <Animated.View
                    style={[
                    {
                      height: height.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 64],
                      }),
                      opacity: height,
                      transform: [{ scale }],
                      overflow: 'hidden',
                    },
                    ]}
                >
                  <View style={[styles.circle, {
                      backgroundColor: active === item.id ?  '#FF0762' :'#ffffff',
                      borderColor: active === item.id ?  '#FF0762' :'#ffffff',
                      marginTop: 4
                      }]}>
                    <Image source={item.image} style={styles.categoryIcon} />
                  </View>
                </Animated.View>

                <Text
                  style={[
                    styles.catText,
                    active === item.id && styles.activeText,
                  ]}
                >
                  {item.label}
                </Text>

                {active === item.id && <View style={styles.underline} />}
              </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
   
      </View>
    </ImageBackground>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({

  loginButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  loginText: {
    color: '#7e7e7e',
    fontSize: 13,
    fontWeight: '600',
  },

  headerBg: {
    backgroundColor: '#FFF',
    borderBottomColor: 'rgba(255, 7, 98, 0.3)',
    borderBottomWidth: 1,
  },

  iconTopLeft: {
    marginRight: 5,
    backgroundColor: 'rgb(255,255,255)',
    padding: 8,
    borderRadius: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    paddingTop: 45,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 36,
    height: 36,
    marginRight: 8,
  },

  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationText: {
    fontSize: 14,
    marginHorizontal: 4,
    maxWidth: 140,
  },

  icons: {
    flexDirection: 'row',
    gap: 12,
  },

  bell: {
    position: 'relative',
  },

  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    backgroundColor: '#FF0762',
    borderRadius: 4,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 12,
    flex: 1,
    height: 44,
    borderColor: '#ececec',
    borderWidth: 1,
  },

  input: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
  },

  category: {
    alignItems: 'center',
    marginRight: 18,
    width: 60,
  },

  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  activeCircle: {
    borderWidth: 2,
    backgroundColor: '#FF0762',
    borderColor: '#FF0762',
  },

  categoryIcon: {
    width: 52,
    height: 52,
  },

  catText: {
    fontSize: 12,
    color: '#3f3f3f',
    fontWeight: '500',
  },

  activeText: {
    color: '#FF0762',
    fontWeight: '600',
  },

  underline: {
    width: 24,
    height: 3,
    backgroundColor: '#FF0762',
    borderRadius: 4,
    marginTop: 4,
  },
});

