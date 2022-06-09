import { useEffect } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, unstable_batchedUpdates } from 'react-native';
import useStore from '../state/store';

export default function usePushNotifications(): void {
  useEffect(() => {
    (async () => {
      if (!Device.isDevice) {
        alert('Must use physical device for Push Notifications');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    })();

    const subscriptions = [
      Notifications.addNotificationResponseReceivedListener(handlePress),
      Notifications.addNotificationReceivedListener(handlePing),
    ];

    return () => {
      subscriptions.forEach(Notifications.removeNotificationSubscription);
    };
  }, []);
}

const handlePing = (notification: Notifications.Notification): void => {
  const {
    content: {
      data: { cliToken },
    },
    trigger,
  } = notification.request;

  // Validate
  if (typeof cliToken !== 'string' || trigger.type !== 'push') return;

  const device = useStore.getState().devices.find((device) => device.token === cliToken);

  if (!device) return;

  unstable_batchedUpdates(() => {
    useStore.getState().pullPings(device);
  });
};

const handlePress = ({ notification }: Notifications.NotificationResponse): void => {
  const cliToken = notification.request.content.data.cliToken as string | undefined;

  // TODO: Redo
};
