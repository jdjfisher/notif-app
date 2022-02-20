import React, { ElementRef, useRef, useState } from 'react';
import tw from 'twrnc';

import { View, Modal, Pressable, Text, TextInput } from '../Themed';

interface Props {
  title: string,
  value: string,
  placeholderValue?: string,
  setValue: (value: string) => void,
}

// TODO: Show keyboard on open

export default function TextInputModal({ title, value, setValue, placeholderValue, children, ...other }: Props) {
  const [localValue, setLocalValue] = useState(value);
  const modalRef = useRef<ElementRef<typeof Modal>>(null);

  return (
    <>
      {/* Plain Pressable for opening the modal */}
      <Pressable onPress={() => {
        setLocalValue(value);
        modalRef.current?.show();
      }} {...other}>
        {children}
      </Pressable>

      {/* The Modal */}
      <Modal ref={modalRef} onOk={() => setValue(localValue)}>
        <View style={tw`p-2 pr-10`}>
          <Text style={tw`font-bold text-lg`}>
            {title}
          </Text>
          <TextInput
            style={tw`my-3`}
            autoFocus
            onChangeText={setLocalValue}
            value={localValue}
            placeholder={placeholderValue}
          />
        </View>
      </Modal>
    </>
  );
}
