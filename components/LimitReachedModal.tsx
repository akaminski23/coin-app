import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';
import { FREE_DAILY_LIMIT } from '@/stores/useHistoryStore';

interface LimitReachedModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LimitReachedModal({ visible, onClose }: LimitReachedModalProps) {
  const router = useRouter();
  const { theme } = useTheme();

  const handleUpgrade = () => {
    onClose();
    router.push('/(app)/paywall');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: theme.card }]} onPress={(e) => e.stopPropagation()}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.gold + '20' }]}>
            <Ionicons name="flash" size={40} color={theme.gold} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>Daily Limit Reached</Text>

          {/* Description */}
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            You've used all {FREE_DAILY_LIMIT} free flips for today.{'\n'}
            Upgrade to Pro for unlimited flips!
          </Text>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <Ionicons name="infinite" size={20} color={theme.gold} />
              <Text style={[styles.featureText, { color: theme.text }]}>Unlimited daily flips</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="time-outline" size={20} color={theme.gold} />
              <Text style={[styles.featureText, { color: theme.text }]}>Full flip history</Text>
            </View>
            <View style={styles.featureRow}>
              <Ionicons name="stats-chart-outline" size={20} color={theme.gold} />
              <Text style={[styles.featureText, { color: theme.text }]}>Advanced statistics</Text>
            </View>
          </View>

          {/* Upgrade Button */}
          <TouchableOpacity onPress={handleUpgrade} activeOpacity={0.8}>
            <LinearGradient
              colors={[theme.gold, theme.goldDark]}
              style={styles.upgradeButton}
            >
              <Ionicons name="star" size={20} color={theme.background} />
              <Text style={[styles.upgradeButtonText, { color: theme.background }]}>Upgrade to Pro</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>Maybe Later</Text>
          </TouchableOpacity>

          {/* Reset info */}
          <Text style={[styles.resetInfo, { color: theme.textSecondary }]}>
            Free flips reset at midnight
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  features: {
    width: '100%',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: 15,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 200,
  },
  upgradeButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  closeButtonText: {
    fontSize: 15,
  },
  resetInfo: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
