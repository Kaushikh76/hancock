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
import TinderCard from "../../components/SwipeCard";
import { StyleSheet, View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI, SAPPHIRE_TESTNET } from './configmatch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrap } from '@oasisprotocol/sapphire-paratime';

const SwipeScreen = () => {
  // State management
  const [userInfo, setUserInfo] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessingSwipe, setIsProcessingSwipe] = useState(false);

  const cardData = [
    { id: 1, text: 'JB', image: 'https://noun-api.com/beta/pfp?name=justinbenito', beauty: '50', wealth: '150' },
    { id: 2, text: 'justinbenito', image: 'https://noun-api.com/beta/pfp?name=jayden', beauty: '150', wealth: '450' },
    { id: 3, text: 'Justin', image: 'https://noun-api.com/beta/pfp?name=jb', beauty: '500', wealth: '120' },
    { id: 4, text: 'JB', image: 'https://noun-api.com/beta/pfp?name=bjb', beauty: '150', wealth: '350' },
  ];

  // Initialize blockchain connection
  const initializeEthers = async () => {
    try {
      console.log('Initializing blockchain connection...');
      
      const baseProvider = new ethers.JsonRpcProvider(SAPPHIRE_TESTNET.networkParams.rpcUrls[0]);
      const wrappedProvider = wrap(baseProvider);
      setProvider(wrappedProvider);
      
      console.log('Provider initialized successfully');

      // Get private key from storage
      const privateKey = await AsyncStorage.getItem('wallet_private_key');
      if (!privateKey) {
        throw new Error('No private key found in storage');
      }

      // Create wrapped wallet
      const baseWallet = new ethers.Wallet(privateKey, wrappedProvider);
      const wrappedWallet = wrap(baseWallet);
      console.log('Wallet initialized with address:', await wrappedWallet.getAddress());
      setWallet(wrappedWallet);

      // Initialize contract
      const wrappedContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wrappedWallet);
      console.log('Contract initialized at address:', CONTRACT_ADDRESS);
      setContract(wrappedContract);
      
      setIsInitialized(true);
      console.log('Blockchain initialization complete');
    } catch (error) {
      console.error('Blockchain initialization failed:', error);
      setIsInitialized(false);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userinfo');
      console.log('Fetched user info:', storedUserInfo);
      setUserInfo(storedUserInfo);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    console.log('Component mounted, initializing...');
    fetchUserData();
    initializeEthers();
  }, []);

  const handleSwipeLeft = (item) => {
    // const profile = cardData[item - 1];
    // console.log('Swiped left on profile:', {
    //   username: profile.text,
    //   beauty: profile.beauty,
    //   wealth: profile.wealth
    // });
  };

  const handleSwipeRight = async (item) => {
    if (!isInitialized || isProcessingSwipe) {
      console.log('Cannot process swipe: ', !isInitialized ? 'blockchain not initialized' : 'previous swipe in progress');
      return;
    }

    if(item > 0 ){
    const profile = cardData[item - 1];
    console.log('Processing right swipe for profile:', {
      username: profile.text,
      beauty: profile.beauty,
      wealth: profile.wealth
    });

    setIsProcessingSwipe(true);

    try {
      console.log('Initiating contract interaction to like profile:', profile.text);
      
      const tx = await contract.likeProfile(
        profile.text,
        { 
          gasLimit: 500000,
        }
      );
      
      console.log('Transaction submitted:', tx.hash);
      
      const receipt = await tx.wait();
      console.log(tx);
      console.log('Transaction confirmed:', {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status
      });

      console.log('Successfully liked profile:', profile.text);

      const tx2=await contract.isMatch('0x9629d2b146F44b124B0794649DDf69662B7a306D','0xc380c0cE9c8d317c35d64765E39E74524ea8f1aa')
      console.log("Is they a match: ",tx2);

    } catch (error) {
      console.error('Failed to like profile:', {
        profile: profile.text,
        error: error.message
      });
    } finally {
      setIsProcessingSwipe(false);
    }
  }

  };

  return (
    <View style={styles.container}>
      {!isInitialized && (
        <Text style={styles.warning}>Initializing blockchain connection...</Text>
      )}
      <TinderCard
        data={cardData}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9e587',
  },
  warning: {
    color: 'orange',
    textAlign: 'center',
    padding: 10,
  }
});

export default SwipeScreen;