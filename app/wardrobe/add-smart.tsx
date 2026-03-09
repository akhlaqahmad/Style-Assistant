import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, Pressable, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';
import { useApp, WardrobeItem } from '@/context/AppContext';
import PhotoCaptureStep from '@/components/wardrobe/PhotoCaptureStep';
import GalleryUploadStep from '@/components/wardrobe/GalleryUploadStep';
import MeasurementProcessingStep from '@/components/wardrobe/MeasurementProcessingStep';
import DetailsStep from '@/components/wardrobe/DetailsStep';

type Step = 'landing' | 'gallery' | 'photos' | 'processing' | 'details';

export default function AddSmartWardrobeItem() {
  const insets = useSafeAreaInsets();
  const { addWardrobeItem } = useApp();
  const [step, setStep] = useState<Step>('landing');
  const [capturedPhotos, setCapturedPhotos] = useState<{ front?: string; back?: string; detail?: string } | null>(null);
  const [processedData, setProcessedData] = useState<any>(null);
  const [sessionItems, setSessionItems] = useState<any[]>([]);
  const [showSelection, setShowSelection] = useState(false);

  const handlePhotosCaptured = (photos: { front: string; back: string; detail: string }) => {
    setCapturedPhotos(photos);
    setStep('processing');
  };

  const handleGallerySelection = (photos: { front?: string; back?: string; detail?: string }) => {
      setCapturedPhotos(photos);
      setStep('photos');
  };

  const handleProcessingComplete = (data: any) => {
    setProcessedData({ ...data, images: capturedPhotos });
    setStep('details');
  };

  const handleSave = async (finalData: any) => {
    try {
      const newItem: Omit<WardrobeItem, 'id' | 'createdAt'> = {
        category: finalData.category || 'Tops',
        image: { uri: finalData.images.front }, // Main image
        images: finalData.images,
        measurements: finalData.measurements,
        colour: finalData.color?.name || 'Unknown',
        colourPalette: finalData.color?.palette,
        fabric: finalData.fabric,
        careInstructions: finalData.care,
        brand: finalData.brand || '',
        notes: finalData.notes || '',
        tag: 'keep',
        favourite: false,
        hidden: finalData.hidden || false,
      };
      
      addWardrobeItem(newItem);
      
      // Add to session items
      setSessionItems(prev => [...prev, { ...newItem, id: Date.now().toString() }]); 
      
      Alert.alert('Success', 'Garment added!', [
        { text: 'Add Another', onPress: () => {
            setStep('landing');
            setCapturedPhotos(null);
            setProcessedData(null);
            setShowSelection(false);
        }},
        { text: 'Done', onPress: () => router.back() }
      ]);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save garment.');
    }
  };

  const renderLanding = () => (
      <View style={styles.landingContainer}>
          <View style={styles.header}>
              <Pressable onPress={() => router.back()} style={styles.backBtn}>
                  <Ionicons name="arrow-back" size={24} color={C.primary} />
              </Pressable>
              <Text style={styles.title}>Add Garments</Text>
              <View style={{ width: 40 }} />
          </View>
          
          <ScrollView contentContainerStyle={styles.sessionList}>
              {sessionItems.length === 0 ? (
                  <View style={styles.emptySession}>
                      <Ionicons name="basket-outline" size={60} color={C.muted} />
                      <Text style={styles.emptyText}>No items added in this session yet.</Text>
                      <Text style={styles.emptySubText}>Add items to see them here.</Text>
                  </View>
              ) : (
                  <View style={styles.grid}>
                      {sessionItems.map((item, idx) => (
                          <View key={idx} style={styles.sessionItem}>
                              <Image source={item.image} style={styles.sessionImg} />
                              <View style={styles.checkBadge}>
                                  <Ionicons name="checkmark" size={12} color="#FFF" />
                              </View>
                          </View>
                      ))}
                  </View>
              )}
          </ScrollView>
          
          <View style={styles.footer}>
              {showSelection ? (
                  <View style={styles.selectionContainer}>
                      <Text style={styles.selectionTitle}>Choose input method</Text>
                      <View style={styles.selectionButtons}>
                          <Pressable style={styles.optionBtn} onPress={() => { setShowSelection(false); setStep('photos'); }}>
                              <View style={[styles.iconCircle, { backgroundColor: C.accentLight }]}>
                                  <Ionicons name="camera" size={24} color={C.accent} />
                              </View>
                              <Text style={styles.optionText}>Camera Scan</Text>
                              <Text style={styles.optionSub}>AR Guides</Text>
                          </Pressable>
                          <Pressable style={styles.optionBtn} onPress={() => { setShowSelection(false); setStep('gallery'); }}>
                              <View style={[styles.iconCircle, { backgroundColor: C.accentLight }]}>
                                  <Ionicons name="images" size={24} color={C.secondary} />
                              </View>
                              <Text style={styles.optionText}>Gallery Upload</Text>
                              <Text style={styles.optionSub}>Multi-select</Text>
                          </Pressable>
                      </View>
                      <Pressable style={styles.cancelSelection} onPress={() => setShowSelection(false)}>
                          <Text style={styles.cancelText}>Cancel</Text>
                      </Pressable>
                  </View>
              ) : (
                  <Pressable style={styles.addBtn} onPress={() => setShowSelection(true)}>
                      <Ionicons name="add-circle" size={24} color="#FFF" />
                      <Text style={styles.addBtnText}>Add New Garment</Text>
                  </Pressable>
              )}
          </View>
      </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {step === 'landing' && renderLanding()}
      
      {step === 'gallery' && (
          <GalleryUploadStep 
              onImagesSelected={handleGallerySelection}
              onCancel={() => setStep('landing')}
          />
      )}
      
      {step === 'photos' && (
        <PhotoCaptureStep 
          initialPhotos={capturedPhotos || undefined}
          onPhotosCaptured={handlePhotosCaptured} 
          onCancel={() => {
              setStep('landing');
              setCapturedPhotos(null);
          }} 
        />
      )}
      {step === 'processing' && (
        <MeasurementProcessingStep 
          onComplete={handleProcessingComplete} 
        />
      )}
      {step === 'details' && processedData && (
        <DetailsStep 
          initialData={processedData} 
          onSave={handleSave} 
          onBack={() => setStep('photos')} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  landingContainer: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backBtn: { padding: 8 },
  title: { fontSize: 20, fontWeight: '700', color: C.primary },
  sessionList: { padding: 20, flexGrow: 1 },
  emptySession: { alignItems: 'center', justifyContent: 'center', flex: 1, gap: 10, opacity: 0.6 },
  emptyText: { color: C.textSecondary, fontSize: 16, fontWeight: '600' },
  emptySubText: { color: C.textSecondary, fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sessionItem: { width: '30%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f0f0f0' },
  sessionImg: { width: '100%', height: '100%' },
  checkBadge: { position: 'absolute', top: 5, right: 5, backgroundColor: C.success, borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  footer: { padding: 20, paddingBottom: 40, backgroundColor: C.background, borderTopWidth: 1, borderColor: C.border },
  addBtn: { backgroundColor: C.primary, padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  addBtnText: { color: C.background, fontSize: 16, fontWeight: '600' },
  selectionContainer: { gap: 20 },
  selectionTitle: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 10, color: C.primary },
  selectionButtons: { flexDirection: 'row', gap: 15 },
  optionBtn: { flex: 1, padding: 20, backgroundColor: C.card, borderRadius: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: C.border },
  iconCircle: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 5 },
  optionText: { fontSize: 15, fontWeight: '600', color: C.primary },
  optionSub: { fontSize: 12, color: C.textSecondary, textAlign: 'center' },
  cancelSelection: { alignItems: 'center', padding: 10 },
  cancelText: { color: C.textSecondary, fontSize: 15 },
});
