import { theme } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

const Timer = ({ remainingPercentage }: { remainingPercentage: number }) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: current.background,
        borderRadius: 15,
        borderColor: current.basic,
        borderWidth: 3,
      }}
    >
      <View
        style={{
          width: `${remainingPercentage - 1}%`,
          height: 18,
          borderRadius: 9,
          backgroundColor: current.basic,
          margin: 2,
        }}
      />
    </View>
  );
};

export default Timer;
