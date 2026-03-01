import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  InformationCircleIcon,
  NewspaperIcon,
  QuestionMarkCircleIcon,
} from "react-native-heroicons/solid";

import { HapticTab } from "@/components/haptic-tab";
import { useLocation } from "@/context/LocationContext";
import { getReadableTextColor } from "@/constants/functions";
import { ALPHA, SIZE, SPACING } from "@/constants/theme";

export default function TabLayout() {
  const { themeColors, averageColor } = useLocation();
  const [tabIconColor, setTabIconColor] = useState("#0a7ea4");
  const [tabBarBackground, setTabBarBackground] = useState("#ffffff");
  const [tabBorderColor, setTabBorderColor] = useState("#dddddd");

  useEffect(() => {
    const bg = themeColors?.[2] || "#f7f7f7";
    const icon = getReadableTextColor(bg);

    setTabBarBackground(bg);
    setTabIconColor(icon);
    setTabBorderColor(ALPHA.lightBorder);
  }, [themeColors, averageColor]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabIconColor,
        tabBarInactiveTintColor: tabIconColor,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          height: SIZE.tabBar,
          paddingBottom: SPACING.sm,
          paddingTop: SPACING.md,
          borderTopWidth: 1,
          borderTopColor: tabBorderColor,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="News"
        options={{
          title: "Local News",
          tabBarIcon: ({ color }) => <NewspaperIcon size={30} color={color} />,
        }}
      />
      <Tabs.Screen
        name="infoCountry"
        options={{
          title: "Country Info",
          tabBarIcon: ({ color }) => (
            <InformationCircleIcon size={35} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Facts"
        options={{
          title: "Facts",
          tabBarIcon: ({ color }) => (
            <QuestionMarkCircleIcon size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
