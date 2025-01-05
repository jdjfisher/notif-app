import { StateCreator } from 'zustand';
import { Link } from '../../types';
import { PingSlice } from './ping';

export interface LinkSlice {
  links: Link[];
  addLink: (link: Link) => void;
  editLink: (
    link: Link,
    attributes: Partial<Pick<Link, 'name' | 'icon' | 'lastPullAt'> & { broken: true }>
  ) => void;
  removeLink: (link: Link) => void;
  recordBrokenLink: (link: Link) => void;
  clearLinks: () => void;
}

const createLinkSlice: StateCreator<LinkSlice & PingSlice, [], [], LinkSlice> = (set, get) => {
  // Helper
  const otherLinks = (link: Link) => get().links.filter((d) => d.id !== link.id);

  return {
    links: [],
    addLink: (link) => {
      set({ links: [...get().links, link] });
    },
    editLink: (link, attributes) => {
      const updatedDevice = { ...link, ...attributes };
      set({ links: [...otherLinks(link), updatedDevice] });
    },
    removeLink: (link) => {
      set({ links: otherLinks(link) });
      get().clearPings(link.id);
    },
    recordBrokenLink: (link) => {
      get().editLink(link, { broken: true });
    },
    clearLinks: () => {
      set({ links: [] });
      get().clearAllPings();
    },
  };
};

export default createLinkSlice;
