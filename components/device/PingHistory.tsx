import React, { useState } from 'react';
import { FlatList } from 'react-native';
import dayjs from 'dayjs';
import tw from 'twrnc';
import { Text } from '../Themed';
import { Link as LinkType, Ping } from '../../types';
import { useStore } from '../../state/store';
import { Link } from 'expo-router';

// TODO: Remove pings from props, infer from link
interface Props {
  link: LinkType;
  pings: Ping[];
}

export default function PingHistory({ link, pings }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const pullPings = useStore((state) => state.pullPings);

  const refresh = async () => {
    setRefreshing(true);

    try {
      await pullPings(link);
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
      keyExtractor={(ping) => String(ping.id)}
      onRefresh={link.broken ? undefined : refresh}
      refreshing={refreshing}
      renderItem={({ item: ping }) => (
        <Link
          href={`/devices/${link.id}/pings/${ping.id}`}
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
        </Link>
      )}
    />
  );
}
