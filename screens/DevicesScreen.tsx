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
import { getPushToken } from '../lib/helpers';

export default function DevicesScreen({ navigation }: RootTabScreenProps<'device-list'>) {
  const [refreshing, setRefreshing] = useState(false);

  const [devices, latestPing, pings, pullPings, recordBrokenLink] = useStore(
    (state) => [
      state.devices,
      state.latestPing,
      state.pings,
      state.pullPings,
      state.recordBrokenLink,
    ],
    shallow
  );

  useEffect(() => {
    (async () => {
      const payload = {
        mobileToken: await getPushToken(),
      };

      NotifApi.status(payload).then((response) => {
        const tokens = response?.data?.linkedCliTokens;

        if (tokens === undefined) return;

        for (const device of devices) {
          if (!tokens.includes(device.token)) {
            recordBrokenLink(device);
          }
        }
      });
    })();
  }, []);

  const linkedDevices = devices.filter((d) => !d.linkBroken);

  const refresh = async () => {
    setRefreshing(true);

    const refreshable = linkedDevices.filter((device) =>
      dayjs(device.lastPullAt).isBefore(dayjs().subtract(30, 'second'))
    );

    try {
      await Promise.all(refreshable.map(pullPings));
    } finally {
      setRefreshing(false);
    }
  };

  if (!devices.length) {
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
        data={devices}
        keyExtractor={(device) => device.token}
        onRefresh={linkedDevices.length ? refresh : undefined}
        refreshing={refreshing}
        renderItem={({ item: device }) => (
          <Pressable
            // @ts-ignore
            onPress={() => navigation.navigate('view-device', { cliToken: device.token })}
            style={tw`p-3 flex-row border-t border-gray-100 justify-between items-start`}
            key={device.token}
          >
            <DefaultView style={tw`flex-row items-center flex-shrink`}>
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
                {dayjs(latestPing(device.token)?.sentAt ?? device.linkedAt).fromNow()}
              </Text>

              {device.linkBroken ? <LinkBroken /> : null}
            </DefaultView>
          </Pressable>
        )}
      />
    </View>
  );
}
