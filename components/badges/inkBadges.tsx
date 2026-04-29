import { theme } from "@/constants/theme";
import { Status } from "@/constants/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text } from "react-native";

const InkBadges = ({
  icon,
  status,
  label,
}: {
  icon: string;
  status: Status;
  label: string;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  return (
    <LinearGradient
      style={{
        height: 100,
        width: 100,
        borderRadius: 20,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 2,
      }}
      colors={
        status === "critical"
          ? [current.critical[0], current.critical[1]]
          : status === "balanced"
            ? [current.balanced[0], current.balanced[1]]
            : [current.positive[0], current.positive[1]]
      }
    >
      <FontAwesome5 name={icon} size={24} color="#fff" solid={true} />
      <Text
        style={{
          color: "#fff",
          fontSize: 16,
          marginTop: 8,
          fontWeight: "bold",
        }}
      >
        {label}
      </Text>
    </LinearGradient>
  );
};

export default InkBadges;
