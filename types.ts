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
  'root': NavigatorScreenParams<RootTabParamList> | undefined;
  'modal': NavigatorScreenParams<ModalParamList> | undefined;
  'not-found': undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  'device-list': undefined;
  'help': undefined;
  'settings': undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ModalParamList = {
  'add-device': undefined;
  'view-device': { cliToken: string };
  'view-ping': { ping: Ping };
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
