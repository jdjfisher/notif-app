import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';
import useStore from '../state/store';

export default function useColorScheme(): NonNullable<ColorSchemeName> {
  const chosenTheme = useStore((state) => state.deviceTheme);

  const defaultTheme = _useColorScheme() as NonNullable<ColorSchemeName>;

  return chosenTheme ?? defaultTheme;
}
