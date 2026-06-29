import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Modal, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useHistory, WorkoutLog, ExerciseLog } from '../context/WorkoutHistoryContext';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSession'>;

interface SetEntry {
  weight: string;
  reps: string;
  done: boolean;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function WorkoutSessionScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { addWorkout } = useHistory();
  const { workout } = route.params;

  const [elapsed, setElapsed] = useState(0);
  const [sets, setSets] = useState<SetEntry[][]>(
    workout.exercises.map((ex) =>
      Array.from({ length: ex.sets }, () => ({ weight: '', reps: '', done: false }))
    )
  );

  const [restSeconds, setRestSeconds] = useState(0);
  const [restVisible, setRestVisible] = useState(false);
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const startRest = (seconds: number) => {
    if (restRef.current) clearInterval(restRef.current);
    setRestSeconds(seconds);
    setRestVisible(true);
    restRef.current = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(restRef.current!);
          setRestVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const dismissRest = () => {
    if (restRef.current) clearInterval(restRef.current);
    setRestVisible(false);
  };

  const toggleSet = (exIdx: number, setIdx: number) => {
    setSets((prev) => {
      const next = prev.map((ex, ei) =>
        ei === exIdx
          ? ex.map((s, si) => (si === setIdx ? { ...s, done: !s.done } : s))
          : ex
      );
      const wasNotDone = !prev[exIdx][setIdx].done;
      if (wasNotDone) {
        const restTime = workout.exercises[exIdx].rest;
        if (restTime > 0) startRest(restTime);
      }
      return next;
    });
  };

  const updateSet = (exIdx: number, setIdx: number, field: 'weight' | 'reps', value: string) => {
    setSets((prev) =>
      prev.map((ex, ei) =>
        ei === exIdx
          ? ex.map((s, si) => (si === setIdx ? { ...s, [field]: value } : s))
          : ex
      )
    );
  };

  const completedCount = sets.flat().filter((s) => s.done).length;
  const totalSets = sets.flat().length;

  const handleFinish = useCallback(() => {
    if (completedCount === 0) {
      Alert.alert('No sets logged', 'Complete at least one set before finishing.');
      return;
    }

    const exerciseLogs: ExerciseLog[] = workout.exercises.map((ex, ei) => ({
      name: ex.name,
      sets: sets[ei]
        .filter((s) => s.done)
        .map((s) => ({
          reps: parseInt(s.reps, 10) || 0,
          weight: parseFloat(s.weight) || 0,
        })),
    })).filter((el) => el.sets.length > 0);

    const totalVolume = exerciseLogs.reduce(
      (vol, el) => vol + el.sets.reduce((sv, s) => sv + s.reps * s.weight, 0),
      0
    );

    const log: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      focus: workout.focus,
      emoji: workout.emoji,
      durationSeconds: elapsed,
      exercises: exerciseLogs,
      totalVolume: Math.round(totalVolume),
    };

    addWorkout(log);
    navigation.goBack();
  }, [sets, elapsed, workout, completedCount, addWorkout, navigation]);

