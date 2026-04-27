import RenderAvatar from "@/components/avatar/avatar";
import AvatarEditor from "@/components/avatar/avatarEditor";
import { Avatar } from "@/constants/typesRelationship";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { theme } from "../constants/theme";

export default function Index() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const currentTheme = theme["dark"];
  const [avatar, setAvatar] = useState<Avatar>({
    skinColor: "light",
    hairColor: "black",
    beardType: "none",
    beardColor: "black",
    selectedCharacter: "character1",
    backgroundColor: "blue",
  });

  return (
    <View
      className="flex-1 items-center justify-center p-4"
      style={{ backgroundColor: currentTheme.background }}
    >
      <TouchableOpacity
        className="bg-red-500 p-4 w-full"
        onPress={() => router.push("/(onboarding)/aboutUs")}
      ></TouchableOpacity>
      <RenderAvatar avatar={avatar} selected={false} />
      <AvatarEditor avatar={avatar} setAvatar={setAvatar} />
    </View>
  );
}
