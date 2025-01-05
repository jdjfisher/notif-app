import JSEncrypt from 'jsencrypt';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface State {
  bearerToken?: string;
  privateKey: string;
  publicKey: string;
  decrypt: (data: string | undefined) => string | undefined;
}

// Temporary instance to generate the keypair if not already persisted
const _rsa = new JSEncrypt();

export const useProfileStore = create<State>()(
  persist(
    (set, get) => ({
      bearerToken: undefined,
      privateKey: _rsa.getPrivateKey(),
      publicKey: _rsa.getPublicKey(),

      decrypt: (data) => {
        if (data === undefined) {
          return undefined;
        }

        console.log('Decrypting:', data);

        const rsa = new JSEncrypt();
        rsa.setPrivateKey(get().privateKey);

        console.log('Decrypted:', rsa.decrypt(data));

        return rsa.decrypt(data) || undefined;
      },
    }),
    {
      name: 'notif.profile',
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => await SecureStore.getItemAsync(name),
        setItem: async (name: string, value: string) => await SecureStore.setItemAsync(name, value),
        removeItem: async (name: string) => await SecureStore.deleteItemAsync(name),
      })),
    }
  )
);
