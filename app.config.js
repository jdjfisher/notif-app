import 'dotenv/config';

export default {
  name: 'Notif',
  slug: 'notif',
  version: '0.1.0',
  orientation: 'portrait',
  icon: './assets/images/icon/icon.png',
  scheme: 'notif',
  githubUrl: 'https://github.com/jdjfisher/notif',
  userInterfaceStyle: 'automatic',
  extra: {
    apiUrl: process.env.API_URL,
    sentryDsn: process.env.SENTRY_DSN,
  },
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  platforms: [
    'android',
    // "ios",
  ],
  android: {
    package: 'com.jdjfisher.notif',
    permissions: ['CAMERA', 'NOTIFICATIONS'],
    useNextNotificationsApi: true,
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  // ios: {
  //   supportsTablet: true,
  // },
};
