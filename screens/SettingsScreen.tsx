import React from 'react';
import { Alert, View as DefaultView } from 'react-native';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Sentry from 'sentry-expo';
import shallow from 'zustand/shallow';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

import axios from '../api';
import useStore from '../state/store';
import ThemeModal from '../components/settings/DeviceThemeModal';
import TextInputModal from '../components/ui/TextInputModal';
import { View, Text, Switch, Pressable } from '../components/Themed';
import { getPushToken } from '../lib/helpers';

export default function SettingsScreen() {
  const [
    mobileDeviceName,
    setMobileDeviceName,
    customApiUrl,
    setCustomApiUrl,
    deviceTheme,
    confirmNewDevices,
    toggleConfirmNewDevices,
    clearDevices,
    clearAllPings,
  ] = useStore(
    (state) => [
      state.mobileDeviceName,
      state.setMobileDeviceName,
      state.customApiUrl,
      state.setCustomApiUrl,
      state.deviceTheme,
      state.confirmNewDevices,
      state.toggleConfirmNewDevices,
      state.clearDevices,
      state.clearAllPings,
    ],
    shallow
  );

  const unlinkAllDevices = async () => {
    try {
      const pushToken = await getPushToken();

      const payload = {
        mobileToken: pushToken,
      };

      // Clean server links
      await axios.post('unlink', payload);

      // Clean local storage
      clearDevices();
    } catch (error) {
      Sentry.Native.captureException(error);

      // TODO: Alert?
    }
  };

  const promptClearAllPings = async () => {
    Alert.alert('Clear Ping History', 'This will clear all pings, for all linked devices.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: clearAllPings },
    ]);
  };

  const promptUnlinkAllDevices = async () => {
    Alert.alert('Clear Devices', 'This will remove all linked devices. This action is final.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: unlinkAllDevices },
    ]);
  };

  const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

  return (
    <DefaultView style={tw`mt-1`}>
      <SettingGroup title="General">
        <ThemeModal style={tw`flex-row justify-between items-center py-3 px-4`}>
          <DefaultView style={tw`flex-row items-center`}>
            <MaterialCommunityIcons name="theme-light-dark" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Theme</Text>
            <Text style={tw`text-red-500`}> (WIP)</Text>
          </DefaultView>

          <Text style={tw`text-right`}>{deviceTheme ? capitalizeFirstLetter(deviceTheme) : 'System Default'}</Text>
        </ThemeModal>

        <TextInputModal 
          style={tw`flex-row justify-between items-center py-3 px-4`}
          title='Device Name'
          value={mobileDeviceName}
          setValue={setMobileDeviceName}
          placeholderValue={Device.deviceName || Device.modelName || undefined}
          maxLength={40}
        >
          <DefaultView style={tw`flex-row items-center`}>
            <MaterialIcons name="smartphone" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Name</Text>
          </DefaultView>

          <Text>
            {mobileDeviceName || Device.deviceName || Device.modelName || ''}
          </Text>
        </TextInputModal>

        <View style={tw`flex-row justify-between items-center px-4`}>
          <DefaultView style={tw`flex-row items-center py-3`}>
            <MaterialIcons name="device-unknown" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Confirm new devices</Text>
          </DefaultView>

          <Switch value={confirmNewDevices} onChange={toggleConfirmNewDevices} />
        </View>
      </SettingGroup>

      <SettingGroup title="Storage">
        <Pressable
          onPress={() => promptClearAllPings()}
          style={tw`flex-row items-center py-3 px-4`}
        >
          <MaterialIcons name="clear-all" size={25} color={tw.color('gray-400')} />
          <Text style={tw`ml-2`}>Clear ping history</Text>
        </Pressable>

        <Pressable
          onPress={() => promptUnlinkAllDevices()}
          style={tw`flex-row items-center py-3 px-4`}
        >
          <MaterialIcons name="delete" size={25} color={tw.color('gray-400')} />
          <Text style={tw`ml-2`}>Remove all devices</Text>
        </Pressable>
      </SettingGroup>

      {/* TODO: Test server health if changed */}
      <SettingGroup title="Advanced">
        <TextInputModal 
          style={tw`flex-row justify-between items-center py-3 px-4`}
          title='Server'
          value={customApiUrl}
          setValue={setCustomApiUrl}
          placeholderValue={Constants.manifest?.extra?.apiUrl}
          maxLength={50}
        >
          <DefaultView style={tw`flex-row items-center`}>
            <MaterialIcons name="storage" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Server</Text>
          </DefaultView>

          <Text>
            {customApiUrl && customApiUrl !== Constants.manifest?.extra?.apiUrl ? 'Custom' : 'Default'}
          </Text>
        </TextInputModal>
      </SettingGroup>
    </DefaultView>
  );
}

const SettingGroup = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <View style={tw`py-4 mb-4 shadow`}>
      <Text style={tw`font-bold text-lg mb-2 mx-4`}>{title}</Text>
      {children}
    </View>
  );
};
