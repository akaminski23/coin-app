import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/useAppStore';

export default function Index() {
  const { hasCompletedOnboarding } = useAppStore();

  // Flow: Onboarding → App (no auth required)
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
