import React, { useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const ITEM_HEIGHT = 58;
const VISIBLE_ITEMS = 5;

interface Props {
  values: (string | number)[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  suffix?: string;
}

export default function ScrollPicker({
  values,
  selectedIndex,
  onIndexChange,
  suffix = '',
}: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 80);
    return () => clearTimeout(timeout);
  }, []);

  const handleScrollEnd = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = Math.max(0, Math.min(Math.round(y / ITEM_HEIGHT), values.length - 1));
    if (idx !== selectedIndex) onIndexChange(idx);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.selectionBox} pointerEvents="none" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        style={styles.scroll}
      >
        {values.map((val, i) => {
          const dist = Math.abs(i - selectedIndex);
          return (
            <View key={i} style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  dist === 0 && styles.itemTextCenter,
                  dist === 1 && styles.itemTextNear,
                  dist >= 2 && styles.itemTextFar,
                ]}
              >
                {val}
                {suffix}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
  },
  selectionBox: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 24,
    right: 24,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
    zIndex: 0,
  },
  scroll: {
    width: '100%',
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: colors.text,
    fontSize: 18,
  },
  itemTextCenter: {
    fontSize: 30,
    fontWeight: '700',
    color: colors.text,
  },
  itemTextNear: {
    fontSize: 22,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  itemTextFar: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '400',
  },
});
