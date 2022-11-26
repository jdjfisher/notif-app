import create, { GetState, SetState } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createLinkSlice, { LinkSlice } from './slices/link';
import createPingSlice, { PingSlice } from './slices/ping';

type State = LinkSlice & PingSlice;

export type Slice<T extends object, E extends object = T> = (
  set: SetState<E extends T ? E : E & T>,
  get: GetState<E extends T ? E : E & T>
) => T;

export const useStore = create<State>(
  persist(
    (set: SetState<any>, get) => ({
      ...createLinkSlice(set, get),
      ...createPingSlice(set, get),
    }),
    {
      name: 'notif',
      getStorage: () => AsyncStorage,
    }
  )
);
