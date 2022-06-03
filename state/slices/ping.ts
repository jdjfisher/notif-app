import { getPushToken } from '../../lib/helpers';
import { Ping } from '../../types';
import { Slice } from '../store';
import NotifApi from '../../lib/api/bindings';

export interface PingSlice {
  pings: { [deviceToken: string]: Ping[] };
  recordPing: (deviceToken: string, ping: Omit<Ping, 'id'>) => void;
  clearPings: (deviceToken: string) => void;
  clearAllPings: () => void;
  latestPing: (deviceToken: string) => Ping | null;
  pullPings: (deviceToken: string) => Promise<void>;
}

// TODO: Tidy
const createPingSlice: Slice<PingSlice> = (set, get) => ({
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

  pullPings: async (deviceToken) => {
    const payload = {
      cliToken: deviceToken,
      mobileToken: await getPushToken(),
      lastPingAt: get().pings[deviceToken]?.[0]?.sentAt,
    };

    const response = await NotifApi.pull(payload);

    const pings = response.data
      .map((raw) => ({
        message: raw.message,
        sentAt: raw.sent_at,
        id: Math.random().toString(36),
      }))
      .reverse();

    const clone = { ...get().pings };

    clone[deviceToken] = [...pings, ...(clone[deviceToken] ?? [])];
    set({ pings: clone });
  },
});

export default createPingSlice;
