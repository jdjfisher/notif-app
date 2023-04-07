import * as React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Linking, StyleSheet, Image, Pressable, View as DefaultView } from 'react-native';
import tw from 'twrnc';

import { Text, View } from '../../components/Themed';
import useColorScheme from '../../hooks/useColorScheme';

export default function Help() {
  const colorScheme = useColorScheme();

  return (
    <DefaultView style={tw`py-4 flex-grow items-center justify-between`}>
      <View style={tw`py-2 w-full flex items-center shadow-sm`}>
        <Text style={tw`text-xl font-bold`}>Install the CLI</Text>
        <Image style={styles.image} source={require('../../assets/images/help/install.png')} />
      </View>

      <View style={tw`py-2 w-full flex items-center shadow-sm`}>
        <Text style={tw`text-xl font-bold`}>Link CLI to App</Text>
        <Image style={styles.image} source={require('../../assets/images/help/link.png')} />
      </View>

      <View style={tw`py-2 w-full flex items-center shadow-sm`}>
        <Text style={tw`text-xl font-bold`}>Send a Ping</Text>
        <Image style={styles.image} source={require('../../assets/images/help/ping.png')} />
      </View>

      <Pressable
        style={tw.style('flex-row items-center rounded py-2 px-3 content-end bg-black', {
          'border border-white': colorScheme === 'dark',
        })}
        onPress={() => Linking.openURL('https://github.com/jdjfisher/notif')}
      >
        <Text style={tw`mr-2 font-bold text-white`}>GitHub</Text>
        <FontAwesome name="github" size={25} color={'white'} />
      </Pressable>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 85,
    marginVertical: 10,
    width: '85%',
    resizeMode: 'contain',
  },
});
