import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useProfile } from '../context/ProfileContext';
import { generateWorkoutPlan, WorkoutDay } from '../utils/workoutGenerator';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width: W } = Dimensions.get('window');

const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { profile, update } = useProfile();

  const plan = useMemo(() => generateWorkoutPlan(profile), [profile]);

  const todayIdx = new Date().getDay(); // 0 = Sunday
  const planDay = todayIdx === 0 ? 6 : todayIdx - 1; // convert to Mon=0
  const today = plan[Math.min(planDay, plan.length - 1)];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

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

  const goalLabel = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle',
    increase_strength: 'Increase Strength',
  }[profile.goal ?? 'gain_muscle'] ?? 'Fitness';

  const resetOnboarding = () => {
    update({ onboardingComplete: false });
    navigation.replace('Gender');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()} 👋</Text>
            <Text style={styles.subGreeting}>Let's crush today's workout!</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={resetOnboarding}>
            <Ionicons name="person-circle-outline" size={38} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.trainingDays ?? 3}</Text>
            <Text style={styles.statLabel}>Days/Week</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{bmi || '—'}</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {profile.currentWeightValue}
              <Text style={{ fontSize: 12 }}>{profile.currentWeightUnit}</Text>
            </Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: colors.accent, fontSize: 13 }]}>{goalLabel}</Text>
            <Text style={styles.statLabel}>Goal</Text>
          </View>
        </View>

        {/* Today's workout */}
        <Text style={styles.sectionTitle}>Today's Workout</Text>
        <TodayCard day={today} />

        {/* Weekly plan */}
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekGrid}>
          {plan.map((d, i) => (
            <WeekDayCard key={i} day={d} dayAbbr={DAY_ABBR[i]} isToday={i === planDay} />
          ))}
        </View>

        {/* Tip card */}
        <View style={styles.tipCard}>
          <MaterialCommunityIcons name="lightbulb-outline" size={22} color={colors.amber} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Today's Tip</Text>
            <Text style={styles.tipBody}>
              {profile.goal === 'lose_weight'
                ? 'Keep your rest periods short (30–45 sec) to maximize calorie burn and maintain an elevated heart rate.'
                : profile.goal === 'gain_muscle'
                ? 'Eat 1.6–2.2g of protein per kg of bodyweight to maximize muscle growth. Prioritize sleep — it\'s when muscles actually grow.'
                : 'Progressive overload is key: add 2.5–5% more weight each week. Track every session to see your strength gains.'}
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function TodayCard({ day }: { day: WorkoutDay }) {
  if (day.isRest) {
    return (
      <LinearGradient colors={['#131D2E', '#192235']} style={styles.todayCard}>
        <Text style={styles.todayEmoji}>😴</Text>
        <Text style={styles.todayFocus}>Rest Day</Text>
        <Text style={styles.todayMeta}>Recovery is part of the plan. Stretch, hydrate, and rest.</Text>
      </LinearGradient>
    );
  }
  return (
    <LinearGradient colors={['#1A2D55', '#162030']} style={styles.todayCard}>
      <View style={styles.todayHeader}>
        <View>
          <Text style={styles.todayEmoji}>{day.emoji}</Text>
          <Text style={styles.todayFocus}>{day.focus}</Text>
          <Text style={styles.todayMeta}>~{day.estimatedMinutes} min  •  {day.exercises.length} exercises</Text>
        </View>
        <View style={styles.todayBadge}>
          <Text style={styles.todayBadgeText}>TODAY</Text>
        </View>
      </View>

      <View style={styles.exerciseList}>
        {day.exercises.slice(0, 4).map((ex, i) => (
          <View key={i} style={styles.exerciseRow}>
            <View style={styles.exerciseDot} />
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseSets}>{ex.sets}×{ex.reps}</Text>
          </View>
        ))}
        {day.exercises.length > 4 && (
          <Text style={styles.moreExercises}>+{day.exercises.length - 4} more exercises</Text>
        )}
      </View>
    </LinearGradient>
  );
}

function WeekDayCard({ day, dayAbbr, isToday }: { day: WorkoutDay; dayAbbr: string; isToday: boolean }) {
  return (
    <View style={[styles.weekCard, isToday && styles.weekCardToday]}>
      <Text style={[styles.weekDayAbbr, isToday && styles.weekDayAbbrToday]}>{dayAbbr}</Text>
      <Text style={styles.weekEmoji}>{day.isRest ? '💤' : day.emoji}</Text>
      <Text style={[styles.weekFocus, isToday && styles.weekFocusToday]} numberOfLines={2}>
        {day.isRest ? 'Rest' : day.focus}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { color: colors.text, fontSize: 22, fontWeight: '700' },
  subGreeting: { color: colors.textSecondary, fontSize: 14, marginTop: 2 },
  profileBtn: { padding: 4 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12, alignItems: 'center',
  },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  statLabel: { color: colors.textSecondary, fontSize: 11, marginTop: 2, textAlign: 'center' },

  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: 12 },

  todayCard: {
    borderRadius: 18, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: 'rgba(74,124,247,0.3)',
  },
  todayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  todayEmoji: { fontSize: 32, marginBottom: 6 },
  todayFocus: { color: colors.text, fontSize: 20, fontWeight: '700' },
  todayMeta: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  todayBadge: {
    backgroundColor: colors.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  todayBadgeText: { color: colors.text, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  exerciseList: { gap: 8 },
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  exerciseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  exerciseName: { flex: 1, color: colors.text, fontSize: 14 },
  exerciseSets: { color: colors.textSecondary, fontSize: 13 },
  moreExercises: { color: colors.accent, fontSize: 13, marginTop: 4 },

  weekGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  weekCard: {
    width: (W - 40 - 48) / 7,
    backgroundColor: colors.card, borderRadius: 10, padding: 8,
    alignItems: 'center', borderWidth: 1.5, borderColor: 'transparent',
  },
  weekCardToday: { borderColor: colors.accent, backgroundColor: colors.cardSelected },
  weekDayAbbr: { color: colors.textSecondary, fontSize: 10, fontWeight: '600', marginBottom: 4 },
  weekDayAbbrToday: { color: colors.accent },
  weekEmoji: { fontSize: 18, marginBottom: 4 },
  weekFocus: { color: colors.textMuted, fontSize: 9, textAlign: 'center', lineHeight: 12 },
  weekFocusToday: { color: colors.textSecondary },

  tipCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: colors.card, borderRadius: 14, padding: 16,
    borderLeftWidth: 3, borderLeftColor: colors.amber,
  },
  tipTitle: { color: colors.amber, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  tipBody: { color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
});
