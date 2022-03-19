import { Ping } from '../../types';
import { Slice } from '../store';

export interface PingSlice {
  pings: { [deviceToken: string]: Ping[] };
  recordPing: (deviceToken: string, ping: Ping) => void;
  clearPings: (deviceToken: string) => void;
  clearAllPings: () => void;
  latestPing: (deviceToken: string) => Ping | null;
}

// TODO: Tidy
const createPingSlice: Slice<PingSlice> = (set, get) => ({
  pings: {},
  recordPing: (deviceToken, ping) => {
    const clone = { ...get().pings };
    clone[deviceToken] = [ping, ...(clone[deviceToken] ?? [])];
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
});

export default createPingSlice;
