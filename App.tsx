import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import usePushNotifications from './hooks/usePushNotifications';
import useCachedResources from './hooks/useCachedResources';
import Body from './components/layout/Body';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

Sentry.init({
  dsn: Constants.manifest?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  tracesSampleRate: 1.0,
});

export default function App() {
  const isLoadingComplete = useCachedResources();

  usePushNotifications();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <StatusBar />
        <Body />
      </SafeAreaProvider>
    );
  }
}
