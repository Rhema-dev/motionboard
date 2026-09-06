import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import type { CategorySlice } from '@/types/finance';
import { colors } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 178;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = Math.PI * 2 * RADIUS;

function Segment({ color, percentage, offset, delay }: { color: string; percentage: number; offset: number; delay: number }) {
  const progress = useSharedValue(0);
  const dashOffset = useDerivedValue(() => CIRCUMFERENCE * (1 - percentage * progress.value));
  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration: 760 + delay, easing: Easing.out(Easing.cubic) });
  }, [delay, percentage, progress]);
  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: dashOffset.value }));
  return <AnimatedCircle animatedProps={animatedProps} cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="transparent" stroke={color} strokeWidth={STROKE} strokeLinecap="round" strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`} rotation={offset * 360 - 90} origin={`${SIZE / 2}, ${SIZE / 2}`} />;
}

export function AnimatedDonutChart({ slices }: { slices: CategorySlice[] }) {
  let offset = 0;
  return (
    <View style={styles.frame} accessibilityLabel="Animated spending category chart">
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="transparent" stroke={colors.border} strokeWidth={STROKE} />
        {slices.map((slice, index) => {
          const item = <Segment key={slice.category} color={slice.color} percentage={slice.percentage} offset={offset} delay={index * 80} />;
          offset += slice.percentage;
          return item;
        })}
      </Svg>
      <View pointerEvents="none" style={styles.center}>
        <Text style={styles.centerValue}>{slices.length}</Text>
        <Text style={styles.centerLabel}>CATEGORIES</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { alignItems: 'center', alignSelf: 'center', height: SIZE, justifyContent: 'center', width: SIZE },
  center: { alignItems: 'center', position: 'absolute' },
  centerValue: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  centerLabel: { color: colors.textMuted, fontSize: 8, fontWeight: '800', letterSpacing: 1.2, marginTop: 2 },
});
