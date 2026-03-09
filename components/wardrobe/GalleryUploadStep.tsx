import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { C } from '@/constants/colors';

interface GalleryUploadStepProps {
  onImagesSelected: (images: { front?: string; back?: string; detail?: string }) => void;
  onCancel: () => void;
}

export default function GalleryUploadStep({ onImagesSelected, onCancel }: GalleryUploadStepProps) {
  const [loading, setLoading] = useState(false);

  const pickImages = async () => {
    try {
      setLoading(true);
      
      // Request permission if not already granted (handled by launchImageLibraryAsync mostly, but good practice)
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery access is needed to upload photos.');
        setLoading(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsMultipleSelection: true,
        selectionLimit: 3, // Limit to 3 images (front, back, detail)
        quality: 0.8,
      });

      if (!result.canceled) {
        const validImages: string[] = [];
        
        for (const asset of result.assets) {
           // Check size (approximate) - asset.fileSize is in bytes
           if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
             Alert.alert('File too large', 'Please select images under 10MB.');
             continue;
           }
           validImages.push(asset.uri);
        }

        if (validImages.length > 0) {
            // Assign to front, back, detail in order
            const images: { front?: string; back?: string; detail?: string } = {};
            if (validImages[0]) images.front = validImages[0];
            if (validImages[1]) images.back = validImages[1];
            if (validImages[2]) images.detail = validImages[2];
            
            // Simulate processing delay for better UX
            setTimeout(() => {
                onImagesSelected(images);
                setLoading(false);
            }, 800);
            return;
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to pick images.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.title}>Upload Photos</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
            <Ionicons name="images-outline" size={80} color={C.primary} />
        </View>
        <Text style={styles.description}>
            Select up to 3 photos from your gallery.
            Supports JPEG, PNG, HEIC (max 10MB).
        </Text>

        {loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={C.accent} />
                <Text style={styles.loadingText}>Processing images...</Text>
            </View>
        ) : (
            <Pressable onPress={pickImages} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
            </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  closeButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: '600', color: C.primary },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  iconContainer: { marginBottom: 20 },
  description: { textAlign: 'center', color: C.textSecondary, marginBottom: 40, lineHeight: 24, fontSize: 16 },
  uploadButton: { backgroundColor: C.primary, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center' },
  uploadButtonText: { color: C.background, fontSize: 16, fontWeight: '600' },
  loadingContainer: { alignItems: 'center', gap: 10 },
  loadingText: { color: C.textSecondary, fontSize: 14 }
});
