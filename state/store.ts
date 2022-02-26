import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CliDevice, Ping } from '../types';
import { ColorSchemeName } from 'react-native';

interface State {
  serverStatus: 'connected' | 'disconnected' | 'maintenance';

  confirmNewDevices: boolean;
  toggleConfirmNewDevices: () => void;

  mobileDeviceName: string | undefined;
  setMobileDeviceName: (name?: string) => void;

  customApiUrl: string | undefined;
  setCustomApiUrl: (value?: string) => void;

  silentMode: boolean;
  toggleSilentMode: () => void;

  deviceTheme: ColorSchemeName; 
  setDeviceTheme: (theme: ColorSchemeName) => void;

  devices: CliDevice[],
  addDevice: (device: CliDevice) => void,
  renameDevice: (device: CliDevice, name: string) => void,
  removeDevice: (device: CliDevice) => void,
  recordBrokenLink: (device: CliDevice) => void,
  clearDevices: () => void,

  pings: {[deviceToken: string]: Ping[]},
  recordPing: (deviceToken: string, ping: Ping) => void,
  clearPings: (deviceToken: string) => void,
  clearAllPings: () => void,
  latestPing: (deviceToken: string) => Ping | null, 
}

// TODO: Store slices ;) 

const useStore = create<State>(
  persist(
    (set, get) => ({
      serverStatus: 'connected', // Assume we're connected to start with

      confirmNewDevices: false,
      toggleConfirmNewDevices: () => set((state) => ({ confirmNewDevices: !state.confirmNewDevices })),

      mobileDeviceName: '',
      setMobileDeviceName: (name) => set({ mobileDeviceName: name }),

      customApiUrl: undefined,
      setCustomApiUrl: (value) => set({ customApiUrl: value }),

      silentMode: false,
      toggleSilentMode: () => set((state) => ({ silentMode: !state.silentMode })),

      deviceTheme: 'light', // TODO: Change back to null
      setDeviceTheme: (deviceTheme) => set({ deviceTheme }),

      devices: [],
      addDevice: (device) => set((state) => ({ devices: state.devices.concat(device) })),
      renameDevice: (device, name) => {
        const newDevice = { ...device, name };
        set((state) => ({ devices: [...state.devices.filter(d => d.token !== device.token), newDevice] }));
      },
      removeDevice: (device) => {
        set((state) => ({ devices: state.devices.filter(d => d.token !== device.token) }));
        get().clearPings(device.token);
      },
      // TODO: Tidy
      recordBrokenLink: (device) => {
        const clone = get().devices.filter(d => d.token !== device.token);
        clone.push({...device, linkBroken: true });
        set({ devices: clone });
      },
      clearDevices: () => {
        set({ devices: [] });
        get().clearAllPings();
      },

      // TODO: Tidy
      pings: {},
      recordPing: (deviceToken, ping) => {
        const clone = {...get().pings};
        clone[deviceToken] = [ ping, ...(clone[deviceToken] ?? [])];
        set({ pings: clone });
      },
      clearPings: (deviceToken) => {
        const clone = {...get().pings};
        delete clone[deviceToken];
        set({ pings: clone });
      },
      clearAllPings: () => set({ pings: {} }), 
      latestPing: (token) => get().pings[token]?.[0] ?? null,
    }),
    {
      name: 'notif',
      getStorage: () => AsyncStorage,
    }
  )
);

export default useStore;
