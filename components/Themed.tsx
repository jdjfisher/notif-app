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
import { PressableProps } from 'react-native';
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

type ModalActions = { show: () => void; hide: (delay?: number) => void };
type ModalProps = DefaultModal['props'] & { onAccept?: () => void; acceptText?: string };

export const Modal = React.forwardRef<ModalActions, ModalProps>((props, ref) => {
  const { onAccept, acceptText, ...otherProps } = props;
  const [visible, setVisible] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    show: () => setVisible(true),
    hide: (delay = 0) => {
      setTimeout(() => setVisible(false), delay);
    },
  }));

  return (
    <DefaultModal
      animationType="fade"
      transparent={true}
      visible={visible}
      statusBarTranslucent
      onRequestClose={() => setVisible(false)}
      {...otherProps}
    >
      <DefaultView style={tw`flex-grow justify-center p-10 bg-opacity-30 bg-black`}>
        <View style={tw`p-5 shadow-lg rounded-md`}>
          {/* Modal body */}
          {props.children}

          {/* Standard Modal actions */}
          <View style={tw`flex-row justify-end`}>
            <DefaultPressable onPress={() => setVisible(false)}>
              <Text style={tw`text-blue-500 text-right`}>CANCEL</Text>
            </DefaultPressable>

            {(onAccept || acceptText) && (
              <DefaultPressable
                style={tw`ml-5`}
                onPress={() => {
                  setVisible(false);
                  onAccept?.();
                }}
              >
                <Text style={tw`text-blue-500 text-right`}>{acceptText ?? 'OK'}</Text>
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

export const TextInput = React.forwardRef<any, DefaultTextInput['props']>((props, ref) => {
  const { style, ...otherProps } = props;
  const color = useThemeColor('text');
  const placeholderColor = useThemeColor('placeholderText');

  return (
    <DefaultTextInput
      placeholderTextColor={placeholderColor}
      style={[{ color }, style]}
      ref={ref}
      {...otherProps}
    />
  );
});

export function Pressable(props: PressableProps) {
  const { style, ...otherProps } = props;

  return (
    <DefaultPressable
      // @ts-ignore
      style={({ pressed }) => [tw.style({ 'opacity-50': pressed }), style]}
      {...otherProps}
    />
  );
}
