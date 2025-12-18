import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  InformationCircleIcon,
  NewspaperIcon,
  PhotoIcon,
} from "react-native-heroicons/solid";

import { HapticTab } from "@/components/haptic-tab";
import { useLocation } from "@/context/LocationContext";

export default function TabLayout() {
  const { flagColors } = useLocation();
  const [tabIconColor, setTabIconColor] = useState("#0a7ea4");
  const [tabBarBackground, setTabBarBackground] = useState("#ffffff");

  useEffect(() => {
    if (flagColors && flagColors.length >= 2) {
      setTabBarBackground(flagColors[0]);
      setTabIconColor(flagColors[1]);
    }
  }, [flagColors]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabIconColor,
        tabBarInactiveTintColor: tabIconColor,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: `${tabBarBackground}40`,
        },
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
