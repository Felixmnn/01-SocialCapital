import { theme } from "@/constants/theme";
import { SpecificBadgeId, Status } from "@/constants/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text } from "react-native";

const BADGE_LABELS: Record<SpecificBadgeId, string> = {
  critical: "Critical",
  balanced: "Balanced",
  positive: "Positive",
  streak1: "Streak 1",
  streak2: "Streak 2",
  streak3: "Streak 3",
  streak4: "Streak 4",
  streak5: "Streak 5",
  streak6: "Streak 6",
  streak7: "Streak 7",
  streak8: "Streak 8",
  streak9: "Streak 9",
  streak10: "Streak 10",
};

const BADGE_ICONS: Record<SpecificBadgeId, string> = {
  critical: "exclamation-triangle",
  balanced: "balance-scale",
  positive: "seedling",
  streak1: "fire",
  streak2: "fire",
  streak3: "fire",
  streak4: "fire",
  streak5: "star",
  streak6: "star",
  streak7: "star",
  streak8: "trophy",
  streak9: "trophy",
  streak10: "award",
};

const badgeStatus = (badgeId: SpecificBadgeId): Status => {
  if (
    badgeId === "critical" ||
    badgeId === "balanced" ||
    badgeId === "positive"
  ) {
    return badgeId;
  }

  const streakLevel = Number(badgeId.replace("streak", ""));
  if (streakLevel <= 3) {
    return "critical";
  }
  if (streakLevel <= 7) {
    return "balanced";
  }
  return "positive";
};

const SpecificBadges = ({ badgeId }: { badgeId: SpecificBadgeId }) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const status = badgeStatus(badgeId);

  return (
    <LinearGradient
      colors={
        status === "critical"
          ? [current.critical[0], current.critical[1]]
          : status === "balanced"
            ? [current.balanced[0], current.balanced[1]]
            : [current.positive[0], current.positive[1]]
      }
      style={{
        width: 100,
        height: 100,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
      }}
    >
      <FontAwesome5
        name={BADGE_ICONS[badgeId]}
        size={24}
        color={current.text}
        solid
      />
      <Text
        style={{
          color: current.text,
          marginTop: 8,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {BADGE_LABELS[badgeId]}
      </Text>
    </LinearGradient>
  );
};

export default SpecificBadges;
