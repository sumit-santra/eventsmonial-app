import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ScrollViewBase, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SignUpScreen = ({ navigation }: any) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    let newErrors: any = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(form.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (form.mobile.length !== 10) {
      newErrors.mobile = 'Enter valid 10 digit number';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!rememberMe) {
      newErrors.terms = 'Please accept Terms & Conditions';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    setLoading(true);
    if (!validateForm()) return;
    
    
    navigation.navigate('OTP');
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
          
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.skip}>SKIP</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Start Planning Your Event</Text>
        <Text style={styles.subTitle}>
          Welcome to Eventsmonial, your smart event planning assistant.
        </Text>

        <View style={styles.twoCol}>
          <View style={{flex: 1, paddingRight: 6,}}>
            <Text style={styles.label}>First Name*</Text>
            <TextInput
              placeholder="Enter your first name"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) =>
                setForm({ ...form, firstName: text })
              }
            />
            {errors.firstName && <Text style={styles.error}>{errors.firstName}</Text>}
          </View>
          <View style={{flex: 1, paddingLeft: 6,}}>
            <Text style={styles.label}>Last Name*</Text>
            <TextInput
              placeholder="Enter your last name"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) =>
                setForm({ ...form, lastName: text })
              }
            />
            {errors.lastName && <Text style={styles.error}>{errors.lastName}</Text>}
          </View>
        </View>


        <Text style={styles.label}>Email*</Text>
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

        <Text style={styles.label}>Mobile Number*</Text>
        
        <View style={styles.passwordBox}>
          <Text style={styles.countryCode}>(+91)</Text>

          <TextInput
            placeholder="Enter mobile number"
            placeholderTextColor="#aaa"
            style={styles.passwordInput}
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) =>
              setForm({ ...form, mobile: text })
            }
          />
        </View>
        {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

        

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
            onChangeText={(text) =>
              setForm({ ...form, password: text })
            }
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialIcons name={passwordVisible ? "visibility" : "visibility-off"} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.error}>{errors.password}</Text>}

        <Text style={styles.label}>Confirm Password</Text>
        
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="Enter your confirm password"
            placeholderTextColor="#aaa"
            style={styles.passwordInput}
            secureTextEntry={!confirmPasswordVisible}
            onChangeText={(text) =>
              setForm({ ...form, confirmPassword: text })
            }
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <MaterialIcons name={confirmPasswordVisible ? "visibility" : "visibility-off"} size={20} color="#999" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

        <View style={styles.row}>
          <TouchableOpacity style={styles.remember} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
              {rememberMe && <MaterialIcons name="check" size={16} color="#fff" />}
            </View>
            
          </TouchableOpacity>
          {/* <Text style={styles.rememberText}>I agree to all the Terms & Conditions and Privacy Policy</Text> */}
          <Text style={styles.rememberText}>
            I agree to all the{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Terms')}
            >
              Terms & Conditions
            </Text>{' '}
            and{' '}
            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Privacy')}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>
        <View style={{paddingTop: errors.terms ? 5:0}}>
          {errors.terms && <Text style={styles.error}>{errors.terms}</Text>}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          
          <Text style={styles.buttonText}>Register</Text>
          {loading && (
            <ActivityIndicator color="#fff" />
          )}
        </TouchableOpacity>

        <Text style={[styles.signup, {paddingTop: 30}]}>
          {`It only takes a minute and you're ready to celebrate! `}
        </Text>

        <Text style={styles.signup}>
          {` Already have an account? `}{' '}
          <Text style={{ color: '#ff0066', fontWeight: 700, }} onPress={() => navigation.navigate('Login')}>Sign in</Text>
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
      
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  twoCol:{
    flexDirection: 'row',
  },

  error: {
    color: '#ff3333',
    fontSize: 12,
    paddingBottom: 8,
    marginTop: -8,
  },

  countryCode: {
    fontSize: 15,
    color: '#333',
    marginRight: 10,
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
    fontSize: 25, 
    fontWeight: 'bold',  
    textAlign: 'center',
    paddingTop: 20,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontSize: 16, 
    fontWeight: '600',
    paddingHorizontal: 5 
  },

  subTitle: {
    fontSize: 12,
    marginBottom: 30,
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
    marginTop: 2,
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
    alignItems: 'center',
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
  
  

  signup: {
    textAlign: 'center',
    color: '#555',
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
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
 
});

export default SignUpScreen;
