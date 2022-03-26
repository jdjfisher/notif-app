import React, { ElementRef, useRef } from 'react';
import { ColorSchemeName, PressableProps } from 'react-native';

import { Pressable } from '../Themed';
import useStore from '../../state/store';
import shallow from 'zustand/shallow';
import RadioGroupModal from '../ui/RadioGroupModal';

type Props = {
  children: React.ReactNode
} & PressableProps;

// TODO: Could inline this component?
function DeviceThemeModal(props: Props) {
  const { children, ...otherProps } = props;

  const [deviceTheme, setDeviceTheme] = useStore(
    (state) => [state.deviceTheme, state.setDeviceTheme],
    shallow
  );

  const modalRef = useRef<ElementRef<typeof RadioGroupModal>>(null);

  return (
    <>
      {/* Plain Pressable for opening the modal */}
      <Pressable {...otherProps} onPress={() => modalRef.current?.show()}>
        {children}
      </Pressable>

      {/* The Modal */}
      <RadioGroupModal<ColorSchemeName>
        ref={modalRef}
        value={deviceTheme}
        setValue={setDeviceTheme}
        options={{
          'Light': 'light',
          'Dark': 'dark',
          'Follow System': null,
        }}
      />
    </>
  );
}

export default DeviceThemeModal;
