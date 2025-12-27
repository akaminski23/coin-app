import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui';
import { useAppStore } from '@/stores/useAppStore';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

export default function GetStartedScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setOnboardingCompleted } = useAppStore();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleGetStarted = () => {
    setOnboardingCompleted();
    router.replace('/(app)/(tabs)');
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={['transparent', theme.roseGold + '08', 'transparent']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.coinContainer,
            { transform: [{ scale: scaleAnim }, { rotate: rotation }] },
          ]}
        >
          <View style={[styles.coinOuter, { shadowColor: theme.roseGold }]}>
            <LinearGradient
              colors={[theme.roseGoldLight, theme.roseGold, theme.roseGoldDark]}
              style={styles.coinGradient}
            >
              <Text style={[styles.questionMark, { color: theme.background }]}>?</Text>
            </LinearGradient>
          </View>
        </Animated.View>

        <Text style={[styles.title, { color: theme.text }]}>Ready to Decide?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Let fate decide for you.{'\n'}Simple. Fast. Fun.
        </Text>

        <View style={styles.benefits}>
          <Text style={[styles.benefit, { color: theme.roseGold }]}>+ Beautiful animations</Text>
          <Text style={[styles.benefit, { color: theme.roseGold }]}>+ Flip history & stats</Text>
          <Text style={[styles.benefit, { color: theme.roseGold }]}>+ Custom coins (PRO)</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
          <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.gold }]} />
        </View>

        <Button title="Get Started" onPress={handleGetStarted} />
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
  coinContainer: {
    marginBottom: spacing.xl,
  },
  coinOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  coinGradient: {
    flex: 1,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionMark: {
    fontSize: 72,
    fontWeight: '300',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 28,
  },
  benefits: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  benefit: {
    fontSize: 14,
    textAlign: 'center',
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
