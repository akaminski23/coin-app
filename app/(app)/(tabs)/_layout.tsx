import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface TabIconProps {
  name: IoniconsName;
  label: string;
  focused: boolean;
}

function TabIcon({ name, label, focused }: TabIconProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.tabItem}>
      <Ionicons
        name={name}
        size={24}
        color={focused ? theme.gold : theme.textSecondary}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? theme.gold : theme.textSecondary }
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 84,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Coin Flip',
          headerShown: true,
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text, fontWeight: '700' },
          headerShadowVisible: false,
          // @ts-ignore - headerLargeTitle works at runtime but types are missing
          headerLargeTitle: true,
          headerLargeTitleStyle: { color: theme.text },
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'disc' : 'disc-outline'} label="Flip" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Stats',
          headerShown: true,
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text, fontWeight: '700' },
          headerShadowVisible: false,
          // @ts-ignore - headerLargeTitle works at runtime but types are missing
          headerLargeTitle: true,
          headerLargeTitleStyle: { color: theme.text },
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} label="Stats" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Me',
          headerShown: true,
          headerStyle: { backgroundColor: theme.background },
          headerTitleStyle: { color: theme.text, fontWeight: '700' },
          headerShadowVisible: false,
          // @ts-ignore - headerLargeTitle works at runtime but types are missing
          headerLargeTitle: true,
          headerLargeTitleStyle: { color: theme.text },
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} label="Me" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 50,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
});
