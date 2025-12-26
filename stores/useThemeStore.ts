import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, ThemeColors, ThemeMode } from '@/constants/colors';

interface ThemeState {
  mode: ThemeMode;
  theme: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      theme: colors.dark,
      toggleTheme: () =>
        set((state) => {
          const newMode = state.mode === 'dark' ? 'light' : 'dark';
          return { mode: newMode, theme: colors[newMode] };
        }),
      setTheme: (mode) => set({ mode, theme: colors[mode] }),
    }),
    {
      name: 'coin-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        // Ensure theme object is properly set after rehydration
        if (state) {
          state.theme = colors[state.mode];
        }
      },
    }
  )
);
