import { theme } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import InkBadges from "./inkBadges";

export default function InkBadeCollection({
  title,
  trust,
  attention,
  support,
}: {
  title?: string;
  trust: number;
  attention: number;
  support: number;
}) {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <View className="mt-4">
      {title ? (
        <Text
          style={{ color: current.text, fontWeight: "700", marginBottom: 10 }}
        >
          {title}
        </Text>
      ) : null}
      <View
        className="justify-between flex-row"
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
          label={trust.toFixed(2)}
        />
        <InkBadges
          icon="hands-helping"
          status={
            support > 1.2 ? "positive" : support < 0.8 ? "critical" : "balanced"
          }
          label={support.toFixed(2)}
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
          label={attention.toFixed(2)}
        />
      </View>
    </View>
  );
}
