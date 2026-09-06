import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, FadeInRight, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AnimatedDonutChart } from '@/components/AnimatedDonutChart';
import { CollapsibleHeader } from '@/components/CollapsibleHeader';
import { SwipeableTransaction } from '@/components/SwipeableTransaction';
import { TransactionSheet } from '@/components/TransactionSheet';
import { categorySlices, expenseTotal, formatNaira, incomeTotal } from '@/lib/finance';
import { useFinanceStore } from '@/store/useFinanceStore';
import { colors, radius, shadows } from '@/theme';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 840;
  const scrollY = useSharedValue(0);
  const transactions = useFinanceStore((state) => state.transactions);
  const selectedId = useFinanceStore((state) => state.selectedTransactionId);
  const isSheetOpen = useFinanceStore((state) => state.isSheetOpen);
  const removeTransaction = useFinanceStore((state) => state.removeTransaction);
  const openTransaction = useFinanceStore((state) => state.openTransaction);
  const closeSheet = useFinanceStore((state) => state.closeSheet);
  const income = incomeTotal(transactions);
  const spending = expenseTotal(transactions);
  const slices = categorySlices(transactions);
  const selected = transactions.find((item) => item.id === selectedId);
  const onScroll = useAnimatedScrollHandler((event) => {
    const nextY = event.contentOffset.y;
    scrollY.value = Number.isFinite(nextY) ? Math.max(0, nextY) : 0;
  });
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.shell}>
        <CollapsibleHeader balance={income - spending} income={income} scrollY={scrollY} spending={spending} />
        <Animated.ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]} onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
          <View style={[styles.grid, wide && styles.gridWide]}>
            <View style={[styles.leftColumn, wide && styles.leftColumnWide]}>
              <Animated.View entering={FadeInDown.duration(450)} style={[styles.chartCard, !wide && styles.chartCardMobile]}>
                <View style={styles.chartCopy}>
                  <View style={styles.labelRow}><Text style={styles.sectionEyebrow}>SEPTEMBER / OUTFLOW</Text><Text style={styles.change}>−4.8%</Text></View>
                  <Text style={styles.spending}>{formatNaira(spending)}</Text>
                  <Text style={styles.subcopy}>Across {slices.length} active categories</Text>
                  <View style={styles.legend}>
                    {slices.slice(0, 3).map((slice) => <View key={slice.category} style={styles.legendRow}><View style={[styles.dot, { backgroundColor: slice.color }]} /><Text style={styles.legendLabel}>{slice.label}</Text><Text style={styles.legendValue}>{Math.round(slice.percentage * 100)}%</Text></View>)}
                  </View>
                </View>
                <AnimatedDonutChart slices={slices} />
              </Animated.View>
              <Animated.View entering={FadeInDown.delay(100)} style={styles.insightCard}>
                <View><Text style={styles.insightEyebrow}>PACE SIGNAL</Text><Text style={styles.insightTitle}>Spending is running below plan.</Text></View>
                <Pressable accessibilityRole="button" onPress={() => router.push('/insights')} style={({ pressed }) => [styles.arrowButton, pressed && styles.pressed]}><Text style={styles.arrow}>↗</Text></Pressable>
              </Animated.View>
            </View>
            <Animated.View entering={FadeInRight.delay(120)} style={[styles.activity, wide && styles.activityWide]}>
              <View style={styles.sectionHeading}>
                <View><Text style={styles.sectionTitle}>Recent activity</Text><Text style={styles.sectionMeta}>{transactions.length} LEDGER ENTRIES</Text></View>
                <Pressable accessibilityRole="link" onPress={() => router.push('/insights')} style={styles.budgetLink}><Text style={styles.budgetLinkText}>BUDGET LAB</Text><Text style={styles.budgetLinkArrow}>→</Text></Pressable>
              </View>
              {transactions.map((transaction) => <SwipeableTransaction key={transaction.id} onDelete={() => removeTransaction(transaction.id)} onPress={() => openTransaction(transaction.id)} transaction={transaction} />)}
            </Animated.View>
          </View>
          <Text style={styles.footer}>MOTIONBOARD  /  LOCAL DEMO DATA  /  ALL VALUES IN NGN</Text>
        </Animated.ScrollView>
      </View>
      <TransactionSheet onClose={closeSheet} open={isSheetOpen} transaction={selected} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  shell: { alignSelf: 'center', flex: 1, maxWidth: 1160, width: '100%' },
  content: { alignSelf: 'center', paddingBottom: 42, paddingHorizontal: 16, width: '100%' },
  contentWide: { paddingHorizontal: 20 },
  grid: { gap: 12 },
  gridWide: { alignItems: 'flex-start', flexDirection: 'row', gap: 18 },
  leftColumn: { gap: 12 },
  leftColumnWide: { flex: .9, minWidth: 0 },
  chartCard: { ...shadows.card, alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', minHeight: 250, overflow: 'hidden', padding: 22 },
  chartCardMobile: { alignItems: 'stretch', flexDirection: 'column', gap: 20 },
  chartCopy: { flex: 1, minWidth: 190 },
  labelRow: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  sectionEyebrow: { color: colors.textMuted, fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  change: { backgroundColor: colors.primaryMuted, borderRadius: 99, color: colors.primary, fontSize: 8, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 8, paddingVertical: 4 },
  spending: { color: colors.text, fontSize: 28, fontWeight: '800', letterSpacing: -1.2, marginTop: 8 },
  subcopy: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  legend: { borderTopColor: colors.border, borderTopWidth: 1, marginTop: 20, paddingTop: 14 },
  legendRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 8, maxWidth: 200 },
  dot: { borderRadius: 4, height: 7, width: 7 },
  legendLabel: { color: colors.textMuted, flex: 1, fontSize: 10, marginLeft: 8 },
  legendValue: { color: colors.text, fontSize: 10, fontWeight: '800' },
  insightCard: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, flexDirection: 'row', justifyContent: 'space-between', minHeight: 104, padding: 18 },
  insightEyebrow: { color: colors.background, fontSize: 8, fontWeight: '900', letterSpacing: 1.3, opacity: .6 },
  insightTitle: { color: colors.background, fontSize: 17, fontWeight: '800', letterSpacing: -.4, marginTop: 7 },
  arrowButton: { alignItems: 'center', backgroundColor: colors.background, borderRadius: 20, height: 40, justifyContent: 'center', width: 40 },
  pressed: { opacity: .7, transform: [{ scale: .97 }] },
  arrow: { color: colors.primary, fontSize: 18, fontWeight: '800' },
  activity: { marginTop: 12 },
  activityWide: { flex: 1.1, marginTop: 0, minWidth: 0 },
  sectionHeading: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14, paddingHorizontal: 2 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: -.5 },
  sectionMeta: { color: colors.textMuted, fontSize: 8, fontWeight: '800', letterSpacing: 1.1, marginTop: 4 },
  budgetLink: { alignItems: 'center', flexDirection: 'row', gap: 7 },
  budgetLinkText: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  budgetLinkArrow: { color: colors.primary, fontSize: 15 },
  footer: { color: colors.textMuted, fontSize: 7, fontWeight: '800', letterSpacing: 1.2, marginTop: 28, opacity: .6, textAlign: 'center' },
});
