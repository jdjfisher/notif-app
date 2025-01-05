import 'dotenv/config';

export default {
  name: 'Notif',
  slug: 'notif',
  version: '0.1.1',
  owner: 'jdjfisher',
  orientation: 'portrait',
  icon: './assets/images/icon/icon.png',
  scheme: 'notif',
  githubUrl: 'https://github.com/jdjfisher/notif',
  newArchEnabled: true,
  userInterfaceStyle: 'automatic',
  extra: {
    apiUrl: process.env.API_URL,
    sentryDsn: process.env.SENTRY_DSN,
    eas: {
      projectId: process.env.PROJECT_ID,
    },
  },
  plugins: ['expo-router', 'sentry-expo', 'expo-asset', 'expo-font', 'expo-secure-store'],
  splash: {
    image: './assets/images/icon/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  platforms: ['android'],
  android: {
    package: 'com.jdjfisher.notif',
    permissions: ['CAMERA', 'NOTIFICATIONS'],
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/images/icon/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  ios: {},
};
