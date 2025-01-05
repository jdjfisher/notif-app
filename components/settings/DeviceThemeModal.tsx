import React, { ElementRef, useRef } from 'react';
import { ColorSchemeName, PressableProps } from 'react-native';

import { Pressable } from '../Themed';
import { useSettingsStore } from '../../state/settingsStore';

import RadioGroupModal from '../ui/RadioGroupModal';
import { useShallow } from 'zustand/react/shallow';

type Props = {
  children: React.ReactNode;
} & PressableProps;

// TODO: Could inline this component?
function DeviceThemeModal(props: Props) {
  const { children, ...otherProps } = props;

  const [deviceTheme, setDeviceTheme] = useSettingsStore(
    useShallow((state) => [state.deviceTheme, state.setDeviceTheme])
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
