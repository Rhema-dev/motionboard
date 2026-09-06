import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { categoryMeta, formatNaira } from '@/lib/finance';
import { colors, radius, shadows } from '@/theme';
import type { Transaction } from '@/types/finance';

const SHEET_HEIGHT = 390;

export function TransactionSheet({ open, transaction, onClose }: { open: boolean; transaction?: Transaction; onClose: () => void }) {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const startY = useSharedValue(0);
  const { width } = useWindowDimensions();
  useEffect(() => { translateY.value = open ? withSpring(0, { damping: 23, stiffness: 210 }) : withTiming(SHEET_HEIGHT, { duration: 220 }); }, [open, translateY]);
  const dismiss = () => onClose();
  const pan = Gesture.Pan().onStart(() => { startY.value = translateY.value; }).onUpdate((event) => { translateY.value = Math.max(0, startY.value + event.translationY); }).onEnd((event) => {
    if (translateY.value > 105 || event.velocityY > 700) { translateY.value = withTiming(SHEET_HEIGHT); runOnJS(dismiss)(); } else { translateY.value = withSpring(0); }
  });
  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: interpolate(translateY.value, [0, SHEET_HEIGHT], [.7, 0]) }));
  const meta = transaction?.kind === 'expense' ? categoryMeta[transaction.category] : undefined;
  return (
    <View pointerEvents={open ? 'auto' : 'none'} style={StyleSheet.absoluteFill}>
      <Pressable accessibilityLabel="Close transaction details" onPress={onClose} style={StyleSheet.absoluteFill}><Animated.View style={[styles.backdrop, backdropStyle]} /></Pressable>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, width > 720 && styles.sheetDesktop, sheetStyle]}>
          <View style={styles.handle} />
          <View style={styles.topline}><Text style={styles.eyebrow}>TRANSACTION / DETAIL</Text><View style={[styles.status, { borderColor: meta?.color ?? colors.primary }]}><Text style={[styles.statusText, { color: meta?.color ?? colors.primary }]}>CLEARED</Text></View></View>
          <Text style={styles.merchant}>{transaction?.merchant ?? ''}</Text>
          <Text style={styles.amount}>{transaction ? `${transaction.kind === 'expense' ? '−' : '+'}${formatNaira(transaction.amount)}` : ''}</Text>
          <View style={styles.rule} />
          <View style={styles.detailRow}><Text style={styles.label}>Category</Text><Text style={styles.value}>{transaction ? (transaction.kind === 'income' ? 'Income' : categoryMeta[transaction.category].label) : ''}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>Settlement date</Text><Text style={styles.value}>{transaction?.occurredAt ?? ''}</Text></View>
          <View style={styles.detailRow}><Text style={styles.label}>Reference</Text><Text style={styles.reference}>MB/{transaction?.id.toUpperCase() ?? ''}/0906</Text></View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: '#000', bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  sheet: { ...shadows.card, backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, borderWidth: 1, bottom: 0, height: SHEET_HEIGHT, padding: 24, position: 'absolute', width: '100%' },
  sheetDesktop: { alignSelf: 'center', borderRadius: radius.xl, bottom: 20, left: '50%', marginLeft: -280, maxWidth: 560 },
  handle: { alignSelf: 'center', backgroundColor: colors.textMuted, borderRadius: 2, height: 4, marginBottom: 24, opacity: .5, width: 42 },
  topline: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  status: { borderRadius: 99, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 5 },
  statusText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  merchant: { color: colors.text, fontSize: 26, fontWeight: '800', letterSpacing: -.8, marginTop: 20 },
  amount: { color: colors.primary, fontSize: 36, fontWeight: '800', letterSpacing: -1.5, marginTop: 5 },
  rule: { backgroundColor: colors.border, height: 1, marginVertical: 22 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  label: { color: colors.textMuted, fontSize: 12 },
  value: { color: colors.text, fontSize: 12, fontWeight: '700' },
  reference: { color: colors.text, fontFamily: 'monospace', fontSize: 11 },
});
