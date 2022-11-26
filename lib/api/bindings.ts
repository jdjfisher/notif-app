import client from './client';
import { z } from 'zod';
import { dateStringValidator } from '../helpers';

export default {
  health: async () => client.get('/health'),

  register: {
    apply: async (pushToken: string) => {
      const payload = {
        push_token: pushToken,
      };

      await client.post('/app/register/apply', payload);
    },

    verify: async (registerToken: string, publicKey: string): Promise<string> => {
      const payload = {
        register_token: registerToken,
        public_key: publicKey,
      };

      const response = await client.post('/app/register/verify', payload);

      const validator = z.string();

      return validator.parse(response.data.token);
    },
  },

  status: async (): Promise<number[]> => {
    const response = await client.get('/app/status');

    const validator = z.array(z.number());

    return validator.parse(response.data.link_ids);
  },

  unlink: async (linkId?: number) => {
    const payload = {
      link_id: linkId,
    };

    await client.post('/app/unlink', payload);
  },

  pull: async (linkId: number, lastPingAt: string) => {
    const payload = {
      link_id: linkId,
      last_ping_at: lastPingAt,
    };

    const response = await client.post('/app/pull', payload);

    const validator = z.array(
      z.object({
        id: z.number(),
        message: z.string().optional().nullable(),
        sent_at: dateStringValidator,
      })
    );

    return validator.parse(response.data.pings);
  },

  link: async (linkCode: string, socketId?: string, appDeviceName?: string): Promise<number> => {
    const payload = {
      link_code: linkCode,
      socket_id: socketId,
      app_device_name: appDeviceName,
    };

    const response = await client.post('/app/link', payload);

    const validator = z.number();

    return validator.parse(response.data.id);
  },
};
