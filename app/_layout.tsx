import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useProfileStore } from '../state/profileStore';
import { useSettingsStore } from '../state/settingsStore';
import NotifApi from '../lib/api/bindings';
import { getPushToken } from '../lib/helpers';
import { View, Text, Pressable } from '../components/Themed';
import tw from 'twrnc';
import usePushNotifications from '../hooks/usePushNotifications';
import useColorScheme from '../hooks/useColorScheme';
import { Button } from 'react-native';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  usePushNotifications();

  const [fontsLoaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [error, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Auth />;
}

function Auth() {
  const bearerToken = useProfileStore((state) => state.bearerToken);
  const apiStatus = useSettingsStore((state) => state.apiStatus);

  const [registrationFailed, setRegistrationFailed] = useState(false);

  useEffect(() => {
    if (!bearerToken) {
      register();
    }
  }, [bearerToken]);

  const register = async () => {
    setRegistrationFailed(false);

    const pushToken = await getPushToken();

    try {
      await NotifApi.register.apply(pushToken);
    } catch (error) {
      setRegistrationFailed(true);
    }
  };

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
        {registrationFailed ? (
          <View style={tw`flex gap-4`}>
            <Text style={tw`text-xl`}>Connection failed</Text>
            <Button title="Retry" onPress={register} />
          </View>
        ) : (
          <Text style={tw`text-xl`}>Connecting</Text>
        )}
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
