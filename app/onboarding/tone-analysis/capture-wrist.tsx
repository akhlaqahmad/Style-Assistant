import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { C } from '@/constants/colors';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';

export default function CaptureWristScreen() {
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.message}>We need your permission to show the camera</ThemedText>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log('Wrist photo taken:', photo?.uri);
        router.push('/onboarding/tone-analysis/capture-card');
      } catch (error) {
        Alert.alert('Error', 'Failed to take photo');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.stepIndicator}>
              <ThemedText variant="caption" style={{ color: 'white' }}>Step 2 of 3</ThemedText>
            </View>
            <View style={{ width: 40 }} /> 
          </View>

          <View style={styles.instructionsContainer}>
             <View style={styles.guideFrame} />
             <ThemedText variant="headingM" style={styles.instructionText}>Inner wrist</ThemedText>
             <ThemedText variant="bodyS" style={styles.subText}>Show the veins on your inner wrist clearly.</ThemedText>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.iconButton}>
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <View style={styles.captureInner} />
            </TouchableOpacity>

            <View style={styles.iconButton} /> 
          </View>
          
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  message: {
    textAlign: 'center',
    color: C.text,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  stepIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  instructionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  guideFrame: {
    width: 280,
    height: 280,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 140, // Circle
    marginBottom: 24,
    borderStyle: 'dashed',
  },
  instructionText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  subText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    maxWidth: '80%',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
