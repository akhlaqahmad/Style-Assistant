import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';

interface PhotoCaptureStepProps {
  onPhotosCaptured: (photos: { front: string; back: string; detail: string }) => void;
  onCancel: () => void;
  initialPhotos?: { front?: string; back?: string; detail?: string };
}

type CaptureStage = 'front' | 'back' | 'detail';

export default function PhotoCaptureStep({ onPhotosCaptured, onCancel, initialPhotos }: PhotoCaptureStepProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [stage, setStage] = useState<CaptureStage>('front');
  const [photos, setPhotos] = useState<{ front?: string; back?: string; detail?: string }>(initialPhotos || {});
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        if (photo) {
          const newPhotos = { ...photos, [stage]: photo.uri };
          setPhotos(newPhotos);
          
          // Auto-advance logic only if not reviewing
          if (!photos.front && stage === 'front') {
            setStage('back');
          } else if (!photos.back && stage === 'back') {
            setStage('detail');
          }
        }
      } catch (e) {
        console.error('Failed to take picture', e);
      }
    }
  };

  const retake = () => {
    const newPhotos = { ...photos };
    delete newPhotos[stage as keyof typeof photos];
    setPhotos(newPhotos);
  };

  const confirmAndContinue = () => {
    if (stage === 'front') setStage('back');
    else if (stage === 'back') setStage('detail');
    else if (photos.front && photos.back && photos.detail) {
      onPhotosCaptured(photos as { front: string; back: string; detail: string });
    }
  };

  const getInstruction = () => {
    switch (stage) {
      case 'front': return 'Capture the FRONT of the garment';
      case 'back': return 'Capture the BACK of the garment';
      case 'detail': return 'Capture a close-up DETAIL (texture/label)';
    }
  };

  const getOverlay = () => {
    // If photo exists, show nothing or minimal overlay?
    // Actually if photo exists we are showing the Image component, so overlay might be redundant or needed for alignment check.
    // But let's keep it simple: if photo exists, no overlay needed on top of image unless for context.
    if (photos[stage]) return null;

    // Simple overlay guides
    if (stage === 'detail') {
      return (
        <View style={styles.detailOverlay}>
          <View style={styles.detailBox} />
          <Text style={styles.overlayText}>Center details here</Text>
        </View>
      );
    }
    return (
      <View style={styles.garmentOverlay}>
        <View style={styles.garmentOutline} />
        <Text style={styles.overlayText}>Fit garment in frame</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {photos[stage] ? (
        <Image source={{ uri: photos[stage] }} style={styles.camera} resizeMode="contain" />
      ) : (
        <CameraView style={styles.camera} facing={cameraType} ref={cameraRef} />
      )}
      
      <View style={styles.overlayContainer}>
        <View style={styles.header}>
          <Pressable onPress={onCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
          <View style={styles.progressContainer}>
              <Pressable onPress={() => setStage('front')}>
                <View style={[styles.progressDot, stage === 'front' && styles.activeDot, photos.front && styles.completedDot]} />
              </Pressable>
              <Pressable onPress={() => setStage('back')}>
                <View style={[styles.progressDot, stage === 'back' && styles.activeDot, photos.back && styles.completedDot]} />
              </Pressable>
              <Pressable onPress={() => setStage('detail')}>
                <View style={[styles.progressDot, stage === 'detail' && styles.activeDot, photos.detail && styles.completedDot]} />
              </Pressable>
          </View>
          {!photos[stage] && (
            <Pressable onPress={() => setCameraType(current => (current === 'back' ? 'front' : 'back'))} style={styles.flipButton}>
                <Ionicons name="camera-reverse" size={24} color="#FFF" />
            </Pressable>
          )}
          {photos[stage] && <View style={{ width: 44 }} />} 
        </View>
        
        <View style={styles.guideArea}>
          {getOverlay()}
        </View>

        <View style={styles.footer}>
          <Text style={styles.instructionText}>
            {photos[stage] ? 'Review photo' : getInstruction()}
          </Text>
          
          {photos[stage] ? (
            <View style={styles.reviewControls}>
                <Pressable onPress={retake} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>Retake</Text>
                </Pressable>
                <Pressable onPress={confirmAndContinue} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>
                        {stage === 'detail' && photos.front && photos.back ? 'Finish' : 'Next'}
                    </Text>
                </Pressable>
            </View>
          ) : (
            <Pressable onPress={takePicture} style={styles.captureButton}>
                <View style={styles.captureInner} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  permissionText: { textAlign: 'center', marginBottom: 20, color: C.primary },
  permissionButton: { backgroundColor: C.accent, padding: 12, borderRadius: 8 },
  permissionButtonText: { color: '#FFF', fontWeight: 'bold' },
  overlayContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', zIndex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60, alignItems: 'center' },
  closeButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  flipButton: { padding: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20 },
  progressContainer: { flexDirection: 'row', gap: 8 },
  progressDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.3)' },
  activeDot: { backgroundColor: '#FFF', transform: [{ scale: 1.2 }] },
  completedDot: { backgroundColor: C.success },
  guideArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  garmentOverlay: { alignItems: 'center', justifyContent: 'center', width: '80%', height: '70%', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', borderStyle: 'dashed', borderRadius: 20 },
  detailOverlay: { alignItems: 'center', justifyContent: 'center', width: 200, height: 200, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)', borderRadius: 10 },
  detailBox: { width: '100%', height: '100%' },
  garmentOutline: { width: '100%', height: '100%' },
  overlayText: { color: '#FFF', marginTop: 10, fontSize: 16, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 },
  footer: { padding: 30, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)' },
  instructionText: { color: '#FFF', fontSize: 18, fontWeight: '600', marginBottom: 20 },
  captureButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#000' },
  reviewControls: { flexDirection: 'row', gap: 20, width: '100%', justifyContent: 'center' },
  secondaryButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  secondaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  primaryButton: { paddingVertical: 12, paddingHorizontal: 32, borderRadius: 30, backgroundColor: C.accent },
  primaryButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
