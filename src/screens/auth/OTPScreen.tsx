import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const OTP_LENGTH = 6;


const OTPScreen = ({ navigation, route }: any) => {

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);

  const [timer, setTimer] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

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

  const { phone } = route.params || {};

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

  const handleOtpSubmit = () => {
    navigation.replace('MainTabs');
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
              <Text style={{color: '#ff0066', fontWeight: 700,}}>example@gmail.com</Text>
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
    
    
            <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {canResend ? (
              <Text style={[styles.signup, { paddingTop: 30 }]}>
                {`Didn’t receive code?`}{' '}
                <Text
                  style={{ color: '#ff0066', fontWeight: '700' }}
                  onPress={() => {
                    setTimer(60);
                    setCanResend(false);
                  }}
                >
                  Resend Code
                </Text>
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
  },

  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  
});

export default OTPScreen;
