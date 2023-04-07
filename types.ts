import type { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Link {
  id: number;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  linkedAt: string;
  broken: boolean;
  lastPullAt?: string;
}

export interface Ping {
  id: number;
  message?: string;
  sentAt: string;
}
