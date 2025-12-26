import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { useSettingsStore } from '@/stores/useSettingsStore';

// Sound file imports
const SOUNDS = {
  flip: require('@/assets/sounds/coin-flip.wav'),
  heads: require('@/assets/sounds/coin-heads.wav'),
  tails: require('@/assets/sounds/coin-tails.wav'),
  tap: require('@/assets/sounds/tap.wav'),
} as const;

type SoundName = keyof typeof SOUNDS;

export function useSound() {
  const { soundEnabled } = useSettingsStore();
  const soundObjects = useRef<Map<SoundName, Audio.Sound>>(new Map());
  const isLoaded = useRef(false);

  // Load all sounds on mount
  useEffect(() => {
    const loadSounds = async () => {
      try {
        // Configure audio mode for iOS
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });

        // Load each sound
        for (const [name, source] of Object.entries(SOUNDS)) {
          const { sound } = await Audio.Sound.createAsync(source, {
            shouldPlay: false,
            volume: 0.8,
          });
          soundObjects.current.set(name as SoundName, sound);
        }
        isLoaded.current = true;
      } catch (error) {
        console.warn('Failed to load sounds:', error);
      }
    };

    loadSounds();

    // Cleanup on unmount
    return () => {
      soundObjects.current.forEach(async (sound) => {
        try {
          await sound.unloadAsync();
        } catch (e) {
          // Ignore cleanup errors
        }
      });
      soundObjects.current.clear();
    };
  }, []);

  // Play a sound by name
  const play = useCallback(
    async (name: SoundName) => {
      if (!soundEnabled || !isLoaded.current) return;

      const sound = soundObjects.current.get(name);
      if (!sound) return;

      try {
        // Reset to beginning and play
        await sound.setPositionAsync(0);
        await sound.playAsync();
      } catch (error) {
        console.warn(`Failed to play sound ${name}:`, error);
      }
    },
    [soundEnabled]
  );

  // Convenience methods
  const playFlip = useCallback(() => play('flip'), [play]);
  const playHeads = useCallback(() => play('heads'), [play]);
  const playTails = useCallback(() => play('tails'), [play]);
  const playTap = useCallback(() => play('tap'), [play]);

  return {
    play,
    playFlip,
    playHeads,
    playTails,
    playTap,
    soundEnabled,
  };
}
