import * as Notifications from 'expo-notifications';
import { z } from 'zod';

export async function getPushToken(): Promise<string> {
  return (await Notifications.getExpoPushTokenAsync()).data;
}

export const dateStringValidator = z.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());
