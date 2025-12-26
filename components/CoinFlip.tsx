import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useSubscriptionStore } from '@/stores/useSubscriptionStore';
import { useSound } from '@/hooks/useSound';
import { LimitReachedModal } from './LimitReachedModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COIN_SIZE = SCREEN_WIDTH * 0.55;
const PARTICLE_COUNT = 12;

const createParticles = () => {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    translateX: new Animated.Value(0),
    translateY: new Animated.Value(0),
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
    rotation: new Animated.Value(0),
  }));
};

// Coin colors - balanced contrast
const GOLD = {
  light: '#FFF8DC',    // Bright highlight
  main: '#FFD700',     // Main gold
  dark: '#B8860B',     // Medium dark for contrast
  stroke: '#DAA520',   // Golden stroke
  letter: '#5C4A00',   // Dark brown for letter (high contrast)
  dots: '#F0E68C',     // Khaki/cream for dots
};

const ROSE = {
  light: '#FFD1D8',    // Bright highlight
  main: '#E8909A',     // Main rose
  dark: '#C97080',     // Medium dark for contrast
  stroke: '#D4848E',   // Rose stroke
  letter: '#5C2A35',   // Dark rose for letter (high contrast)
  dots: '#E8B4B8',     // Light rose for dots
};

// Reusable coin face component - SHARP & HIGH CONTRAST
const CoinFaceView = ({
  size,
  letter,
  colors
}: {
  size: number;
  letter: 'H' | 'T';
  colors: { light: string; main: string; dark: string; stroke: string; letter: string; dots: string }
}) => {
  // Pre-calculate dot positions - moved slightly inward
  const dots = [0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: 100 + Math.cos(rad) * 80,
      y: 100 + Math.sin(rad) * 80,
    };
  });

  return (
    <View style={[styles.coinFace, { width: size, height: size, shadowColor: colors.dark }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        {/* Outer edge - very dark for sharp border */}
        <Circle cx="100" cy="100" r="99" fill={colors.stroke} />
        {/* Outer ring - dark gold/rose */}
        <Circle cx="100" cy="100" r="96" fill={colors.dark} />
        {/* Main coin face */}
        <Circle cx="100" cy="100" r="90" fill={colors.main} />
        {/* Highlight for 3D effect - brighter, more visible */}
        <Circle cx="100" cy="100" r="55" fill={colors.light} opacity={0.35} />
        {/* Inner decorative ring - visible but not too dark */}
        <Circle cx="100" cy="100" r="72" fill="none" stroke={colors.dark} strokeWidth="3" opacity={0.6} />
        {/* Center letter - HIGH CONTRAST */}
        <SvgText
          x="100"
          y="100"
          dy="0.35em"
          fontSize="78"
          fontWeight="900"
          fill={colors.letter}
          textAnchor="middle"
        >
          {letter}
        </SvgText>
        {/* Decorative dots - cream/gold tinted */}
        {dots.map((dot, i) => (
          <Circle key={i} cx={dot.x} cy={dot.y} r="7" fill={colors.dots} stroke={colors.dark} strokeWidth="1" />
        ))}
      </Svg>
    </View>
  );
};

// HEADS coin - Gold
const HeadsCoin = ({ size }: { size: number }) => (
  <CoinFaceView size={size} letter="H" colors={GOLD} />
);

// TAILS coin - Rose Gold (uses SAME component, different props)
const TailsCoin = ({ size }: { size: number }) => (
  <CoinFaceView size={size} letter="T" colors={ROSE} />
);

interface ParticleProps {
  animatedValues: {
    translateX: Animated.Value;
    translateY: Animated.Value;
    scale: Animated.Value;
    opacity: Animated.Value;
    rotation: Animated.Value;
  };
  angle: number;
  gold: string;
  roseGold: string;
}

const Particle = ({ animatedValues, angle, gold, roseGold }: ParticleProps) => {
  const distance = 80 + Math.random() * 60;
  const size = 8 + Math.random() * 8;
  const isGold = Math.random() > 0.5;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isGold ? gold : roseGold,
          transform: [
            {
              translateX: animatedValues.translateX.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Math.cos(angle) * distance],
              }),
            },
            {
              translateY: animatedValues.translateY.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Math.sin(angle) * distance],
              }),
            },
            { scale: animatedValues.scale },
            {
              rotate: animatedValues.rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
              }),
            },
          ],
          opacity: animatedValues.opacity,
        },
      ]}
    />
  );
};

interface CoinFlipProps {
  onFlipComplete?: (result: 'heads' | 'tails') => void;
}

