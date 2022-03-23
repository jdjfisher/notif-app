import * as Notifications from 'expo-notifications';

export async function getPushToken(): Promise<string> {
  return (await Notifications.getExpoPushTokenAsync()).data;
}