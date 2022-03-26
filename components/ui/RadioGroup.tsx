import React from 'react';
import { View as DefaultView, PixelRatio } from 'react-native';
import tw from 'twrnc';
import { Text, Pressable, useThemeColor } from '../Themed';

export interface Props<T> {
  value?: T;
  options: { [id: string]: T };
  onSelect?: (option: T) => void;
  size?: number;
  customLabel?: (label: string, value: T) => React.ReactNode;
}

function RadioGroup<T>({ value, options, onSelect, customLabel, size = 20 }: Props<T>) {
  const colour = useThemeColor('text');

  const borderWidth = PixelRatio.roundToNearestPixel(size * 0.1);
  const sizeHalf = PixelRatio.roundToNearestPixel(size * 0.5);
  const sizeFull = PixelRatio.roundToNearestPixel(size);

  return (
    <DefaultView>
      {Object.entries(options).map(([label, option]) => (
        <Pressable
          key={label}
          style={tw`flex flex-row items-center p-1`}
          onPress={() => {
            if (onSelect) onSelect(option);
          }}
        >
          <DefaultView
            style={[
              tw`flex items-center justify-center mr-2`,
              {
                borderColor: colour,
                borderWidth,
                width: sizeFull,
                height: sizeFull,
                borderRadius: sizeHalf,
              },
            ]}
          >
            {value === option && (
              <DefaultView
                style={{
                  backgroundColor: colour,
                  width: sizeHalf,
                  height: sizeHalf,
                  borderRadius: sizeHalf,
                }}
              />
            )}
          </DefaultView>
          {customLabel ? customLabel(label, option) : <Text>{label}</Text>}
        </Pressable>
      ))}
    </DefaultView>
  );
}

export default RadioGroup;
