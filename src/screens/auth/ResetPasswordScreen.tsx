import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import authApi from '../../services/authApi';

const ResetPasswordScreen = ({ navigation, route }: any) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { authorization } = route.params || {};
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    let newErrors: any = {};

    if (!form.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async () => {
     if (!validateForm()) return;
    setLoading(true);

    try {
      const res = await authApi.resetPassword(form, authorization);

      if (res.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset Successful 🎉',
          text2: 'Please login with your new password',
        });

        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Reset Failed',
          text2: res?.data?.message || 'Unable to reset password',
        });
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: err?.response?.data?.message || 'Something went wrong',
      });
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

        <Text style={styles.title}>Create a New Password</Text>
        <Text style={styles.subTitle}>
          Recover your account password
        </Text>

        <Text style={styles.label}>New Password</Text>
                
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
            onChangeText={(text) => {
              setForm({ ...form, newPassword: text });
              if (errors.newPassword) setErrors({});
            }}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialIcons name={passwordVisible ? "visibility" : "visibility-off"} size={22} color="#999" />
          </TouchableOpacity>
        </View>
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}

        <Text style={styles.label}>Confirm New Password</Text>
        
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your confirm password"
            placeholderTextColor="#aaa"
            style={styles.passwordInput}
            secureTextEntry={!confirmPasswordVisible}
            onChangeText={(text) => {
              setForm({ ...form, confirmPassword: text });
              if (errors.confirmPassword) setErrors({});
            }}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <MaterialIcons name={confirmPasswordVisible ? "visibility" : "visibility-off"} size={22} color="#999" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        

        <TouchableOpacity style={[styles.button, {opacity: loading ? 0.7 : 1}]} disabled={loading} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Password</Text>
          {loading && (
            <ActivityIndicator size={12} color="#ff0066" />
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
  ScrollViewContainer: {
    flexGrow: 1,
  },
  errorText:{
    color: '#ff3333',
    fontSize: 12,
    paddingBottom: 8,
    marginTop: 2,
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
    marginBottom: 5, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#FF0762', 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 10, 
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
    marginTop: 10,
  },
  signup: {
    textAlign: 'center',
    paddingTop: 25,
    color: '#555',
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 5, 
    fontSize: 16 
  },

  passwordInput: {
    padding: 0,
    flex: 1,
  },

});

export default ResetPasswordScreen;
