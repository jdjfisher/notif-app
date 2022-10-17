import React, { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, FlatList, View as DefaultView } from 'react-native';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import NotifApi from '../lib/api/bindings';
import useStore from '../state/store';
import { Text, View, Pressable } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import LinkBroken from '../components/device/LinkBroken';

export default function DevicesScreen({ navigation }: RootTabScreenProps<'device-list'>) {
  const [refreshing, setRefreshing] = useState(false);

  const [links, latestPing, pings, pullPings, recordBrokenLink] = useStore(
    (state) => [
      state.links,
      state.latestPing,
      state.pings,
      state.pullPings,
      state.recordBrokenLink,
    ],
    shallow
  );

  useEffect(() => {
    NotifApi.status().then((linkIds) => {
      for (const link of links) {
        if (!linkIds.includes(link.id)) {
          recordBrokenLink(link);
        }
      }
    });
  }, []);

  const linkedDevices = links.filter((d) => !d.broken);

  const refresh = async () => {
    setRefreshing(true);

    const refreshable = linkedDevices.filter((link) =>
      dayjs(link.lastPullAt).isBefore(dayjs().subtract(30, 'second'))
    );

    try {
      await Promise.all(refreshable.map(pullPings));
    } finally {
      setRefreshing(false);
    }
  };

  if (!links.length) {
    return (
      <DefaultView style={tw`flex-grow justify-center items-center`}>
        <Text style={tw`pb-5 text-2xl`}> No Devices linked </Text>
        {/* @ts-ignore */}
        <Button title={'Link Device'} onPress={() => navigation.navigate('add-device')} />
      </DefaultView>
    );
  }

  return (
    <View style={tw`mt-1 shadow-sm`}>
      <FlatList
        data={links}
        keyExtractor={(link) => String(link.id)}
        onRefresh={linkedDevices.length ? refresh : undefined}
        refreshing={refreshing}
        renderItem={({ item: link }) => (
          <Pressable
            // @ts-ignore
            onPress={() => navigation.navigate('view-device', { linkId: link.id })}
            style={tw`p-3 flex-row border-t border-gray-100 justify-between items-start`}
            key={link.id}
          >
            <DefaultView style={tw`flex-row items-center flex-shrink`}>
              <MaterialCommunityIcons
                name={link.icon}
                size={35}
                color={tw.color('text-black')}
                style={tw`mr-3`}
              />

              <DefaultView>
                <Text style={tw`text-xl`}>{link.name}</Text>
                <Text style={tw`text-xs text-gray-400`}>{latestPing(link)?.message ?? '-'}</Text>
              </DefaultView>
            </DefaultView>

            <DefaultView style={tw`items-end`}>
              <Text style={tw`text-xs text-gray-400`}>
                {dayjs(latestPing(link)?.sentAt ?? link.linkedAt).fromNow()}
              </Text>

              {link.broken ? <LinkBroken /> : null}
            </DefaultView>
          </Pressable>
        )}
      />
    </View>
  );
}
