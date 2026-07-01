import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { useHistory, WeightLog } from '../context/WorkoutHistoryContext';
import { colors } from '../theme/colors';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const GOAL_LABEL: Record<string, string> = {
  lose_weight: 'Lose Weight',
  gain_muscle: 'Gain Muscle',
  increase_strength: 'Increase Strength',
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  regular: 'Regular',
  athlete: 'Athlete',
};

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <MaterialCommunityIcons name={icon as any} size={20} color={colors.accent} style={styles.infoIcon} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, { color }]}>{value}</Text>
      <Text style={styles.statBoxLabel}>{label}</Text>
    </View>
  );
}

function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: colors.amber };
  if (bmi < 25) return { label: 'Normal', color: colors.success };
  if (bmi < 30) return { label: 'Overweight', color: colors.amber };
  return { label: 'Obese', color: colors.danger };
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { profile, update } = useProfile();
  const { workouts, weights, streak, addWeight } = useHistory();

  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(profile.currentWeightUnit);

  const bmi = useMemo(() => {
    const w = profile.currentWeightUnit === 'kg'
      ? profile.currentWeightValue
      : profile.currentWeightValue / 2.205;
    const h = profile.heightUnit === 'cm'
      ? profile.heightValue / 100
      : profile.heightValue * 0.3048;
    if (h === 0) return 0;
    return Math.round((w / (h * h)) * 10) / 10;
  }, [profile]);

  const { label: bmiLabel, color: bmiColor } = bmiCategory(bmi);

  const heightDisplay = profile.heightUnit === 'cm'
    ? `${profile.heightValue} cm`
    : `${profile.heightValue} ft`;

  const weightDisplay = `${profile.currentWeightValue} ${profile.currentWeightUnit}`;
  const targetDisplay = `${profile.targetWeightValue} ${profile.targetWeightUnit}`;

  const weightDiff = useMemo(() => {
    const curr = profile.currentWeightUnit === 'kg'
      ? profile.currentWeightValue
      : profile.currentWeightValue / 2.205;
    const target = profile.targetWeightUnit === 'kg'
      ? profile.targetWeightValue
      : profile.targetWeightValue / 2.205;
    return Math.round((target - curr) * 10) / 10;
  }, [profile]);

  const totalMinutes = workouts.reduce((s, w) => s + Math.round(w.durationSeconds / 60), 0);
  const totalVolume = workouts.reduce((s, w) => s + w.totalVolume, 0);

  const todayDate = new Date().toISOString().slice(0, 10);
  const loggedToday = weights.some((w) => w.date === todayDate);

  const handleLogWeight = () => {
    const val = parseFloat(weightInput);
    if (!val || val <= 0 || val > 500) {
      Alert.alert('Invalid weight', 'Please enter a valid weight.');
      return;
    }
    const kg = weightUnit === 'kg' ? val : val / 2.205;
    const log: WeightLog = { date: todayDate, weightKg: Math.round(kg * 10) / 10 };
    addWeight(log);
    // Also update current profile weight
    update({ currentWeightValue: val, currentWeightUnit: weightUnit });
    setWeightInput('');
    setWeightModalVisible(false);
  };

  const handleEditProfile = () => {
    Alert.alert(
      'Reset Profile?',
      'This will restart the onboarding flow so you can update your information.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            update({ onboardingComplete: false });
            navigation.navigate('Gender');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Avatar + name */}
        <LinearGradient colors={['#1A2D55', '#162030']} style={styles.heroCard}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name={profile.gender === 'female' ? 'human-female' : 'human-male'}
              size={48}
              color={colors.accent}
            />
          </View>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>Your Profile</Text>
            <Text style={styles.heroSub}>
              {LEVEL_LABEL[profile.fitnessLevel ?? ''] ?? 'Athlete'} · {GOAL_LABEL[profile.goal ?? ''] ?? 'Fitness'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={20} color={colors.accent} />
          </TouchableOpacity>
        </LinearGradient>

        {/* Lifetime stats */}
        <Text style={styles.sectionTitle}>Lifetime Stats</Text>
        <View style={styles.statsRow}>
          <StatBox label="Sessions" value={workouts.length.toString()} color={colors.accent} />
          <StatBox label="Streak" value={`${streak}d`} color={colors.amber} />
          <StatBox
            label="Time"
            value={totalMinutes > 59 ? `${Math.round(totalMinutes / 60)}h` : `${totalMinutes}m`}
            color={colors.teal}
          />
          <StatBox
            label="Volume"
            value={totalVolume > 999 ? `${(totalVolume / 1000).toFixed(1)}t` : `${totalVolume}kg`}
            color={colors.purple}
          />
        </View>

        {/* BMI card */}
        <Text style={styles.sectionTitle}>Body Metrics</Text>
        <View style={styles.bmiCard}>
          <View style={styles.bmiLeft}>
            <Text style={[styles.bmiValue, { color: bmiColor }]}>{bmi || '—'}</Text>
            <Text style={styles.bmiLabel}>BMI</Text>
          </View>
          <View style={styles.bmiDivider} />
          <View style={styles.bmiRight}>
            <View style={[styles.bmiTag, { backgroundColor: `${bmiColor}20` }]}>
              <Text style={[styles.bmiTagText, { color: bmiColor }]}>{bmiLabel}</Text>
            </View>
            <Text style={styles.bmiScale}>Healthy range: 18.5 – 24.9</Text>
          </View>
        </View>

        {/* Body info */}
        <View style={styles.infoCard}>
          <InfoRow icon="human-male-height" label="Height" value={heightDisplay} />
          <View style={styles.divider} />
          <InfoRow icon="scale" label="Current weight" value={weightDisplay} />
          <View style={styles.divider} />
          <InfoRow icon="flag-outline" label="Target weight" value={targetDisplay} />
          <View style={styles.divider} />
          <InfoRow
            icon={weightDiff < 0 ? 'trending-down' : weightDiff > 0 ? 'trending-up' : 'check-circle-outline'}
            label="To goal"
            value={`${weightDiff > 0 ? '+' : ''}${weightDiff} kg`}
          />
        </View>

        {/* Log weight button */}
        <TouchableOpacity
          style={[styles.logWeightBtn, loggedToday && styles.logWeightBtnDone]}
          onPress={() => setWeightModalVisible(true)}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name={loggedToday ? 'check-circle-outline' : 'scale-balance'}
            size={20}
            color={loggedToday ? colors.success : colors.accent}
          />
          <Text style={[styles.logWeightText, loggedToday && { color: colors.success }]}>
            {loggedToday ? 'Weight logged today ✓' : 'Log Today\'s Weight'}
          </Text>
          <Text style={styles.logWeightCount}>{weights.length} entries</Text>
        </TouchableOpacity>

        {/* Plan info */}
        <Text style={styles.sectionTitle}>Training Plan</Text>
        <View style={styles.infoCard}>
          <InfoRow icon="calendar-week" label="Training days" value={`${profile.trainingDays ?? 3} days/week`} />
          <View style={styles.divider} />
          <InfoRow icon="clock-outline" label="Session length" value={profile.workoutDuration ?? '45 min'} />
          <View style={styles.divider} />
          <InfoRow icon="home-outline" label="Location" value={profile.workoutLocation === 'home' ? 'Home' : 'Gym'} />
          <View style={styles.divider} />
          <InfoRow icon="food-apple-outline" label="Diet style" value={profile.dietStyle ?? 'Not set'} />
        </View>

        {/* Edit profile button */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleEditProfile} activeOpacity={0.85}>
          <Ionicons name="refresh-outline" size={18} color={colors.text} />
          <Text style={styles.resetBtnText}>Update Profile & Goals</Text>
        </TouchableOpacity>

        <Text style={styles.version}>FitEasy v1.0</Text>
      </ScrollView>

      {/* Weight logging modal */}
      <Modal visible={weightModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Log Weight</Text>
              <TouchableOpacity onPress={() => setWeightModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDate}>{todayDate}</Text>

            {/* Unit selector */}
            <View style={styles.unitRow}>
              {(['kg', 'lbs'] as const).map((u) => (
                <TouchableOpacity
                  key={u}
                  style={[styles.unitBtn, weightUnit === u && styles.unitBtnActive]}
                  onPress={() => setWeightUnit(u)}
                >
                  <Text style={[styles.unitBtnText, weightUnit === u && styles.unitBtnTextActive]}>{u}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Weight input */}
            <View style={styles.weightInputRow}>
              <TextInput
                style={styles.weightInput}
                value={weightInput}
                onChangeText={setWeightInput}
                keyboardType="decimal-pad"
                placeholder={`e.g. ${profile.currentWeightValue}`}
                placeholderTextColor={colors.textMuted}
                autoFocus
                maxLength={6}
              />
              <Text style={styles.weightUnitLabel}>{weightUnit}</Text>
            </View>

            <TouchableOpacity
              style={[styles.saveWeightBtn, !weightInput && styles.saveWeightBtnDisabled]}
              onPress={handleLogWeight}
              activeOpacity={0.85}
            >
              <Text style={styles.saveWeightBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },

  heroCard: {
    borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center',
    gap: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(74,124,247,0.3)',
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(74,124,247,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  heroInfo: { flex: 1 },
  heroName: { color: colors.text, fontSize: 20, fontWeight: '800' },
  heroSub: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  editBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(74,124,247,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },

  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginBottom: 12 },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statBox: {
    flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  statBoxValue: { fontSize: 20, fontWeight: '800' },
  statBoxLabel: { color: colors.textMuted, fontSize: 10, marginTop: 2 },

  bmiCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border, marginBottom: 24,
  },
  bmiLeft: { alignItems: 'center', width: 80 },
  bmiValue: { fontSize: 36, fontWeight: '800' },
  bmiLabel: { color: colors.textSecondary, fontSize: 12 },
  bmiDivider: { width: 1, height: 48, backgroundColor: colors.border, marginHorizontal: 16 },
  bmiRight: { flex: 1, gap: 6 },
  bmiTag: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  bmiTagText: { fontSize: 13, fontWeight: '700' },
  bmiScale: { color: colors.textMuted, fontSize: 12 },

  infoCard: {
    backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: 'hidden',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  infoIcon: { marginRight: 12 },
  infoLabel: { flex: 1, color: colors.textSecondary, fontSize: 14 },
  infoValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 46 },

  logWeightBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(74,124,247,0.1)', borderRadius: 14, padding: 16,
    borderWidth: 1.5, borderColor: colors.accent, marginBottom: 24,
  },
  logWeightBtnDone: {
    backgroundColor: 'rgba(34,197,94,0.08)', borderColor: colors.success,
  },
  logWeightText: { flex: 1, color: colors.accent, fontSize: 14, fontWeight: '600' },
  logWeightCount: { color: colors.textMuted, fontSize: 12 },

  resetBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1.5, borderColor: colors.border, borderRadius: 14,
    paddingVertical: 14, marginBottom: 20,
  },
  resetBtnText: { color: colors.text, fontSize: 14, fontWeight: '600' },

  version: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },

  // Modal styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#131D2E', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40, borderTopWidth: 1, borderColor: colors.border,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: '700' },
  modalDate: { color: colors.textMuted, fontSize: 13, marginBottom: 20 },

  unitRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  unitBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.border, alignItems: 'center',
  },
  unitBtnActive: { borderColor: colors.accent, backgroundColor: 'rgba(74,124,247,0.1)' },
  unitBtnText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  unitBtnTextActive: { color: colors.accent },

  weightInputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 16,
    marginBottom: 20, borderWidth: 1, borderColor: colors.border,
  },
  weightInput: {
    flex: 1, color: colors.text, fontSize: 32, fontWeight: '700',
    paddingVertical: 16, textAlign: 'center',
  },
  weightUnitLabel: { color: colors.textSecondary, fontSize: 18, fontWeight: '600' },

  saveWeightBtn: {
    backgroundColor: colors.accent, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
  },
  saveWeightBtnDisabled: { backgroundColor: colors.border },
  saveWeightBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
