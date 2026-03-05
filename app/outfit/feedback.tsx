import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { C } from '@/constants/colors';
import { useApp } from '@/context/AppContext';

const SCORES = [
  { val: 1, icon: 'sad-outline', label: 'Not for me', color: C.danger },
  { val: 2, icon: 'thumbs-down-outline', label: 'Didn\'t work', color: C.warning },
  { val: 3, icon: 'remove-circle-outline', label: 'It was okay', color: C.muted },
  { val: 4, icon: 'thumbs-up-outline', label: 'Liked it', color: C.success },
  { val: 5, icon: 'heart', label: 'Loved it', color: C.accent },
];

const WHAT_WORKED = ['The colours', 'The silhouette', 'The layers', 'The accessories', 'The comfort', 'The formality level'];
const WHAT_DIDNT = ['Colours felt off', 'Too casual', 'Too formal', 'Didn\'t suit the weather', 'Uncomfortable', 'Needed more variety'];

export default function OutfitFeedback() {
  const { outfitId } = useLocalSearchParams<{ outfitId?: string }>();
  const insets = useSafeAreaInsets();
  const { addFeedback } = useApp();
  const [score, setScore] = useState(0);
  const [worked, setWorked] = useState<string[]>([]);
  const [didnt, setDidnt] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const thumbScale = useSharedValue(1);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ scale: thumbScale.value }] }));

  function selectScore(val: number) {
    setScore(val);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    thumbScale.value = withSpring(1.3, { damping: 8 }, () => {
      thumbScale.value = withSpring(1);
    });
  }

  function toggle(list: string[], setList: (l: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  }

  function handleSubmit() {
    if (!score) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addFeedback({
      outfitId: outfitId || '',
      score,
      sentiment: SCORES.find(s => s.val === score)?.label || '',
      whatWorked: worked,
      whatDidnt: didnt,
    });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={56} color={C.success} />
        </View>
        <Text style={styles.successTitle}>Feedback saved</Text>
        <Text style={styles.successSub}>Your input helps us refine future outfit suggestions for you.</Text>
        <Pressable style={styles.doneBtn} onPress={() => router.back()}>
          <Text style={styles.doneBtnText}>Done</Text>
        </Pressable>
      </View>
    );
  }

  const selectedScore = SCORES.find(s => s.val === score);

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="close" size={24} color={C.primary} />
        </Pressable>
        <Text style={styles.headerTitle}>Rate this look</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 40) }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.prompt}>How did today's outfit feel?</Text>

        <View style={styles.scoreRow}>
          {SCORES.map(s => (
            <Pressable
              key={s.val}
              onPress={() => selectScore(s.val)}
              style={[styles.scorePill, score === s.val && { borderColor: s.color, backgroundColor: s.color + '18' }]}
            >
              <Ionicons name={s.icon as any} size={28} color={score === s.val ? s.color : C.muted} />
            </Pressable>
          ))}
        </View>

        {selectedScore && (
          <Animated.View style={[styles.scoreLabelWrap, thumbStyle]}>
            <Text style={[styles.scoreLabel, { color: selectedScore.color }]}>{selectedScore.label}</Text>
          </Animated.View>
        )}

        {score >= 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What worked well?</Text>
            <View style={styles.chips}>
              {WHAT_WORKED.map(w => (
                <Pressable
                  key={w}
                  onPress={() => toggle(worked, setWorked, w)}
                  style={[styles.chip, worked.includes(w) && styles.chipActive]}
                >
                  <Text style={[styles.chipText, worked.includes(w) && styles.chipTextActive]}>{w}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {score <= 3 && score > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What could be improved?</Text>
            <View style={styles.chips}>
              {WHAT_DIDNT.map(w => (
                <Pressable
                  key={w}
                  onPress={() => toggle(didnt, setDidnt, w)}
                  style={[styles.chip, didnt.includes(w) && styles.chipDanger]}
                >
                  <Text style={[styles.chipText, didnt.includes(w) && { color: C.danger }]}>{w}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Pressable
          style={[styles.submitBtn, !score && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!score}
        >
          <Text style={styles.submitBtnText}>Submit feedback</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  successContainer: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 40 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: C.successLight, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: 'Inter_700Bold', fontSize: 26, color: C.primary, textAlign: 'center' },
  successSub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.textSecondary, textAlign: 'center', lineHeight: 22 },
  doneBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 48, marginTop: 8 },
  doneBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.primary },
  scroll: { paddingHorizontal: 24, paddingTop: 24, gap: 28 },
  prompt: { fontFamily: 'Inter_700Bold', fontSize: 24, color: C.primary, lineHeight: 32 },
  scoreRow: { flexDirection: 'row', gap: 10 },
  scorePill: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderWidth: 1.5, borderColor: C.border, borderRadius: 14, backgroundColor: C.white },
  scoreLabelWrap: { alignItems: 'center' },
  scoreLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
  section: { gap: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.primary },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1.5, borderColor: C.border, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: C.white },
  chipActive: { borderColor: C.success, backgroundColor: C.successLight },
  chipDanger: { borderColor: C.danger, backgroundColor: C.dangerLight },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.secondary },
  chipTextActive: { color: C.success },
  submitBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#FFF' },
});
