import RenderAvatar from "@/components/avatar/avatar";
import InkBadeCollection from "@/components/badges/inkBadeCollection";
import GradientToBackground from "@/components/gradientToBackground";
import PointOverview from "@/components/pointOverview";
import Streak from "@/components/streak";
import { theme } from "@/constants/theme";
import { WeekEntry } from "@/constants/types";
import { Avatar } from "@/constants/typesRelationship";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  calculateAverageAttention,
  calculateAverageSupport,
  calculateAverageTrust,
  calculateTheirPoints,
  calculateYourPoints,
} from "@/functions/relationshipStats";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";

const You = () => {
  const { yourStats, relationships } = useGlobalContext();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const mockWeekPerfect: WeekEntry[] = [
    { date: "2026-04-20T08:00:00Z", completed: false },
    { date: "2026-04-21T08:00:00Z", completed: true },
    { date: "2026-04-22T08:00:00Z", completed: false },
    { date: "2026-04-23T08:00:00Z", completed: false },
    { date: "2026-04-24T08:00:00Z", completed: false },
    { date: "2026-04-25T08:00:00Z", completed: false },
    { date: "2026-04-26T08:00:00Z", completed: false },
  ];
  const exampleAvatar: Avatar = {
    skinColor: "light",
    hairColor: "black",
    beardType: "none",
    beardColor: "black",
    selectedCharacter: "character1",
    backgroundColor: "blue",
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <GradientToBackground
        state="critical"
        visibleComponents="cog"
        onPressCog={() => router.push("/settings")}
      >
        {yourStats?.avatar && (
          <RenderAvatar avatar={yourStats?.avatar} selected={false} />
        )}
      </GradientToBackground>
      <View className="flex-1 w-full p-4">
        <Streak weekEntrys={mockWeekPerfect} duration={0} />
        <PointOverview
          myPoints={calculateYourPoints(relationships)}
          theirPoints={calculateTheirPoints(relationships)}
        />
        <InkBadeCollection
          trust={calculateAverageTrust(relationships)}
          attention={calculateAverageAttention(relationships)}
          support={calculateAverageSupport(relationships)}
        />
      </View>
      <Text style={{ color: current.text }}>Y</Text>
    </View>
  );
};

export default You;
