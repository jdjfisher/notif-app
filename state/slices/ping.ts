import { Link, Ping } from '../../types';
import { Slice } from '../store';
import NotifApi from '../../lib/api/bindings';
import { LinkSlice } from './link';
import { ProfileSlice } from './profile';

export interface PingSlice {
  pings: { [linkId: number]: Ping[] };
  clearPings: (linkId: number) => void;
  clearAllPings: () => void;
  latestPing: (link: Link) => Ping | null;
  pullPings: (link: Link) => Promise<void>;
}

// TODO: Tidy
const createPingSlice: Slice<PingSlice, LinkSlice & ProfileSlice> = (set, get) => ({
  pings: {},
  clearPings: (linkId) => {
    const clone = { ...get().pings };
    delete clone[linkId];
    set({ pings: clone });
  },
  clearAllPings: () => {
    set({ pings: {} });
  },
  latestPing: (link) => {
    return get().pings[link.id]?.[0];
  },

  pullPings: async (link) => {
    const lastPingAt = get().pings[link.id]?.[0]?.sentAt;

    const rawPings = await NotifApi.pull(link.id, lastPingAt);

    const pings = rawPings
      .map((p) => ({
        id: p.id,
        message: get().decrypt(p.message ?? undefined),
        sentAt: p.sent_at.toISOString(),
      }))
      .reverse();

    const clone = { ...get().pings };

    clone[link.id] = [...pings, ...(clone[link.id] ?? [])];
    set({ pings: clone });
    get().editLink(link, { lastPullAt: new Date().toISOString() });
  },
});

export default createPingSlice;
