import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Rect, Circle, Line, Path, Text as SvgText, G } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHistory, WorkoutLog } from '../context/WorkoutHistoryContext';
import { colors } from '../theme/colors';

const { width: W } = Dimensions.get('window');
const CHART_W = W - 48;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MUSCLE_COLORS = ['#4A7CF7', '#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444', '#22C55E'];

function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(now);
  start.setDate(now.getDate() - diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function useWeeklyData(workouts: WorkoutLog[]) {
  return useMemo(() => {
    const weekStart = getWeekStart();
    const counts = Array(7).fill(0);
    const volumes = Array(7).fill(0);
    workouts.forEach((w) => {
      const d = new Date(w.date);
      const diffDays = Math.round((d.getTime() - weekStart.getTime()) / 86400000);
      if (diffDays >= 0 && diffDays < 7) {
        counts[diffDays]++;
        volumes[diffDays] += w.totalVolume;
      }
    });
    return { counts, volumes };
  }, [workouts]);
}

function useMuscleBreakdown(workouts: WorkoutLog[]) {
  return useMemo(() => {
    const map: Record<string, number> = {};
    workouts.slice(0, 30).forEach((w) => {
      const focus = w.focus.split(' & ')[0].trim();
      map[focus] = (map[focus] ?? 0) + 1;
    });
    const total = Object.values(map).reduce((a, b) => a + b, 0);
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], i) => ({ name, count, pct: total > 0 ? count / total : 0, color: MUSCLE_COLORS[i % MUSCLE_COLORS.length] }));
  }, [workouts]);
}

function useWeightTrend(weights: import('../context/WorkoutHistoryContext').WeightLog[]) {
  return useMemo(() => weights.slice(0, 20).reverse(), [weights]);
}

