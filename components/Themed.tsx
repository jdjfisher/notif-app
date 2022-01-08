/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  Modal as DefaultModal,
  Switch as DefaultSwitch,
  TextInput as DefaultTextInput,
  Pressable as DefaultPressable,
} from 'react-native';
import tw from 'twrnc';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
  const theme = useColorScheme();

  return Colors[theme][colorName];
}

export function Text(props: DefaultText['props']) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: DefaultView['props']) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor('background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

type ModalActions = { show: () => void; hide: () => void };
type ModalProps = DefaultModal['props'] & { onOk?: () => void };

export const Modal = React.forwardRef<ModalActions, ModalProps>((props, ref) => {
  const { onOk, ...otherProps } = props;
  const [visible, setVisible] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: () => setVisible(false),
  }));

  return (
    <DefaultModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(false)}
      {...otherProps}
    >
      <DefaultView style={tw`flex flex-grow items-center justify-center bg-opacity-50 bg-black`}>
        <View style={tw`p-5 shadow-lg rounded-md`}>
          {/* Modal body */}
          {props.children}

          {/* Standard Modal actions */}
          <View style={tw`flex-row justify-end`}>
            <DefaultPressable onPress={() => setVisible(false)}>
              <Text style={tw`text-blue-500 text-right`}>CANCEL</Text>
            </DefaultPressable>

            {onOk && (
              <DefaultPressable
                style={tw`ml-5`}
                onPress={() => {
                  setVisible(false);
                  onOk();
                }}
              >
                <Text style={tw`text-blue-500 text-right`}>OK</Text>
              </DefaultPressable>
            )}
          </View>
        </View>
      </DefaultView>
    </DefaultModal>
  );
});

export function Switch(props: DefaultSwitch['props']) {
  const { style, ...otherProps } = props;

  return <DefaultSwitch {...otherProps} />;
}

export function TextInput(props: DefaultTextInput['props']) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('text');
  const placeholderColor = useThemeColor('placeholderText');

  return (
    <DefaultTextInput
      placeholderTextColor={placeholderColor}
      style={[{ color }, style]}
      {...otherProps}
    />
  );
}

export function Pressable(props: any) {
  const { style, ...otherProps } = props;

  return (
    <DefaultPressable
      style={({ pressed }) => [tw.style({ 'opacity-50': pressed }), style]}
      {...otherProps}
    />
  );
}
