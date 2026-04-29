import AvatarWithStats from "@/components/avatar/avatarWithStats";
import InkBadeCollection from "@/components/badges/inkBadeCollection";
import GradientToBackground from "@/components/gradientToBackground";
import PointOverview from "@/components/pointOverview";
import { theme } from "@/constants/theme";
import { useGlobalContext } from "@/context/GlobalProvider";
import { calculateBalance } from "@/functions/relationshipStats";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Relationship = () => {
  const { relationships } = useGlobalContext();
  const params = useLocalSearchParams<{ relationshipIndex?: string }>();
  const selectedIndex = Number(params.relationshipIndex ?? -1);
  const relationship =
    Number.isInteger(selectedIndex) && selectedIndex >= 0
      ? relationships[selectedIndex]
      : undefined;
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  if (!relationship) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: current.background,
        }}
      >
        <Text style={{ color: current.text }}>Relationship not found</Text>
      </View>
    );
  }

  const latestActions = [...relationship.actions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: current.background,
      }}
    >
      <GradientToBackground
        state={calculateBalance(
          relationship.points.yourPoints,
          relationship.points.theirPoints,
        )}
        visibleComponents="arrowBack"
        onPressArrow={() => router.back()}
      >
        <AvatarWithStats
          avatar={relationship.person.avatar}
          name={relationship.person.name}
          points={
            relationship.points.yourPoints + relationship.points.theirPoints
          }
        />
      </GradientToBackground>
      <ScrollView
        className="flex-1 w-full"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <PointOverview
          myPoints={relationship.points.yourPoints}
          theirPoints={relationship.points.theirPoints}
        />
        <InkBadeCollection
          title="Deine INK Werte"
          trust={relationship.ink.your.trust}
          attention={relationship.ink.your.attention}
          support={relationship.ink.your.support}
        />
        <InkBadeCollection
          title={`INK Werte von ${relationship.person.name}`}
          trust={relationship.ink.their.trust}
          attention={relationship.ink.their.attention}
          support={relationship.ink.their.support}
        />
        <View
          className="mt-6 p-4 rounded-xl"
          style={{ borderWidth: 1, borderColor: current.basic }}
        >
          <Text
            style={{ color: current.text, fontWeight: "700", marginBottom: 10 }}
          >
            Letzte Aktionen
          </Text>
          {latestActions.length === 0 ? (
            <Text style={{ color: current.text }}>
              Noch keine Aktionen vorhanden.
            </Text>
          ) : (
            latestActions.map((entry, index) => {
              const actorLabel =
                entry.actor === "you" ? "Du" : relationship.person.name;
              return (
                <View
                  key={`${entry.actionID}-${entry.date}-${index}`}
                  style={{ marginBottom: 8 }}
                >
                  <Text style={{ color: current.text }}>
                    {actorLabel}: {entry.actionID}
                  </Text>
                  <Text
                    style={{ color: current.text, opacity: 0.7, fontSize: 12 }}
                  >
                    {new Date(entry.date).toLocaleString("de-DE")}
                  </Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Relationship;
