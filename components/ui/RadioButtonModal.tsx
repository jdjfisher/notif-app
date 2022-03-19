import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import React, { ElementRef, useRef } from 'react';
import tw from 'twrnc';

import { View, Modal, useThemeColor } from '../Themed';

interface Actions {
  show: () => void;
  hide: () => void;
}

interface Props<T> {
  value?: T,
  setValue: (value?: T) => void,
  options: { [label: string]: T }
}

function RadioButtonModal<T extends string>({ value, setValue, options }: Props<T>, forwardRef: React.ForwardedRef<Actions>) {
  const modalRef = useRef<ElementRef<typeof Modal>>(null);

  const textColour = useThemeColor('text');

  React.useImperativeHandle(forwardRef, () => ({
    show: () => modalRef.current?.show(),
    hide: () => modalRef.current?.hide(),
  }));

  const radioButtons: RadioButtonProps[] = Object.entries(options).map(([k, v]) => ({
    id: k,
    label: k,
    value: v,
    selected: v === value,
    color: textColour,
    labelStyle: { color: textColour },
    onPress: () => {
      setValue(v);
      modalRef.current?.hide();
    }
  }));

  return (
    <Modal ref={modalRef}>
      <View style={tw`p-1`}>
        <RadioGroup
          containerStyle={tw`items-start`}
          radioButtons={radioButtons}
        />
      </View>
    </Modal>
  );
}

export default React.forwardRef(RadioButtonModal);
