import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ColorSchemeName } from 'react-native';

export interface State {
  // TODO: Move this, it doesn't need to be persisted
  apiStatus: 'connected' | 'disconnected' | 'maintenance';

  confirmNewLinks: boolean;
  toggleConfirmNewLinks: () => void;

  mobileDeviceName: string | undefined;
  setMobileDeviceName: (name?: string) => void;

  customApiUrl: string | undefined;
  setCustomApiUrl: (value?: string) => void;

  // silentMode: boolean;
  // toggleSilentMode: () => void;

  deviceTheme: ColorSchemeName;
  setDeviceTheme: (theme: ColorSchemeName) => void;
}

export const useSettingsStore = create<State>(
  persist(
    (set, get) => ({
      // Assume we're connected to start with
      apiStatus: 'connected',

      confirmNewLinks: false,
      toggleConfirmNewLinks: () => set((state) => ({ confirmNewLinks: !state.confirmNewLinks })),

      mobileDeviceName: '',
      setMobileDeviceName: (name) => set({ mobileDeviceName: name }),

      customApiUrl: undefined,
      setCustomApiUrl: (value) => set({ customApiUrl: value }),

      // silentMode: false,
      // toggleSilentMode: () => set((state) => ({ silentMode: !state.silentMode })),

      deviceTheme: 'light', // TODO: Change back to null
      setDeviceTheme: (deviceTheme) => set({ deviceTheme }),
    }),
    {
      name: 'notif.settings',
      getStorage: () => AsyncStorage,
    }
  )
);
