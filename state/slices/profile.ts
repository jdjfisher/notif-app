import { Slice } from '../store';
import JSEncrypt from 'jsencrypt';

export interface ProfileSlice {
  appId?: number;
  privateKey: string;
  publicKey: string;
  decrypt: (data: string | undefined) => string | undefined;
  setAppId: (id: number) => void;
  getToken: () => string;
}

// Temporary instance to generate the keypair if not
// already persisted in AsyncStorage
const _rsa = new JSEncrypt();

const createProfileSlice: Slice<ProfileSlice> = (set, get) => ({
  appId: undefined,
  privateKey: _rsa.getPrivateKey(),
  publicKey: _rsa.getPublicKey(),

  decrypt: (data) => {
    if (data === undefined) {
      return undefined;
    }

    const rsa = new JSEncrypt();
    rsa.setPrivateKey(get().privateKey);

    return rsa.decrypt(data) || undefined;
  },

  setAppId: (id) => {
    set({ appId: id });
  },

  getToken: () => {
    // TODO: actual token
    return String(get().appId);
  },
});

export default createProfileSlice;
