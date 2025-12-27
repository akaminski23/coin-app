import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
} from 'react-native-purchases';

// RevenueCat API Keys
const REVENUECAT_API_KEY_IOS = 'appl_TneTLFAufxmDGTKVIp0pYrYUNNS';
const REVENUECAT_API_KEY_ANDROID = 'YOUR_REVENUECAT_ANDROID_API_KEY'; // TODO: Add when needed

// Product identifiers (must match App Store Connect)
export const PRODUCT_IDS = {
  MONTHLY: 'coin_pro_monthly',
  YEARLY: 'coin_pro_yearly',
  LIFETIME: 'coin_pro_lifetime',
};

// Entitlement ID (set in RevenueCat dashboard)
export const ENTITLEMENT_ID = 'pro';

interface RevenueCatContextType {
  isReady: boolean;
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOffering | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  checkSubscription: () => Promise<boolean>;
}

const RevenueCatContext = createContext<RevenueCatContextType | undefined>(undefined);

interface RevenueCatProviderProps {
  children: ReactNode;
}

export function RevenueCatProvider({ children }: RevenueCatProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    const initRevenueCat = async () => {
      try {
        // Configure RevenueCat
        const apiKey = Platform.OS === 'ios' ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;

        // Only configure if we have a real API key
        if (apiKey && !apiKey.includes('YOUR_')) {
          await Purchases.configure({ apiKey });

          // Get customer info
          const info = await Purchases.getCustomerInfo();
          setCustomerInfo(info);

          // Check entitlements
          const hasPro = typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
          setIsPro(hasPro);

          // Get offerings
          const offeringsData = await Purchases.getOfferings();
          if (offeringsData.current) {
            setOfferings(offeringsData.current);
          }

          // Listen for customer info updates
          Purchases.addCustomerInfoUpdateListener((info) => {
            setCustomerInfo(info);
            const hasPro = typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
            setIsPro(hasPro);
          });
        } else {
          console.log('RevenueCat: Running in development mode (no API key)');
        }

        setIsReady(true);
      } catch (error) {
        console.error('RevenueCat initialization error:', error);
        setIsReady(true);
      }
    };

    initRevenueCat();
  }, []);

  const purchasePackage = async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo: newInfo } = await Purchases.purchasePackage(pkg);
      setCustomerInfo(newInfo);

      const hasPro = typeof newInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
      setIsPro(hasPro);

      return hasPro;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
      }
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);

      const hasPro = typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
      setIsPro(hasPro);

      return hasPro;
    } catch (error) {
      console.error('Restore error:', error);
      return false;
    }
  };

  const checkSubscription = async (): Promise<boolean> => {
    try {
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);

      const hasPro = typeof info.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
      setIsPro(hasPro);

      return hasPro;
    } catch (error) {
      console.error('Check subscription error:', error);
      return false;
    }
  };

  return (
    <RevenueCatContext.Provider
      value={{
        isReady,
        isPro,
        customerInfo,
        offerings,
        purchasePackage,
        restorePurchases,
        checkSubscription,
      }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
}

export function useRevenueCat() {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat must be used within a RevenueCatProvider');
  }
  return context;
}
