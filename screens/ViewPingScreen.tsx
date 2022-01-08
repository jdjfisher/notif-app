import React from 'react';

import { Text, View } from '../components/Themed';
import { ModalScreenProps } from '../types';
import tw from 'twrnc';
import dayjs from 'dayjs';

export default function ViewPingScreen({ route }: ModalScreenProps<'Ping'>) {
  const { ping } = route.params;

  return (
    <View style={tw`flex p-4`}>
      <View style={tw`flex-row justify-between`}>
        <Text style={tw`text-2xl`}>Ping</Text>
        <Text style={tw`mb-4 text-right`}>
          {dayjs(ping.timestamp).toString()} {'\n'}({dayjs(ping.timestamp).fromNow()})
        </Text>
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
