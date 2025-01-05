import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createLinkSlice, { LinkSlice } from './slices/link';
import createPingSlice, { PingSlice } from './slices/ping';

type State = LinkSlice & PingSlice;

export const useStore = create<State>()(
  persist(
    (...a) => ({
      ...createLinkSlice(...a),
      ...createPingSlice(...a),
    }),
    {
      name: 'notif',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
