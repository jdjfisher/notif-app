import React, { ElementRef, useRef } from 'react';
import tw from 'twrnc';

import RadioGroup, { Props as RadioGroupProps } from './RadioGroup';
import { View, Modal } from '../Themed';

interface Actions {
  show: () => void;
  hide: () => void;
}

type Props<T> = {
  setValue: (value?: T) => void;
} & Omit<RadioGroupProps<T>, 'onSelect'>;

function RadioGroupModal<T>(
  { setValue, ...otherProps }: Props<T>,
  forwardRef: React.ForwardedRef<Actions>
) {
  const modalRef = useRef<ElementRef<typeof Modal>>(null);

  React.useImperativeHandle(forwardRef, () => ({
    show: () => modalRef.current?.show(),
    hide: () => modalRef.current?.hide(),
  }));

  const onSelect = (option: T) => {
    setValue(option);
    modalRef.current?.hide(300);
  };

  return (
    <Modal ref={modalRef}>
      <View style={tw`p-1`}>
        <RadioGroup<T> {...otherProps} onSelect={onSelect} />
      </View>
    </Modal>
  );
}

export default React.forwardRef(RadioGroupModal);
