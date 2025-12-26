import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';
import { TRIAL_DAYS } from '@/stores/useSubscriptionStore';

interface TrialExpiredModalProps {
  visible: boolean;
}

export function TrialExpiredModal({ visible }: TrialExpiredModalProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const handleUpgrade = () => {
    router.push('/(app)/paywall');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.card }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
            <Ionicons name="time" size={48} color={theme.error} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>Trial Ended</Text>

          {/* Description */}
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Your {TRIAL_DAYS}-day free trial has ended.{'\n'}
            Upgrade to Coin Pro to continue flipping!
          </Text>

          {/* Features reminder */}
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <Ionicons name="infinite" size={20} color={theme.gold} />
              <Text style={[styles.featureText, { color: theme.text }]}>Unlimited coin flips</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="stats-chart-outline" size={20} color={theme.gold} />
              <Text style={[styles.featureText, { color: theme.text }]}>Full statistics & history</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="heart" size={20} color={theme.gold} />
              <Text style={[styles.featureText, { color: theme.text }]}>Support indie development</Text>
            </View>
          </View>

          {/* Upgrade Button */}
          <Pressable onPress={handleUpgrade}>
            <LinearGradient
              colors={[theme.gold, theme.goldDark]}
              style={styles.upgradeButton}
            >
              <Ionicons name="star" size={22} color={theme.background} />
              <Text style={[styles.upgradeButtonText, { color: theme.background }]}>
                Upgrade to Pro
              </Text>
            </LinearGradient>
          </Pressable>

          {/* Pricing hint */}
          <Text style={[styles.pricingHint, { color: theme.textSecondary }]}>
            Starting at $2.99/month
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  features: {
    width: '100%',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    fontSize: 16,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    minWidth: 220,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  pricingHint: {
    fontSize: 14,
    marginTop: spacing.md,
  },
});
