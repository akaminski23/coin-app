import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CoinFlip } from '@/components/CoinFlip';
import { TrialExpiredModal } from '@/components/TrialExpiredModal';
import { useTheme } from '@/hooks/useTheme';
import { useHistoryStore, FREE_DAILY_LIMIT } from '@/stores/useHistoryStore';
import { useSubscriptionStore, TRIAL_DAYS } from '@/stores/useSubscriptionStore';
import { spacing } from '@/constants/spacing';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { totalFlips, dailyFlips, getRemainingFlips } = useHistoryStore();
  const { isPro, isTrialActive, isTrialExpired, getTrialDaysRemaining } = useSubscriptionStore();

  const trialDays = getTrialDaysRemaining();
  const trialActive = isTrialActive();
  const trialExpired = isTrialExpired();
  const remainingFlips = getRemainingFlips(isPro);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={['transparent', theme.gold + '05', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header stats */}
      <View style={styles.headerStats}>
        {totalFlips > 0 && (
          <Text style={[styles.totalFlips, { color: theme.textSecondary }]}>
            {totalFlips} {totalFlips === 1 ? 'flip' : 'flips'} total
          </Text>
        )}

        {/* Trial badge for FREE users */}
        {trialActive && (
          <View style={[
            styles.trialBadge,
            {
              backgroundColor: trialDays <= 2 ? theme.error + '15' : theme.gold + '15',
              borderColor: trialDays <= 2 ? theme.error : theme.gold,
            }
          ]}>
            <Ionicons
              name="time-outline"
              size={14}
              color={trialDays <= 2 ? theme.error : theme.gold}
            />
            <Text style={[
              styles.trialBadgeText,
              { color: trialDays <= 2 ? theme.error : theme.gold }
            ]}>
              {trialDays === TRIAL_DAYS ? `${TRIAL_DAYS}-day trial` : `${trialDays} day${trialDays !== 1 ? 's' : ''} left`}
            </Text>
          </View>
        )}

        {/* Daily flip limit badge for trial users */}
        {trialActive && (
          <View style={[
            styles.flipsBadge,
            {
              backgroundColor: remainingFlips === 0 ? theme.error + '15' : theme.card,
              borderColor: remainingFlips === 0 ? theme.error : theme.border,
            }
          ]}>
            <Ionicons
              name={remainingFlips > 0 ? 'flash' : 'flash-off'}
              size={14}
              color={remainingFlips > 0 ? theme.gold : theme.error}
            />
            <Text style={[
              styles.flipsBadgeText,
              { color: remainingFlips > 0 ? theme.text : theme.error }
            ]}>
              {dailyFlips}/{FREE_DAILY_LIMIT}
            </Text>
          </View>
        )}

        {/* PRO badge */}
        {isPro && (
          <View style={[styles.proBadge, { backgroundColor: theme.gold }]}>
            <Ionicons name="infinite" size={12} color={theme.background} />
            <Text style={[styles.proBadgeText, { color: theme.background }]}>PRO</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <CoinFlip />
      </View>

      <Text style={[styles.footerHint, { color: theme.textSecondary }]}>Tap to decide your fate</Text>

      {/* HARD PAYWALL - blocks entire app when trial expires */}
      <TrialExpiredModal visible={trialExpired} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    overflow: 'visible',
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  totalFlips: {
    fontSize: 14,
  },
  trialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  trialBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  flipsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  flipsBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  footerHint: {
    fontSize: 12,
    letterSpacing: 1,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
