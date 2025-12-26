import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
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
  destructive,
}: {
  icon: IoniconsName;
  label: string;
  onPress: () => void;
  accent?: boolean;
  destructive?: boolean;
}) {
  const { theme } = useTheme();

  const iconColor = destructive ? theme.error : accent ? theme.gold : theme.textSecondary;

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
          destructive && { color: theme.error },
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
  const { user, logout } = useAuthStore();
  const { isPro } = useSubscriptionStore();
  const { totalFlips, headsCount, tailsCount } = useHistoryStore();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const initial = user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* User Card */}
      <Card style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={isPro ? [theme.gold, theme.goldDark] : [theme.roseGold, theme.roseGoldDark]}
            style={styles.avatar}
          >
            <Text style={[styles.avatarText, { color: theme.background }]}>{initial}</Text>
          </LinearGradient>
          {isPro && (
            <View style={[styles.proBadge, { backgroundColor: theme.gold, borderColor: theme.card }]}>
              <Text style={[styles.proBadgeText, { color: theme.background }]}>PRO</Text>
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.text }]}>{user?.name || 'User'}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
        </View>
      </Card>

      {/* Stats Summary */}
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
          icon="chatbubble-outline"
          label="Share Feedback"
          onPress={() => Alert.alert('Thank you!', 'Rate us on the App Store')}
        />
        <MenuItem
          icon="log-out-outline"
          label="Log Out"
          onPress={handleLogout}
          destructive
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
  },
  proBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
  },
  proBadgeText: {
    fontSize: 8,
    fontWeight: '700',
  },
  userInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 2,
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
    minHeight: 44, // iOS touch target
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
