import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { formatNaira } from '@/lib/finance';
import { colors } from '@/theme';

const EXPANDED = 230;
const COLLAPSED = 126;

export function CollapsibleHeader({ balance, income, spending, scrollY }: { balance: number; income: number; spending: number; scrollY: SharedValue<number> }) {
  const headerStyle = useAnimatedStyle(() => ({ height: interpolate(scrollY.value, [0, EXPANDED - COLLAPSED], [EXPANDED, COLLAPSED], Extrapolation.CLAMP) }));
  const detailsStyle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.value, [0, 68], [1, 0], Extrapolation.CLAMP), transform: [{ translateY: interpolate(scrollY.value, [0, 68], [0, -12], Extrapolation.CLAMP) }] }));
  return (
    <Animated.View style={[styles.header, headerStyle]}>
      <View style={styles.topline}>
        <View style={styles.brand}><Image source={require('../../assets/icon.png')} style={styles.logo} /><Text style={styles.brandName}>MOTIONBOARD</Text></View>
        {/* <View style={styles.live}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE LEDGER</Text></View> */}
      </View>
      <View>
        <Text style={styles.eyebrow}>AVAILABLE BALANCE / 06 SEP</Text>
        <Text adjustsFontSizeToFit numberOfLines={1} style={styles.balance}>{formatNaira(balance)}</Text>
        <Animated.View style={[styles.details, detailsStyle]}>
          <View><Text style={styles.detailLabel}>Income</Text><Text style={styles.detailValue}>{formatNaira(income)}</Text></View>
          <View style={styles.vRule} />
          <View><Text style={styles.detailLabel}>Outflow</Text><Text style={styles.detailValue}>{formatNaira(spending)}</Text></View>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.background, justifyContent: 'space-between', overflow: 'hidden', paddingBottom: 20, paddingHorizontal: 20, paddingTop: 14 },
  topline: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  brand: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  logo: { borderRadius: 9, height: 30, width: 30 },
  brandName: { color: colors.text, fontSize: 10, fontWeight: '900', letterSpacing: 1.8 },
  live: { alignItems: 'center', borderColor: colors.border, borderRadius: 99, borderWidth: 1, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  liveDot: { backgroundColor: colors.primary, borderRadius: 4, height: 6, width: 6 },
  liveText: { color: colors.textMuted, fontSize: 8, fontWeight: '800', letterSpacing: 1 },
  eyebrow: { color: colors.textMuted, fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  balance: { color: colors.text, fontSize: 44, fontWeight: '800', letterSpacing: -2.4, marginTop: 3 },
  details: { alignItems: 'center', flexDirection: 'row', gap: 22, marginTop: 14 },
  detailLabel: { color: colors.textMuted, fontSize: 10 },
  detailValue: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: 2 },
  vRule: { backgroundColor: colors.border, height: 28, width: 1 },
});
