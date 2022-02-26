import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import usePushNotifications from './hooks/usePushNotifications';
import useCachedResources from './hooks/useCachedResources';
import ServerBanner from './components/ServerBanner';
import Navigation from './navigation';

dayjs.extend(relativeTime);

Sentry.init({
  dsn: Constants.manifest?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  tracesSampleRate: 1.0,
});

export default function App() {
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    usePushNotifications();
  }, []);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar />
        <Navigation />
        <ServerBanner />
      </SafeAreaProvider>
    );
  }
}
