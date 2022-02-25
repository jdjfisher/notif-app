/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
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
  Device: { cliToken: string };
  Ping: { ping: Ping };
};

export type ModalScreenProps<Screen extends keyof ModalParamList> = NativeStackScreenProps<
  ModalParamList,
  Screen
>;

export interface CliDevice {
  name: string;
  icon: 'computer' | 'dns' | 'storage' | 'desktop-mac';
  token: string;
  linkedAt: string;
  linkBroken: boolean;
}

export interface Ping {
  id: string;
  message?: string;
  timestamp: number;
}
