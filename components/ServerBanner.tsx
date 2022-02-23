import React, { useEffect } from 'react';
import { Text, Pressable } from 'react-native';
import useStore from '../store';
import api from '../api';
import tw from 'twrnc';

export default () => {
  const serverStatus = useStore(state => state.serverStatus);

  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      await api.get('/health');
    } catch (error) {
      console.debug(error);     
    }
  }

  if (serverStatus !== 'connected')
    return (
      <Pressable style={tw`bg-red-500 p-4`} onPress={checkServerStatus}>
        <Text style={tw`text-center text-white font-bold`}>
          { serverStatus === 'maintenance' ? 'Server under maintenance' : 'Lost connection to Server' }
        </Text>
      </Pressable>
    );

  return null;
};
