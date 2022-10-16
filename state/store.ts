import create, { GetState, SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSettingsSlice, { SettingsSlice } from './slices/settings';
import createLinkSlice, { LinkSlice } from './slices/link';
import createPingSlice, { PingSlice } from './slices/ping';
import createProfileSlice, { ProfileSlice } from './slices/profile';

interface State extends SettingsSlice, LinkSlice, PingSlice, ProfileSlice {
  apiStatus: 'connected' | 'disconnected' | 'maintenance';
}

export type Slice<T extends object, E extends object = T> = (
  set: SetState<E extends T ? E : E & T>,
  get: GetState<E extends T ? E : E & T>
) => T;

const useStore = create<State>(
  persist(
    (set: SetState<any>, get) => ({
      // Assume we're connected to start with
      apiStatus: 'connected',

      // Merge Slices
      ...createLinkSlice(set, get),
      ...createPingSlice(set, get),
      ...createSettingsSlice(set, get),
      ...createProfileSlice(set, get),
    }),
    {
      name: 'notif',
      getStorage: () => AsyncStorage,
    }
  )
);

export default useStore;
