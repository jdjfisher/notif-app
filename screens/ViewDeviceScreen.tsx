import React, { ElementRef, useEffect, useRef } from 'react';
import { Pressable, Alert, FlatList, View as DefaultView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextInputModal from '../components/ui/TextInputModal';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import { CliDevice, ModalScreenProps } from '../types';
import { Text, View } from '../components/Themed';
import Menu from '../components/Menu';
import api from '../api';
import useStore from '../state/store';
import LinkBroken from '../components/device/LinkBroken';
import RadioButtonModal from '../components/ui/RadioButtonModal';

export default function ViewDeviceScreen({ route, navigation }: ModalScreenProps<'Device'>) {
  // Ref hooks
  const renameDeviceModalRef = useRef<ElementRef<typeof TextInputModal>>(null);
  const changeIconModalRef = useRef<ElementRef<typeof RadioButtonModal>>(null);

  // State hooks
  const [devices, allPings, clearPings, editDevice, removeDevice, recordBrokenLink] = useStore(
    (state) => [
      state.devices,
      state.pings,
      state.clearPings,
      state.editDevice,
      state.removeDevice,
      state.recordBrokenLink,
    ],
    shallow
  );

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
  }, [ navigation, allPings ]);

  // Fetch the device data
  const device = devices.find((d) => d.token === route.params.cliToken);

  useEffect(() => {
    // We know the link is broken, only this app can correct this, .*. don't verify again
    if (!device || device.linkBroken) return;

    const payload = {
      cliToken: device.token,
    };

    api
      .post('status', payload)
      .then((response) => {
        if (response?.data?.linked === false) {
          recordBrokenLink(device);
          Alert.alert('Link Broken', `${device.name} has been unlinked from this deivce`);
        }
      })
      .catch((error) => console.debug(error));
  }, []);

  // Abort if the device could not be found
  if (!device) {
    return null;
  }

  const pings = allPings[device.token] ?? [];

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
      await api.post('unlink', payload);

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
        <DefaultView style={tw`flex-row items-center`}>
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

      <View style={tw`p-4 flex-1 shadow-sm mb-1`}>
        <Text style={tw`text-xl mb-2`}>Pings</Text>

        {pings.length ? (
          <FlatList
            data={pings}
            keyExtractor={(ping) => ping.id}
            renderItem={({ item: ping }) => (
              <Pressable
                style={tw`border-t border-gray-100 py-3 pr-3`}
                onPress={() => navigation.navigate('Ping', { ping })}
              >
                {ping.message ? (
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {ping.message}
                  </Text>
                ) : (
                  <Text style={tw`text-gray-500 italic`}>No message provided</Text>
                )}
                <Text style={tw`text-right text-gray-400`}>{dayjs(ping.timestamp).fromNow()}</Text>
              </Pressable>
            )}
          />
        ) : (
          <Text style={tw`text-gray-500`}>No ping history</Text>
        )}
      </View>

      {/* TODO: Preview icons */}
      <RadioButtonModal<CliDevice['icon']> 
        ref={changeIconModalRef} 
        value={device.icon}
        setValue={icon => {
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
      />
    </DefaultView>
  );
}
