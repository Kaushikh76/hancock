import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import { useLoginWithEmail, usePrivy, hasError, useEmbeddedWallet } from '@privy-io/expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Override atob
const _atob = atob;
global.atob = (val) => {
  try {
    return _atob(val);
  } catch {
    return _atob(val + "=");
  }
};

const LoginScreen = () => {
  const { isReady } = usePrivy();
  const [code, setCode] = useState(''.padEnd(6, '')); // Initialize as a 6-character string
  const [email, setEmail] = useState('');
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);

  const { state, sendCode, loginWithCode } = useLoginWithEmail();
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));
  const { user } = usePrivy();
  const wallet = useEmbeddedWallet();
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('userinfo');
      if (userInfo) {
        setUserInfo(userInfo);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleCodeChange = (index, text) => {
    const updatedCodeArray = [...code];
    updatedCodeArray[index] = text;
    setCode(updatedCodeArray.join(''));

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedCodeArray.join('').length === 6) {
        console.log("updated:",updatedCodeArray.join(''));
      loginWithCode({ code: updatedCodeArray.join(''), email }).then(() => {
        showSuccessToast();
        handleWalletCreation();
      });
    }
  };

  const handleWalletCreation = async () => {
    try {
      const password = 'password';
      await wallet.create({
        recoveryMethod: 'user-passcode',
        password,
      });
      console.log('Wallet created:', wallet);
    } catch (error) {
      console.error('Error during wallet creation:', error);
    } finally {
      setTimeout(() => {
        router.push('/(tabs)');
      }, 1000);
    }
  };

  const showSuccessToast = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Login Successful!", ToastAndroid.SHORT);
    } else {
      Alert.alert('Login Successful!');
    }
  };

  const handleSendCode = async () => {
    try {
      const result = await sendCode({ email });
      if (!result.success && hasError(state)) {
        console.error(state.error.message);
      }
      if (result.success) {
        setIsOtpEnabled(true);
      }
    } catch (error) {
      console.error('Error sending code:', error);
      Alert.alert('Error', 'Failed to send code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign into!</Text>

      {state.status !== 'sending-code' &&
        <View style={styles.card}>
          <TextInput
            style={[styles.input, styles.emailInput]}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#000000FF"
          />
        </View>
      }
      {isOtpEnabled &&
        <View style={styles.otpContainer}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.otpInput]}
                onChangeText={(text) => handleCodeChange(index, text)}
                maxLength={1}
                keyboardType="numeric"
                textAlign="center"
              />
            ))}
        </View>}

      <TouchableOpacity onPress={handleSendCode} style={styles.button}>
        <View style={styles.btnLeft}>
          <Text style={styles.buttonText}>Send Code</Text>
          <Ionicons name="arrow-forward-outline" size={25} color="#000" />
        </View>
      </TouchableOpacity>

      {state.status === 'submitting-code' && <Text style={styles.statusText}>Logging in...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9e587',
    padding: 20,
  },
  card: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    marginBottom: 5,
  },
  emailInput: {
    width: '100%',
    borderWidth: 2,
    borderColor: 'black',
  },
  button: {
    backgroundColor: '#0000002C',
    borderRadius: 10,
    width: '100%',
    paddingVertical: 12,
    marginTop: 10,
  },
  btnLeft: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderColor: '#3B62FFFF',
    borderWidth: 2,
    borderRadius: 8,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default LoginScreen;
