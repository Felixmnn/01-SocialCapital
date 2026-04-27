import { Avatar } from "@/constants/typesRelationship";
import React from "react";
import { Text, View } from "react-native";

const Selectable = ({
  iconName,
  onPress,
  title,
  avatarIncluded,
  avatar,
  gradientType,
}: {
  iconName: string;
  onPress: () => void;
  title: string;
  avatarIncluded?: boolean;
  avatar?: Avatar;
  gradientType: "positive" | "negative";
}) => {
  return (
    <View>
      <Text>S</Text>
    </View>
  );
};

export default Selectable;
