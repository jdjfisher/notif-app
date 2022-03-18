import * as React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable as DefaultPressable, View as DefaultView } from 'react-native';
import tw from 'twrnc';
import { Pressable, Text } from './Themed';

type Props = {
  options: {
    [title: string]: () => void;
  };
};

const Menu = ({ options }: Props) => {
  const [visible, setVisible] = React.useState(false);

  return (
    <DefaultView>
      <Pressable onPress={() => setVisible(true)}>
        <MaterialCommunityIcons name="dots-vertical" size={25} />
      </Pressable>

      <Modal
        animationType="fade"
        transparent
        visible={visible}
        statusBarTranslucent={false}
        onRequestClose={() => setVisible(false)}
      >
        <DefaultPressable style={tw`flex-grow`} onPress={() => setVisible(false)}>
          <DefaultPressable style={tw`bg-white p-2 shadow-md m-1 ml-auto min-w-40`}>
            {Object.entries(options).map(([title, onPress]) => (
              <Pressable
                style={tw`p-2 border-b border-gray-50`}
                key={title}
                onPress={() => {
                  onPress();
                  setTimeout(() => setVisible(false), 200);
                }}
              >
                <Text style={tw`text-lg`}>{title}</Text>
              </Pressable>
            ))}
          </DefaultPressable>
        </DefaultPressable>
      </Modal>
    </DefaultView>
  );
};

export default Menu;
