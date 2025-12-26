import { View, Text, StyleSheet, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { spacing } from '@/constants/spacing';

const FEATURES = [
  {
    icon: 'dice-outline' as const,
    title: 'Random Result',
    description: 'True randomness for fair decisions',
  },
  {
    icon: 'sparkles' as const,
    title: 'Dramatic Animations',
    description: '3D flip with particle burst and bounce effect',
  },
  {
    icon: 'stats-chart' as const,
    title: 'Decision History',
    description: 'Track all your flips and statistics',
  },
];

export default function FeaturesScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const animations = useRef(FEATURES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      })
    );
    Animated.stagger(150, staggeredAnimations).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>Why Coin?</Text>

          <View style={styles.features}>
            {FEATURES.map((feature, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    opacity: animations[index],
                    transform: [
                      {
                        translateY: animations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.featureIcon, { backgroundColor: theme.gold + '15' }]}>
                  <Ionicons name={feature.icon} size={28} color={theme.gold} />
                </View>
                <View style={styles.featureText}>
                  <Text style={[styles.featureTitle, { color: theme.text }]}>{feature.title}</Text>
                  <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>{feature.description}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
          <View style={[styles.dot, styles.dotActive, { backgroundColor: theme.gold }]} />
          <View style={[styles.dot, { backgroundColor: theme.border }]} />
        </View>

        <Button
          title="Next"
          onPress={() => router.push('/(onboarding)/get-started')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  features: {
    gap: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: 16,
    gap: spacing.md,
    borderWidth: 1,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
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
