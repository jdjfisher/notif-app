import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link, Tabs } from 'expo-router';
import { Pressable } from '../../components/Themed';
import Colors from '../../constants/Colors';
import tw from 'twrnc';
import useColorScheme from '../../hooks/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}) {
  return <MaterialIcons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Devices',
          tabBarIcon: ({ color }) => <TabBarIcon name="devices" color={color} />,
          headerRight: () => (
            <Link href="/devices/add" asChild>
              <Pressable rippleRadius={16}>
                <MaterialIcons
                  name="add"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={tw`p-1 mr-4`}
                />
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color }) => <TabBarIcon name="help" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
