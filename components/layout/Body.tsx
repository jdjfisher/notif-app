import React, { useEffect } from 'react';
import Navigation from '../../navigation';
import { useProfileStore } from '../../state/profileStore';
import { useSettingsStore } from '../../state/settingsStore';
import NotifApi from '../../lib/api/bindings';
import { getPushToken } from '../../lib/helpers';
import { View, Text, Pressable } from '../Themed';
import tw from 'twrnc';

export default function Body() {
  const bearerToken = useProfileStore((state) => state.bearerToken);
  const apiStatus = useSettingsStore((state) => state.apiStatus);

  useEffect(() => {
    if (bearerToken) {
      return;
    }

    getPushToken().then((pushToken) => {
      NotifApi.register.apply(pushToken);
    });
  }, [bearerToken]);

  const checkApiStatus = async () => {
    try {
      await NotifApi.health();
    } catch (error) {
      //
    }
  };

  if (apiStatus !== 'connected')
    return (
      <Pressable onPress={checkApiStatus} style={tw`flex-grow items-center justify-center`}>
        <Text>
          {apiStatus === 'maintenance' ? 'Server under maintenance' : 'Unable to connect to Server'}
        </Text>
      </Pressable>
    );

  if (!bearerToken) {
    return (
      <View style={tw`flex-grow items-center justify-center`}>
        <Text>Authenticating</Text>
      </View>
    );
  }

  return <Navigation />;
}
