import { theme } from "@/constants/theme";
import { Avatar } from "@/constants/typesRelationship";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import RenderAvatar from "./avatar";

const AvatarWithName = ({ avatar, name }: { avatar: Avatar; name: string }) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  return (
    <View className="items-center justify-center">
      <RenderAvatar avatar={avatar} selected={false} />
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
          marginTop: 8,
          color: current.text,
        }}
      >
        {name}
      </Text>
    </View>
  );
};

export default AvatarWithName;
