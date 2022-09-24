import create, { GetState, SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createSettingsSlice, { SettingsSlice } from './slices/settings';
import createDeviceSlice, { DeviceSlice } from './slices/device';
import createPingSlice, { PingSlice } from './slices/ping';
import createCryptSlice, { CryptSlice } from './slices/crypt';

interface State extends SettingsSlice, DeviceSlice, PingSlice, CryptSlice {
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
      ...createDeviceSlice(set, get),
      ...createPingSlice(set, get),
      ...createSettingsSlice(set, get),
      ...createCryptSlice(set, get),
    }),
    {
      name: 'notif',
      getStorage: () => AsyncStorage,
    }
  )
);

export default useStore;
