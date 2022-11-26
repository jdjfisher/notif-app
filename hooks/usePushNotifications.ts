import { useEffect } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, unstable_batchedUpdates } from 'react-native';
import useStore from '../state/store';
import {
  AndroidNotificationPriority,
  Notification,
  NotificationHandler,
  NotificationResponse,
} from 'expo-notifications';
import NotifApi from '../lib/api/bindings';
import { getPushToken } from '../lib/helpers';

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
        handleNotification: handleNotificationBehaviour,
      });
    })();

    const subscriptions = [
      Notifications.addNotificationResponseReceivedListener(handleNotificationInteraction),
      Notifications.addNotificationReceivedListener(handleNotificationRecieved),
    ];

    return () => {
      subscriptions.forEach(Notifications.removeNotificationSubscription);
    };
  }, []);
}

const handleNotificationBehaviour: NotificationHandler['handleNotification'] = async (
  notification
) => {
  const isPing = notification.request.content.data.type === 'ping';

  return {
    shouldShowAlert: isPing,
    shouldPlaySound: isPing,
    shouldSetBadge: false,
    priority: isPing ? AndroidNotificationPriority.DEFAULT : AndroidNotificationPriority.MIN,
  };
};

const handleNotificationRecieved = (notification: Notification): void => {
  if (notification.request.trigger.type !== 'push') {
    return;
  }

  switch (notification.request.content.data.type) {
    case 'ping':
      handlePing(notification);
      break;

    case 'register':
      handleRegister(notification);
      break;
  }
};

const handlePing = (notification: Notification): void => {
  const linkId = notification.request.content.data.link_id;

  // Validate
  if (typeof linkId !== 'number') return;

  const link = useStore.getState().links.find((link) => link.id === linkId);

  if (!link) return;

  unstable_batchedUpdates(() => {
    useStore.getState().pullPings(link);
  });
};

const handleRegister = async (notification: Notification): Promise<void> => {
  const publicKey = useStore.getState().publicKey;

  const registerToken = notification.request.content.data.register_token as string;

  const bearerToken = await NotifApi.register.verify(registerToken, publicKey);

  useStore.getState().bearerToken = bearerToken;
};

const handleNotificationInteraction = ({ notification }: NotificationResponse): void => {
  //
};
