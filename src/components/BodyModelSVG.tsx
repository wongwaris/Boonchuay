import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Circle, Rect, Ellipse, Line } from 'react-native-svg';
import { colors } from '../theme/colors';

const SCREEN_W = Dimensions.get('window').width;
const SVG_W = SCREEN_W;
const SVG_H = 420;
const OX = SVG_W / 2 - 100; // body offset x (body is 200px wide)

interface Zone {
  id: string;
  label: string;
  side: 'left' | 'right';
  top: number;
}

const ZONES: Zone[] = [
  { id: 'TRAPS', label: 'TRAPS', side: 'left', top: 52 },
  { id: 'CHEST', label: 'CHEST', side: 'right', top: 82 },
  { id: 'SHOULDERS', label: 'SHOULDERS', side: 'left', top: 128 },
  { id: 'ABS', label: 'ABS', side: 'right', top: 160 },
  { id: 'ARMS', label: 'ARMS', side: 'left', top: 198 },
  { id: 'FOREARMS', label: 'FOREARMS', side: 'right', top: 204 },
  { id: 'BACK', label: 'BACK', side: 'left', top: 258 },
  { id: 'LEGS', label: 'LEGS', side: 'right', top: 298 },
  { id: 'FULL BODY', label: 'FULL BODY', side: 'right', top: 370 },
];

const LABEL_W = 90;
const LABEL_H = 30;

// Connection targets (body-relative coords, body starts at OX)
const ZONE_TARGETS: Record<string, [number, number]> = {
  TRAPS: [95, 62],
  CHEST: [150, 95],
  SHOULDERS: [50, 110],
  ABS: [135, 170],
  ARMS: [45, 155],
  FOREARMS: [158, 185],
  BACK: [80, 175],
  LEGS: [145, 300],
  'FULL BODY': [120, 360],
};

function getLinePoints(zone: Zone): { x1: number; y1: number; x2: number; y2: number } {
  const labelY = zone.top + LABEL_H / 2;
  const target = ZONE_TARGETS[zone.id];
  const tx = OX + target[0];
  const ty = target[1];

  if (zone.side === 'left') {
    return { x1: LABEL_W + 4, y1: labelY, x2: tx, y2: ty };
  } else {
    return { x1: SVG_W - LABEL_W - 4, y1: labelY, x2: tx, y2: ty };
  }
}

interface Props {
  selected: string[];
  onToggle: (id: string) => void;
}

export default function BodyModelSVG({ selected, onToggle }: Props) {
  const isSelected = (id: string) =>
    selected.includes(id) || selected.includes('FULL BODY');

  const overlayColor = 'rgba(239,68,68,0.65)';

  return (
    <View style={{ width: SVG_W, height: SVG_H }}>
      <Svg width={SVG_W} height={SVG_H}>
        {/* Connecting lines */}
        {ZONES.map((z) => {
          const pts = getLinePoints(z);
          const active = selected.includes(z.id);
          return (
            <Line
              key={z.id}
              x1={pts.x1}
              y1={pts.y1}
              x2={pts.x2}
              y2={pts.y2}
              stroke={active ? colors.accent : 'rgba(74,124,247,0.25)'}
              strokeWidth={1}
            />
          );
        })}

        {/* ─── Body outline ─── */}
        <G
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={1.8}
          transform={`translate(${OX}, 0)`}
        >
          <Circle cx={100} cy={30} r={22} />
          <Rect x={90} y={51} width={20} height={13} rx={4} />
          <Rect x={48} y={64} width={104} height={12} rx={6} />
          <Rect x={38} y={64} width={22} height={74} rx={11} />
          <Rect x={140} y={64} width={22} height={74} rx={11} />
          <Rect x={32} y={140} width={20} height={62} rx={10} />
          <Rect x={148} y={140} width={20} height={62} rx={10} />
          <Rect x={62} y={76} width={76} height={92} rx={9} />
          <Rect x={67} y={168} width={66} height={50} rx={8} />
          <Rect x={58} y={218} width={84} height={16} rx={8} />
          <Rect x={60} y={234} width={36} height={96} rx={13} />
          <Rect x={104} y={234} width={36} height={96} rx={13} />
          <Rect x={63} y={333} width={30} height={72} rx={11} />
          <Rect x={107} y={333} width={30} height={72} rx={11} />
          <Ellipse cx={79} cy={410} rx={20} ry={8} />
          <Ellipse cx={121} cy={410} rx={20} ry={8} />
        </G>

        {/* ─── Muscle overlays ─── */}
        <G transform={`translate(${OX}, 0)`}>
          {isSelected('CHEST') && (
            <Rect x={64} y={78} width={72} height={56} rx={7} fill={overlayColor} />
          )}
          {isSelected('ABS') && (
            <Rect x={69} y={135} width={62} height={83} rx={7} fill={overlayColor} />
          )}
          {isSelected('SHOULDERS') && <>
            <Rect x={48} y={64} width={104} height={12} rx={6} fill={overlayColor} />
            <Rect x={38} y={64} width={22} height={36} rx={10} fill={overlayColor} />
            <Rect x={140} y={64} width={22} height={36} rx={10} fill={overlayColor} />
          </>}
          {isSelected('ARMS') && <>
            <Rect x={38} y={100} width={22} height={38} rx={10} fill={overlayColor} />
            <Rect x={140} y={100} width={22} height={38} rx={10} fill={overlayColor} />
          </>}
          {isSelected('FOREARMS') && <>
            <Rect x={32} y={140} width={20} height={62} rx={10} fill={overlayColor} />
            <Rect x={148} y={140} width={20} height={62} rx={10} fill={overlayColor} />
          </>}
          {isSelected('TRAPS') && <>
            <Rect x={80} y={51} width={40} height={13} rx={4} fill={overlayColor} />
            <Rect x={64} y={64} width={72} height={14} rx={4} fill={overlayColor} />
          </>}
          {isSelected('BACK') && <>
            <Rect x={62} y={78} width={16} height={90} rx={6} fill={overlayColor} />
            <Rect x={122} y={78} width={16} height={90} rx={6} fill={overlayColor} />
          </>}
          {isSelected('LEGS') && <>
            <Rect x={60} y={234} width={36} height={168} rx={11} fill={overlayColor} />
            <Rect x={104} y={234} width={36} height={168} rx={11} fill={overlayColor} />
          </>}
        </G>
      </Svg>

      {/* ─── Label chips ─── */}
      {ZONES.map((zone) => {
        const active = selected.includes(zone.id);
        const isLeft = zone.side === 'left';
        return (
          <TouchableOpacity
            key={zone.id}
            onPress={() => onToggle(zone.id)}
            style={[
              styles.chip,
              isLeft ? styles.chipLeft : styles.chipRight,
              { top: zone.top },
              active && styles.chipActive,
            ]}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {zone.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    position: 'absolute',
    width: LABEL_W,
    height: LABEL_H,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(74,124,247,0.35)',
    backgroundColor: 'rgba(19,29,46,0.9)',
  },
  chipLeft: { left: 4 },
  chipRight: { right: 4 },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: 'rgba(74,124,247,0.2)',
  },
  chipText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  chipTextActive: {
    color: colors.text,
  },
});
