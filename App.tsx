import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import usePushNotifications from './hooks/usePushNotifications';
import useCachedResources from './hooks/useCachedResources';
import ServerBanner from './components/ServerBanner';
import Navigation from './navigation';
import { useProfileStore } from './state/profileStore';
import NotifApi from './lib/api/bindings';
import { getPushToken } from './lib/helpers';

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

  const bearerToken = useProfileStore((state) => state.bearerToken);

  useEffect(() => {
    if (bearerToken) {
      return;
    }

    getPushToken().then((token) => {
      NotifApi.register.apply(token);
    });
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
