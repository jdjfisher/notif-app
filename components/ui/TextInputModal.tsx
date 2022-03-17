import React, { ElementRef, useRef, useState } from 'react';
import { PressableProps } from 'react-native';
import tw from 'twrnc';

import { View, Modal, Pressable, Text, TextInput } from '../Themed';

interface Actions {
  show: () => void;
}

type Props = {
  title: string;
  value?: string;
  setValue: (value?: string) => void;
  placeholderValue?: string;
  maxLength?: number;
  children?: React.ReactNode;
} & Omit<PressableProps, 'onPress'>;

const TextInputModal = React.forwardRef<Actions, Props>(({
  title,
  value,
  setValue,
  placeholderValue,
  maxLength,
  children,
  ...other
}, forwardRef) => {
  const [localValue, setLocalValue] = useState(value);
  const modalRef = useRef<ElementRef<typeof Modal>>(null);
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);

  React.useImperativeHandle(forwardRef, () => ({
    show: () => modalRef.current?.show(),
  }));

  return (
    <>
      {/* Plain Pressable for opening the modal */}
      <Pressable
        onPress={() => {
          setLocalValue(value);
          modalRef.current?.show();
        }}
        {...other}
      >
        {children}
      </Pressable>

      {/* The Modal */}
      <Modal
        ref={modalRef}
        acceptText="SAVE"
        onAccept={() => setValue(localValue)}
        onShow={() => {
          setTimeout(() => inputRef.current?.focus(), 20); // TODO: Avoid timeout
        }}
      >
        <View style={tw`p-1`}>
          <Text style={tw`font-bold text-lg`}>{title}</Text>
          <TextInput
            ref={inputRef}
            selectTextOnFocus
            maxLength={maxLength} 
            style={tw`my-3 border-b border-gray-300`}
            onChangeText={setLocalValue}
            value={localValue}
            placeholder={placeholderValue}
          />
        </View>
      </Modal>
    </>
  );
});

export default TextInputModal;
