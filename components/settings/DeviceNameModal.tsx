import React, { ElementRef, useRef, useState } from 'react';
import { ColorSchemeName } from 'react-native';
import * as Device from 'expo-device';
import tw from 'twrnc';

import { View, Modal, Pressable, Text, TextInput } from '../Themed';
import useStore from '../../store';
import shallow from 'zustand/shallow';

export default function ThemeModal(props: any) {
  const { children, ...otherProps } = props;

  const [deviceName, setDeviceName] = useStore(
    (state) => [state.mobileDeviceName, state.setMobileDeviceName],
    shallow
  );

  const [localDeviceName, setLocalDeviceName] = useState(deviceName);

  const modalRef = useRef<ElementRef<typeof Modal>>(null);

  return (
    <>
      {/* Plain Pressable for opening the modal */}
      <Pressable onPress={() => {
        setLocalDeviceName(deviceName);
        modalRef.current?.show();
      }} {...otherProps}>
        {children}
      </Pressable>

      {/* The Modal */}
      <Modal ref={modalRef} onOk={() => setDeviceName(localDeviceName)}>
        <View style={tw`p-2 pr-10`}>
          <Text style={tw`font-bold text-lg`}>
            Device Name
          </Text>
          <TextInput
            style={tw`my-3`}
            autoFocus
            onChangeText={setLocalDeviceName}
            value={localDeviceName}
            placeholder={Device.deviceName || Device.modelName || ''}
          />
        </View>
      </Modal>
    </>
  );
}
