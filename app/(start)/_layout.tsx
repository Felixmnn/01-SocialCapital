import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as NavigationBar from "expo-navigation-bar";
import { router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, TouchableOpacity, View } from "react-native";

export default function Layout() {
  const currentTheme = theme["dark"];

  useEffect(() => {
    if (Platform.OS !== "android") {
      return;
    }

    const applyNavigationBarBehavior = async () => {
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setVisibilityAsync("hidden");
    };

    void applyNavigationBarBehavior();

    return () => {
      void NavigationBar.setVisibilityAsync("visible");
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* TABS */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: currentTheme.purpleGradient[1],
            height: 70,
            position: "absolute",
            borderTopWidth: 0,
            borderTopColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        {/* LINKS */}
        <Tabs.Screen
          name="you"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ width: 42, alignItems: "center" }}>
                <FontAwesome5
                  name="user"
                  size={30}
                  color={focused ? "white" : "#602568"}
                  solid={true}
                />
              </View>
            ),
          }}
        />

        {/* RECHTS */}
        <Tabs.Screen
          name="others"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ width: 42, alignItems: "center" }}>
                <FontAwesome5
                  name="users"
                  size={30}
                  color={focused ? "white" : "#602568"}
                  solid={true}
                />
              </View>
            ),
          }}
        />
      </Tabs>

      {/* ➕ FLOATING BUTTON (KEIN SCREEN!) */}
      <TouchableOpacity
        onPress={() => {
          router.push("/dailyEntrys");
          console.log("Plus gedrückt");
        }}
        style={{
          position: "absolute",
          bottom: 40,
          alignSelf: "center",
          width: 60,
          height: 60,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
          elevation: 10,
        }}
      >
        <LinearGradient
          colors={[
            currentTheme.purpleGradient[0],
            currentTheme.purpleGradient[1],
          ]}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="plus" size={28} color={"white"} solid={true} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
