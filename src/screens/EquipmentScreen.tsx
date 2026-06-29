import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Equipment'>;

interface EqItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const QUICK = [
  { id: 'none', label: 'No Equipment' },
  { id: 'large_gym', label: 'Large Gym' },
  { id: 'small_gym', label: 'Small Gym' },
];

function Ic({ name, size = 20 }: { name: string; size?: number }) {
  return <MaterialCommunityIcons name={name as any} size={size} color="#fff" />;
}

const EQUIPMENT: EqItem[] = [
  { id: 'barbell', label: 'Barbell', icon: <Ic name="barbell" /> },
  { id: 'dumbbell', label: 'Dumbbell', icon: <Ic name="dumbbell" /> },
  { id: 'kettlebell', label: 'Kettlebell', icon: <Ic name="kettlebell" /> },
  { id: 'bench', label: 'Bench', icon: <Ic name="weight-lifter" /> },
  { id: 'pull_bar', label: 'Pull-up Bar', icon: <Ic name="human-greeting" /> },
  { id: 'cables', label: 'Cables', icon: <Ic name="cable" /> },
  { id: 'resistance_bands', label: 'Resistance Bands', icon: <Ic name="infinity" /> },
  { id: 'treadmill', label: 'Treadmill', icon: <Ic name="run" /> },
  { id: 'stationary_bike', label: 'Stationary Bike', icon: <Ic name="bike" /> },
  { id: 'rowing', label: 'Rowing Machine', icon: <Ic name="rowing" /> },
  { id: 'smith_machine', label: 'Smith Machine', icon: <Ic name="weight-lifter" /> },
  { id: 'leg_press', label: 'Leg Press Machine', icon: <Ic name="seat" /> },
  { id: 'lat_pulldown', label: 'Lat Pulldown', icon: <Ic name="arrow-down-bold-box-outline" /> },
  { id: 'chest_press', label: 'Chest Press Machine', icon: <Ic name="arm-flex" /> },
  { id: 'shoulder_press', label: 'Shoulder Press Machine', icon: <Ic name="human-male-height" /> },
  { id: 'hip_thrust', label: 'Hip Thrust Machine', icon: <Ic name="human-male" /> },
  { id: 'incline_bench', label: 'Incline Bench', icon: <Ic name="weight-lifter" /> },
  { id: 'calf_raise', label: 'Calf Raise Machine', icon: <Ic name="shoe-print" /> },
  { id: 'battle_ropes', label: 'Battle Ropes', icon: <Ic name="waves" /> },
  { id: 'jump_rope', label: 'Jump Rope', icon: <Ic name="circle-double" /> },
  { id: 'medicine_ball', label: 'Medicine Ball', icon: <Ic name="basketball" /> },
  { id: 'foam_roller', label: 'Foam Roller', icon: <Ic name="circle-outline" /> },
  { id: 'yoga_mat', label: 'Yoga Mat', icon: <Ic name="yoga" /> },
  { id: 'trx', label: 'TRX / Suspension', icon: <Ic name="human-greeting" /> },
];

export default function EquipmentScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, update } = useProfile();
  const [selected, setSelected] = useState<string[]>(profile.equipment ?? []);

  const toggle = (id: string) => {
    const quick = ['none', 'large_gym', 'small_gym'];
    if (quick.includes(id)) {
      // Auto-select relevant equipment
      if (id === 'none') {
        setSelected(['none']);
      } else if (id === 'large_gym') {
        setSelected(['barbell', 'dumbbell', 'bench', 'cables', 'treadmill', 'stationary_bike',
          'rowing', 'smith_machine', 'leg_press', 'lat_pulldown', 'chest_press', 'shoulder_press',
          'hip_thrust', 'incline_bench', 'calf_raise', 'pull_bar', 'kettlebell']);
      } else {
        setSelected(['barbell', 'dumbbell', 'bench', 'cables', 'pull_bar', 'kettlebell', 'lat_pulldown']);
      }
      return;
    }
    setSelected((prev) => {
      const without = prev.filter((x) => !['none', 'large_gym', 'small_gym'].includes(x) || x !== 'none');
      return without.includes(id) ? without.filter((x) => x !== id) : [...without, id];
    });
  };

  const handleContinue = () => {
    update({ equipment: selected });
    navigation.navigate('PlanGenerating');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>MY PROFILE</Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Your plan is 77% personalized</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '77%' }]} />
        </View>
      </View>

      <Text style={styles.title}>Which equipment do you have access to?</Text>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick select */}
        <View style={styles.quickRow}>
          {QUICK.map((q) => {
            const sel = selected.includes(q.id) ||
              (q.id === 'large_gym' && selected.length > 8) ||
              (q.id === 'small_gym' && selected.length >= 5 && selected.length <= 8);
            return (
              <TouchableOpacity
                key={q.id}
                style={[styles.quickBtn, sel && styles.quickBtnSelected]}
                onPress={() => toggle(q.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.quickBtnText, sel && styles.quickBtnTextSelected]}>
                  {q.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Equipment grid */}
        <View style={styles.grid}>
          {EQUIPMENT.map((eq) => {
            const sel = selected.includes(eq.id);
            return (
              <TouchableOpacity
                key={eq.id}
                style={[styles.gridItem, sel && styles.gridItemSelected]}
                onPress={() => toggle(eq.id)}
                activeOpacity={0.8}
              >
                {sel && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={11} color="#fff" />
                  </View>
                )}
                <View style={[styles.gridIcon, sel && styles.gridIconSelected]}>
                  {eq.icon}
                </View>
                <Text style={[styles.gridLabel, sel && styles.gridLabelSelected]} numberOfLines={2}>
                  {eq.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
  },
  backBtn: { width: 38, height: 38, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: colors.text, fontSize: 15, fontWeight: '600', letterSpacing: 1 },
  progressContainer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  progressText: { color: colors.textSecondary, fontSize: 13, marginBottom: 8 },
  progressTrack: { height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.accent, borderRadius: 3 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center', paddingHorizontal: 20, marginVertical: 16 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  quickBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.card, alignItems: 'center',
  },
  quickBtnSelected: { borderColor: colors.accent, backgroundColor: colors.cardSelected },
  quickBtnText: { color: colors.textSecondary, fontSize: 13, fontWeight: '600' },
  quickBtnTextSelected: { color: colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridItem: {
    width: '22%', aspectRatio: 0.85,
    backgroundColor: colors.card, borderRadius: 12, borderWidth: 1.5,
    borderColor: 'transparent', alignItems: 'center', justifyContent: 'center',
    padding: 8, position: 'relative',
  },
  gridItemSelected: { borderColor: colors.accent, backgroundColor: colors.cardSelected },
  checkBadge: {
    position: 'absolute', top: 6, right: 6, width: 18, height: 18,
    borderRadius: 9, backgroundColor: colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  gridIcon: { marginBottom: 6, opacity: 0.6 },
  gridIconSelected: { opacity: 1 },
  gridLabel: { color: colors.textSecondary, fontSize: 11, textAlign: 'center', lineHeight: 15 },
  gridLabelSelected: { color: colors.text },
  footer: { paddingHorizontal: 20, paddingTop: 12 },
  continueBtn: { backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 17, alignItems: 'center' },
  continueBtnText: { color: colors.text, fontSize: 15, fontWeight: '700', letterSpacing: 1.5 },
});
