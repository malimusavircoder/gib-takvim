import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import ClientsScreen from './src/screens/ClientsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import { colors } from './src/utils/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.bg0,
              borderTopColor: colors.border,
              borderTopWidth: 0.5,
              height: 80,
              paddingBottom: 20,
            },
            tabBarActiveTintColor: colors.blue,
            tabBarInactiveTintColor: colors.text4,
            tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
          }}
        >
          <Tab.Screen
            name="Ana Ekran"
            component={HomeScreen}
            options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: 18, color: focused ? colors.blue : colors.text4 }}>⌂</Text> }}
          />
          <Tab.Screen
            name="Takvim"
            component={CalendarScreen}
            options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: 16, color: focused ? colors.blue : colors.text4 }}>📅</Text> }}
          />
          <Tab.Screen
            name="Mükellefler"
            component={ClientsScreen}
            options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: 16, color: focused ? colors.blue : colors.text4 }}>👤</Text> }}
          />
          <Tab.Screen
            name="Bildirimler"
            component={NotificationsScreen}
            options={{ tabBarIcon: ({ focused }) => <Text style={{ fontSize: 16, color: focused ? colors.blue : colors.text4 }}>🔔</Text> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
