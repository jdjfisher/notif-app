import { Slice } from '../store';
import JSEncrypt from 'jsencrypt';

export interface CryptSlice {
  privateKey: string;
  publicKey: string;
  decrypt: (data: string | undefined) => string | undefined;
}

// Temporary instance to generate the keypair if not
// already persisted in AsyncStorage
const _rsa = new JSEncrypt();

const createCryptSlice: Slice<CryptSlice> = (set, get) => ({
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

export default createCryptSlice;
