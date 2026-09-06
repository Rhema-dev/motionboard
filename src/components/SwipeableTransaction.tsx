import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { LinearTransition, interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { categoryMeta, formatNaira } from '@/lib/finance';
import { colors, radius } from '@/theme';
import type { Transaction } from '@/types/finance';

const ACTION_WIDTH = 92;

export function SwipeableTransaction({ transaction, onDelete, onPress }: { transaction: Transaction; onDelete: () => void; onPress: () => void }) {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const pan = Gesture.Pan().activeOffsetX([-10, 10]).failOffsetY([-12, 12])
    .onStart(() => { startX.value = translateX.value; })
    .onUpdate((event) => { translateX.value = Math.min(0, Math.max(-ACTION_WIDTH, startX.value + event.translationX)); })
    .onEnd((event) => { translateX.value = withSpring(translateX.value < -ACTION_WIDTH / 2 || event.velocityX < -500 ? -ACTION_WIDTH : 0, { damping: 19, stiffness: 230 }); });
  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: translateX.value }] }));
  const actionStyle = useAnimatedStyle(() => ({ opacity: interpolate(translateX.value, [-ACTION_WIDTH, -18], [1, 0]), transform: [{ scale: interpolate(translateX.value, [-ACTION_WIDTH, 0], [1, .82]) }] }));
  const meta = transaction.kind === 'expense' ? categoryMeta[transaction.category] : { color: colors.primary, glyph: '↗', label: 'Income' };
  const date = new Date(`${transaction.occurredAt}T12:00:00`).toLocaleDateString('en-NG', { day: '2-digit', month: 'short' });
  return (
    <Animated.View layout={LinearTransition.springify()} style={styles.clip}>
      <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteAction}><Animated.Text style={[styles.deleteText, actionStyle]}>DELETE</Animated.Text></Pressable>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.row, rowStyle]}>
          <Pressable accessibilityRole="button" onPress={onPress} style={styles.pressable}>
            <View style={[styles.icon, { borderColor: meta.color }]}><Text style={[styles.iconText, { color: meta.color }]}>{meta.glyph}</Text></View>
            <View style={styles.copy}><Text style={styles.merchant}>{transaction.merchant}</Text><Text style={styles.meta}>{meta.label}  ·  {date}</Text></View>
            <View style={styles.amountBlock}><Text style={transaction.kind === 'income' ? styles.income : styles.expense}>{transaction.kind === 'expense' ? '−' : '+'}{formatNaira(transaction.amount)}</Text><Text style={styles.cleared}>CLEARED</Text></View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  clip: { borderRadius: radius.md, marginBottom: 9, overflow: 'hidden' },
  deleteAction: { alignItems: 'flex-end', backgroundColor: colors.danger, bottom: 0, justifyContent: 'center', left: 0, paddingRight: 17, position: 'absolute', right: 0, top: 0 },
  deleteText: { color: '#fff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  row: { backgroundColor: colors.surface },
  pressable: { alignItems: 'center', flexDirection: 'row', minHeight: 74, paddingHorizontal: 14, paddingVertical: 12 },
  icon: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderRadius: 14, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  iconText: { fontSize: 14, fontWeight: '900' },
  copy: { flex: 1, marginLeft: 12 },
  merchant: { color: colors.text, fontSize: 14, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 10, marginTop: 5, textTransform: 'uppercase' },
  amountBlock: { alignItems: 'flex-end' },
  expense: { color: colors.text, fontSize: 13, fontWeight: '800' },
  income: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  cleared: { color: colors.textMuted, fontSize: 7, fontWeight: '800', letterSpacing: .9, marginTop: 5 },
});
