import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Svg, { Rect, Ellipse, Line } from 'react-native-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

type Phase = 'front' | 'side';

function SilhouetteGuide({ phase }: { phase: Phase }) {
  const isFront = phase === 'front';
  return (
    <Svg width="200" height="380" viewBox="0 0 200 380" style={styles.silhouette}>
      <Ellipse cx={100} cy={40} rx={isFront ? 28 : 22} ry={32} stroke="rgba(193,123,88,0.5)" strokeWidth={1.5} fill="none" strokeDasharray="6,4" />
      <Line x1={100} y1={72} x2={100} y2={90} stroke="rgba(193,123,88,0.3)" strokeWidth={1} />
      <Rect x={isFront ? 55 : 65} y={90} width={isFront ? 90 : 70} height={110} rx={isFront ? 20 : 16} stroke="rgba(193,123,88,0.5)" strokeWidth={1.5} fill="none" strokeDasharray="6,4" />
      <Line x1={isFront ? 55 : 65} y1={200} x2={isFront ? 70 : 72} y2={340} stroke="rgba(193,123,88,0.3)" strokeWidth={1} />
      <Line x1={isFront ? 145 : 135} y1={200} x2={isFront ? 130 : 128} y2={340} stroke="rgba(193,123,88,0.3)" strokeWidth={1} />
    </Svg>
  );
}

function WebFallback() {
  const insets = useSafeAreaInsets();
  const { updateAvatarProfile } = useApp();

  function handleSkip() {
    updateAvatarProfile({ frontPhotoUri: '', sidePhotoUri: '' });
    router.push('/body-scan/result');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 67 }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Photo Capture</Text>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>2/3</Text>
        </View>
      </View>
      <View style={styles.webFallback}>
        <View style={styles.webIcon}>
          <Ionicons name="camera-outline" size={48} color={C.muted} />
        </View>
        <Text style={styles.webTitle}>Camera unavailable on web</Text>
        <Text style={styles.webSub}>Photo capture works best on a mobile device. You can skip this step and still generate your avatar from measurements alone.</Text>
        <Pressable style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipBtnText}>Skip and generate avatar</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFF" />
        </Pressable>
      </View>
    </View>
  );
}

function NativeCapture() {
  const insets = useSafeAreaInsets();
  const { updateAvatarProfile } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('front');
  const [frontUri, setFrontUri] = useState('');
  const [sideUri, setSideUri] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const frontUriRef = useRef('');

  async function handleCapture() {
    if (!cameraRef.current || capturing || !cameraReady) return;
    setCapturing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo) {
        if (phase === 'front') {
          frontUriRef.current = photo.uri;
          setFrontUri(photo.uri);
          setPhase('side');
        } else {
          setSideUri(photo.uri);
          updateAvatarProfile({ frontPhotoUri: frontUriRef.current, sidePhotoUri: photo.uri });
          router.push('/body-scan/result');
        }
      }
    } catch {
      Alert.alert('Capture failed', 'Could not take photo. Please try again.');
    }
    setCapturing(false);
  }

  function handleSkip() {
    updateAvatarProfile({ frontPhotoUri: '', sidePhotoUri: '' });
    router.push('/body-scan/result');
  }

  if (!permission?.granted) {
    const denied = permission && !permission.granted && !permission.canAskAgain;
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={C.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Photo Capture</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>2/3</Text>
          </View>
        </View>
        <View style={styles.permissionWrap}>
          <View style={styles.permIcon}>
            <Ionicons name="camera-outline" size={48} color={C.accent} />
          </View>
          <Text style={styles.permTitle}>{denied ? 'Camera access denied' : 'Camera access needed'}</Text>
          <Text style={styles.permSub}>
            {denied
              ? 'Camera permission was denied. Please enable it in your device settings, or skip this step.'
              : 'We need camera access to capture reference photos for your avatar.'}
          </Text>
          {!denied && (
            <Pressable style={styles.permBtn} onPress={requestPermission}>
              <Ionicons name="shield-checkmark-outline" size={18} color="#FFF" />
              <Text style={styles.permBtnText}>Grant access</Text>
            </Pressable>
          )}
          <Pressable style={styles.skipLink} onPress={handleSkip}>
            <Text style={styles.skipLinkText}>Skip photos</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.cameraWrap}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          onCameraReady={() => setCameraReady(true)}
        >
          <SilhouetteGuide phase={phase} />
        </CameraView>
      </View>

      <Animated.View entering={FadeInDown.duration(400)} style={[styles.controls, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.phaseRow}>
          <View style={[styles.phaseDot, phase === 'front' && styles.phaseDotActive]} />
          <Text style={styles.phaseLabel}>{phase === 'front' ? 'Front view' : 'Side view'}</Text>
          <View style={[styles.phaseDot, phase === 'side' && styles.phaseDotActive]} />
        </View>
        <Text style={styles.instruction}>
          {phase === 'front' ? 'Stand facing the camera, arms slightly away from body' : 'Turn 90 degrees to the right, stand naturally'}
        </Text>

        <View style={styles.btnRow}>
          <Pressable style={styles.skipLink} onPress={handleSkip}>
            <Text style={styles.skipLinkText}>Skip</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.captureBtn, { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.92 : 1 }] }]}
            onPress={handleCapture}
            disabled={capturing || !cameraReady}
          >
            <View style={[styles.captureBtnInner, !cameraReady && { opacity: 0.4 }]} />
          </Pressable>
          <View style={{ width: 40 }} />
        </View>
      </Animated.View>
    </View>
  );
}

export default function CaptureScreen() {
  if (Platform.OS === 'web') {
    return <WebFallback />;
  }
  return <NativeCapture />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  stepBadge: { backgroundColor: C.accentLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  stepText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.accent },
  cameraWrap: { flex: 1, overflow: 'hidden' },
  camera: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  silhouette: { position: 'absolute', alignSelf: 'center' },
  controls: { backgroundColor: C.background, paddingHorizontal: 24, paddingTop: 20, gap: 16, borderTopWidth: 1, borderTopColor: C.border },
  phaseRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  phaseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.border },
  phaseDotActive: { backgroundColor: C.accent, width: 10, height: 10, borderRadius: 5 },
  phaseLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: C.primary },
  instruction: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 20 },
  btnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  captureBtn: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: C.accent, alignItems: 'center', justifyContent: 'center' },
  captureBtnInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.accent },
  skipLink: { paddingVertical: 8, paddingHorizontal: 16 },
  skipLinkText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: C.muted },
  webFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  webIcon: { width: 88, height: 88, borderRadius: 28, backgroundColor: C.cardAlt, alignItems: 'center', justifyContent: 'center' },
  webTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: C.primary, textAlign: 'center' },
  webSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 20 },
  skipBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  skipBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  permissionWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 16 },
  permIcon: { width: 88, height: 88, borderRadius: 28, backgroundColor: C.accentLight, alignItems: 'center', justifyContent: 'center' },
  permTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, color: C.primary, textAlign: 'center' },
  permSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSecondary, textAlign: 'center', lineHeight: 20 },
  permBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  permBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
