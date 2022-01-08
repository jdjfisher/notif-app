import React, { useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, View as DefaultView } from 'react-native';
import * as Notifications from 'expo-notifications';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import api from '../api';
import useStore from '../store';
import { Text, View, Pressable } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function DevicesScreen({ navigation }: RootTabScreenProps<'Devices'>) {
  const [devices, recordBrokenLink] = useStore((state) => [state.devices, state.recordBrokenLink], shallow);

  useEffect(() => {
    (async () => {
      const payload = {
        mobileToken: (await Notifications.getExpoPushTokenAsync()).data,
      };
  
      api.post('status', payload).then((response) => {
        const tokens = response?.data?.linkedCliTokens as string[] | undefined;

        if (tokens === undefined)
          return; 
  
        for (const device of devices) {
          if (!tokens.includes(device.token))
            recordBrokenLink(device);
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
    <View style={tw`mt-1`}>
      {devices.map((device) => (
        <Pressable
          key={device.token}
          onPress={() => navigation.navigate('Device', { device })}
          style={tw`p-4 flex flex-row justify-between items-center`}
        >
          <Text style={tw`text-2xl`}>{device.name}</Text>

          {device.linkBroken ? (
            <View style={tw`flex-row items-center`}>
              <MaterialIcons
                name={'link-off'}
                size={15}
                color={tw.color('red-400')}
                />
              <Text style={tw`text-red-400 ml-1`}>Link Broken</Text>
            </View>
          ) : (
            <Text style={tw`text-gray-400`}>Linked {dayjs(device.linkedAt).fromNow()}</Text>
          )}
          {/* TODO: Show last ping timestamp instead */}
        </Pressable>
      ))}
    </View>
  );
}