// ── Bar Chart ──
function WeeklyBarChart({ counts }: { counts: number[] }) {
  const BAR_W = 24;
  const H = 100;
  const maxCount = Math.max(...counts, 1);
  const spacing = (CHART_W - 8) / 7;

  return (
    <Svg width={CHART_W} height={H + 28}>
      {counts.map((c, i) => {
        const barH = Math.max(4, (c / maxCount) * H);
        const x = i * spacing + spacing / 2 - BAR_W / 2;
        const y = H - barH;
        return (
          <G key={i}>
            <Rect
              x={x} y={y} width={BAR_W} height={barH} rx={6}
              fill={c > 0 ? colors.accent : colors.border}
            />
            {c > 0 && (
              <SvgText x={x + BAR_W / 2} y={y - 4} fill={colors.accent} fontSize={10} textAnchor="middle" fontWeight="700">
                {c}
              </SvgText>
            )}
            <SvgText x={i * spacing + spacing / 2} y={H + 20} fill={colors.textSecondary} fontSize={11} textAnchor="middle">
              {DAY_LABELS[i]}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

// ── Donut Chart ──
function DonutChart({ slices }: { slices: { name: string; pct: number; color: string; count: number }[] }) {
  const R = 60;
  const CX = 80;
  const CY = 80;
  const STROKE = 20;

  function arc(pct: number, offset: number) {
    const total = 2 * Math.PI;
    const start = total * offset - Math.PI / 2;
    const end = start + total * pct;
    const x1 = CX + (R + STROKE / 2) * Math.cos(start);
    const y1 = CY + (R + STROKE / 2) * Math.sin(start);
    const x2 = CX + (R + STROKE / 2) * Math.cos(end);
    const y2 = CY + (R + STROKE / 2) * Math.sin(end);
    const large = pct > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${R + STROKE / 2} ${R + STROKE / 2} 0 ${large} 1 ${x2} ${y2}`;
  }

  let offset = 0;
  const totalCount = slices.reduce((a, s) => a + s.count, 0) as unknown as number;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <Svg width={160} height={160}>
        <Circle cx={CX} cy={CY} r={R + STROKE} fill="none" stroke={colors.border} strokeWidth={STROKE} />
        {slices.map((s, i) => {
          const path = arc(s.pct, offset);
          offset += s.pct;
          return <Path key={i} d={path} fill="none" stroke={s.color} strokeWidth={STROKE} />;
        })}
        <SvgText x={CX} y={CY - 6} fill={colors.text} fontSize={22} textAnchor="middle" fontWeight="800">
          {(totalCount as any as number)}
        </SvgText>
        <SvgText x={CX} y={CY + 12} fill={colors.textSecondary} fontSize={11} textAnchor="middle">
          workouts
        </SvgText>
      </Svg>
      <View style={{ flex: 1, gap: 8 }}>
        {slices.slice(0, 5).map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: s.color }} />
            <Text style={{ color: colors.textSecondary, fontSize: 12, flex: 1 }} numberOfLines={1}>{s.name}</Text>
            <Text style={{ color: colors.text, fontSize: 12, fontWeight: '700' }}>{Math.round(s.pct * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Line Chart ──
function WeightLineChart({ data }: { data: import('../context/WorkoutHistoryContext').WeightLog[] }) {
  const H = 100;
  const PAD = 24;
  const W2 = CHART_W;

  if (data.length < 2) {
    return (
      <View style={{ height: H + 40, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textMuted, fontSize: 13 }}>Log weight to see trend</Text>
      </View>
    );
  }

  const values = data.map((d) => d.weightKg);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W2 - PAD * 2),
    y: H - ((d.weightKg - minV) / range) * (H - 20) - 10,
    weight: d.weightKg,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <Svg width={W2} height={H + 40}>
      <Path d={pathD} fill="none" stroke={colors.accent} strokeWidth={2.5} strokeLinejoin="round" />
      {pts.map((p, i) => (
        <G key={i}>
          <Circle cx={p.x} cy={p.y} r={4} fill={colors.accent} />
          {(i === 0 || i === pts.length - 1) && (
            <SvgText
              x={p.x}
              y={p.y - 10}
              fill={colors.text}
              fontSize={11}
              textAnchor={i === 0 ? 'start' : 'end'}
              fontWeight="700"
            >
              {p.weight}kg
            </SvgText>
          )}
        </G>
      ))}
      <SvgText x={PAD} y={H + 34} fill={colors.textMuted} fontSize={10}>
        {data[0]?.date}
      </SvgText>
      <SvgText x={W2 - PAD} y={H + 34} fill={colors.textMuted} fontSize={10} textAnchor="end">
        {data[data.length - 1]?.date}
      </SvgText>
    </Svg>
  );
}

function EmptyState({ icon, message }: { icon: string; message: string }) {
  return (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name={icon as any} size={32} color={colors.textMuted} />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();
  const { workouts, weights, streak } = useHistory();

  const { counts } = useWeeklyData(workouts);
  const muscleBreakdown = useMuscleBreakdown(workouts);
  const weightTrend = useWeightTrend(weights);

  const totalWorkouts = workouts.length;
  const totalVolume = workouts.reduce((s, w) => s + w.totalVolume, 0);
  const avgDuration = totalWorkouts > 0
    ? Math.round(workouts.reduce((s, w) => s + w.durationSeconds, 0) / totalWorkouts / 60)
    : 0;

  const thisWeekCount = counts.reduce((a, b) => a + b, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <Text style={styles.pageTitle}>Progress</Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={22} color={colors.amber} />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day streak</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="dumbbell" size={22} color={colors.accent} />
            <Text style={styles.statValue}>{totalWorkouts}</Text>
            <Text style={styles.statLabel}>Total sessions</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="weight-kilogram" size={22} color={colors.teal} />
            <Text style={styles.statValue}>{totalVolume > 999 ? `${Math.round(totalVolume / 1000)}k` : totalVolume}</Text>
            <Text style={styles.statLabel}>kg lifted</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="clock-outline" size={22} color={colors.purple} />
            <Text style={styles.statValue}>{avgDuration}</Text>
            <Text style={styles.statLabel}>avg min</Text>
          </View>
        </View>

        {/* Weekly bar chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <Text style={styles.sectionBadge}>{thisWeekCount} sessions</Text>
          </View>
          <View style={styles.chartCard}>
            {totalWorkouts === 0
              ? <EmptyState icon="calendar-blank" message="Complete your first workout to see progress" />
              : <WeeklyBarChart counts={counts} />
            }
          </View>
        </View>

        {/* Muscle breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Muscle Focus</Text>
          <View style={styles.chartCard}>
            {muscleBreakdown.length === 0
              ? <EmptyState icon="circle-outline" message="No workout data yet" />
              : <DonutChart slices={muscleBreakdown} />
            }
          </View>
        </View>

        {/* Weight trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight Trend</Text>
          <View style={styles.chartCard}>
            <WeightLineChart data={weightTrend} />
          </View>
        </View>

        {/* Recent workouts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Workouts</Text>
          {workouts.length === 0 ? (
            <EmptyState icon="dumbbell" message="Your logged workouts will appear here" />
          ) : (
            workouts.slice(0, 10).map((w) => (
              <View key={w.id} style={styles.recentCard}>
                <Text style={styles.recentEmoji}>{w.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentFocus}>{w.focus}</Text>
                  <Text style={styles.recentMeta}>
                    {w.date}  ·  {Math.round(w.durationSeconds / 60)} min  ·  {w.totalVolume} kg
                  </Text>
                </View>
                <View style={styles.recentSets}>
                  <Text style={styles.recentSetsText}>
                    {w.exercises.reduce((s, e) => s + e.sets.length, 0)} sets
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  pageTitle: { color: colors.text, fontSize: 26, fontWeight: '800', marginBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12,
    alignItems: 'center', gap: 4,
  },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 10, textAlign: 'center' },

  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginBottom: 10 },
  sectionBadge: { color: colors.accent, fontSize: 13, fontWeight: '600' },
  chartCard: {
    backgroundColor: colors.card, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.border,
  },

  emptyState: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },

  recentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.card, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: colors.border, marginBottom: 8,
  },
  recentEmoji: { fontSize: 28 },
  recentFocus: { color: colors.text, fontSize: 14, fontWeight: '700' },
  recentMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  recentSets: {
    backgroundColor: colors.surface, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  recentSetsText: { color: colors.textSecondary, fontSize: 12, fontWeight: '600' },
});
