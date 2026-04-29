import { yourStats } from "@/constants/types";
import { Relationship } from "@/constants/typesRelationship";
import { FontAwesome5 } from "@expo/vector-icons";
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
  return (
    <View className="flex-row">
      <RenderAvatar
        avatar={you.avatar}
        size={"medium"}
        selected={selected === "you"}
      />
      <View className="h-[100px] items-center justify-center">
        <FontAwesome5
          name="arrow-right"
          size={24}
          color={selected === "you" ? "blue" : "black"}
          style={{ marginHorizontal: 10 }}
        />
        <FontAwesome5
          name="arrow-left"
          size={24}
          color={selected === "them" ? "blue" : "black"}
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
