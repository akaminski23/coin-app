import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useRevenueCat, PRODUCT_IDS } from '@/providers/RevenueCatProvider';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

type IoniconsName = keyof typeof Ionicons.glyphMap;

const FEATURES: { icon: IoniconsName; text: string }[] = [
  { icon: 'color-palette-outline', text: 'Custom coins - choose colors and symbols' },
  { icon: 'stats-chart-outline', text: 'Advanced statistics and charts' },
  { icon: 'sync-outline', text: 'Sync across devices' },
  { icon: 'ban-outline', text: 'No ads forever' },
  { icon: 'flash-outline', text: 'Priority support' },
];

const LEGAL_URLS = {
  privacy: 'https://akaminski23.github.io/coin-app/privacy.html',
  terms: 'https://akaminski23.github.io/coin-app/terms.html',
};

export default function PaywallScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setIsPro } = useSubscriptionStore();
  const { offerings, purchasePackage, restorePurchases, isReady } = useRevenueCat();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Get packages from RevenueCat offerings
  const monthlyPackage = offerings?.availablePackages.find(
    pkg => pkg.product.identifier === PRODUCT_IDS.MONTHLY
  );
  const yearlyPackage = offerings?.availablePackages.find(
    pkg => pkg.product.identifier === PRODUCT_IDS.YEARLY
  );
  const lifetimePackage = offerings?.availablePackages.find(
    pkg => pkg.product.identifier === PRODUCT_IDS.LIFETIME
  );

  const handlePurchase = async (plan: 'monthly' | 'yearly' | 'lifetime') => {
    const packageMap = {
      monthly: monthlyPackage,
      yearly: yearlyPackage,
      lifetime: lifetimePackage,
    };

    const selectedPackage = packageMap[plan];

    // If RevenueCat is not configured (dev mode), use mock
    if (!selectedPackage) {
      const planNames = {
        monthly: 'monthly ($2.99/mo)',
        yearly: 'yearly ($19.99/yr)',
        lifetime: 'lifetime ($49.99)',
      };

      Alert.alert('Development Mode', `You selected the ${planNames[plan]} plan`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Simulate Purchase',
          onPress: () => {
            setIsPro(true);
            Alert.alert('Congratulations!', 'Welcome to Coin Pro!', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ]);
      return;
    }

    // Real RevenueCat purchase
    setIsPurchasing(true);
    try {
      const success = await purchasePackage(selectedPackage);
      if (success) {
        setIsPro(true);
        Alert.alert('Congratulations!', 'Welcome to Coin Pro!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch {
      // Error handled in provider
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const success = await restorePurchases();
      if (success) {
        setIsPro(true);
        Alert.alert('Restored!', 'Your purchases have been restored.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('No Purchases Found', 'We could not find any previous purchases to restore.');
      }
    } catch {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <TouchableOpacity
        style={[styles.closeButton, { backgroundColor: theme.card }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.closeText, { color: theme.text }]}>✕</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={[theme.gold, theme.goldDark]}
            style={[styles.iconContainer, { shadowColor: theme.gold }]}
          >
            <Text style={[styles.iconText, { color: theme.background }]}>C</Text>
          </LinearGradient>
          <Text style={[styles.title, { color: theme.text }]}>Coin Pro</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Unlock full potential</Text>
        </View>

        {/* Features */}
        <View style={[styles.features, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name={feature.icon} size={22} color={theme.gold} />
              <Text style={[styles.featureText, { color: theme.text }]}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={[styles.plans, isPurchasing && { opacity: 0.6 }]}>
          {/* Yearly - Recommended */}
          <TouchableOpacity
            style={[
              styles.planCard,
              styles.planRecommended,
              { backgroundColor: theme.gold + '10', borderColor: theme.gold },
            ]}
            onPress={() => handlePurchase('yearly')}
            activeOpacity={0.8}
            disabled={isPurchasing || isRestoring}
          >
            <View style={[styles.saveBadge, { backgroundColor: theme.gold }]}>
              <Text style={[styles.saveBadgeText, { color: theme.background }]}>SAVE 45%</Text>
            </View>
            <Text style={[styles.planName, { color: theme.text }]}>Yearly</Text>
            <Text style={[styles.planPrice, { color: theme.gold }]}>
              {yearlyPackage?.product.priceString ?? '$19.99'}
            </Text>
            <Text style={[styles.planPeriod, { color: theme.textSecondary }]}>/ year</Text>
            <Text style={[styles.planMonthly, { color: theme.gold }]}>~$1.67/month</Text>
          </TouchableOpacity>

          <View style={styles.plansRow}>
            {/* Monthly */}
            <TouchableOpacity
              style={[styles.planCard, styles.planSmall, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => handlePurchase('monthly')}
              activeOpacity={0.8}
              disabled={isPurchasing || isRestoring}
            >
              <Text style={[styles.planName, { color: theme.text }]}>Monthly</Text>
              <Text style={[styles.planPriceSmall, { color: theme.text }]}>
                {monthlyPackage?.product.priceString ?? '$2.99'}
              </Text>
              <Text style={[styles.planPeriod, { color: theme.textSecondary }]}>/ month</Text>
            </TouchableOpacity>

            {/* Lifetime */}
            <TouchableOpacity
              style={[
                styles.planCard,
                styles.planSmall,
                styles.planLifetime,
                { backgroundColor: theme.roseGold + '10', borderColor: theme.roseGold },
              ]}
              onPress={() => handlePurchase('lifetime')}
              activeOpacity={0.8}
              disabled={isPurchasing || isRestoring}
            >
              <Text style={[styles.planName, { color: theme.text }]}>Lifetime</Text>
              <Text style={[styles.planPriceSmall, { color: theme.text }]}>
                {lifetimePackage?.product.priceString ?? '$49.99'}
              </Text>
              <Text style={[styles.planPeriod, { color: theme.textSecondary }]}>one-time</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Restore */}
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isRestoring || isPurchasing}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color={theme.textSecondary} />
          ) : (
            <Text style={[styles.restoreText, { color: theme.textSecondary }]}>Restore Purchases</Text>
          )}
        </TouchableOpacity>

        {/* Legal Links */}
        <View style={styles.legalLinks}>
          <Text style={[styles.legalAgreement, { color: theme.textSecondary }]}>
            By purchasing, you agree to our{' '}
          </Text>
          <View style={styles.legalLinksRow}>
            <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.terms)}>
              <Text style={[styles.legalLink, { color: theme.textSecondary }]}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={[styles.legalAgreement, { color: theme.textSecondary }]}> and </Text>
            <TouchableOpacity onPress={() => Linking.openURL(LEGAL_URLS.privacy)}>
              <Text style={[styles.legalLink, { color: theme.textSecondary }]}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <Text style={[styles.legal, { color: theme.textSecondary }]}>
          Payment will be charged to your iTunes account. Subscription automatically
          renews unless cancelled at least 24 hours before the end of the current
          period. Manage subscriptions in your account settings after purchase.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  iconText: {
    fontSize: 36,
    fontWeight: '200',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginTop: spacing.xs,
  },
  features: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  plans: {
    marginBottom: spacing.lg,
  },
  planCard: {
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  planRecommended: {},
  planSmall: {
    flex: 1,
    padding: spacing.md,
  },
  planLifetime: {
    marginLeft: spacing.md,
  },
  plansRow: {
    flexDirection: 'row',
  },
  saveBadge: {
    position: 'absolute',
    top: -12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  planPriceSmall: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: spacing.xs,
    flexShrink: 0,
  },
  planPeriod: {
    fontSize: 14,
  },
  planMonthly: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  restoreButton: {
    padding: spacing.md,
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 16,
  },
  legal: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.md,
  },
  legalLinks: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  legalLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalAgreement: {
    fontSize: 12,
    textAlign: 'center',
  },
  legalLink: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
