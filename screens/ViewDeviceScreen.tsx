import React, { useEffect } from 'react';
import { Button, Pressable, Alert, FlatList, View as DefaultView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import TextInputModal from '../components/ui/TextInputModal';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import { ModalScreenProps } from '../types';
import { Text, View } from '../components/Themed';
import api from '../api';
import useStore from '../state/store';

export default function ViewDeviceScreen({ route, navigation }: ModalScreenProps<'Device'>) {
  const [devices, allPings, clearPings, renameDevice, removeDevice, recordBrokenLink] = useStore(
    (state) => [
      state.devices,
      state.pings,
      state.clearPings,
      state.renameDevice,
      state.removeDevice,
      state.recordBrokenLink,
    ],
    shallow
  );

  // Fetch the device data
  const device = devices.find((d) => d.token === route.params.cliToken);

  if (!device) {
    navigation.popToTop();
    return;
  }

  const pings = allPings[device.token] ?? [];

  useEffect(() => {
    // We know the link is broken, only this app can correct this, .*. don't verify again
    if (device.linkBroken) return;

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
      .catch((error) => {});
  }, []);

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
      <View style={tw`p-4 flex flex-row justify-between items-center shadow-sm mb-1`}>
        <TextInputModal
          title="Rename Device"
          value={device.name}
          setValue={(name) => {
            if (name) renameDevice(device, name);
          }}
        >
          <Text style={tw`text-xl`}>{device.name}</Text>
        </TextInputModal>

        {device.linkBroken ? (
          <View style={tw`flex-row items-center`}>
            <MaterialIcons name={'link-off'} size={15} color={tw.color('red-400')} />
            <Text style={tw`text-red-400 ml-1 text-xs`}>Link Broken</Text>
          </View>
        ) : (
          <Text style={tw`text-right text-gray-500 text-xs`}>
            Linked {dayjs(device.linkedAt).fromNow()}
          </Text>
        )}
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

      {/* TODO: Replace with menu */}
      <View style={tw`p-4 flex-row shadow-sm mb-1`}>
        {pings.length ? (
          <View style={tw`flex-grow mr-2`}>
            <Button title={'Clear Pings'} onPress={() => promptClearPings()} />
          </View>
        ) : null}

        <View style={tw`flex-grow`}>
          <Button title={'Remove Device'} onPress={() => promptRemove()} />
        </View>
      </View>
    </DefaultView>
  );
}
