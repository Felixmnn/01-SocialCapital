import { theme } from "@/constants/theme";
import { Avatar } from "@/constants/typesRelationship";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import RenderAvatar from "./avatar";

const AvatarWithStats = ({
  avatar,
  name,
  points,
}: {
  avatar: Avatar;
  name: string;
  points: number;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <View
      style={{
        height: 220,
      }}
    >
      <RenderAvatar avatar={avatar} selected={false} />
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
          color: current.text,
        }}
      >
        {name}
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontSize: 16,
          fontWeight: "bold",
          color: current.text,
        }}
      >
        {points}
      </Text>
    </View>
  );
};

export default AvatarWithStats;
