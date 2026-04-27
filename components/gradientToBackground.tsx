import React from "react";
import { View } from "react-native";

const GradientToBackground = ({
  visibleComponents,
  onPressArrow,
  onPressCog,
  children,
}: {
  visibleComponents: "arrowBack" | "cog" | "both";
  onPressArrow: () => void;
  onPressCog: () => void;
  children: React.ReactNode;
}) => {
  return <View>{children}</View>;
};

export default GradientToBackground;
