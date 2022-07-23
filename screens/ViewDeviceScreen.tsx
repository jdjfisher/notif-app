import React, { ElementRef, useEffect, useRef } from 'react';
import { Alert, View as DefaultView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextInputModal from '../components/ui/TextInputModal';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import { CliDevice, ModalScreenProps } from '../types';
import { Text, View } from '../components/Themed';
import Menu from '../components/Menu';
import NotifApi from '../lib/api/bindings';
import useStore from '../state/store';
import LinkBroken from '../components/device/LinkBroken';
import RadioGroupModal from '../components/ui/RadioGroupModal';
import PingHistory from '../components/device/PingHistory';

export default function ViewDeviceScreen({ route, navigation }: ModalScreenProps<'view-device'>) {
  // Ref hooks
  const renameDeviceModalRef = useRef<ElementRef<typeof TextInputModal>>(null);
  const changeIconModalRef = useRef<ElementRef<typeof RadioGroupModal>>(null);

  // State hooks
  const [devices, allPings, clearPings, pullPings, editDevice, removeDevice, recordBrokenLink] =
    useStore(
      (state) => [
        state.devices,
        state.pings,
        state.clearPings,
        state.pullPings,
        state.editDevice,
        state.removeDevice,
        state.recordBrokenLink,
      ],
      shallow
    );

  // Fetch the device data
  const cliToken = route.params.cliToken;
  const device = devices.find((d) => d.token === cliToken);
  const pings = allPings[cliToken] ?? [];

  useEffect(() => {
    // We know the link is broken, only this app can correct this, .*. don't verify again
    if (!device || device.linkBroken) return;

    const payload = { cliToken };

    NotifApi.status(payload)
      .then(async (response) => {
        if (response.data?.linked === false) {
          recordBrokenLink(device);
          Alert.alert('Link Broken', `${device.name} has been unlinked from this deivce`);
          return;
        }

        await pullPings(device);
      })
      .catch(console.debug);
  }, []);

  //
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          options={{
            'Remove': promptRemove,
            'Rename': () => renameDeviceModalRef.current?.show(),
            'Change Icon': () => changeIconModalRef.current?.show(),
            ...(pings.length ? { 'Clear Pings': promptClearPings } : {}),
          }}
        />
      ),
    });
  }, [navigation, pings]);

  // Abort if the device could not be found
  if (!device) {
    return null;
  }

  const promptClearPings = () => {
    Alert.alert('Clear Pings', `Clear all ping history for ${device.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => clearPings(device.token) },
    ]);
  };

  const promptRemove = () => {
    Alert.alert('Remove Device', `Remove ${device.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => remove() },
    ]);
  };

  const remove = async () => {
    const payload = {
      cliToken: device.token,
    };

    try {
      // Unlink server-side
      await NotifApi.unlink(payload);

      // Remove from storage
      removeDevice(device);

      // Return to devices screen
      navigation.popToTop();
    } catch {
      Alert.alert('Alert', 'Failed to unlink device', [{ text: 'OK' }]);
    }
  };

  return (
    <DefaultView style={tw`h-full`}>
      <View style={tw`p-3 flex flex-row justify-between items-center shadow-sm mb-1`}>
        <DefaultView style={tw`flex-row items-center flex-shrink`}>
          <MaterialCommunityIcons
            name={device.icon}
            size={35}
            color={tw.color('text-black')}
            style={tw`mr-3`}
          />

          <DefaultView>
            <TextInputModal
              ref={renameDeviceModalRef}
              title="Rename Device"
              value={device.name}
              setValue={(name) => {
                if (name) editDevice(device, { name });
              }}
              maxLength={20}
            >
              <Text style={tw`text-xl`}>{device.name}</Text>
            </TextInputModal>

            <Text style={tw`text-gray-400 text-xs`}>Linked {dayjs(device.linkedAt).fromNow()}</Text>
          </DefaultView>
        </DefaultView>

        {device.linkBroken ? <LinkBroken /> : null}
      </View>

      <View style={tw`flex-1 shadow-sm pt-4`}>
        <Text style={tw`text-xl mx-4 mb-2`}>Pings</Text>

        <PingHistory device={device} pings={pings} />
      </View>

      {/* TODO: Preview icons */}
      <RadioGroupModal<CliDevice['icon']>
        ref={changeIconModalRef}
        value={device.icon}
        setValue={(icon) => {
          if (icon) editDevice(device, { icon });
        }}
        options={{
          'Laptop': 'laptop',
          'Desktop': 'desktop-tower',
          'Server': 'server',
          'Docker': 'docker',
          'AWS': 'aws',
          'Google': 'google-cloud',
          'Azure': 'microsoft-azure',
          'Digital Ocean': 'digital-ocean',
        }}
        customLabel={(label, value) => (
          <DefaultView style={tw`flex-row`}>
            <MaterialCommunityIcons
              name={value}
              size={20}
              color={tw.color('text-black')}
              style={tw`mr-2`}
            />
            <Text>{label}</Text>
          </DefaultView>
        )}
      />
    </DefaultView>
  );
}
