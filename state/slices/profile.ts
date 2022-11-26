import { Slice } from '../store';
import JSEncrypt from 'jsencrypt';

export interface ProfileSlice {
  bearerToken?: string;
  privateKey: string;
  publicKey: string;
  decrypt: (data: string | undefined) => string | undefined;
}

// Temporary instance to generate the keypair if not
// already persisted in AsyncStorage
const _rsa = new JSEncrypt();

const createProfileSlice: Slice<ProfileSlice> = (set, get) => ({
  bearerToken: undefined,
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
});

export default createProfileSlice;
