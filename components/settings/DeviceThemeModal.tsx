import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import React, { ElementRef, useRef } from 'react';
import { ColorSchemeName } from 'react-native';
import tw from 'twrnc';

import { View, Modal, Pressable, useThemeColor } from '../Themed';
import useStore from '../../store';
import shallow from 'zustand/shallow';

export default function ThemeModal(props: any) {
  const { children, ...otherProps } = props;

  const [deviceTheme, setDeviceTheme] = useStore(
    (state) => [state.deviceTheme, state.setDeviceTheme],
    shallow
  );

  const modalRef = useRef<ElementRef<typeof Modal>>(null);

  const textColour = useThemeColor('text');

  const radioButtons: RadioButtonProps[] = [
    {
      id: 'light',
      label: 'Light',
      value: 'light',
      selected: deviceTheme === 'light',
    },
    {
      id: 'dark',
      label: 'Dark',
      value: 'dark',
      selected: deviceTheme === 'dark',
    },
    {
      id: 'default',
      label: 'Follow System',
      value: undefined,
      selected: !deviceTheme,
    },
  ].map(button => ({
    ...button,
    color: textColour,
    labelStyle: { color: textColour },
  }));

  const onPressRadioButton = (radioButtonsArray: RadioButtonProps[]) => {
    setDeviceTheme(radioButtonsArray.find((b) => b.selected)?.value as ColorSchemeName); // TODO: Remove type assert
    modalRef.current?.hide();
  }

  return (
    <>
      {/* Plain Pressable for opening the modal */}
      <Pressable onPress={() => modalRef.current?.show()} {...otherProps}>
        {children}
      </Pressable>

      {/* The Modal */}
      <Modal ref={modalRef}>
        <View style={tw`p-2`}>
          <RadioGroup
            containerStyle={tw`items-start`}
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
          />
        </View>
      </Modal>
    </>
  );
}