export function CoinFlip({ onFlipComplete }: CoinFlipProps) {
  const { theme } = useTheme();
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { addFlip, canFlip, incrementDailyFlips, resetDailyFlipsIfNewDay } = useHistoryStore();
  const { isPro, canUseApp } = useSubscriptionStore();
  const { playFlip, playHeads, playTails, playTap } = useSound();

  // Reset daily flips counter if new day
  useEffect(() => {
    resetDailyFlipsIfNewDay();
  }, [resetDailyFlipsIfNewDay]);

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const bounceAnimation = useRef(new Animated.Value(1)).current;
  const glowAnimation = useRef(new Animated.Value(0)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0.5)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const particles = useRef(createParticles()).current;

  React.useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, [glowAnimation]);

  const animateParticles = useCallback(() => {
    const animations = particles.map((p, i) => {
      const delay = i * 30;

      p.translateX.setValue(0);
      p.translateY.setValue(0);
      p.scale.setValue(0);
      p.opacity.setValue(0);
      p.rotation.setValue(0);

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(p.translateX, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(p.translateY, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(p.scale, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(p.scale, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
          Animated.sequence([
            Animated.timing(p.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.delay(300),
            Animated.timing(p.opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]),
          Animated.timing(p.rotation, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      ]);
    });
    Animated.parallel(animations).start();
  }, [particles]);

  const flipCoin = useCallback(() => {
    if (isFlipping) return;

    // Check if user can use app (trial active or pro)
    // Note: TrialExpiredModal blocks the screen when trial expires
    if (!canUseApp()) {
      return;
    }

    // Check daily limit for non-PRO users (5 flips/day during trial)
    if (!isPro && !canFlip(isPro)) {
      setShowLimitModal(true);
      return;
    }

    setIsFlipping(true);
    setResult(null);
    resultOpacity.setValue(0);
    resultScale.setValue(0.5);

    // Increment daily flip counter for non-PRO users
    if (!isPro) {
      incrementDailyFlips();
    }

    // Play flip sound at start
    playFlip();

    const newResult = Math.random() > 0.5 ? 'heads' : 'tails';
    const fullRotations = 4 + Math.floor(Math.random() * 3);
    const finalRotation = fullRotations + (newResult === 'tails' ? 0.5 : 0);

    flipAnimation.setValue(0);

    Animated.sequence([
      Animated.timing(flipAnimation, {
        toValue: finalRotation,
        duration: 1800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.spring(bounceAnimation, { toValue: 0.9, friction: 3, tension: 200, useNativeDriver: true }),
        Animated.spring(bounceAnimation, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
      ]),
    ]).start(() => {
      setResult(newResult);
      setIsFlipping(false);
      addFlip(newResult);
      onFlipComplete?.(newResult);
      animateParticles();

      // Play result sound
      if (newResult === 'heads') {
        playHeads();
      } else {
        playTails();
      }

      Animated.parallel([
        Animated.spring(resultScale, { toValue: 1, friction: 4, tension: 100, useNativeDriver: true }),
        Animated.timing(resultOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    });
  }, [isFlipping, isPro, canUseApp, canFlip, incrementDailyFlips, flipAnimation, bounceAnimation, animateParticles, resultOpacity, resultScale, addFlip, onFlipComplete, playFlip, playHeads, playTails]);

  const handlePressIn = () => {
    playTap();
    Animated.spring(buttonScale, { toValue: 0.95, friction: 5, tension: 300, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, friction: 5, tension: 300, useNativeDriver: true }).start();
  };

  // 2D flip simulation using scaleX (avoids 3D perspective clipping issues)
  // Each full rotation: 1 -> 0 -> -1 -> 0 -> 1
  const buildScaleXRanges = () => {
    const inputRange: number[] = [];
    const outputRange: number[] = [];

    for (let i = 0; i <= 7; i++) {
      inputRange.push(i, i + 0.25, i + 0.5, i + 0.75);
      outputRange.push(1, 0, -1, 0);
    }
    inputRange.push(8);
    outputRange.push(1);

    return { inputRange, outputRange };
  };

  const scaleXRanges = buildScaleXRanges();
  const coinScaleX = flipAnimation.interpolate({
    inputRange: scaleXRanges.inputRange,
    outputRange: scaleXRanges.outputRange,
  });

  // Opacity: HEADS visible when scaleX > 0, TAILS visible when scaleX < 0
  const buildOpacityRanges = (isFront: boolean) => {
    const inputRange: number[] = [];
    const outputRange: number[] = [];

    for (let i = 0; i <= 7; i++) {
      inputRange.push(i, i + 0.25, i + 0.25, i + 0.75, i + 0.75);
      if (isFront) {
        outputRange.push(1, 1, 0, 0, 1);
      } else {
        outputRange.push(0, 0, 1, 1, 0);
      }
    }
    inputRange.push(8);
    outputRange.push(isFront ? 1 : 0);

    return { inputRange, outputRange };
  };

  const frontRanges = buildOpacityRanges(true);
  const backRanges = buildOpacityRanges(false);

  const frontOpacity = flipAnimation.interpolate({
    inputRange: frontRanges.inputRange,
    outputRange: frontRanges.outputRange,
  });
  const backOpacity = flipAnimation.interpolate({
    inputRange: backRanges.inputRange,
    outputRange: backRanges.outputRange,
  });
  const glowOpacity = glowAnimation.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.7] });

  return (
    <View style={styles.container}>
      {/* Glow rendered at container level - BEHIND everything with zIndex: -1 */}
      <Animated.View style={[styles.glowAbsolute, { opacity: glowOpacity, transform: [{ scale: bounceAnimation }] }]}>
        <View style={[styles.glowCircle, { backgroundColor: theme.gold + '25' }]} />
      </Animated.View>

      <View style={styles.coinContainer}>
        <View style={styles.particlesContainer}>
          {particles.map((p, i) => (
            <Particle
              key={i}
              animatedValues={p}
              angle={(i / PARTICLE_COUNT) * Math.PI * 2}
              gold={theme.gold}
              roseGold={theme.roseGold}
            />
          ))}
        </View>

        {/* 2D flip using scaleX - avoids 3D perspective clipping issues */}
        <Animated.View
          style={[styles.coin, { transform: [{ scaleX: coinScaleX }, { scale: bounceAnimation }] }]}
        >
          {/* Use opacity to switch between HEADS/TAILS */}
          <Animated.View style={[styles.coinSide, { opacity: frontOpacity }]}>
            <HeadsCoin size={COIN_SIZE} />
          </Animated.View>
          <Animated.View style={[styles.coinSide, { opacity: backOpacity }]}>
            <TailsCoin size={COIN_SIZE} />
          </Animated.View>
        </Animated.View>
      </View>

      <View style={styles.resultContainer}>
        {result && (
          <Animated.View
            style={[
              styles.resultBadge,
              { opacity: resultOpacity, transform: [{ scale: resultScale }], backgroundColor: result === 'heads' ? theme.gold : theme.roseGold },
            ]}
          >
            <Text style={[styles.resultText, { color: theme.background }]}>{result === 'heads' ? 'HEADS' : 'TAILS'}</Text>
          </Animated.View>
        )}
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }], overflow: 'visible' }}>
        <Pressable onPress={flipCoin} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={isFlipping} style={[styles.flipButton, { shadowColor: theme.gold }]}>
          <LinearGradient
            colors={isFlipping ? [theme.backgroundLight, theme.backgroundLight] : [theme.gold, theme.goldDark]}
            style={styles.flipButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.flipButtonText, { color: isFlipping ? theme.textSecondary : theme.background }]}>
              {isFlipping ? 'FLIPPING...' : 'FLIP COIN'}
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      {/* Daily limit modal for trial users */}
      <LimitReachedModal
        visible={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  coinContainer: {
    width: Math.max(COIN_SIZE + 160, 380),
    height: COIN_SIZE + 160,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  // Glow at container level - not clipped by coinContainer
  glowAbsolute: {
    position: 'absolute',
    width: COIN_SIZE + 120,
    height: COIN_SIZE + 120,
    // Center using negative margins (half of size)
    marginTop: -(COIN_SIZE + 120) / 2,
    marginLeft: -(COIN_SIZE + 120) / 2,
    top: '50%',
    left: '50%',
    zIndex: -1,
  },
  glowCircle: {
    width: '100%',
    height: '100%',
    borderRadius: (COIN_SIZE + 120) / 2,
  },
  particlesContainer: {
    position: 'absolute',
    width: COIN_SIZE,
    height: COIN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  particle: {
    position: 'absolute',
  },
  // 2D flip - no backfaceVisibility needed
  coin: {
    width: COIN_SIZE,
    height: COIN_SIZE,
  },
  coinSide: {
    position: 'absolute',
    width: COIN_SIZE,
    height: COIN_SIZE,
  },
  coinFace: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  resultContainer: {
    height: 60,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    overflow: 'visible',
  },
  resultBadge: {
    minWidth: 150,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 4,
  },
  flipButton: {
    borderRadius: 30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 16,
    marginBottom: 24,
    minWidth: 180,
  },
  flipButtonGradient: {
    minWidth: 180,
    paddingHorizontal: 48,
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 30,
  },
  flipButtonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
  },
});
