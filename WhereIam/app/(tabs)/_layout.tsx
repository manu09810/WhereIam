import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  InformationCircleIcon,
  NewspaperIcon,
  PhotoIcon,
} from "react-native-heroicons/solid";

import { HapticTab } from "@/components/haptic-tab";
import { useLocation } from "@/context/LocationContext";

// Helper de contraste
const getReadableTextColor = (hex: string) => {
  if (!hex || hex.length < 7) return "#111";
  const r = parseInt(hex.substr(1, 2), 16) / 255;
  const g = parseInt(hex.substr(3, 2), 16) / 255;
  const b = parseInt(hex.substr(5, 2), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55 ? "#111111" : "#ffffff";
};

export default function TabLayout() {
  const { themeColors, averageColor } = useLocation();
  const [tabIconColor, setTabIconColor] = useState("#0a7ea4");
  const [tabBarBackground, setTabBarBackground] = useState("#ffffff");
  const [tabBorderColor, setTabBorderColor] = useState("#dddddd");

  useEffect(() => {
    const bg =  themeColors?.[0] || "#f7f7f7";
    const icon = getReadableTextColor(bg);

    setTabBarBackground(bg);
    setTabIconColor(icon);
    setTabBorderColor("rgba(0,0,0,0.08)");
  }, [themeColors, averageColor]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabIconColor,
        tabBarInactiveTintColor: tabIconColor,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: tabBorderColor,
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
