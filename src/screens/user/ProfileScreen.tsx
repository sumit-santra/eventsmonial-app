import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeHeader from '../../components/Layout/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
};

const ProfileScreen = ({ navigation }: any) => {
  const menuItems = [
    { label: 'Reviews', icon: 'star-outline' },
    { label: 'Saved Vendors', icon: 'storefront' },
    { label: 'My Cards', icon: 'wallet-giftcard' },
    { label: 'My Website', icon: 'language' },
    { label: 'Change Password', icon: 'password' },
    { label: 'Help and Support', icon: 'help-outline' },
  ];

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, []);


  const handelLogout = async () => {

    try {
      await AsyncStorage.multiRemove([
        'user',
        'accessToken',
        'refreshToken',
        'isLoggedIn',
      ]);

      console.log('User logged out');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {
      console.log('Logout error:', error);
    }
    
  };

  return (
    <View style={styles.container}>

      <HomeHeader navigation={navigation} showCategories={false} isCategories={false} isBackButton={true}/>

      <ScrollView  contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}> My Profile</Text>
        </View>

       
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: user?.profileImage || 'https://i.pravatar.cc/150?img=3',
              }}
              style={styles.avatar}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user ? `${user.firstName} ${user.lastName}` : ''}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <MaterialIcons name="edit" size={20} color="#FF2D55" />
          </TouchableOpacity>
        </View>

       
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <MaterialIcons name={item.icon} size={24} color="#666" />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

    
        <TouchableOpacity onPress={() => handelLogout()} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

       
        <View style={styles.footer}>
          <Text style={styles.brand}>
            events<Text style={{ color: '#000' }}>monial</Text>
          </Text>
          <Text style={styles.version}>Version - 0.0.1</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F8F9',
    },

    scrollContent: {
      padding: 20,
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    headerTitle: {
      flex: 1,
      textAlign: 'left',
      fontSize: 18,
      fontWeight: '600',
    },

    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 16,
      backgroundColor: '#FFF',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#4d4d4d',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.01,
      shadowRadius: 5,
      elevation: 1,
    },

    avatarWrapper: {
      borderWidth: 2,
      borderColor: '#FF2D55',
      borderRadius: 40,
      padding: 2,
    },

    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
    },

    profileInfo: {
      flex: 1,
      marginLeft: 12,
    },

    name: {
      fontSize: 16,
      fontWeight: '600',
      color: '#111',
      textTransform: 'capitalize',
    },

    email: {
      fontSize: 13,
      color: '#777',
      marginTop: 2,
    },

    editBtn: {
      padding: 6,
    },

    menu: {
      marginTop: 5,
    },

    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
    },

    menuText: {
      fontSize: 15,
      marginLeft: 14,
      color: '#555',
    },

    logoutBtn: {
      marginTop: 40,
      alignItems: 'center',
    },

    logoutText: {
      color: '#FF2D55',
      fontSize: 15,
      fontWeight: '600',
    },

    footer: {
      alignItems: 'center',
      marginTop: 40,
      marginBottom: 20,
    },

    brand: {
      fontSize: 18,
      color: '#FF2D55',
      fontWeight: '600',
    },

    version: {
      fontSize: 12,
      color: '#999',
      marginTop: 4,
    },
});
