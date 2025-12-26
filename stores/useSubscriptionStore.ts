import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Trial duration in days
export const TRIAL_DAYS = 7;

interface SubscriptionState {
  // Pro status (from RevenueCat)
  isPro: boolean;
  setIsPro: (value: boolean) => void;

  // Trial tracking
  firstLaunchDate: string | null;
  setFirstLaunchDate: (date: string) => void;

  // Computed trial state
  getTrialDaysRemaining: () => number;
  isTrialActive: () => boolean;
  isTrialExpired: () => boolean;
  canUseApp: () => boolean;

  // Initialize trial on first launch
  initializeTrial: () => void;

  // Reset (for logout and testing)
  reset: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isPro: false,
      firstLaunchDate: null,

      setIsPro: (value) => set({ isPro: value }),

      setFirstLaunchDate: (date) => set({ firstLaunchDate: date }),

      initializeTrial: () => {
        const { firstLaunchDate } = get();
        if (!firstLaunchDate) {
          const today = new Date().toISOString().split('T')[0];
          set({ firstLaunchDate: today });
        }
      },

      getTrialDaysRemaining: () => {
        const { firstLaunchDate, isPro } = get();

        // Pro users have unlimited access
        if (isPro) return Infinity;

        // No first launch date = not initialized
        if (!firstLaunchDate) return TRIAL_DAYS;

        const firstLaunch = new Date(firstLaunchDate);
        const now = new Date();
        const diffTime = now.getTime() - firstLaunch.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        const remaining = TRIAL_DAYS - diffDays;
        return Math.max(0, remaining);
      },

      isTrialActive: () => {
        const { isPro, getTrialDaysRemaining } = get();
        if (isPro) return false; // Pro users don't need trial
        return getTrialDaysRemaining() > 0;
      },

      isTrialExpired: () => {
        const { isPro, getTrialDaysRemaining } = get();
        if (isPro) return false; // Pro users never expire
        return getTrialDaysRemaining() <= 0;
      },

      canUseApp: () => {
        const { isPro, isTrialActive } = get();
        return isPro || isTrialActive();
      },

      reset: () => {
        set({ isPro: false, firstLaunchDate: null });
      },
    }),
    {
      name: 'coin-subscription-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these fields
      partialize: (state) => ({
        isPro: state.isPro,
        firstLaunchDate: state.firstLaunchDate,
      }),
    }
  )
);
