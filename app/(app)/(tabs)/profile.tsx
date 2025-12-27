import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

type IoniconsName = keyof typeof Ionicons.glyphMap;

function MenuItem({
  icon,
  label,
  onPress,
  accent,
}: {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  accent?: boolean;
}) {
  const { theme } = useTheme();

  const iconColor = accent ? theme.gold : theme.textSecondary;

  return (
    <TouchableOpacity
      style={[styles.menuItem, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text
        style={[
          styles.menuLabel,
          { color: theme.text },
          accent && { color: theme.gold, fontWeight: '600' },
        ]}
      >
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isPro } = useSubscriptionStore();
  const { totalFlips, headsCount, tailsCount } = useHistoryStore();

  const handleRateApp = () => {
    // TODO: Replace with actual App Store link after publishing
    Alert.alert('Thank you!', 'Your feedback helps us improve Coin.');
  };

  const handleContact = () => {
    Linking.openURL('mailto:23adamkaminski@gmail.com?subject=Coin App Feedback');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Stats Card */}
      <Card style={styles.statsCard}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>Your Stats</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.text }]}>{totalFlips}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Flips</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.gold }]}>{headsCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Heads</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.roseGold }]}>{tailsCount}</Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Tails</Text>
          </View>
        </View>
      </Card>

      {/* Menu */}
      <View style={styles.menu}>
        <MenuItem
          icon="settings-outline"
          label="Settings"
          onPress={() => router.push('/(app)/settings')}
        />
        {!isPro && (
          <MenuItem
            icon="star-outline"
            label="Upgrade to Pro"
            onPress={() => router.push('/(app)/paywall')}
            accent
          />
        )}
        <MenuItem
          icon="star"
          label="Rate Coin"
          onPress={handleRateApp}
        />
        <MenuItem
          icon="mail-outline"
          label="Contact Us"
          onPress={handleContact}
        />
      </View>

      <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  menu: {
    gap: spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.md,
    borderWidth: 1,
    minHeight: 44,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: spacing.lg,
  },
});
