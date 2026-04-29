import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

const GradientToBackground = ({
  visibleComponents,
  onPressArrow,
  onPressCog,
  children,
  state,
}: {
  visibleComponents?: "arrowBack" | "cog" | "both";
  onPressArrow?: () => void;
  onPressCog?: () => void;
  children?: React.ReactNode;
  state?: "critical" | "balanced" | "positive";
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <LinearGradient
      colors={
        state == "critical"
          ? [current.criticalToBackground[0], current.criticalToBackground[1]]
          : state == "balanced"
            ? [current.balancedToBackground[0], current.balancedToBackground[1]]
            : state == "positive"
              ? [
                  current.positiveToBackground[0],
                  current.positiveToBackground[1],
                ]
              : [current.background, current.background]
      }
      style={{
        flex: 1,
        width: "100%",
        maxHeight: 200,
        alignItems: "center",
        justifyContent: "start",
      }}
    >
      <View className="p-4 flex-row w-full justify-between">
        <View>
          <FontAwesome5
            name="arrow-left"
            size={24}
            color={current.text}
            onPress={onPressArrow}
            style={{
              opacity:
                visibleComponents === "arrowBack" ||
                visibleComponents === "both"
                  ? 1
                  : 0,
            }}
          />
        </View>
        <View>
          <FontAwesome5
            name="cog"
            size={24}
            color={current.text}
            onPress={onPressCog}
            style={{
              opacity:
                visibleComponents === "cog" || visibleComponents === "both"
                  ? 1
                  : 0,
            }}
          />
        </View>
      </View>
      {children}
    </LinearGradient>
  );
};

export default GradientToBackground;
