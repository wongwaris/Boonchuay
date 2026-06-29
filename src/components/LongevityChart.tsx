import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';

const W = 300;
const H = 180;
const PAD = { top: 20, right: 20, bottom: 36, left: 44 };

const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top - PAD.bottom;

// Bell-curve data points: x = minutes/week (0-120), y = mortality reduction %
const DATA: [number, number][] = [
  [0, 3], [10, 10], [20, 18], [30, 23], [40, 27], [50, 29],
  [60, 30], [70, 28], [80, 25], [90, 21], [100, 17], [110, 13], [120, 10],
];

const X_MAX = 120;
const Y_MAX = 33;

function toCanvas(x: number, y: number): [number, number] {
  return [
    PAD.left + (x / X_MAX) * chartW,
    PAD.top + chartH - (y / Y_MAX) * chartH,
  ];
}

function buildPath(): string {
  return DATA.map(([x, y], i) => {
    const [cx, cy] = toCanvas(x, y);
    return i === 0 ? `M${cx},${cy}` : `L${cx},${cy}`;
  }).join(' ');
}

const yLabels = [0, 10, 20, 30];
const xLabels = [0, 30, 60, 90, 120];

// Dot at x=120 (cursor dot in reference image)
const [dotX, dotY] = toCanvas(120, 10);

export default function LongevityChart() {
  const path = buildPath();

  return (
    <View style={styles.wrapper}>
      <Svg width={W} height={H}>
        {/* Grid lines */}
        {yLabels.map((v) => {
          const [, cy] = toCanvas(0, v);
          return (
            <Line
              key={v}
              x1={PAD.left}
              y1={cy}
              x2={W - PAD.right}
              y2={cy}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
          );
        })}

        {/* Y axis labels */}
        {yLabels.map((v) => {
          const [, cy] = toCanvas(0, v);
          return (
            <SvgText
              key={v}
              x={PAD.left - 6}
              y={cy + 4}
              fontSize={10}
              fill={colors.textSecondary}
              textAnchor="end"
            >
              {v}%
            </SvgText>
          );
        })}

        {/* X axis labels */}
        {xLabels.map((v) => {
          const [cx] = toCanvas(v, 0);
          return (
            <SvgText
              key={v}
              x={cx}
              y={H - 4}
              fontSize={10}
              fill={colors.textSecondary}
              textAnchor="middle"
            >
              {v}
            </SvgText>
          );
        })}

        {/* Curve */}
        <Path
          d={path}
          stroke={colors.accent}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* End dot */}
        <Circle cx={dotX} cy={dotY} r={6} fill={colors.accent} />
      </Svg>

      <View style={styles.axisLabels}>
        <Text style={styles.yAxisLabel}>Mortality{'\n'}Risk{'\n'}Reduction %</Text>
        <Text style={styles.xAxisLabel}>Minutes/week of resistance training</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  axisLabels: {
    width: W,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  yAxisLabel: {
    position: 'absolute',
    left: 0,
    top: PAD.top,
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
    width: 36,
    lineHeight: 13,
  },
  xAxisLabel: {
    position: 'absolute',
    bottom: 0,
    left: PAD.left,
    right: PAD.right,
    textAlign: 'center',
    fontSize: 10,
    color: colors.textSecondary,
  },
});
