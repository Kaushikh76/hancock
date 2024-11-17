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

import React, { useState, useEffect } from 'react';
import TinderCard from "../../components/SwipeCard";
import { StyleSheet, View, Text } from 'react-native';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI, SAPPHIRE_TESTNET } from './configmatch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wrap } from '@oasisprotocol/sapphire-paratime';
import SwipeFeedbackCard from '@/components/FeedbackCard';

const SwipeScreen = () => {
  const [userInfo, setUserInfo] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessingSwipe, setIsProcessingSwipe] = useState(false);
  const [cardDatas, setCardData] = useState([]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [lastSwipedProfile, setLastSwipedProfile] = useState(null);
  const [lastSwipeDirection, setLastSwipeDirection] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserData();
      await fetchUsersData();
    };
    initializeData();
  }, []);

  const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const fetchUsersData = async () => {
    try {
      const baseProvider = new ethers.JsonRpcProvider(SAPPHIRE_TESTNET.networkParams.rpcUrls[0]);
      const wrappedProvider = wrap(baseProvider);
      setProvider(wrappedProvider);
      
      const privateKey = await AsyncStorage.getItem('wallet_private_key');
      
      if (!privateKey) {
        console.log('Wallet Setup Required', 'Please set up your wallet first by importing your private key');
        return;
      }

      const baseWallet = new ethers.Wallet(privateKey, wrappedProvider);
      const wrappedWallet = wrap(baseWallet);
      setWallet(wrappedWallet);

      const wrappedContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wrappedWallet);
      setContract(wrappedContract);
      setIsInitialized(true);

      const numProfiles = await wrappedContract.getTotalProfiles();
      const arrayOfProfiles = await wrappedContract.getActiveProfiles(0, numProfiles);

      const profilePromises = arrayOfProfiles.map(async (profile, index) => {
        const profileInfo = await wrappedContract.getPublicProfileInfo(profile);
        const parsedUserInfo = userInfo ? JSON.parse(userInfo) : { name: 'default' };
        
        return {
          id: index + 1,
          text: profile,
          image: `https://noun-api.com/beta/pfp?name=${parsedUserInfo.name}`,
          beauty: randInt(0, 100).toString(),
          wealth: profileInfo.wealthMetric.toString().slice(0, 2),
        };
      });

      const profiles = await Promise.all(profilePromises);
      setCardData(profiles);
    } catch (error) {
      console.error('Error fetching users data:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const storedUserInfo = await AsyncStorage.getItem('userinfo');
      setUserInfo(storedUserInfo || '');
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSwipeLeft = async (item) => {
    if (!isInitialized || isProcessingSwipe) {
      console.log('Cannot process swipe: ', !isInitialized ? 'blockchain not initialized' : 'previous swipe in progress');
      return;
    }

    if (item <= 0 || item > cardDatas.length) return;

    const profile = cardDatas[item - 1];
    setLastSwipedProfile(profile);
    setLastSwipeDirection('left');
    setFeedbackVisible(true);
    setIsProcessingSwipe(true);

    try {
      const tx = await contract.unlikeProfile(profile.text, { gasLimit: 500000 });
      await tx.wait();
      console.log('Successfully disliked profile:', profile.text);
    } catch (error) {
      console.error('Failed to dislike profile:', error);
    } finally {
      setIsProcessingSwipe(false);
    }
  };

  const handleSwipeRight = async (item) => {
    if (!isInitialized || isProcessingSwipe) {
      console.log('Cannot process swipe: ', !isInitialized ? 'blockchain not initialized' : 'previous swipe in progress');
      return;
    }

    if (item <= 0 || item > cardDatas.length) return;

    const profile = cardDatas[item - 1];
    setLastSwipedProfile(profile);
    setLastSwipeDirection('right');
    setFeedbackVisible(true);
    setIsProcessingSwipe(true);

    try {
      const tx = await contract.likeProfile(profile.text, { gasLimit: 500000 });
      await tx.wait();
      console.log('Successfully liked profile:', profile.text);

      const isMatch = await contract.isMatch(
        '0x9629d2b146F44b124B0794649DDf69662B7a306D',
        '0xc380c0cE9c8d317c35d64765E39E74524ea8f1aa'
      );
      console.log("Is there a match:", isMatch);
    } catch (error) {
      console.error('Failed to like profile:', error);
    } finally {
      setIsProcessingSwipe(false);
    }
  };

  return (
    <View style={styles.container}>
      {cardDatas.length > 0 ? (
        <>
          {!isInitialized && (
            <Text style={styles.warning}>Initializing blockchain connection...</Text>
          )}
          <TinderCard
            data={cardDatas}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
          <SwipeFeedbackCard
            isVisible={feedbackVisible}
            onClose={() => setFeedbackVisible(false)}
            swipedProfile={lastSwipedProfile}
            swipeDirection={lastSwipeDirection}
          />
        </>
      ) : (
        <Text style={styles.warning}>No profiles found</Text>
      )}
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