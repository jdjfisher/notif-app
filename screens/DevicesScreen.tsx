import React, { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, FlatList, View as DefaultView } from 'react-native';
import * as Notifications from 'expo-notifications';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import api from '../api';
import useStore from '../store';
import { Text, View, Pressable } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function DevicesScreen({ navigation }: RootTabScreenProps<'Devices'>) {
  const [devices, latestPing, recordBrokenLink] = useStore(
    (state) => [state.devices, state.latestPing, state.recordBrokenLink],
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
            onPress={() => navigation.navigate('Device', { cliToken: device.token })}
            style={tw`p-3 flex-row border-t border-gray-100 justify-between items-start`}
          >
            <DefaultView style={tw`flex-row items-center`}>
              <MaterialIcons name={device.icon} size={35} color={tw.color('text-black')} />

              <DefaultView style={tw`ml-3`}>
                <Text style={tw`text-xl`}>{device.name}</Text>
                <Text style={tw`text-xs text-gray-400`}>
                  {latestPing(device.token)?.message ?? '-'}
                </Text>
              </DefaultView>
            </DefaultView>

            <Text style={tw`text-xs text-gray-400 text-right`}>
              {dayjs(latestPing(device.token)?.timestamp ?? device.linkedAt).fromNow()}
            </Text>

            {/* TODO: number of unseen pings */}
            {/* <Text style={tw`text-xs bg-gray-200 rounded-xl p-1 text-center mt-1`}>5</Text> */}

            {/* 
            {device.linkBroken ? (
              <View style={tw`flex-row items-center`}>
                <MaterialIcons name={'link-off'} size={15} color={tw.color('red-400')} />
                <Text style={tw`text-red-400 ml-1`}>Link Broken</Text>
              </View>
            ) : null} 
            */}
          </Pressable>
        )}
      />
    </View>
  );
}