  const handleExit = () => {
    Alert.alert(
      'Exit workout?',
      'Your progress will not be saved.',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleExit}>
          <Ionicons name="close" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEmoji}>{workout.emoji}</Text>
          <Text style={styles.headerTitle}>{workout.focus}</Text>
        </View>
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${totalSets > 0 ? (completedCount / totalSets) * 100 : 0}%` }]} />
      </View>
      <Text style={styles.progressLabel}>{completedCount} / {totalSets} sets</Text>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {workout.exercises.map((ex, ei) => (
            <View key={ei} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{ex.name}</Text>
              <Text style={styles.exercisePlan}>{ex.sets} sets · {ex.reps} reps · {ex.rest}s rest</Text>

              {/* Column labels */}
              <View style={styles.setHeader}>
                <Text style={[styles.setCol, styles.setLabel]}>SET</Text>
                <Text style={[styles.setColWide, styles.setLabel]}>KG</Text>
                <Text style={[styles.setColWide, styles.setLabel]}>REPS</Text>
                <View style={styles.setColCheck} />
              </View>

              {sets[ei].map((s, si) => (
                <View key={si} style={[styles.setRow, s.done && styles.setRowDone]}>
                  <Text style={[styles.setCol, styles.setNum]}>{si + 1}</Text>
                  <TextInput
                    style={[styles.setColWide, styles.setInput, s.done && styles.setInputDone]}
                    value={s.weight}
                    onChangeText={(v) => updateSet(ei, si, 'weight', v)}
                    keyboardType="decimal-pad"
                    placeholder="—"
                    placeholderTextColor={colors.textMuted}
                    editable={!s.done}
                  />
                  <TextInput
                    style={[styles.setColWide, styles.setInput, s.done && styles.setInputDone]}
                    value={s.reps}
                    onChangeText={(v) => updateSet(ei, si, 'reps', v)}
                    keyboardType="number-pad"
                    placeholder="—"
                    placeholderTextColor={colors.textMuted}
                    editable={!s.done}
                  />
                  <TouchableOpacity
                    style={[styles.setColCheck, styles.checkBtn, s.done && styles.checkBtnDone]}
                    onPress={() => toggleSet(ei, si)}
                  >
                    <Ionicons name="checkmark" size={16} color={s.done ? '#fff' : colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Finish button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity
          style={[styles.finishBtn, completedCount === 0 && styles.finishBtnDisabled]}
          onPress={handleFinish}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="flag-checkered" size={20} color="#fff" />
          <Text style={styles.finishBtnText}>Finish Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Rest timer modal */}
      <Modal visible={restVisible} transparent animationType="fade">
        <View style={styles.restOverlay}>
          <LinearGradient colors={['#0F1C35', '#131D2E']} style={styles.restCard}>
            <Text style={styles.restTitle}>Rest</Text>
            <Text style={styles.restTimer}>{formatTime(restSeconds)}</Text>
            <View style={styles.restProgress}>
              <View style={styles.restProgressFill} />
            </View>
            <TouchableOpacity style={styles.restSkipBtn} onPress={dismissRest}>
              <Text style={styles.restSkipText}>Skip Rest</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 12, gap: 8,
  },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerEmoji: { fontSize: 20 },
  headerTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  timerBox: {
    backgroundColor: colors.card, borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 6, minWidth: 72, alignItems: 'center',
  },
  timerText: { color: colors.accent, fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },

  progressTrack: { height: 3, backgroundColor: colors.border, marginHorizontal: 16 },
  progressFill: { height: '100%', backgroundColor: colors.accent },
  progressLabel: { color: colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 6, marginBottom: 4 },

  scroll: { padding: 16, gap: 16 },

  exerciseCard: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  exerciseName: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 2 },
  exercisePlan: { color: colors.textSecondary, fontSize: 12, marginBottom: 12 },

  setHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  setLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  setRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 6,
    borderRadius: 8, marginBottom: 4,
  },
  setRowDone: { backgroundColor: 'rgba(74,124,247,0.08)' },
  setCol: { width: 32, textAlign: 'center' },
  setColWide: { flex: 1, textAlign: 'center' },
  setColCheck: { width: 40, alignItems: 'center' },
  setNum: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
  setInput: {
    color: colors.text, fontSize: 15, fontWeight: '600',
    backgroundColor: colors.surface, borderRadius: 8, paddingVertical: 6,
    paddingHorizontal: 8, textAlign: 'center', marginHorizontal: 4,
  },
  setInputDone: { color: colors.textSecondary, backgroundColor: 'transparent' },
  checkBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 2, borderColor: colors.textMuted,
    justifyContent: 'center', alignItems: 'center',
  },
  checkBtnDone: { backgroundColor: colors.accent, borderColor: colors.accent },

  footer: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: colors.background },
  finishBtn: {
    backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  finishBtnDisabled: { backgroundColor: colors.border },
  finishBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  restOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  restCard: {
    width: 280, borderRadius: 24, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
  },
  restTitle: { color: colors.textSecondary, fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  restTimer: { color: colors.text, fontSize: 56, fontWeight: '800', marginVertical: 12, fontVariant: ['tabular-nums'] },
  restProgress: { width: '100%', height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 24 },
  restProgressFill: { width: '50%', height: '100%', backgroundColor: colors.accent, borderRadius: 2 },
  restSkipBtn: {
    backgroundColor: colors.card, borderRadius: 12, paddingHorizontal: 24,
    paddingVertical: 12, borderWidth: 1, borderColor: colors.border,
  },
  restSkipText: { color: colors.text, fontSize: 14, fontWeight: '600' },
});
