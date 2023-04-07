import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useProfileStore } from '../state/profileStore';
import { useSettingsStore } from '../state/settingsStore';
import NotifApi from '../lib/api/bindings';
import { getPushToken } from '../lib/helpers';
import { View, Text, Pressable } from '../components/Themed';
import tw from 'twrnc';
import usePushNotifications from '../hooks/usePushNotifications';
import useColorScheme from '../hooks/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  usePushNotifications();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return <SplashScreen />;
  }

  return <Hiya />;
}

function Hiya() {
  const bearerToken = useProfileStore((state) => state.bearerToken);
  const apiStatus = useSettingsStore((state) => state.apiStatus);

  useEffect(() => {
    if (bearerToken) {
      return;
    }

    getPushToken().then((pushToken) => {
      NotifApi.register.apply(pushToken);
    });
  }, [bearerToken]);

  const checkApiStatus = async () => {
    try {
      await NotifApi.health();
    } catch (error) {
      //
    }
  };

  if (apiStatus !== 'connected')
    return (
      <Pressable onPress={checkApiStatus} style={tw`flex-grow items-center justify-center`}>
        <Text>
          {apiStatus === 'maintenance' ? 'Server under maintenance' : 'Unable to connect to Server'}
        </Text>
      </Pressable>
    );

  if (!bearerToken) {
    return (
      <View style={tw`flex-grow items-center justify-center`}>
        <Text>Authenticating</Text>
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="devices/add"
            options={{ title: 'Add Device', presentation: 'modal' }}
          />
          <Stack.Screen
            name="devices/[linkId]/index"
            options={{ title: 'Device', presentation: 'modal' }}
          />
          <Stack.Screen
            name="devices/[linkId]/pings/[pingId]"
            options={{ title: 'Ping', presentation: 'modal' }}
          />
        </Stack>
      </ThemeProvider>
    </>
  );
}
