import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import AnimatedSpeedometer from '../../components/AnimatedSpeedometer';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.profileComponent}>
          <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Profile</Text>

   
    <View style={styles.profileCard}>
      {/* Profile Image */}
      <View style={styles.profileImage}>
        <SvgUri
          uri="https://noun-api.com/beta/pfp?name=justinbenito"
          width="100%"
          height="100%"
        />
      </View>
      
      {/* Profile Name and Bio */}
      <Text style={styles.name}>Justin Benito</Text>
      <Text style={styles.bio}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ac sapien lectus.
      </Text>
      
      {/* Speedometers */}
      <View style={styles.speedometerCard}>
        <AnimatedSpeedometer
          value={45}
          label="Beauty"
          color="#D3D3D3FF"
        />
        <AnimatedSpeedometer
          value={90}
          label="Wealth"
          color="#D3D3D3FF"
        />
      </View>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  profileComponent:{
padding: 20,
marginTop: 20,
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