import { ColorSchemeName } from 'react-native';
import { Slice } from '../store';

export interface SettingsSlice {
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

const createSettingsSlice: Slice<SettingsSlice> = (set, get) => ({
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
});

export default createSettingsSlice;
