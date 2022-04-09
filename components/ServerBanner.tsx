import React, { useEffect } from 'react';
import { Text, Pressable } from 'react-native';
import useStore from '../state/store';
import NotifApi from '../lib/api/bindings';
import tw from 'twrnc';

export default () => {
  const apiStatus = useStore(state => state.apiStatus);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      await NotifApi.health();
    } catch (error) {
      console.debug(error);     
    }
  }

  if (apiStatus !== 'connected')
    return (
      <Pressable style={tw`bg-red-500 p-4`} onPress={checkApiStatus}>
        <Text style={tw`text-center text-white font-bold`}>
          { apiStatus === 'maintenance' ? 'Server under maintenance' : 'Lost connection to Server' }
        </Text>
      </Pressable>
    );

  return null;
};
