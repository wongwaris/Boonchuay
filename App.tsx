import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ProfileProvider } from './src/context/ProfileContext';
import { HistoryProvider } from './src/context/WorkoutHistoryContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ProfileProvider>
          <HistoryProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor="#0B1120" />
            <AppNavigator />
          </NavigationContainer>
          </HistoryProvider>
        </ProfileProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
