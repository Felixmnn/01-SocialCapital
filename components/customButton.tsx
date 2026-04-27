import { theme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const CustomButton = ({
  title,
  onPress,
  disable = false,
}: {
  title: string;
  onPress: () => void;
  disable?: boolean;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        width: "100%",
        padding: 16,
      }}
      disabled={disable}
    >
      <LinearGradient
        colors={[current.purpleGradient[0], current.purpleGradient[1]]}
        style={{
          width: "100%",
          opacity: disable ? 0.5 : 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          padding: 16,
          borderRadius: 12,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={{ color: current.text, fontWeight: "bold", fontSize: 16 }}>
          {" "}
          {title}{" "}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;
