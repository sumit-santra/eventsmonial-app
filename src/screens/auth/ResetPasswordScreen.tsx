import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ResetPasswordScreen = ({ navigation, route }: any) => {
  const [code, setCode] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { email } = route.params || {};

  const handleReset = () => {
    navigation.navigate('Login');
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


        <Text style={styles.label}>Verification Code</Text>
        <TextInput
          placeholder="Enter your Verification Code"
          placeholderTextColor="#aaa"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>New Password</Text>
                
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialIcons name={passwordVisible ? "visibility" : "visibility-off"} size={22} color="#999" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm New Password</Text>
        
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your confirm password"
            placeholderTextColor="#aaa"
            style={styles.passwordInput}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <MaterialIcons name={confirmPasswordVisible ? "visibility" : "visibility-off"} size={22} color="#999" />
          </TouchableOpacity>
        </View>

        

        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Password</Text>
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
    marginTop: 5, 
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '600' 
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
