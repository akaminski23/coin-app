import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FlipRecord {
  id: string;
  result: 'heads' | 'tails';
  timestamp: number;
  question?: string;
}

// Freemium limits
export const FREE_DAILY_LIMIT = 5;
export const FREE_HISTORY_LIMIT = 10;
export const PRO_HISTORY_LIMIT = 100;

// Helper to get today's date string (YYYY-MM-DD)
const getTodayString = () => new Date().toISOString().split('T')[0];

interface HistoryState {
  flips: FlipRecord[];
  totalFlips: number;
  headsCount: number;
  tailsCount: number;
  // Daily tracking for freemium
  dailyFlips: number;
  lastFlipDate: string;
  // Actions
  addFlip: (result: 'heads' | 'tails', question?: string) => void;
  clearHistory: () => void;
  incrementDailyFlips: () => void;
  resetDailyFlips: () => void;
  resetDailyFlipsIfNewDay: () => void;
  canFlip: (isPro: boolean) => boolean;
  getRemainingFlips: (isPro: boolean) => number;
  getVisibleFlips: (isPro: boolean) => FlipRecord[];
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      flips: [],
      totalFlips: 0,
      headsCount: 0,
      tailsCount: 0,
      dailyFlips: 0,
      lastFlipDate: getTodayString(),

      addFlip: (result, question) => {
        const newFlip: FlipRecord = {
          id: Date.now().toString(),
          result,
          timestamp: Date.now(),
          question,
        };
        set((state) => ({
          flips: [newFlip, ...state.flips].slice(0, PRO_HISTORY_LIMIT),
          totalFlips: state.totalFlips + 1,
          headsCount: state.headsCount + (result === 'heads' ? 1 : 0),
          tailsCount: state.tailsCount + (result === 'tails' ? 1 : 0),
        }));
      },

      clearHistory: () =>
        set({
          flips: [],
          totalFlips: 0,
          headsCount: 0,
          tailsCount: 0,
          dailyFlips: 0,
        }),

      incrementDailyFlips: () => {
        set((state) => ({
          dailyFlips: state.dailyFlips + 1,
          lastFlipDate: getTodayString(),
        }));
      },

      resetDailyFlips: () => {
        set({ dailyFlips: 0, lastFlipDate: getTodayString() });
      },

      resetDailyFlipsIfNewDay: () => {
        const today = getTodayString();
        const { lastFlipDate } = get();
        if (lastFlipDate !== today) {
          set({ dailyFlips: 0, lastFlipDate: today });
        }
      },

      canFlip: (isPro: boolean) => {
        if (isPro) return true;
        const { dailyFlips, lastFlipDate } = get();
        const today = getTodayString();
        // Reset if new day
        if (lastFlipDate !== today) return true;
        return dailyFlips < FREE_DAILY_LIMIT;
      },

      getRemainingFlips: (isPro: boolean) => {
        if (isPro) return Infinity;
        const { dailyFlips, lastFlipDate } = get();
        const today = getTodayString();
        // Reset if new day
        if (lastFlipDate !== today) return FREE_DAILY_LIMIT;
        return Math.max(0, FREE_DAILY_LIMIT - dailyFlips);
      },

      getVisibleFlips: (isPro: boolean) => {
        const { flips } = get();
        const limit = isPro ? PRO_HISTORY_LIMIT : FREE_HISTORY_LIMIT;
        return flips.slice(0, limit);
      },
    }),
    {
      name: 'coin-history-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
