import { CliDevice } from '../../types';
import { Slice } from '../store';
import { PingSlice } from './ping';

export interface DeviceSlice {
  devices: CliDevice[];
  addDevice: (device: CliDevice) => void;
  editDevice: (
    device: CliDevice,
    attributes: Partial<Pick<CliDevice, 'name' | 'icon' | 'lastPullAt'> & { linkBroken: true }>
  ) => void;
  removeDevice: (device: CliDevice) => void;
  recordBrokenLink: (device: CliDevice) => void;
  clearDevices: () => void;
}
const createDeviceSlice: Slice<DeviceSlice, PingSlice> = (set, get) => {
  // Helper
  const otherDevices = (device: CliDevice) => get().devices.filter((d) => d.token !== device.token);

  return {
    devices: [],
    addDevice: (device) => {
      set({ devices: [...get().devices, device] });
    },
    editDevice: (device, attributes) => {
      const updatedDevice = { ...device, ...attributes };
      set({ devices: [...otherDevices(device), updatedDevice] });
    },
    removeDevice: (device) => {
      set({ devices: otherDevices(device) });
      get().clearPings(device.token);
    },
    recordBrokenLink: (device) => {
      get().editDevice(device, { linkBroken: true });
    },
    clearDevices: () => {
      set({ devices: [] });
      get().clearAllPings();
    },
  };
};

export default createDeviceSlice;
