import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { G, Circle, Rect, Ellipse } from 'react-native-svg';
import { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const { width: W, height: H } = Dimensions.get('window');

function BodyFigure({ x = 0, y = 0, scale = 1, highlight = false }) {
  const c = highlight ? '#EF4444' : 'rgba(255,255,255,0.75)';
  const s = scale;
  return (
    <G transform={`translate(${x}, ${y}) scale(${s})`} fill="none" stroke={c} strokeWidth={2}>
      <Circle cx={50} cy={22} r={18} />
      <Rect x={42} y={40} width={16} height={12} rx={4} />
      <Rect x={24} y={52} width={52} height={10} rx={5} />
      <Rect x={14} y={52} width={18} height={58} rx={9} />
      <Rect x={68} y={52} width={18} height={58} rx={9} />
      <Rect x={10} y={112} width={16} height={50} rx={8} />
      <Rect x={74} y={112} width={16} height={50} rx={8} />
      <Rect x={26} y={62} width={48} height={68} rx={8} />
      <Rect x={28} y={130} width={20} height={70} rx={10} />
      <Rect x={52} y={130} width={20} height={70} rx={10} />
      <Rect x={29} y={202} width={18} height={55} rx={9} />
      <Rect x={53} y={202} width={18} height={55} rx={9} />
      <Ellipse cx={38} cy={262} rx={14} ry={6} />
      <Ellipse cx={62} cy={262} rx={14} ry={6} />
    </G>
  );
}

export default function SplashScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#050A14', '#0B1420', '#0D1835']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Hero body models */}
      <View style={styles.heroArea}>
        <Svg width={W} height={H * 0.58} viewBox={`0 0 ${W} 380`}>
          <BodyFigure x={W * 0.48} y={20} scale={1.35} highlight={false} />
          <BodyFigure x={W * 0.15} y={50} scale={1.0} highlight={false} />
        </Svg>

        {/* Glow effect */}
        <LinearGradient
          colors={['transparent', 'rgba(74,124,247,0.12)', 'transparent']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0.4 }}
          end={{ x: 1, y: 0.6 }}
          pointerEvents="none"
        />
      </View>

      {/* Bottom content */}
      <LinearGradient
        colors={['transparent', '#050A14CC', '#050A14']}
        style={styles.bottomGradient}
        pointerEvents="none"
      />
      <View style={styles.bottom}>
        <View style={styles.logoRow}>
          <Text style={styles.logoFit}>FIT</Text>
          <Text style={styles.logoEasy}>EASY</Text>
        </View>
        <Text style={styles.tagline}>
          Built on anatomy, backed by science.{'\n'}
          Your plan. Your goal. Your level.{'\n'}
          Workouts that target the right muscles,{'\n'}
          the right way — every time.
        </Text>

        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('Gender')}
          activeOpacity={0.85}
        >
          <Text style={styles.startBtnText}>GET STARTED</Text>
        </TouchableOpacity>

        <Text style={styles.signIn}>
          Already have an account?{' '}
          <Text style={{ color: colors.accent }}>Sign In</Text>
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroArea: { flex: 1, overflow: 'hidden' },
  bottomGradient: {
    position: 'absolute',
    left: 0, right: 0,
    bottom: 0,
    height: H * 0.45,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  logoFit: {
    fontSize: 46,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1,
  },
  logoEasy: {
    fontSize: 46,
    fontWeight: '900',
    color: colors.accent,
    letterSpacing: -1,
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 30,
  },
  startBtn: {
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  startBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  signIn: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 14,
  },
});
