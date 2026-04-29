import { theme } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";
import InkBadges from "./inkBadges";

export default function InkBadeCollection({
  trust,
  attention,
  support,
}: {
  trust: number;
  attention: number;
  support: number;
}) {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <View
      className="justify-between flex-row mt-4"
      style={{
        alignItems: "center",
        borderRadius: 12,
      }}
    >
      <InkBadges
        icon="shield-alt"
        status={
          trust > 1.2 ? "positive" : trust < 0.8 ? "critical" : "balanced"
        }
        label="trust"
      />
      <InkBadges
        icon="hands-helping"
        status={
          support > 1.2 ? "positive" : support < 0.8 ? "critical" : "balanced"
        }
        label="help"
      />
      <InkBadges
        icon="eye"
        status={
          attention > 1.2
            ? "positive"
            : attention < 0.8
              ? "critical"
              : "balanced"
        }
        label="attention"
      />
    </View>
  );
}
