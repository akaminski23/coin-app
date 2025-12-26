import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={['transparent', theme.gold + '05', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.coinIcon, { shadowColor: theme.gold }]}>
          <LinearGradient
            colors={[theme.goldLight, theme.gold, theme.goldDark]}
            style={styles.coinGradient}
          >
            <Text style={[styles.coinText, { color: theme.background }]}>C</Text>
          </LinearGradient>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>COIN</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Decision Maker</Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Make decisions the dramatic way.{'\n'}
          Flip a coin and let fate decide.
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.gold }]} />
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
        </View>

        <Button
          title="Next"
          onPress={() => router.push('/(onboarding)/features')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  coinIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.xl,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  coinGradient: {
    flex: 1,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinText: {
    fontSize: 56,
    fontWeight: '200',
  },
  title: {
    fontSize: 48,
    fontWeight: '200',
    letterSpacing: 16,
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 4,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
    marginTop: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
});
