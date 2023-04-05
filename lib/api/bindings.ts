import client from './client';
import { z } from 'zod';
import { dateStringValidator } from '../helpers';

export default {
  health: async () => client.get('/api/health'),

  register: {
    apply: async (pushToken: string) => {
      const payload = {
        push_token: pushToken,
      };

      await client.post('/api/app/register/apply', payload);
    },

    verify: async (registerToken: string, publicKey: string): Promise<string> => {
      const payload = {
        register_token: registerToken,
        public_key: publicKey,
      };

      const response = await client.post('/api/app/register/verify', payload);

      const validator = z.string();

      return validator.parse(response.data.token);
    },
  },

  status: async (): Promise<number[]> => {
    const response = await client.get('/api/app/status');

    const validator = z.array(z.number());

    return validator.parse(response.data.link_ids);
  },

  unlink: async (linkId?: number) => {
    const payload = {
      link_id: linkId,
    };

    await client.post('/api/app/unlink', payload);
  },

  pull: async (linkId: number, lastPingAt: string) => {
    const payload = {
      link_id: linkId,
      last_ping_at: lastPingAt,
    };

    const response = await client.post('/api/app/pull', payload);

    const validator = z.array(
      z.object({
        id: z.number(),
        message: z.string().optional().nullable(),
        sent_at: dateStringValidator,
      })
    );

    return validator.parse(response.data.pings);
  },

  link: async (linkCode: string, appDeviceName?: string): Promise<number> => {
    const payload = {
      link_code: linkCode,
      app_device_name: appDeviceName,
    };

    const response = await client.post('/api/app/link', payload);

    const validator = z.number();

    return validator.parse(response.data.id);
  },
};
