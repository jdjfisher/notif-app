
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform, unstable_batchedUpdates } from 'react-native';
import useStore from '../state/store';
import { Ping } from '../types';
import { navigationRef } from '../navigation/index'; 

const BACKGROUND_NOTIFICATION_TASK: string = 'BACKGROUND-NOTIFICATION-TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }: any) => {
  handlePing(data.notification);
});

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

export default async () => {
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
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  Notifications.addNotificationResponseReceivedListener(({ notification }) => {
    const cliToken = notification.request.content.data.cliToken as string | undefined;
    const pingId = notification.request.identifier;
    
    if (cliToken && pingId) {
      const ping = useStore.getState().pings[cliToken]?.find(ping => ping.id === pingId);

      if (ping && navigationRef.isReady())
        navigationRef.navigate('Ping', { ping });
    }
  });

  Notifications.addNotificationReceivedListener(handlePing);
};

const handlePing = async (notification: any) => {
  const date = notification.date;
  const { title, body } = notification.request.content;
  const cliToken = notification.request.content.data.cliToken as string | undefined; // TODO: Replace with an ID
  const pingId = notification.request.identifier;

  if (!cliToken)
    return;

  const ping: Ping = {
    id: pingId,
    message: body,
    timestamp: date,
  };

  // Persist the ping
  unstable_batchedUpdates(() => useStore.getState().recordPing(cliToken, ping));
};
