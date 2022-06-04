import client from './client';

export default {
  health: async () => client.get('/health'),

  // TODO: Split into two routes
  status: async <T extends { mobileToken: string } | { cliToken: string }>(payload: T) =>
    client.post<
      T extends { mobileToken: string } ? { linkedCliTokens?: string[] } : { linked?: boolean }
    >('/status', payload),

  unlink: async (payload: { mobileToken: string } | { cliToken: string }) =>
    client.post<{ linkedCliTokens?: string[] }>('/unlink', payload),

  pull: async (payload: { mobileToken: string; cliToken: string; lastPingAt: string }) =>
    client.post<{ message?: string; sent_at: string }[]>('/pull', payload),

  link: async (payload: {
    socketId?: string;
    cliToken: string;
    mobileToken: string;
    mobileDeviceName?: string;
  }) => client.post('/link', payload),
};
