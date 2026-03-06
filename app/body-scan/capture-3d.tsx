import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import Svg, { Rect, Ellipse, Line } from 'react-native-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

type Phase = 'front' | 'side';

function SilhouetteGuide({ phase }: { phase: Phase }) {
  const isFront = phase === 'front';
  return (
    <Svg width="100%" height="100%" viewBox="0 0 200 380" style={styles.silhouette}>
      <Ellipse cx={100} cy={40} rx={isFront ? 28 : 22} ry={32} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} fill="none" strokeDasharray="6,4" />
      <Line x1={100} y1={72} x2={100} y2={90} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      <Rect x={isFront ? 55 : 65} y={90} width={isFront ? 90 : 70} height={110} rx={isFront ? 20 : 16} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} fill="none" strokeDasharray="6,4" />
      <Line x1={isFront ? 55 : 65} y1={200} x2={isFront ? 70 : 72} y2={340} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      <Line x1={isFront ? 145 : 135} y1={200} x2={isFront ? 130 : 128} y2={340} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
    </Svg>
  );
}

export default function Capture3DScreen() {
  const insets = useSafeAreaInsets();
  const { updateAvatarProfile } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>('front');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      setScanProgress(0);
    }
  }, [scanning]);

  async function handleScan() {
    if (!cameraRef.current || scanning) return;
    
    setScanning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Simulate scanning duration
    setTimeout(async () => {
      try {
        const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
        setScanning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        if (phase === 'front') {
          setPhase('side');
        } else {
          router.push('/body-scan/processing');
        }
      } catch {
        setScanning(false);
        Alert.alert('Scan failed', 'Could not capture data. Please try again.');
      }
    }, 2000);
  }

  if (Platform.OS === 'web') {
    // Web fallback
     return (
        <View style={[styles.container, { paddingTop: insets.top + 67 }]}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="arrow-back" size={24} color={C.primary} />
            </Pressable>
            <Text style={styles.headerTitle}>3D Scan</Text>
          </View>
          <View style={styles.webFallback}>
            <Ionicons name="scan-outline" size={64} color={C.muted} />
            <Text style={styles.webTitle}>3D Scanning not available on web</Text>
            <Pressable style={styles.btn} onPress={() => router.push('/body-scan/processing')}>
              <Text style={styles.btnText}>Simulate Scan</Text>
            </Pressable>
          </View>
        </View>
     );
  }

  if (!permission?.granted) {
     return (
       <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
         <Text style={styles.permTitle}>Camera access needed for 3D Scan</Text>
         <Pressable style={styles.btn} onPress={requestPermission}>
           <Text style={styles.btnText}>Grant Access</Text>
         </Pressable>
       </View>
     );
  }

  return (
    <View style={[styles.container]}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="front"
      />
      <View style={[styles.overlay, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.headerOverlay}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color="#FFF" />
          </Pressable>
          <Text style={styles.overlayTitle}>{phase === 'front' ? 'Front Scan' : 'Side Scan'}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.guideContainer}>
          <SilhouetteGuide phase={phase} />
          {scanning && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.scanningOverlay}>
                <View style={styles.scanLine} />
                <Text style={styles.scanningText}>Scanning... {scanProgress}%</Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.controls}>
          <Text style={styles.instruction}>
            {phase === 'front' 
              ? 'Align your body within the frame' 
              : 'Turn 90° to your right'}
          </Text>
          
          <Pressable
            style={({ pressed }) => [styles.captureBtn, pressed && styles.captureBtnPressed, scanning && styles.captureBtnDisabled]}
            onPress={handleScan}
            disabled={scanning}
          >
            <View style={styles.captureBtnInner} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: C.primary },
  webFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  webTitle: { fontSize: 18, color: C.textSecondary },
  btn: { backgroundColor: C.accent, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  btnText: { color: '#FFF', fontWeight: '600', fontSize: 16 },
  permTitle: { fontSize: 18, marginBottom: 20, color: C.primary },
  
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' },
  headerOverlay: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  overlayTitle: { color: '#FFF', fontSize: 18, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 },
  
  guideContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  silhouette: { position: 'absolute', width: '100%', height: '100%' },
  
  scanningOverlay: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)' },
  scanningText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  scanLine: { width: '100%', height: 2, backgroundColor: C.accent, shadowColor: C.accent, shadowOpacity: 1, shadowRadius: 10 },

  controls: { alignItems: 'center', gap: 20 },
  instruction: { color: '#FFF', fontSize: 16, textAlign: 'center', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 2, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  captureBtn: { width: 80, height: 80, borderRadius: 40, borderWidth: 5, borderColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  captureBtnPressed: { opacity: 0.8, transform: [{ scale: 0.95 }] },
  captureBtnDisabled: { opacity: 0.5 },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.accent },
});
