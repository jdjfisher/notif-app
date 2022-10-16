import React, { ElementRef, useEffect, useRef } from 'react';
import { Alert, View as DefaultView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TextInputModal from '../components/ui/TextInputModal';
import shallow from 'zustand/shallow';
import dayjs from 'dayjs';
import tw from 'twrnc';

import { Link, ModalScreenProps } from '../types';
import { Text, View } from '../components/Themed';
import Menu from '../components/Menu';
import NotifApi from '../lib/api/bindings';
import useStore from '../state/store';
import LinkBroken from '../components/device/LinkBroken';
import RadioGroupModal from '../components/ui/RadioGroupModal';
import PingHistory from '../components/device/PingHistory';

export default function ViewDeviceScreen({ route, navigation }: ModalScreenProps<'view-device'>) {
  // Ref hooks
  const renameDeviceModalRef = useRef<ElementRef<typeof TextInputModal>>(null);
  const changeIconModalRef = useRef<ElementRef<typeof RadioGroupModal>>(null);

  // State hooks
  const [links, allPings, clearPings, pullPings, editLink, removeLink, recordBrokenLink] = useStore(
    (state) => [
      state.links,
      state.pings,
      state.clearPings,
      state.pullPings,
      state.editLink,
      state.removeLink,
      state.recordBrokenLink,
      state.appId,
    ],
    shallow
  );

  // Fetch the device data
  const linkId = route.params.linkId;
  const link = links.find((l) => l.id === linkId);
  const pings = allPings[linkId] ?? [];

  useEffect(() => {
    // We know the link is broken, only this app can correct this, .*. don't verify again
    if (!link || link.broken) return;

    NotifApi.status()
      .then(async (linkIds) => {
        if (!linkIds.includes(link.id)) {
          recordBrokenLink(link);
          Alert.alert('Link Broken', `${link.name} has been unlinked from this deivce`);
          return;
        }

        await pullPings(link);
      })
      .catch(console.debug);
  }, []);

  //
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          options={{
            'Remove': promptRemove,
            'Rename': () => renameDeviceModalRef.current?.show(),
            'Change Icon': () => changeIconModalRef.current?.show(),
            ...(pings.length ? { 'Clear Pings': promptClearPings } : {}),
          }}
        />
      ),
    });
  }, [navigation, pings]);

  // Abort if the device could not be found
  if (!link) {
    return null;
  }

  const promptClearPings = () => {
    Alert.alert('Clear Pings', `Clear all ping history for ${link.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: () => clearPings(link.id) },
    ]);
  };

  const promptRemove = () => {
    Alert.alert('Remove Device', `Remove ${link.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', onPress: () => remove() },
    ]);
  };

  const remove = async () => {
    try {
      // Unlink server-side
      await NotifApi.unlink(link.id);

      // Remove from storage
      removeLink(link);

      // Return to devices screen
      navigation.popToTop();
    } catch {
      Alert.alert('Alert', 'Failed to unlink device', [{ text: 'OK' }]);
    }
  };

  return (
    <DefaultView style={tw`h-full`}>
      <View style={tw`p-3 flex flex-row justify-between items-center shadow-sm mb-1`}>
        <DefaultView style={tw`flex-row items-center flex-shrink`}>
          <MaterialCommunityIcons
            name={link.icon}
            size={35}
            color={tw.color('text-black')}
            style={tw`mr-3`}
          />

          <DefaultView>
            <TextInputModal
              ref={renameDeviceModalRef}
              title="Rename Device"
              value={link.name}
              setValue={(name) => {
                if (name) editLink(link, { name });
              }}
              maxLength={20}
            >
              <Text style={tw`text-xl`}>{link.name}</Text>
            </TextInputModal>

            <Text style={tw`text-gray-400 text-xs`}>Linked {dayjs(link.linkedAt).fromNow()}</Text>
          </DefaultView>
        </DefaultView>

        {link.broken ? <LinkBroken /> : null}
      </View>

      <View style={tw`flex-1 shadow-sm pt-4`}>
        <Text style={tw`text-xl mx-4 mb-2`}>Pings</Text>

        <PingHistory device={link} pings={pings} />
      </View>

      {/* TODO: Preview icons */}
      <RadioGroupModal<Link['icon']>
        ref={changeIconModalRef}
        value={link.icon}
        setValue={(icon) => {
          if (icon) editLink(link, { icon });
        }}
        options={{
          'Laptop': 'laptop',
          'Desktop': 'desktop-tower',
          'Server': 'server',
          'Docker': 'docker',
          'AWS': 'aws',
          'Google': 'google-cloud',
          'Azure': 'microsoft-azure',
          'Digital Ocean': 'digital-ocean',
        }}
        customLabel={(label, value) => (
          <DefaultView style={tw`flex-row`}>
            <MaterialCommunityIcons
              name={value}
              size={20}
              color={tw.color('text-black')}
              style={tw`mr-2`}
            />
            <Text>{label}</Text>
          </DefaultView>
        )}
      />
    </DefaultView>
  );
}
