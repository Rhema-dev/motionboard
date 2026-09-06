import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BudgetSlider } from '@/components/BudgetSlider';
import { spentForBudget } from '@/lib/finance';
import { useFinanceStore } from '@/store/useFinanceStore';
import { colors, radius } from '@/theme';

export default function InsightsScreen() {
  const budgets = useFinanceStore((state) => state.budgets);
  const transactions = useFinanceStore((state) => state.transactions);
  const updateBudget = useFinanceStore((state) => state.updateBudget);
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + spentForBudget(budget, transactions), 0);
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Back to dashboard" accessibilityRole="button" onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><Text style={styles.backText}>←</Text></Pressable>
          <View><Text style={styles.eyebrow}>BUDGET LAB / SEPTEMBER</Text><Text style={styles.title}>Tune your limits</Text></View>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <View><Text style={styles.summaryLabel}>TOTAL ENVELOPE</Text><Text style={styles.summaryValue}>₦{totalLimit.toLocaleString('en-NG')}</Text></View>
            <View style={styles.summaryRule} />
            <View><Text style={styles.summaryLabel}>UTILISATION</Text><Text style={styles.summaryValue}>{Math.round((totalSpent / totalLimit) * 100)}%</Text></View>
            <View style={styles.signal}><View style={styles.signalDot} /><Text style={styles.signalText}>ON TRACK</Text></View>
          </View>
          <View style={styles.intro}><Text style={styles.introTitle}>Shape the month.</Text><Text style={styles.instructions}>Drag each instrument to change its ceiling. Values snap to ₦5,000 increments and flow back into the shared finance model.</Text></View>
          <Animated.View layout={LinearTransition.springify()}>
            {budgets.map((budget, index) => <Animated.View entering={FadeInRight.delay(index * 70)} key={budget.category}><BudgetSlider budget={budget} onCommit={(limit) => updateBudget(budget.category, limit)} spent={spentForBudget(budget, transactions)} /></Animated.View>)}
          </Animated.View>
          <Text style={styles.footer}>LIMITS ARE STORED FOR THIS SESSION ONLY</Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.background, flex: 1 },
  shell: { alignSelf: 'center', flex: 1, maxWidth: 720, width: '100%' },
  header: { alignItems: 'center', flexDirection: 'row', gap: 14, paddingHorizontal: 18, paddingVertical: 18 },
  back: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  pressed: { opacity: .7, transform: [{ scale: .96 }] },
  backText: { color: colors.text, fontSize: 20 },
  eyebrow: { color: colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', letterSpacing: -1, marginTop: 3 },
  content: { padding: 18, paddingBottom: 48 },
  summary: { alignItems: 'center', backgroundColor: colors.surfaceRaised, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row', gap: 18, marginBottom: 28, padding: 20 },
  summaryLabel: { color: colors.textMuted, fontSize: 7, fontWeight: '900', letterSpacing: 1 },
  summaryValue: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 5 },
  summaryRule: { backgroundColor: colors.border, height: 36, width: 1 },
  signal: { alignItems: 'center', flexDirection: 'row', gap: 6, marginLeft: 'auto' },
  signalDot: { backgroundColor: colors.primary, borderRadius: 4, height: 6, width: 6 },
  signalText: { color: colors.primary, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  intro: { marginBottom: 20 },
  introTitle: { color: colors.text, fontSize: 19, fontWeight: '800' },
  instructions: { color: colors.textMuted, fontSize: 12, lineHeight: 19, marginTop: 6, maxWidth: 520 },
  footer: { color: colors.textMuted, fontSize: 7, fontWeight: '800', letterSpacing: 1.2, marginTop: 24, opacity: .6, textAlign: 'center' },
});
