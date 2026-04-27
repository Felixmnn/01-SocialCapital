import { yourStats } from "@/constants/types";
import { Relationship } from "@/constants/typesRelationship";
import React from "react";
import { Text, View } from "react-native";

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
    <View>
      <Text>avatarCorrelation</Text>
    </View>
  );
};

export default AvatarCorrelation;
