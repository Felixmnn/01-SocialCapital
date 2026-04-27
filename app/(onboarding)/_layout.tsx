import { Stack } from "expo-router";
import React from "react";

export default function _layout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="aboutUs" options={{ headerShown: false }} />
        <Stack.Screen name="gettingStarted" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
