import React from 'react';

import { Text, View } from '../../../../components/Themed';
import tw from 'twrnc';
import dayjs from 'dayjs';
import { useGlobalSearchParams } from 'expo-router';
import { useStore } from '../../../../state/store';
import { z } from 'zod';

// TODO: Redo this screen
export default function ViewPing() {
  const params = useGlobalSearchParams();

  const linkId = z.preprocess(Number, z.number()).parse(params.linkId);
  const pingId = z.preprocess(Number, z.number()).parse(params.pingId);

  const pings = useStore((state) => state.pings);

  const ping = pings[linkId].find((ping) => ping.id === pingId);

  if (!ping) {
    return;
  }

  return (
    <View style={tw`flex p-4`}>
      <View style={tw`flex-row justify-between mb-4`}>
        <Text>{dayjs(ping.sentAt).format('llll')}</Text>
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
