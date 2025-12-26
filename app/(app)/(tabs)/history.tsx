import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui';
import { useHistoryStore, FlipRecord, FREE_HISTORY_LIMIT } from '@/stores/useHistoryStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function FlipItem({ item }: { item: FlipRecord }) {
  const { theme } = useTheme();
  const isHeads = item.result === 'heads';

  return (
    <View style={[styles.flipItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.flipIcon, { backgroundColor: isHeads ? theme.gold + '20' : theme.roseGold + '20' }]}>
        <Text style={[styles.flipIconText, { color: theme.text }]}>{isHeads ? 'H' : 'T'}</Text>
      </View>
      <View style={styles.flipInfo}>
        <Text style={[styles.flipResult, { color: isHeads ? theme.gold : theme.roseGold }]}>
          {isHeads ? 'Heads' : 'Tails'}
        </Text>
        <Text style={[styles.flipTime, { color: theme.textSecondary }]}>{formatTime(item.timestamp)}</Text>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { flips, totalFlips, headsCount, tailsCount, clearHistory, getVisibleFlips } = useHistoryStore();
  const { isPro } = useSubscriptionStore();

  const visibleFlips = getVisibleFlips(isPro);
  const hasMoreHistory = !isPro && flips.length > FREE_HISTORY_LIMIT;
  const headsPercentage = totalFlips > 0 ? Math.round((headsCount / totalFlips) * 100) : 50;
  const tailsPercentage = 100 - headsPercentage;

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to delete all flip history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  const handleStatsTap = () => {
    if (!isPro) {
      router.push('/(app)/paywall');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Stats Card */}
      <TouchableOpacity onPress={handleStatsTap} activeOpacity={isPro ? 1 : 0.7}>
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={[styles.statsTitle, { color: theme.text }]}>Statistics</Text>
            {!isPro && (
              <View style={[styles.proBadge, { backgroundColor: theme.gold }]}>
                <Text style={[styles.proBadgeText, { color: theme.background }]}>PRO</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.gold }]}>{headsCount}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Heads</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{totalFlips}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.roseGold }]}>{tailsCount}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Tails</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.roseGold + '40' }]}>
              <LinearGradient
                colors={[theme.gold, theme.goldDark]}
                style={[styles.progressFill, { width: `${headsPercentage}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{headsPercentage}%</Text>
              <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>{tailsPercentage}%</Text>
            </View>
          </View>

          {!isPro && (
            <Text style={[styles.proHint, { color: theme.gold }]}>Unlock advanced statistics</Text>
          )}
        </Card>
      </TouchableOpacity>

      {/* History List */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Flips</Text>

      {visibleFlips.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🪙</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>No history yet</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>Flip a coin to see your history</Text>
        </View>
      ) : (
        <FlatList
          data={visibleFlips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FlipItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            hasMoreHistory ? (
              <TouchableOpacity
                style={[styles.upgradePrompt, { backgroundColor: theme.card, borderColor: theme.gold }]}
                onPress={() => router.push('/(app)/paywall')}
              >
                <Text style={[styles.upgradePromptText, { color: theme.gold }]}>
                  Upgrade to Pro to see full history
                </Text>
                <Text style={[styles.upgradePromptSubtext, { color: theme.textSecondary }]}>
                  {flips.length - FREE_HISTORY_LIMIT} more flips hidden
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      )}
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
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  proBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  progressLabel: {
    fontSize: 12,
  },
  proHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  flipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  flipIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipIconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  flipInfo: {
    marginLeft: spacing.md,
  },
  flipResult: {
    fontSize: 16,
    fontWeight: '600',
  },
  flipTime: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  upgradePrompt: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  upgradePromptText: {
    fontSize: 14,
    fontWeight: '600',
  },
  upgradePromptSubtext: {
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
