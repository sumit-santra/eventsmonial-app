import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import authApi from '../../services/authApi';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const [form, setForm] = useState({
    email: '',
    userType: 'planner',
  });

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    let newErrors: any = {};

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      newErrors.email = 'Enter a valid email';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {

    if (!validateForm()) return;
    setLoading(true);

    try {
      setLoading(true);

      const response = await authApi.forgotPassword({
        email: form.email,
        userType: form.userType,
      });

      if(response.data.success){
        const verificationtoken = response.headers.get('resettoken');
        navigation.navigate('PasswordOTPScreen', { verificationtoken: verificationtoken, email: form.email});
        Toast.show({
          type: 'success',
          text1: 'OTP Sent Successfully 📩',
          text2: 'Please check your email',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send OTP',
          text2: response?.data?.message || 'Please try again',
        });
      }
      
    } catch (error: any) {

      Toast.show({
        type: 'error',
        text1: 'Failed to send OTP',
        text2: error.message || 'Please try again',
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.ScrollViewContainer}>
      <LinearGradient
        colors={['#FAF2F2', '#F8F8F9']}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <MaterialIcons name="west" color="#5D5D5D" size={20} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
            <Text style={styles.skip}>SKIP</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subTitle}>
          Recover your account password
        </Text>


        <Text style={styles.label}>E-mail Address</Text>
        <TextInput
          placeholder="Enter your email address"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) =>
            setForm({ ...form, email: text })
          }
        />

        {errors.email && <Text style={styles.error}>{errors.email}</Text>}


        <TouchableOpacity style={styles.button} onPress={handleSendCode}>
          <Text style={styles.buttonText}>Next</Text>
          {loading && (
            <ActivityIndicator color="#fff" />
          )}
        </TouchableOpacity>

        <Text style={styles.signup}>
          {`Back to`}{' '}
          <Text style={{ color: '#ff0066', fontWeight: 700, }} onPress={() => navigation.navigate('Login')}>Login</Text>
        </Text>

      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({

   error: {
    color: '#ff3333',
    fontSize: 12,
    paddingBottom: 8,
    marginTop: -8,
  },

  ScrollViewContainer: {
    flexGrow: 1,
  },

  container: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    flexGrow: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    alignItems: 'center',
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 36,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  skip: {
    color: '#8c8c8c',
    fontSize: 14,
    lineHeight: 15,
    borderBottomColor: '#9A9999',
    borderBottomWidth: 1,
    paddingBottom: 2
  },

  title: { 
    fontSize: 30, 
    fontWeight: 'bold',  
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 6,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#FF0762', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 5, 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '600',
    paddingHorizontal: 5,
  },
  subTitle: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#434E58'
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },
  signup: {
    textAlign: 'center',
    paddingTop: 25,
    color: '#555',
  },
});

export default ForgotPasswordScreen;
