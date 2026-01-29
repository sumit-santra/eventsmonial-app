import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = () => {
    navigation.navigate('MainTabs');
  };

  return (
      <ScrollView contentContainerStyle={styles.ScrollViewContainer}>
        <LinearGradient
          colors={['#FAF2F2', '#F8F8F9']}
          style={styles.container}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
              <MaterialIcons name="west" color="#5D5D5D" size={20} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={styles.skip}>SKIP</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Glad to see you again!</Text>
          <Text style={styles.subTitle}>
            Log in to plan, connect, and celebrate with {' '}
            <Text style={{color: '#FF0762', fontWeight: '600'}}>
              Eventsmonial.
            </Text>
          </Text>


          <Text style={styles.label}>Email Address</Text>
          <TextInput
            placeholder="Enter your email address"
            placeholderTextColor="#aaa"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          
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

          <View style={styles.row}>
            <TouchableOpacity style={styles.remember} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <MaterialIcons name="check" size={16} color="#fff" />}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgot}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.signup}>
            {`Don’t have an account?`}{' '}
            <Text style={{ color: '#ff0066', fontWeight: 700, }} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
          </Text>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.or}>Or Sign In with</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity style={styles.googleBtn}>
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        
          <Text style={styles.footer}>
            By signing up you agree to our{' '}
            <Text style={{ color: '#ff0066' }}>Terms</Text> and{' '}
            <Text style={{ color: '#ff0066' }}>Conditions of Use</Text>
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
    fontSize: 25, 
    fontWeight: 'bold',  
    textAlign: 'center',
    paddingTop: 30,
    paddingBottom: 6,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    paddingHorizontal: 15, 
    paddingVertical: 15,
    borderRadius: 6, 
    marginBottom: 12, 
    fontSize: 15 
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
  subTitle: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: 'center',
    color: '#434E58'
  },
  link: { 
    color: '#FF0762', 
    textAlign: 'center', 
    marginTop: 15, 
    fontSize: 14 
  },

  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    marginTop: 16,
  },

  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 8, 
    marginBottom: 15, 
    fontSize: 16 
  },
  passwordInput: {
    padding: 0,
    flex: 1,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
    paddingBottom: 5,
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF0762',
    borderColor: '#FF0762',
  },
  rememberText: {
    fontSize: 14,
    color: '#666',
  },
  forgot: {
    fontSize: 14,
    color: '#ff0066',
  },
  signInBtn: {
    backgroundColor: '#ff0066',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  signInText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  signup: {
    textAlign: 'center',
    paddingTop: 20,
    color: '#555',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  or: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#aaa',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 12,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  googleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#474747'
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default LoginScreen;
