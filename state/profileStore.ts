import JSEncrypt from 'jsencrypt';
import SecureStore from 'expo-secure-store';
import create from 'zustand';
import { persist } from 'zustand/middleware';

export interface State {
  bearerToken?: string;
  privateKey: string;
  publicKey: string;
  decrypt: (data: string | undefined) => string | undefined;
}

// Temporary instance to generate the keypair if not already persisted
const _rsa = new JSEncrypt();

export const useProfileStore = create<State>(
  persist(
    (set, get) => ({
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
    }),
    {
      name: 'notif-profile',
      getStorage: () => ({
        getItem: async (name: string) => await SecureStore.getItemAsync(name),
        setItem: async (name: string, value: string) => await SecureStore.setItemAsync(name, value),
        removeItem: async (name: string) => await SecureStore.deleteItemAsync(name),
      }),
    }
  )
);
