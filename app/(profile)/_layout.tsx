import { Buffer } from 'buffer';
import { Text as TextDecoder, TextEncoder } from 'text-encoding';

// Polyfill necessary globals
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
  global.TextEncoder = TextEncoder;
}
if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
import { useLoginWithEmail, usePrivy, useEmbeddedWallet, isNotCreated, hasError, EIP1193Provider } from '@privy-io/expo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI, SAPPHIRE_TESTNET } from './configmatch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrap } from '@oasisprotocol/sapphire-paratime';
// Replace this with any of the networks listed at https://viem.sh/docs/chains/introduction#chains


const LoginScreen = () => {
  const {isReady} = usePrivy();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [isOtpEnabled, setIsOtpEnabled] = useState(false);


  //privy state sendcode
  const { state, sendCode, loginWithCode } = useLoginWithEmail();
  const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));

  const {user}=usePrivy();

  const wallet = useEmbeddedWallet();

  // user data
  const [userInfo, setUserInfo] = useState('');

  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [wallets, setWallet] = useState(null);
  const [username, setUsername] = useState('');
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    age: '',
    bio: '',
  });
  const [interests, setInterests] = useState(['']);
  const [profileData, setProfileData] = useState(null);
  const [matches, setMatches] = useState([]);
  const [targetUsername, setTargetUsername] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    fetchData();
    initializeEthers();
    console.log("userinnnfo",userInfo);
  }, []);

  const fetchData = async () => {
    let userInfo = await AsyncStorage.getItem('userinfo');
    console.log("type", typeof(userInfo));
    console.log("userinfo",userInfo);
    console.log("Hi")
    // userInfo=JSON.parse(userInfo)
    setUserInfo(userInfo);
  }

  const initializeEthers = async () => {
    try {
      // Create a provider and wrap it with Sapphire
      const baseProvider = new ethers.JsonRpcProvider(SAPPHIRE_TESTNET.networkParams.rpcUrls[0]);
      const wrappedProvider = wrap(baseProvider);
      setProvider(wrappedProvider);
      
      //await AsyncStorage.setItem('wallet_private_key', '3ffab572949e1afdccdaa3108f222c23cf7332a05e3c1e100bb57caebfa28ba6');
      const privateKey = await AsyncStorage.getItem('wallet_private_key');
      
      if (!privateKey) {
        Alert.alert('Wallet Setup Required', 'Please set up your wallet first by importing your private key');
        return;
      }

      // Create a wrapped wallet for Sapphire
      const baseWallet = new ethers.Wallet(privateKey, wrappedProvider);
      console.log('Based address:', baseWallet);
      const wrappedWallet = wrap(baseWallet);
      console.log('Wrapped address:', wrappedWallet);
      setWallet(wrappedWallet);

      // Initialize contract with wrapped wallet
      const wrappedContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wrappedWallet);
      setContract(wrappedContract);
      setIsInitialized(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize blockchain connection: ' + error.message);
      console.error('Initialization error:', error);
    }
  };

  // // Function to encrypt sensitive data using Sapphire's built-in encryption
  // const encryptData = async (data) => {
  //   try {
  //     // Convert data to hex string
  //     const dataHex = ethers.toUtf8Bytes(JSON.stringify(data));
  //     // The encryption happens automatically through the wrapped contract
  //     return dataHex;
  //   } catch (error) {
  //     console.error('Encryption error:', error);
  //     throw new Error('Failed to encrypt data');
  //   }
  // };

  // // Function to decrypt received data
  // const decryptData = async (encryptedData) => {
  //   try {
  //     // The decryption happens automatically through the wrapped contract
  //     return JSON.parse(ethers.toUtf8String(encryptedData));
  //   } catch (error) {
  //     console.error('Decryption error:', error);
  //     throw new Error('Failed to decrypt data');
  //   }
  // };

  // const createProfile = async () => {
  //     if (!isInitialized) {
  //       Alert.alert('Error', 'Please wait for wallet initialization');
  //       return;
  //     }

  //     if(userInfo){
  //       console.log("yes")
  //       console.log(userInfo)
  //       console.log("here name",userInfo)
  //       const userInfoJSON = JSON.parse(userInfo)
  //       console.log(typeof(userInfoJSON))
  //       console.log(userInfoJSON.name);
  //       console.log(userInfoJSON["age"]);
  //     try {
  //       if (!contract || !wallet) {
  //         Alert.alert('Error', 'Wallet or contract not initialized');
  //         return;
  //       }

  //       if(!userInfoJSON){
  //         console.log("nahh bro not doing it")
  //       }
  
  //       // Validate fields
  //       if (!userInfoJSON['name'].trim()) {
  //         Alert.alert('Error', 'Username is required');
  //         return;
  //       }
  
  //       if (!userInfoJSON['name'].trim() || !userInfoJSON['age'] || !userInfoJSON['Bio'].trim()) {
  //         console.log("nahh bro not doing it");
  //         Alert.alert('Error', 'All profile fields are required');
  //         return;
  //       }
  
  //       // const validInterests = interests.filter(interest => interest.trim() !== '');
  //       // if (validInterests.length === 0) {
  //       //   Alert.alert('Error', 'At least one interest is required');
  //       //   return;
  //       // }
  
  //       // Check if username is already taken
  //       const isTaken = await contract.isUsernameTaken(userInfoJSON['name']);
  //       if (isTaken) {
  //         console.error('Error', 'Username is already taken');
  //         return;
  //       }
  
        
  //       setPersonalInfo({
  //         name: userInfoJSON['name'],
  //         age: userInfoJSON['age'],
  //         bio: userInfoJSON['Bio'],
  //       })
  //       // Encrypt data
  //       // const encryptedPersonalInfo = await encryptData({
  //       //   name: "userInfoJSON['name']",
  //       //   age: userInfoJSON['age'],
  //       //   bio: userInfoJSON['Bio'],
  //       // });
  //       // const encryptedInterests = await encryptData(["flutter","dart"]);
  
  //       console.log('Confirming', 'Creating confidential profile... Please wait.');
  //       console.log("After this is the error");
        
  //       const tx = await contract.createProfile(
  //           userInfoJSON.name,
  //           {
  //         name: userInfoJSON['name'],
  //         age: userInfoJSON['age'],
  //         bio: userInfoJSON['Bio'],
  //       },
  //           ["encryptedInterests", "Flutter"],
  //           { gasLimit: 500000 }
  //         );
  //         await tx.wait();

  //         console.log('Profile created successfully!', tx);

  //       console.log('Profile created successfully!');
  
  //       console.log('Success', 'Confidential profile created successfully!');
  //       // Reset fields after successful profile creation
  //       setPersonalInfo({ name: '', age: '', bio: '' });
  //       setInterests(['']);
  //       setUsername('');
  //     } catch (error) {
  //       console.log("cntrct",userInfoJSON.name,{ gasLimit: 500000 });

  //       console.error('Error', 'Failed to create confidential profile: ' + (error.reason || error.message));
  //       console.error('Profile creation error:', error);
  //     }
  //   }
  //   else{
  //   console.log("not working")
  //   }

  //   };

  const getProfile = async () => {

    const userInfoJSON = JSON.parse(userInfo)
    console.log("getProfile",userInfoJSON);
    if (!isInitialized) {
      Alert.alert('Error', 'Please wait for wallet initialization');
      return;
    }

    try {
      // if (!contract || !username.trim()) {
      //   Alert.alert('Error', 'Please enter a username');
      //   return;
      // }


      const profile = await contract.getPublicProfileInfo(userInfoJSON.name);
      
      console.log("profile",profile);

      const privateData = await contract.getPersonalInfo(userInfoJSON.name);
      console.log("private:",privateData);

      if (!profile.exists) {
        Alert.alert('Error', 'Profile does not exist');
        setProfileData(null);
        return;
      }

      console.log("no ah",profile);

      // Decrypt profile data
      // const decryptedProfile = {
      //   personalInfo: await decryptData(profile.personalInfo),
      //   interests: await decryptData(profile.interests),
      //   beautyMetric: profile.beautyMetric.toString(),
      //   wealthMetric: profile.wealthMetric.toString()
      // };

      // setProfileData(decryptedProfile);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch profile: ' + (error.reason || error.message));
      console.error('Profile fetch error:', error);
    }
  };

  const signMessage = async(provider: EIP1193Provider) => {

    console.log("are you ready?",isReady)
    // Get the wallet address
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    });
    console.log("Inside Sign message:", accounts);

    // Sign message
    const message = 'I hereby vote for foobar';
    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, accounts[0]]
    });
    console.log("Signing message:", signature);
  }

  const handleCodeChange = (index: number, text: string) => {
    const updatedCode = code.slice(0, index) + text + code.slice(index + 1);
    setCode(updatedCode);

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (updatedCode.length === 6) {
      loginWithCode({ code: updatedCode,email: email}).then(() => {
        console.log("user is",user);
        showSuccessToast();
        try {
          console.log("walet create aacha ?")
          let password='password';
          wallet.create({
            recoveryMethod: 'user-passcode',
            password,
          })
          console.log("wall",wallet);
          signMessage(wallet.provider);
          console.log("Signed aacha")
        } catch (error) {
          console.error('Error during wallet creation or signing message:', error)
        } finally {
          setTimeout(() => {
            router.push('/(tabs)');
          }, 1000);
        }
      });
    }
  };

  const showSuccessToast = () => {
    if (Platform.OS === 'android') {
      ToastAndroid.show("Login Successful!", ToastAndroid.SHORT);
    } else {
      // For iOS or any other platform, use a compatible toast library
    }
  };

  const handleSendCode = async() => {
    // createProfile();

    try {
      let result = await sendCode({ email });
      console.log(result);
      if(result.success==false && hasError(state)){
        console.log(state.error.message);
      }
      if(result.success==true){
        setIsOtpEnabled(true);
      }
    } catch (error) {
      
      console.error('Error sending code:', error);
      Alert.alert('Error', 'Failed to send code. Please try again.');
    }
    //router.push('/(tabs)');
    // after wards
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign into!</Text>

{state.status != 'sending-code' &&
      <View style={styles.card}>
        <TextInput
          style={[styles.input, styles.emailInput]}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#000000FF"
        />
        

      
      </View>
    }
     { isOtpEnabled &&
    <View style={styles.otpContainer}>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[styles.otpInput, isOtpEnabled ? null : styles.disabledInput]}
            onChangeText={(text) => handleCodeChange(index, text)}
            maxLength={1}
            keyboardType="numeric"
            textAlign="center"
            editable={isOtpEnabled}
            placeholder="•"
            placeholderTextColor="#ccc"
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
    // backgroundColor: '#fff',
    // borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    // borderWidth: 3,
    // borderColor: 'black'
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
    borderColor: 'black'
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
  disabledInput: {
    backgroundColor: '#e0e0e0',
    color: '#a0a0a0',
    
  },
  statusText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default LoginScreen;
