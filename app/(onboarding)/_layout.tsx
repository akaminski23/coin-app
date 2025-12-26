import { Stack } from 'expo-router';
import { theme } from '@/constants/colors';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: false,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
