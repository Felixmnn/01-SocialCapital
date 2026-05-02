import { theme } from "@/constants/theme";
import { Avatar } from "@/constants/typesRelationship";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

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
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <TouchableOpacity
      className="flex-row items-center justify-center px-1 rounded-xl my-1"
      onPress={onPress}
    >
      <LinearGradient
        colors={
          gradientType === "positive"
            ? [current.positive[0], current.positive[1]]
            : [current.critical[0], current.critical[1]]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 15,
          padding: 3,
        }}
        className="flex-row items-center justify-center p-1 rounded-xl"
      >
        <Text className="text-gray-700 font-bold ml-2">{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Selectable;
