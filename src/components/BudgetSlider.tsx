import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolateColor, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import { categoryMeta, formatNaira } from '@/lib/finance';
import { colors, radius } from '@/theme';
import type { Budget } from '@/types/finance';

const MIN = 10000;
const MAX = 200000;

export function BudgetSlider({ budget, spent, onCommit }: { budget: Budget; spent: number; onCommit: (limit: number) => void }) {
  const [trackWidth, setTrackWidth] = useState(1);
  const x = useSharedValue(0);
  const startX = useSharedValue(0);
  const ratio = useDerivedValue(() => Math.min(1, Math.max(0, x.value / trackWidth)));
  useEffect(() => { x.value = withSpring(((budget.limit - MIN) / (MAX - MIN)) * trackWidth); }, [budget.limit, trackWidth, x]);
  const commit = (value: number) => onCommit(value);
  const pan = Gesture.Pan().onStart(() => { startX.value = x.value; }).onUpdate((event) => { x.value = Math.min(trackWidth, Math.max(0, startX.value + event.translationX)); }).onEnd(() => {
    const value = MIN + (Math.min(trackWidth, Math.max(0, x.value)) / trackWidth) * (MAX - MIN);
    const snapped = Math.round(value / 5000) * 5000;
    x.value = withSpring(((snapped - MIN) / (MAX - MIN)) * trackWidth);
    runOnJS(commit)(snapped);
  });
  const fillStyle = useAnimatedStyle(() => ({ backgroundColor: interpolateColor(ratio.value, [0, 1], [colors.primary, colors.warning]), width: x.value }));
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value - 12 }] }));
  const usage = spent / budget.limit;
  const meta = categoryMeta[budget.category];
  const onLayout = (event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width);
  return (
    <View style={styles.card}>
      <View style={styles.headingRow}>
        <View style={styles.categoryRow}><View style={[styles.badge, { borderColor: meta.color }]}><Text style={[styles.badgeText, { color: meta.color }]}>{meta.glyph}</Text></View><View><Text style={styles.category}>{meta.label}</Text><Text style={styles.spent}>{formatNaira(spent)} SPENT</Text></View></View>
        <View style={styles.right}><Text style={styles.limit}>{formatNaira(budget.limit)}</Text><Text style={[styles.usage, usage > 1 && styles.over]}>{Math.round(usage * 100)}% USED</Text></View>
      </View>
      <GestureDetector gesture={pan}>
        <View accessibilityLabel={`${meta.label} budget slider`} accessibilityRole="adjustable" onLayout={onLayout} style={styles.track}><Animated.View style={[styles.fill, fillStyle]} /><Animated.View style={[styles.thumb, thumbStyle]}><View style={styles.thumbCore} /></Animated.View></View>
      </GestureDetector>
      <View style={styles.scale}><Text style={styles.scaleText}>₦10K</Text><Text style={styles.scaleText}>DRAG TO SET LIMIT</Text><Text style={styles.scaleText}>₦200K</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, marginBottom: 12, padding: 17 },
  headingRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  categoryRow: { alignItems: 'center', flexDirection: 'row', gap: 11 },
  badge: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderRadius: 12, borderWidth: 1, height: 38, justifyContent: 'center', width: 38 },
  badgeText: { fontSize: 12, fontWeight: '900' },
  category: { color: colors.text, fontSize: 14, fontWeight: '800' },
  spent: { color: colors.textMuted, fontSize: 8, fontWeight: '800', letterSpacing: .8, marginTop: 4 },
  right: { alignItems: 'flex-end' },
  limit: { color: colors.text, fontSize: 15, fontWeight: '800' },
  usage: { color: colors.textMuted, fontSize: 8, fontWeight: '800', letterSpacing: .7, marginTop: 4 },
  over: { color: colors.danger },
  track: { backgroundColor: colors.border, borderRadius: radius.pill, height: 7, marginTop: 25 },
  fill: { borderRadius: radius.pill, height: 7 },
  thumb: { alignItems: 'center', backgroundColor: colors.text, borderRadius: 12, height: 24, justifyContent: 'center', position: 'absolute', top: -8.5, width: 24 },
  thumbCore: { backgroundColor: colors.background, borderRadius: 3, height: 6, width: 6 },
  scale: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 13 },
  scaleText: { color: colors.textMuted, fontSize: 7, fontWeight: '800', letterSpacing: .8 },
});
