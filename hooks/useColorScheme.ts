import { ColorSchemeName, useColorScheme as _useColorScheme } from 'react-native';
import { useSettingsStore } from '../state/settingsStore';

export default function useColorScheme(): NonNullable<ColorSchemeName> {
  const chosenTheme = useSettingsStore((state) => state.deviceTheme);

  const defaultTheme = _useColorScheme() as NonNullable<ColorSchemeName>;

  return chosenTheme ?? defaultTheme;
}
