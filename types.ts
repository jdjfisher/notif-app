/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  // eslint-disable-next-line
  namespace ReactNavigation {
    // eslint-disable-next-line
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: NavigatorScreenParams<ModalParamList> | undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Devices: undefined;
  Help: undefined;
  Settings: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ModalParamList = {
  'Add Device': undefined;
  'Device': { cliToken: string };
  'Ping': { ping: Ping };
};

export type ModalScreenProps<Screen extends keyof ModalParamList> = NativeStackScreenProps<
  ModalParamList,
  Screen
>;

export interface CliDevice {
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  token: string;
  linkedAt: string;
  linkBroken: boolean;
  lastPullAt?: string;
}

export interface Ping {
  id: string;
  message?: string;
  sentAt: string;
}
