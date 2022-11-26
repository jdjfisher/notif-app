import create, { GetState, SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSettingsSlice, { SettingsSlice } from './slices/settings';
import createLinkSlice, { LinkSlice } from './slices/link';
import createPingSlice, { PingSlice } from './slices/ping';

interface State extends SettingsSlice, LinkSlice, PingSlice {
  apiStatus: 'connected' | 'disconnected' | 'maintenance';
}

export type Slice<T extends object, E extends object = T> = (
  set: SetState<E extends T ? E : E & T>,
  get: GetState<E extends T ? E : E & T>
) => T;

export const useStore = create<State>(
  persist(
    (set: SetState<any>, get) => ({
      // Assume we're connected to start with
      apiStatus: 'connected',

      // Merge Slices
      ...createLinkSlice(set, get),
      ...createPingSlice(set, get),
      ...createSettingsSlice(set, get),
    }),
    {
      name: 'notif',
      getStorage: () => AsyncStorage,
    }
  )
);
