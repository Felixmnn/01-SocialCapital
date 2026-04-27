import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function Layout() {
  const currentTheme = theme["dark"];

  return (
    <View style={{ flex: 1 }}>
      {/* TABS */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: currentTheme.basic,
            height: 70,
            position: "absolute",
          },
        }}
      >
        {/* LINKS */}
        <Tabs.Screen
          name="you"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="user"
                size={22}
                color="white"
                solid={focused}
              />
            ),
          }}
        />

        {/* RECHTS */}
        <Tabs.Screen
          name="others"
          options={{
            tabBarIcon: ({ focused }) => (
              <FontAwesome5
                name="users"
                size={22}
                color="white"
                solid={focused}
              />
            ),
          }}
        />
      </Tabs>

      {/* ➕ FLOATING BUTTON (KEIN SCREEN!) */}
      <TouchableOpacity
        onPress={() => {
          console.log("Plus gedrückt");
        }}
        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          width: 65,
          height: 65,
          borderRadius: 32.5,
          backgroundColor: "white",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
          elevation: 10,
        }}
      >
        <FontAwesome5 name="plus" size={24} color={currentTheme.basic} />
      </TouchableOpacity>
    </View>
  );
}
