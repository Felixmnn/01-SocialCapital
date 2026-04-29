import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="dailyEntrys" options={{ headerShown: false }} />
        <Stack.Screen name="relationship" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="addUser" options={{ headerShown: false }} />
        <Stack.Screen name="termsAndPrivacy" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
