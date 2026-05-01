import { Avatar } from "@/constants/typesRelationship";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import { Image, View } from "react-native";
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
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 200, height: 200, marginBottom: 24 }}
        resizeMode="contain"
      />
    </View>
  );
}
