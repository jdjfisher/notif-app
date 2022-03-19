import React, { useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, FlatList, View as DefaultView } from 'react-native';
import * as Notifications from 'expo-notifications';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import api from '../api';
import useStore from '../state/store';
import { Text, View, Pressable } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import LinkBroken from '../components/device/LinkBroken';

export default function DevicesScreen({ navigation }: RootTabScreenProps<'Devices'>) {
  const [devices, pings, latestPing, recordBrokenLink] = useStore(
    (state) => [state.devices, state.pings, state.latestPing, state.recordBrokenLink],
    shallow
  );

  useEffect(() => {
    (async () => {
      const payload = {
        mobileToken: (await Notifications.getExpoPushTokenAsync()).data,
      };

      api.post('status', payload).then((response) => {
        const tokens = response?.data?.linkedCliTokens as string[] | undefined;

        if (tokens === undefined) return;

        for (const device of devices) {
          if (!tokens.includes(device.token)) {
            recordBrokenLink(device);
          }
        }
      });
    })();
  }, []);

  if (!devices.length) {
    return (
      <DefaultView style={tw`flex-grow justify-center items-center`}>
        <Text style={tw`pb-5 text-2xl`}> No Devices linked </Text>
        {/* @ts-ignore */}
        <Button title={'Link Device'} onPress={() => navigation.navigate('Add Device')} />
      </DefaultView>
    );
  }

  return (
    <View style={tw`mt-1 shadow-sm`}>
      <FlatList
        data={devices}
        keyExtractor={(device) => device.token}
        renderItem={({ item: device }) => (
          <Pressable
            key={device.token}
            // @ts-ignore
            onPress={() => navigation.navigate('Device', { cliToken: device.token })}
            style={tw`p-3 flex-row border-t border-gray-100 justify-between items-start`}
          >
            <DefaultView style={tw`flex-row items-center`}>
              <MaterialCommunityIcons
                name={device.icon}
                size={35}
                color={tw.color('text-black')}
                style={tw`mr-3`}
              />

              <DefaultView>
                <Text style={tw`text-xl`}>{device.name}</Text>
                <Text style={tw`text-xs text-gray-400`}>
                  {latestPing(device.token)?.message ?? '-'}
                </Text>
              </DefaultView>
            </DefaultView>

            <DefaultView style={tw`items-end`}>
              <Text style={tw`text-xs text-gray-400`}>
                {dayjs(latestPing(device.token)?.timestamp ?? device.linkedAt).fromNow()}
              </Text>

              {/* sxt style={tw`text-xs bg-gray-200 rounded-xl p-1 text-center mt-1`}>5</Text> */}

              {device.linkBroken ? <LinkBroken /> : null}
            </DefaultView>
          </Pressable>
        )}
      />
    </View>
  );
}
