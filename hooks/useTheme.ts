import { useThemeStore } from '@/stores/useThemeStore';

export function useTheme() {
  const { theme, mode, toggleTheme, setTheme } = useThemeStore();
  return { theme, mode, toggleTheme, setTheme, isDark: mode === 'dark' };
}
