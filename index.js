import 'expo-router/entry';

import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

Sentry.init({
  dsn: Constants.manifest?.extra?.sentryDsn,
  enableInExpoDevelopment: true,
  tracesSampleRate: 1.0,
});
