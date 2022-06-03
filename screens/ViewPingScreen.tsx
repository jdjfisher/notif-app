import React from 'react';

import { Text, View } from '../components/Themed';
import { ModalScreenProps } from '../types';
import tw from 'twrnc';
import dayjs from 'dayjs';

// TODO: Redo this screen
export default function ViewPingScreen({ route }: ModalScreenProps<'Ping'>) {
  const { ping } = route.params;

  return (
    <View style={tw`flex p-4`}>
      <View style={tw`flex-row justify-between mb-4`}>
        <Text>{dayjs(ping.sentAt).toString()}</Text>
        <Text style={tw`text-xs text-gray-400`}>{dayjs(ping.sentAt).fromNow()}</Text>
      </View>

      <Text style={tw`font-bold text-lg mb-2`}>Message</Text>

      {ping.message ? (
        <Text>{ping.message}</Text>
      ) : (
        <Text style={tw`text-gray-500 italic`}>No message provided</Text>
      )}
    </View>
  );
}
