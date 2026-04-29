import { SpecificBadgeId } from "@/constants/types";
import React from "react";
import { View } from "react-native";
import SpecificBadges from "./specificBadges";

const EXAMPLE_BADGES: SpecificBadgeId[] = [
  "critical",
  "balanced",
  "positive",
  "streak1",
  "streak5",
  "streak10",
];

const BadgeCollection = ({
  badges = EXAMPLE_BADGES,
}: {
  badges?: SpecificBadgeId[];
}) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginTop: 12,
      }}
    >
      {badges.map((badge) => (
        <SpecificBadges key={badge} badgeId={badge} />
      ))}
    </View>
  );
};

export default BadgeCollection;
