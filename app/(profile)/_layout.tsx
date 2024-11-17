// import { Buffer } from 'buffer';
// import { Text as TextDecoder, TextEncoder } from 'text-encoding';

// // Polyfill necessary globals
// if (typeof global.TextDecoder === 'undefined') {
//   global.TextDecoder = TextDecoder;
//   global.TextEncoder = TextEncoder;
// }
// if (typeof global.Buffer === 'undefined') {
//   global.Buffer = Buffer;
// }

// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ToastAndroid, Platform, Alert } from 'react-native';
// import { useLoginWithEmail } from '@privy-io/expo';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import { router } from 'expo-router';
// import { ethers } from 'ethers';
// import { CONTRACT_ADDRESS, ABI, SAPPHIRE_TESTNET } from './configmatch';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { wrap } from '@oasisprotocol/sapphire-paratime';


// const LoginScreen = () => {
//   const [code, setCode] = useState('');
//   const [email, setEmail] = useState('');
//   const [isOtpEnabled, setIsOtpEnabled] = useState(false);
//   const { state, sendCode, loginWithCode } = useLoginWithEmail();
//   const inputRefs = useRef<(TextInput | null)[]>(Array(6).fill(null));



//   const [publics, setPublic] = useState('');
//   const [privates, setPrivate] = useState('');
//   // user data
//   const [userInfo, setUserInfo] = useState('');

//   const [provider, setProvider] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [wallet, setWallet] = useState(null);
//   const [username, setUsername] = useState('');
//   const [personalInfo, setPersonalInfo] = useState({
//     name: '',
//     age: '',
//     bio: '',
//   });
//   const [interests, setInterests] = useState(['']);
//   const [profileData, setProfileData] = useState(null);
//   const [matches, setMatches] = useState([]);
//   const [targetUsername, setTargetUsername] = useState('');
//   const [isInitialized, setIsInitialized] = useState(false);

//   useEffect(() => {
//     fetchData();
//     initializeEthers();
//   }, []);

//   const fetchData = async () => {
//     let userInfo = await AsyncStorage.getItem('userinfo');
//     // userInfo=JSON.parse(userInfo)
//     setUserInfo(userInfo);
//   }

//   const initializeEthers = async () => {
//     try {
//       // Create a provider and wrap it with Sapphire
//       const baseProvider = new ethers.JsonRpcProvider(SAPPHIRE_TESTNET.networkParams.rpcUrls[0]);
//       const wrappedProvider = wrap(baseProvider);
//       setProvider(wrappedProvider);
      
//       //await AsyncStorage.setItem('wallet_private_key', '3ffab572949e1afdccdaa3108f222c23cf7332a05e3c1e100bb57caebfa28ba6');
//       const privateKey = await AsyncStorage.getItem('wallet_private_key');
      
//       if (!privateKey) {
//         Alert.alert('Wallet Setup Required', 'Please set up your wallet first by importing your private key');
//         return;
//       }

//       // Create a wrapped wallet for Sapphire
//       const baseWallet = new ethers.Wallet(privateKey, wrappedProvider);
//       console.log('Based address:', baseWallet);
//       const wrappedWallet = wrap(baseWallet);
//       console.log('Wrapped address:', wrappedWallet);
//       setWallet(wrappedWallet);

//       // Initialize contract with wrapped wallet
//       const wrappedContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wrappedWallet);
//       setContract(wrappedContract);
//       setIsInitialized(true);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to initialize blockchain connection: ' + error.message);
//       console.error('Initialization error:', error);
//     }
//   };



//   const getProfile = async () => {

//     const userInfoJSON = JSON.parse(userInfo)
//     console.log("getProfile",userInfoJSON);
//     if (!isInitialized) {
//       Alert.alert('Error', 'Please wait for wallet initialization');
//       return;
//     }

//     try {
//       // if (!contract || !username.trim()) {
//       //   Alert.alert('Error', 'Please enter a username');
//       //   return;
//       // }


//       const profile = await contract.getPublicProfileInfo(userInfoJSON.name);
//       setPublic(profile);
//       console.log("profile",profile);

//       const privateData = await contract.getPersonalInfo(userInfoJSON.name);
//       setPrivate(privateData);
//       console.log("private:",privateData);

//       if (!profile.exists) {
//         console.error('Error', 'Profile does not exist');
//         setProfileData(null);
//         return;
//       }

//       console.log("no ah",profile);

//       // Decrypt profile data
//       // const decryptedProfile = {
//       //   personalInfo: await decryptData(profile.personalInfo),
//       //   interests: await decryptData(profile.interests),
//       //   beautyMetric: profile.beautyMetric.toString(),
//       //   wealthMetric: profile.wealthMetric.toString()
//       // };

//       // setProfileData(decryptedProfile);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to fetch profile: ' + (error.reason || error.message));
//       console.error('Profile fetch error:', error);
//     }
//   };



  
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign into!</Text>

// {state.status != 'sending-code' &&
//       <View style={styles.card}>
//         <TextInput
//           style={[styles.input, styles.emailInput]}
//           onChangeText={setEmail}
//           placeholder="Enter your email"
//           placeholderTextColor="#000000FF"
//         />

//         <TouchableOpacity onPress={handleSendCode} style={styles.button}>
//           <View style={styles.btnLeft}>
//             <Text style={styles.buttonText}>Send Code</Text>
//             <Ionicons name="arrow-forward-outline" size={25} color="#000" />
//           </View>
//         </TouchableOpacity>
      
//       </View>
//     }



//     { state.status === 'sending-code' &&
//     <View style={styles.otpContainer}>
//       {Array(6)
//         .fill(0)
//         .map((_, index) => (
//           <TextInput
//             key={index}
//             ref={(ref) => (inputRefs.current[index] = ref)}
//             style={[styles.otpInput, isOtpEnabled ? null : styles.disabledInput]}
//             onChangeText={(text) => handleCodeChange(index, text)}
//             maxLength={1}
//             keyboardType="numeric"
//             textAlign="center"
//             editable={isOtpEnabled}
//             placeholder="•"
//             placeholderTextColor="#ccc"
//           />
//         ))}
//     </View>}

//       {state.status === 'submitting-code' && <Text style={styles.statusText}>Logging in...</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f9e587',
//     padding: 20,
//   },
//   card: {
//     // backgroundColor: '#fff',
//     // borderRadius: 12,
//     padding: 20,
//     width: '100%',
//     maxWidth: 400,
//     alignItems: 'center',
//     // borderWidth: 3,
//     // borderColor: 'black'
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 20,
//   },
//   input: {
//     height: 50,
//     borderColor: '#ddd',
//     borderWidth: 2,
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     backgroundColor: '#f9f9f9',
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   emailInput: {
//     width: '100%',
//         borderWidth: 2,
//     borderColor: 'black'
//   },
//   button: {
//     backgroundColor: '#0000002C',
//     borderRadius: 10,
//     width: '100%',
//     paddingVertical: 12,
//     marginTop: 10,
//   },
//   btnLeft: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#000',
//     fontSize: 18,
//     fontWeight: '700',
//     marginRight: 8,
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginVertical: 20,
//   },
//   otpInput: {
//     width: 48,
//     height: 48,
//     borderColor: '#3B62FFFF',
//     borderWidth: 2,
//     borderRadius: 8,
//     marginHorizontal: 5,
//     textAlign: 'center',
//     fontSize: 20,
//     color: '#333',
//     fontWeight: 'bold',
//   },
//   disabledInput: {
//     backgroundColor: '#e0e0e0',
//     color: '#a0a0a0',
    
//   },
//   statusText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#555',
//   },
// });

// export default LoginScreen;
