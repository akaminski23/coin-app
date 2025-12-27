import { useEffect } from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppStore } from '@/stores/useAppStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { RevenueCatProvider } from '@/providers/RevenueCatProvider';
import { theme } from '@/constants/colors';

export default function RootLayout() {
  const { isHydrated: appHydrated } = useAppStore();
  const { initializeTrial } = useSubscriptionStore();

  // Initialize trial on first launch
  useEffect(() => {
    initializeTrial();
  }, [initializeTrial]);

  if (!appHydrated) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={theme.gold} />
      </View>
    );
  }

  return (
    <RevenueCatProvider>
      <StatusBar style="light" />
      <Slot />
    </RevenueCatProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
});
