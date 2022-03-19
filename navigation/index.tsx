/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import { Pressable } from '../components/Themed';
import useColorScheme from '../hooks/useColorScheme';
import AddDeviceScreen from '../screens/AddDeviceScreen';
import ViewDeviceScreen from '../screens/ViewDeviceScreen';
import ViewPingScreen from '../screens/ViewPingScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import DevicesScreen from '../screens/DevicesScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

export const navigationRef = createNavigationContainerRef();

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        {/* @ts-ignore */}
        <Stack.Screen name="Add Device" component={AddDeviceScreen} />
        {/* @ts-ignore */}
        <Stack.Screen name="Device" component={ViewDeviceScreen} />
        {/* @ts-ignore */}
        <Stack.Screen name="Ping" component={ViewPingScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Devices"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarHideOnKeyboard: true,
        tabBarStyle: { height: 60 },
        tabBarItemStyle: { padding: 8 },
      }}>
      <BottomTab.Screen
        name="Devices"
        component={DevicesScreen}
        options={({ navigation }: RootTabScreenProps<'Devices'>) => ({
          title: 'Devices',
          tabBarIcon: ({ color }) => <TabBarIcon name="devices" color={color} />,
          headerRight: () => (
            // @ts-ignore
            <Pressable onPress={() => navigation.navigate('Add Device')}>
              <MaterialIcons
                name="add"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="Help"
        component={HelpScreen}
        options={{
          title: 'Help',
          tabBarIcon: ({ color }) => <TabBarIcon name="help" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={30} style={{ marginBottom: -3 }} {...props} />;
}
