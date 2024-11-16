import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';

const movements = [
  { id: 'front', text: 'Look straight at the camera' },
  { id: 'up', text: 'Tilt your head up' },
  { id: 'down', text: 'Tilt your head down' },
  { id: 'left', text: 'Turn your head left' },
  { id: 'right', text: 'Turn your head right' },
];

const MOVEMENT_DURATION = 3000; // 3 seconds per movement
const FADE_DURATION = 300; // 0.3 seconds for fade

const KYCScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentMovementIndex, setCurrentMovementIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle movement transitions
  useEffect(() => {
    if (!isRecording || isCompleted) return;

    const progress = ((currentMovementIndex + 1) * 100) / movements.length;

    // Reset fade animation
    fadeAnim.setValue(0);

    // Fade in text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();

    // Animate progress bar
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: MOVEMENT_DURATION,
      useNativeDriver: false,
    }).start();

    // Set up timer for next movement
    timerRef.current = setTimeout(() => {
      if (currentMovementIndex < movements.length - 1) {
        setCurrentMovementIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
        finishVerification();
      }
    }, MOVEMENT_DURATION);

    // Cleanup timer when movement changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentMovementIndex, isRecording, isCompleted]);

  const startVerification = () => {
    progressAnimation.setValue(0);
    setIsRecording(true);
    setCurrentMovementIndex(0);
    setIsCompleted(false);
  };

  const resetVerification = () => {
    progressAnimation.setValue(0);
    setIsRecording(false);
    setIsCompleted(false);
    setCurrentMovementIndex(0);
  };

  const finishVerification = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        // Example API call
        const response = await fetch('YOUR_KYC_API_ENDPOINT', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: photo.base64,
          }),
        });
        const data = await response.json();
        console.log('KYC Verification Response:', data);
      } catch (error) {
        console.error('KYC Verification Error:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

const doneVerification = () =>{
    router.push('/(profile)')
}


  // Render functions remain the same as before
  const renderContent = () => {
    if (!isRecording) {
      return (
        <TouchableOpacity
          style={styles.startButton}
          onPress={startVerification}
        >
          <MaterialIcons name="camera" size={32} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Verification</Text>
        </TouchableOpacity>
      );
    }

    if (isCompleted) {
      return (
        <View style={styles.completedContainer}>
          <MaterialIcons style={styles.icons} name="check-circle" size={64} color="#4CAF50" />
          <Text style={styles.completedText}>
            {isProcessing ? 'Processing...' : '                           '}
          </Text>
          <TouchableOpacity
            style={[styles.startButton, { marginTop: 20 }]}
            onPress={doneVerification}
          >
            <MaterialIcons name="arrow-forward" size={32} color="#000000" />
            <Text style={styles.startButtonText}>Let's find matches</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <Animated.View 
        style={[
          styles.instructionContainer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.instructionText}>
          {movements[currentMovementIndex].text}
        </Text>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnimation.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </Animated.View>
    );
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }
  if (hasPermission === false) {
    return <Text style={styles.errorText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={'front'}
      >
        <View style={styles.overlay}>
          <View style={styles.guideBox} />
          {renderContent()}
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
    icons:{
marginBottom: 30,
    },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 140,
    position: 'absolute',
    top: '20%',
  },
  startButton: {
    backgroundColor: '#FFE15AFF',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: '15%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButtonText: {
    color: '#000000FF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  instructionContainer: {
    position: 'absolute',
    bottom: '15%',
    width: '80%',
    alignItems: 'center',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFE15AFF',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
  },
  completedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 16,
  },
  completedText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default KYCScreen;