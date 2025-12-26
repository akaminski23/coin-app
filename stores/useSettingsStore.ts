import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  setAnimationsEnabled: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      animationsEnabled: true,
      setSoundEnabled: (value) => set({ soundEnabled: value }),
      setAnimationsEnabled: (value) => set({ animationsEnabled: value }),
    }),
    {
      name: 'coin-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
