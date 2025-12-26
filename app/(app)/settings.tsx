import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '@/stores/useAppStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

// __DEV__ is a built-in React Native global:
// true  → Expo Go, development
// false → TestFlight, App Store (production builds)

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const { resetOnboarding } = useAppStore();
  const { clearHistory, resetDailyFlips, dailyFlips } = useHistoryStore();
  const { soundEnabled, setSoundEnabled, animationsEnabled, setAnimationsEnabled } = useSettingsStore();
  const { reset: resetSubscription, isPro, getTrialDaysRemaining, initializeTrial } = useSubscriptionStore();

  const handleResetOnboarding = () => {
    Alert.alert('Reset Onboarding', 'Are you sure you want to see the onboarding again?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        onPress: () => {
          resetOnboarding();
          router.replace('/(onboarding)/welcome');
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to delete all flip history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            clearHistory();
            Alert.alert('Done', 'History has been cleared');
          },
        },
      ]
    );
  };

  const handleResetTrial = () => {
    Alert.alert(
      'Reset Trial',
      'This will reset your trial, PRO status, and daily flips. Use for testing.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetSubscription();
            resetDailyFlips();
            initializeTrial();
            Alert.alert('Done', 'Trial has been reset. You now have a fresh 7-day trial with 5 flips.');
          },
        },
      ]
    );
  };

  const handleTogglePro = () => {
    const { setIsPro } = useSubscriptionStore.getState();
    setIsPro(!isPro);
    Alert.alert('Done', isPro ? 'PRO status removed' : 'PRO status activated');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeButton, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Appearance</Text>

          <View style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={22} color={theme.textSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.gold }}
              thumbColor={theme.text}
            />
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Preferences</Text>

          <View style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Sounds</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: theme.border, true: theme.gold }}
              thumbColor={theme.text}
            />
          </View>

          <View style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="sparkles-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Particle Animations</Text>
            </View>
            <Switch
              value={animationsEnabled}
              onValueChange={setAnimationsEnabled}
              trackColor={{ false: theme.border, true: theme.gold }}
              thumbColor={theme.text}
            />
          </View>
        </View>

        {/* Data */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Data</Text>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleClearData}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="trash-outline" size={22} color={theme.error} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Clear History</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleResetOnboarding}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="refresh-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Show Onboarding Again</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>About</Text>

          <View style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>App Version</Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.textSecondary }]}>1.0.0</Text>
          </View>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy link will be here')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => Alert.alert('Terms of Service', 'Terms of service link will be here')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={22} color={theme.textSecondary} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Developer Tools - only in development */}
        {__DEV__ && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.error }]}>🛠 Developer Tools</Text>

            <View style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.settingInfo}>
                <Ionicons name="time-outline" size={22} color={theme.textSecondary} />
                <Text style={[styles.settingLabel, { color: theme.text }]}>Trial Status</Text>
              </View>
              <Text style={[styles.settingValue, { color: isPro ? theme.gold : theme.text }]}>
                {isPro ? 'PRO' : `${getTrialDaysRemaining()} days left`}
              </Text>
            </View>

            <View style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.settingInfo}>
                <Ionicons name="flash" size={22} color={theme.gold} />
                <Text style={[styles.settingLabel, { color: theme.text }]}>Daily Flips Used</Text>
              </View>
              <Text style={[styles.settingValue, { color: dailyFlips >= 5 ? theme.error : theme.text }]}>
                {isPro ? '∞' : `${dailyFlips}/5`}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={handleResetTrial}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="refresh-circle-outline" size={22} color={theme.error} />
                <Text style={[styles.settingLabel, { color: theme.text }]}>Reset Trial</Text>
              </View>
              <Text style={[styles.settingValue, { color: theme.textSecondary }]}>Start fresh 7-day trial</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRow, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={handleTogglePro}
            >
              <View style={styles.settingInfo}>
                <Ionicons name="star-outline" size={22} color={theme.gold} />
                <Text style={[styles.settingLabel, { color: theme.text }]}>Toggle PRO</Text>
              </View>
              <Text style={[styles.settingValue, { color: isPro ? theme.gold : theme.textSecondary }]}>
                {isPro ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
  },
});
