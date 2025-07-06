import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
import { setupPushNotifications } from './services/pushNotifications';

export default function App() {
  useEffect(() => {
    setupPushNotifications();
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
} 