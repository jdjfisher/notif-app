import { ColorSchemeName } from "react-native";
import { Slice } from "../store";

export interface SettingsSlice {
  confirmNewDevices: boolean;
  toggleConfirmNewDevices: () => void;

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
  confirmNewDevices: false,
  toggleConfirmNewDevices: () => set((state) => ({ confirmNewDevices: !state.confirmNewDevices })),

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