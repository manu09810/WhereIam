import { Tabs } from "expo-router";
import React from "react";
import {
  InformationCircleIcon,
  NewspaperIcon,
  PhotoIcon,
} from "react-native-heroicons/solid";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="infoCountry"
        options={{
          title: "Country Info",
          tabBarIcon: ({ color }) => (
            <InformationCircleIcon size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="News"
        options={{
          title: "Local News",
          tabBarIcon: ({ color }) => <NewspaperIcon size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Image"
        options={{
          title: "Landscapes",
          tabBarIcon: ({ color }) => <PhotoIcon size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
