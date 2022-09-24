import { getPushToken } from '../../lib/helpers';
import { CliDevice, Ping } from '../../types';
import { Slice } from '../store';
import NotifApi from '../../lib/api/bindings';
import { DeviceSlice } from './device';
import { CryptSlice } from './crypt';

export interface PingSlice {
  pings: { [deviceToken: string]: Ping[] };
  recordPing: (deviceToken: string, ping: Omit<Ping, 'id'>) => void;
  clearPings: (deviceToken: string) => void;
  clearAllPings: () => void;
  latestPing: (deviceToken: string) => Ping | null;
  pullPings: (device: CliDevice) => Promise<void>;
}

// TODO: Tidy
const createPingSlice: Slice<PingSlice, DeviceSlice & CryptSlice> = (set, get) => ({
  pings: {},
  recordPing: (deviceToken, ping) => {
    const clone = { ...get().pings };
    const id = Math.random().toString(36);
    clone[deviceToken] = [{ id, ...ping }, ...(clone[deviceToken] ?? [])];
    set({ pings: clone });
  },
  clearPings: (deviceToken) => {
    const clone = { ...get().pings };
    delete clone[deviceToken];
    set({ pings: clone });
  },
  clearAllPings: () => {
    set({ pings: {} });
  },
  latestPing: (deviceToken) => {
    return get().pings[deviceToken]?.[0];
  },

  pullPings: async (device) => {
    const payload = {
      cliToken: device.token,
      mobileToken: await getPushToken(),
      lastPingAt: get().pings[device.token]?.[0]?.sentAt,
    };

    const response = await NotifApi.pull(payload);

    const pings = response.data
      .map((raw) => ({
        message: get().decrypt(raw.message),
        sentAt: raw.sent_at,
        id: Math.random().toString(36),
      }))
      .reverse();

    const clone = { ...get().pings };

    clone[device.token] = [...pings, ...(clone[device.token] ?? [])];
    set({ pings: clone });
    get().editDevice(device, { lastPullAt: new Date().toISOString() });
  },
});

export default createPingSlice;
