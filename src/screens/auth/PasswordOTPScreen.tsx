import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import authApi from '../../services/authApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_LENGTH = 6;


const PasswordOTPScreen = ({ navigation, route }: any) => {

  const inputs = useRef<Array<TextInput | null>>([]);
  const { verificationtoken, email } = route.params || {};

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState(false);

  console.log('verificationtoken', verificationtoken)

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);


  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newOtp = [...otp];
    
    if (text === '') {
      newOtp[index] = '';
      setOtp(newOtp);
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    } else {
      newOtp[index] = text;
      setOtp(newOtp);
      if (index < OTP_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join('');
    console.log('OTP:', otpString);
    console.log('verificationtoken:', verificationtoken);
    
    
    setLoading(true);

    try {
       const res = await authApi.verificationOtp(otpString, verificationtoken);

       console.log(res);
       const userData = res.data.data.user

       if(res.data.success){

        const refreshToken = res.headers.get('refreshtoken');
          const accessToken = res.headers.get('accesstoken');

          await AsyncStorage.multiSet([
            ['user', JSON.stringify(userData)],
            ['accessToken', accessToken || ''],
            ['refreshToken', refreshToken || ''],
            ['isLoggedIn', 'true'],
          ]);

          Toast.show({
            type: 'success',
            text1: 'Login Successful 🎉',
            text2: 'Welcome back!',
          });

          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        
        Toast.show({
          type: 'success',
          text1: 'OTP Verified ✅',
          text2: 'Your account has been successfully verified',
        });
        
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP ❌',
          text2: res.data.message || 'Please enter a valid OTP',
        });
      }

    } catch (err: any){
      console.log('err', err);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err?.data?.message || 'Unable to verify OTP. Try again.',
      });

    } finally {
      setLoading(false);
    }
  };

  const handelReSend = async () => {

    setResendLoading(true);

    try {
       const res = await authApi.resendOTP(verificationtoken);

       if(res.data.success){

        Toast.show({
          type: 'success',
          text1: 'OTP Resend ✅',
          text2: 'New OTP has been sent to your email',
        });

        setTimer(60);
        setCanResend(false);

       } else {
        Toast.show({
          type: 'error',
          text1: 'Failed ❌',
          text2: res.data.message || 'Failed to send OTP. Try again.',
        });
       }

    } catch (err: any){
      console.log('err', err);
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: err?.data?.message || 'Unable to resend OTP. Try again.',
      });

    } finally {
      setResendLoading(false);
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
    
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subTitle}>
              We have just sent you 6 digit code via your email {' '}
              <Text style={{color: '#ff0066', fontWeight: 700,}}>{email}</Text>
            </Text>


            <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) {
                    inputs.current[index] = ref;
                  }
                }}
                style={[
                  styles.box,
                  focusedIndex === index && styles.activeBox,
                ]}
                keyboardType="numeric"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                autoFocus={index === 0}
                secureTextEntry
                textAlign="center"
              />
            ))}
            </View>
    
    
            <TouchableOpacity style={[styles.button, {opacity: loading ? 0.7 : 1}]} disabled={loading} onPress={handleOtpSubmit}>
              <Text style={styles.buttonText}>Continue</Text>
              {loading && (
                <ActivityIndicator color="#fff" />
              )}
            </TouchableOpacity>

            {canResend ? (
              <Text style={[styles.signup, { paddingTop: 30 }]}>
                {`Didn’t receive code?`}{' '}
                <Text
                  style={{ color: '#ff0066', paddingRight: 10, fontWeight: '700' }}
                  onPress={() => handelReSend()}
                >
                  Resend Code
                </Text>
                {resendLoading && (
                  <ActivityIndicator size={12} color="#ff0066" />
                )}
              </Text>
            ) : (
              <Text style={[styles.signup, { paddingTop: 30 }]}>
                Resend code in{' '}
                <Text style={{ fontWeight: '700' }}>
                  00:{timer < 10 ? `0${timer}` : timer}
                </Text>
              </Text>
            )}
          
          </LinearGradient>
        </ScrollView>
  );
};

const styles = StyleSheet.create({

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
    marginBottom: 50,
    alignItems: 'center',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  box: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 24,
    color: '#000',
  },
  activeBox: {
    borderColor: '#ff0066',
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
    paddingTop: 20,
    paddingBottom: 6,
  },

  subTitle: {
    fontSize: 10,
    marginBottom: 30,
    textAlign: 'center',
    color: '#434E58'
  },

  signup: {
    textAlign: 'center',
    color: '#555',
    fontSize: 14,
  },

  button: { 
    backgroundColor: '#FF0762', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 22, 
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
  
});

export default PasswordOTPScreen;
