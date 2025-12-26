// Coin App Premium Color Palette

export const colors = {
  dark: {
    // Backgrounds
    background: '#1a1a1a',
    backgroundLight: '#2a2a2a',
    card: '#252525',

    // Gold
    gold: '#FFD700',
    goldDark: '#B8860B',
    goldLight: '#FFE55C',

    // Rose Gold (vibrant, matching gold intensity)
    roseGold: '#E8909A',
    roseGoldLight: '#F4B8C0',
    roseGoldDark: '#B76E79',

    // Text
    text: '#FFFFFF',
    textSecondary: '#8E8E93',

    // Accent (gold as primary)
    accent: '#FFD700',

    // Utility
    border: '#3A3A3C',
    success: '#4CD964',
    error: '#FF3B30',
  },
  light: {
    // Backgrounds
    background: '#F5F5F5',
    backgroundLight: '#FFFFFF',
    card: '#FFFFFF',

    // Gold
    gold: '#FFD700',
    goldDark: '#B8860B',
    goldLight: '#FFE55C',

    // Rose Gold (vibrant, matching gold intensity)
    roseGold: '#E8909A',
    roseGoldLight: '#F4B8C0',
    roseGoldDark: '#B76E79',

    // Text
    text: '#1a1a1a',
    textSecondary: '#6B6B6B',

    // Accent (gold as primary)
    accent: '#B8860B',

    // Utility
    border: '#E5E5E5',
    success: '#34C759',
    error: '#FF3B30',
  },
};

// Default theme export for backwards compatibility
export const theme = colors.dark;

export type ThemeColors = typeof colors.dark;
export type ThemeMode = 'dark' | 'light';
