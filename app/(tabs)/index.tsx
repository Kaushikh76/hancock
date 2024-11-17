import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import AnimatedSpeedometer from '../../components/AnimatedSpeedometer';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ethers } from 'ethers';
import { ABI, CONTRACT_ADDRESS, SAPPHIRE_TESTNET } from '../configmatch';
import { wrap } from '@oasisprotocol/sapphire-paratime';
import axios from 'axios';

const ProfileScreen = () => {
  // Basic state management
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Blockchain-related state
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState('');
  const [profileMetrics, setProfileMetrics] = useState(null);
  const [balanceData, setBalanceData] = useState(null);



  // Safely parse JSON with error handling
  const safeJsonParse = (str) => {
    try {
      return str ? JSON.parse(str) : null;
    } catch (e) {
      console.error('JSON Parse Error:', e);
      return null;
    }
  };

  // Initialize ethers and fetch user data
  const initializeEthers = async () => {
    try {
      // Create a provider and wrap it with Sapphire
      const baseProvider = new ethers.JsonRpcProvider(SAPPHIRE_TESTNET.networkParams.rpcUrls[0]);
      const wrappedProvider = wrap(baseProvider);
      setProvider(wrappedProvider);
      
      const privateKey = await AsyncStorage.getItem('wallet_private_key');
      
      if (!privateKey) {
        throw new Error('Wallet setup required. Please import your private key.');
      }

      // Create wrapped wallet and contract
      const baseWallet = new ethers.Wallet(privateKey, wrappedProvider);
      const wrappedWallet = wrap(baseWallet);
      setWallet(wrappedWallet);
      setAddress(baseWallet.address);

      const wrappedContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wrappedWallet);
      setContract(wrappedContract);

      // Fetch profile metrics if username exists
      if (userInfo?.name) {
        const tx = await wrappedContract.getPublicProfileInfo(userInfo.name);
        setProfileMetrics(tx);
        console
      }
    } catch (error) {
      console.error('Blockchain initialization error:', error);
      setError(error.message);
    }
  };

  // Fetch wallet balance
  const fetchWalletBalance = async (address, apiKey) => {
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      throw new Error('Invalid Ethereum address format');
    }

    const config = {
      headers: { "Authorization": `Bearer ${apiKey}` },
      params: {
        "addresses": [address],
        "chain_id": "1" // Example chain ID
      }
    };

    try {
      const response = await axios.get('https://api.1inch.dev/portfolio/portfolio/v4/general/current_value', config);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        const storedUserInfo = await AsyncStorage.getItem('userinfo');
        const parsedUserInfo = safeJsonParse(storedUserInfo);
        
        if (!parsedUserInfo) {
          throw new Error('Failed to load user information');
        }

        setUserInfo(parsedUserInfo);
        await initializeEthers();

        if (address) {
          const balance = await fetchWalletBalance(address, 'Rk4INMKh2xRQ1R86JOedAvm4FKOCQ5H0');
          setBalanceData(balance);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.profileComponent}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.profileComponent}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  const randomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  return (
    <SafeAreaView style={styles.profileComponent}>
      <Text style={styles.headerText}>Profile</Text>
      
      <View style={styles.profileCard}>
        <View style={styles.profileImage}>
          {userInfo?.name ? (
            <SvgUri
              uri={`https://noun-api.com/beta/pfp?name=${userInfo.name}`}
              width="100%"
              height="100%"
            />
          ) : (
            <Text>No profile image available</Text>
          )}
        </View>
        
        <Text style={styles.name}>{userInfo?.name || 'Anonymous'}</Text>
        <Text style={styles.bio}>{userInfo?.Bio || 'No bio available'}</Text>
        
        <View style={styles.speedometerCard}>
          <AnimatedSpeedometer
            value={randomInt(0, 100)}
            label="Beauty"
            color="#D3D3D3FF"
          />
          <AnimatedSpeedometer
            value={randomInt(0, 100)}
            label="Wealth"
            color="#D3D3D3FF"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileComponent: {
    padding: 20,
    marginTop: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  profileCard: {
    borderWidth: 3,
    borderColor: 'black',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    width: '100%',
    maxWidth: 400,
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  bio: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  speedometerCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 25,
    paddingTop: 20,
  },
});

export default ProfileScreen;