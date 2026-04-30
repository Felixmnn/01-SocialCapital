import { theme } from "@/constants/theme";
import { yourStats } from "@/constants/types";
import { Relationship } from "@/constants/typesRelationship";
import { FontAwesome5 } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";
import RenderAvatar from "./avatar";

const AvatarCorrelation = ({
  you,
  them,
  selected,
}: {
  you: yourStats;
  them: Relationship;
  selected: "you" | "them" | "none";
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <View className="flex-row mt-4">
      <RenderAvatar
        avatar={you.avatar}
        size={"medium"}
        selected={selected === "you"}
      />
      <View className="h-[100px] items-center justify-center">
        <FontAwesome5
          name="arrow-right"
          size={24}
          color={selected === "you" ? current.basic : current.text}
          style={{ marginHorizontal: 10 }}
        />
        <FontAwesome5
          name="arrow-left"
          size={24}
          color={selected === "them" ? current.basic : current.text}
          style={{ marginHorizontal: 10 }}
        />
      </View>
      <RenderAvatar
        avatar={them.person.avatar}
        size={"medium"}
        selected={selected === "them"}
      />
    </View>
  );
};

export default AvatarCorrelation;
