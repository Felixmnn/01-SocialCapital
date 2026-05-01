import { theme } from "@/constants/theme";
import { Status } from "@/constants/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const InkBadges = ({
  icon,
  status,
  label,
  value,
  onPress,
}: {
  icon: string;
  status: Status;
  label: string;
  value?: number;
  onPress?: () => void;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  function returnGradientColors(value: number): [string, string] {
    if (value < 0.7) {
      return [current.critical[0], current.critical[1]];
    } else if (value < 0.9) {
      return [current.concerning[0], current.concerning[1]];
    } else if (value < 1.1) {
      return [current.balanced[0], current.balanced[1]];
    } else if (value < 1.3) {
      return [current.positive[0], current.positive[1]];
    } else {
      return [current.veryPositive[0], current.veryPositive[1]];
    }
  }
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <LinearGradient
        style={{
          height: 100,
          width: 100,
          borderRadius: 20,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 2,
          marginBottom: 4,
        }}
        colors={
          value !== undefined
            ? returnGradientColors(value)
            : [current.balanced[0], current.balanced[1]]
        }
      >
        <FontAwesome5 name={icon} size={24} color="#fff" solid={true} />
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            marginTop: 8,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default InkBadges;
