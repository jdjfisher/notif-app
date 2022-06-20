import React, { useState } from 'react';
import { FlatList } from 'react-native';
import dayjs from 'dayjs';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';

import { Text, Pressable } from '../Themed';
import { CliDevice, Ping } from '../../types';
import useStore from '../../state/store';

// TODO: Remove pings from props, infer from device
interface Props {
  device: CliDevice;
  pings: Ping[];
}

export default function PingHistory({ device, pings }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const pullPings = useStore((state) => state.pullPings);
  const navigation = useNavigation();

  const refresh = async () => {
    setRefreshing(true);

    try {
      await pullPings(device);
    } finally {
      setRefreshing(false);
    }
  };

  if (!pings.length) {
    return <Text style={tw`text-gray-500 mx-4`}>No ping history</Text>;
  }

  return (
    <FlatList
      data={pings}
      keyExtractor={(ping) => ping.id}
      onRefresh={device.linkBroken ? undefined : refresh}
      refreshing={refreshing}
      renderItem={({ item: ping }) => (
        <Pressable
          // @ts-ignore
          onPress={() => navigation.navigate('view-ping', { ping })}
          style={tw`border-t border-gray-100 py-3 px-4`}
        >
          {ping.message ? (
            <Text numberOfLines={1} ellipsizeMode="tail">
              {ping.message}
            </Text>
          ) : (
            <Text style={tw`text-gray-500 italic`}>No message provided</Text>
          )}
          <Text style={tw`text-right text-gray-400`}>{dayjs(ping.sentAt).fromNow()}</Text>
        </Pressable>
      )}
    />
  );
}
