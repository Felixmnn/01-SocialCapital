import { Avatar } from "@/constants/typesRelationship";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";

export default function Index() {
  const { loading, yourStats } = useGlobalContext();
  const { colorScheme, setColorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const currentTheme = theme["dark"];
  const hasRedirected = useRef(false);
  const [avatar, setAvatar] = useState<Avatar>({
    skinColor: "light",
    hairColor: "black",
    beardType: "none",
    beardColor: "black",
    selectedCharacter: "character1",
    hairType: "type1",
    backgroundColor: "blue",
  });

  useEffect(() => {
    if (loading || hasRedirected.current) {
      return;
    }

    hasRedirected.current = true;

    if (yourStats) {
      router.replace("/(start)/you");
    } else {
      router.replace("/(onboarding)/aboutUs");
    }
  }, [loading, yourStats]);

  return (
    <View
      className="flex-1 items-center justify-center p-4"
      style={{ backgroundColor: currentTheme.background }}
    >
      <TouchableOpacity
        className="bg-red-500 p-4 w-full"
        onPress={() => router.push("/(onboarding)/aboutUs")}
      ></TouchableOpacity>
      <TouchableOpacity
        className="bg-green-500 p-4 w-full mt-4"
        onPress={() => router.push("/(start)/you")}
      >
        <Text>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
