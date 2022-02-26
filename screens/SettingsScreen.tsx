import React from 'react';
import * as Notifications from 'expo-notifications';
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
      const pushToken = (await Notifications.getExpoPushTokenAsync()).data;

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
        <ThemeModal style={tw`flex flex-row justify-between items-center py-2`} disabled>
          <View style={tw`flex flex-row items-center`}>
            <MaterialCommunityIcons name="theme-light-dark" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Theme</Text>
            <Text style={tw`text-red-500`}> (WIP)</Text>
          </View>
          <Text style={tw`text-right`}>{deviceTheme ? capitalizeFirstLetter(deviceTheme) : 'System Default'}</Text>
        </ThemeModal>

        <TextInputModal 
          style={tw`flex flex-row justify-between items-center my-2`}
          title='Device Name'
          value={mobileDeviceName}
          setValue={setMobileDeviceName}
          placeholderValue={Device.deviceName || Device.modelName || undefined}
        >
          <View style={tw`flex flex-row items-center`}>
            <MaterialIcons name="smartphone" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Name</Text>
          </View>

          <Text>
            {mobileDeviceName || Device.deviceName || Device.modelName || ''}
          </Text>
        </TextInputModal>

        <View style={tw`flex flex-row items-center my-2 justify-between`}>
          <View style={tw`flex flex-row items-center`}>
            <MaterialIcons name="device-unknown" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Confirm new devices</Text>
          </View>
          <Switch value={confirmNewDevices} onChange={toggleConfirmNewDevices} />
        </View>
      </SettingGroup>

      <SettingGroup title="Storage">
        <Pressable
          onPress={() => promptClearAllPings()}
          style={tw`flex flex-row items-center py-2`}
        >
          <MaterialIcons name="clear-all" size={25} color={tw.color('gray-400')} />
          <Text style={tw`ml-2`}>Clear ping history</Text>
        </Pressable>

        <Pressable
          onPress={() => promptUnlinkAllDevices()}
          style={tw`flex flex-row items-center py-2`}
        >
          <MaterialIcons name="delete" size={25} color={tw.color('gray-400')} />
          <Text style={tw`ml-2`}>Remove all devices</Text>
        </Pressable>
      </SettingGroup>

      {/* TODO: Test server health if changed */}
      <SettingGroup title="Advanced">
        <TextInputModal 
          style={tw`flex flex-row justify-between items-center my-2`}
          title='Server'
          value={customApiUrl}
          setValue={setCustomApiUrl}
          placeholderValue={Constants.manifest?.extra?.apiUrl}
        >
          <View style={tw`flex flex-row items-center`}>
            <MaterialIcons name="storage" size={25} color={tw.color('gray-400')} />
            <Text style={tw`ml-2`}>Server</Text>
          </View>
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
    <View style={tw`p-4 mb-4 shadow`}>
      <Text style={tw`font-bold text-lg mb-2`}>{title}</Text>
      {children}
    </View>
  );
};
