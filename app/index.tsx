import { Redirect } from 'expo-router';
import { useAppStore } from '@/stores/useAppStore';
import { useAuthStore } from '@/stores/useAuthStore';

export default function Index() {
  const { hasCompletedOnboarding } = useAppStore();
  const { isAuthenticated } = useAuthStore();

  // Flow: Onboarding → Auth → App
  if (!hasCompletedOnboarding) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
