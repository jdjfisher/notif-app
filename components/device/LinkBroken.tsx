import { MaterialIcons } from '@expo/vector-icons';
import { Text, View as DefaultView } from 'react-native';
import tw from 'twrnc';

const LinkBroken = () => {
  return (
    <DefaultView style={tw`flex-row items-center`}>
      <MaterialIcons name={'link-off'} size={18} color={tw.color('red-400')} />
      <Text style={tw`text-red-400 ml-1 text-sm`}>Link Broken</Text>
    </DefaultView>
  );
};

export default LinkBroken;
