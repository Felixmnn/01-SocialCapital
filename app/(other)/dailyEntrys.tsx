import ActionList from "@/components/actionList";
import RenderAvatar from "@/components/avatar/avatar";
import AvatarCorrelation from "@/components/avatar/avatarCorrelation";
import Timer from "@/components/timer";
import { Action, negativeAction, positiveAction } from "@/constants/constants";
import { theme } from "@/constants/theme";
import { useGlobalContext } from "@/context/GlobalProvider";
import { calculateUpdatedRelationshipsAfterDailyTimers } from "@/functions/dailyEntryScoreCalculation";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const DailyEntrys = () => {
  const { yourStats, relationships, setRelationships } = useGlobalContext();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const [remainingTime, setRemainingTime] = React.useState(60);
  const [paused, setPaused] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);

  const [whosTurn, setWhosTurn] = React.useState<"you" | "them">("them");
  const [selectedRelationship, setSelectedRelationship] = React.useState(0);
  const [skipPressed, setSkipPressed] = React.useState(false);

  const currentRelationship = relationships[selectedRelationship];

  const totalActionsToday = React.useMemo(() => {
    const today = new Date();
    return relationships.reduce((sum, rel) => {
      return (
        sum +
        rel.actions.filter((a) => {
          const d = new Date(a.date);
          return (
            d.getFullYear() === today.getFullYear() &&
            d.getMonth() === today.getMonth() &&
            d.getDate() === today.getDate()
          );
        }).length
      );
    }, 0);
  }, [relationships]);
  const visibleRelationshipIndices = React.useMemo(() => {
    if (relationships.length <= 3) {
      return relationships.map((_, index) => index);
    }

    const previousIndex =
      (selectedRelationship - 1 + relationships.length) % relationships.length;
    const nextIndex = (selectedRelationship + 1) % relationships.length;

    return [previousIndex, selectedRelationship, nextIndex];
  }, [relationships, selectedRelationship]);

  function isSameDayLocal(dateA: Date, dateB: Date) {
    return (
      dateA.getFullYear() === dateB.getFullYear() &&
      dateA.getMonth() === dateB.getMonth() &&
      dateA.getDate() === dateB.getDate()
    );
  }

  const selectedActions: Action[] = React.useMemo(() => {
    if (!currentRelationship) return [];

    const actionPool = [...positiveAction, ...negativeAction];
    const today = new Date();
    return currentRelationship.actions
      .filter(
        (entry) =>
          entry.actor === whosTurn &&
          isSameDayLocal(new Date(entry.date), today),
      )
      .map((entry) => actionPool.find((a) => a.actionId === entry.actionID))
      .filter((action): action is Action => Boolean(action));
  }, [currentRelationship, whosTurn]);

  React.useEffect(() => {
    if (paused || isFinished) return;

    const timerId = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          if (whosTurn === "them") {
            setWhosTurn("you");
            return 60;
          }

          setIsFinished(true);
          setPaused(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [paused, isFinished, whosTurn]);

  React.useEffect(() => {
    if (relationships.length === 0) {
      setRemainingTime(60);
      setWhosTurn("them");
      setIsFinished(false);
    }
  }, [relationships.length]);

  React.useEffect(() => {
    if (isFinished) {
      setRelationships((prev) =>
        calculateUpdatedRelationshipsAfterDailyTimers(prev),
      );
    }
  }, [isFinished, setRelationships]);

  function addActionToCurrentRelationship(action: Action) {
    setRelationships((prev) => {
      if (!prev[selectedRelationship]) return prev;
      return prev.map((relationship, index) => {
        if (index !== selectedRelationship) return relationship;
        return {
          ...relationship,
          actions: [
            ...relationship.actions,
            {
              actor: whosTurn,
              actionID: action.actionId,
              date: new Date().toISOString(),
            },
          ],
        };
      });
    });
  }

  function removeActionFromCurrentRelationship(action: Action) {
    setRelationships((prev) => {
      if (!prev[selectedRelationship]) return prev;
      return prev.map((relationship, index) => {
        if (index !== selectedRelationship) return relationship;

        let removed = false;
        return {
          ...relationship,
          actions: relationship.actions.filter((entry) => {
            if (
              !removed &&
              entry.actor === whosTurn &&
              entry.actionID === action.actionId
            ) {
              removed = true;
              return false;
            }
            return true;
          }),
        };
      });
    });
  }

  function nextTurn({ whereTo }: { whereTo: "left" | "right" }) {
    if (relationships.length === 0) return;
    if (selectedRelationship === 0 && whereTo === "left") {
      setSelectedRelationship(relationships.length - 1);
    } else if (
      selectedRelationship === relationships.length - 1 &&
      whereTo === "right"
    ) {
      setSelectedRelationship(0);
    } else if (whereTo === "right") {
      setSelectedRelationship((prev) => prev + 1);
    } else if (whereTo === "left") {
      setSelectedRelationship((prev) => prev - 1);
    }
  }
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: current.background,
        paddingHorizontal: 16,
      }}
    >
      <View className="flex-row">
        <FontAwesome5
          name="arrow-left"
          size={24}
          color={current.basic}
          onPress={() => router.back()}
          style={{ marginRight: 20 }}
        />
        {!isFinished && (
          <Timer remainingPercentage={(remainingTime / 60) * 100} />
        )}
        {!isFinished && (
          <FontAwesome5
            name={paused ? "play" : "pause"}
            size={24}
            color={current.basic}
            onPress={() => setPaused(!paused)}
            style={{ marginLeft: 20 }}
          />
        )}
        {isFinished && <View className="flex-1" />}
      </View>
      {isFinished ? (
        <View className="flex-1 items-center justify-center px-8">
          <LinearGradient
            colors={current.veryPositive as [string, string]}
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <FontAwesome5 name="check" size={52} color="#fff" />
          </LinearGradient>

          <Text
            style={{
              color: current.text,
              fontSize: 28,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            Geschafft!
          </Text>

          <Text
            style={{
              color: current.basic,
              fontSize: 16,
              marginBottom: 12,
            }}
          >
            {totalActionsToday}{" "}
            {totalActionsToday === 1 ? "Aktion" : "Aktionen"} heute eingetragen
          </Text>

          <Text
            style={{
              color: current.text,
              fontSize: 14,
              textAlign: "center",
              opacity: 0.5,
              marginBottom: 48,
              lineHeight: 22,
            }}
          >
            Deine Einträge wurden gespeichert.{"\n"}Komm morgen wieder für
            deinen nächsten Check-in.
          </Text>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              paddingHorizontal: 36,
              paddingVertical: 13,
              borderRadius: 28,
              backgroundColor: current.basic,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
              Zurück
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {yourStats && currentRelationship && (
            <AvatarCorrelation
              you={yourStats}
              them={currentRelationship}
              selected={whosTurn}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              if (!skipPressed) {
                setSkipPressed(true);
                nextTurn({ whereTo: "right" });
              } else {
                setIsFinished(true);
              }
            }}
            style={{
              alignSelf: "flex-end",
              marginTop: 4,
              marginBottom: 2,
              opacity: 0.6,
            }}
          >
            <Text style={{ color: current.basic, fontSize: 13 }}>
              {skipPressed ? "Finish early" : "Skip"}
            </Text>
          </TouchableOpacity>
          {/*}
          <View
            className="mt-3 px-4 py-2 rounded-full"
            style={{ backgroundColor: current.purpleGradient[0] }}
          >
            <Text style={{ color: current.text }}>
              {whosTurn === "them"
                ? `Phase: ${currentRelationship?.person.name ?? "Them"} (${remainingTime}s)`
                : `Phase: You (${remainingTime}s)`}
            </Text>
          </View>
          */}
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <ActionList
              title={
                whosTurn === "you"
                  ? "Deine Aktionen"
                  : "Aktionen von " +
                    (currentRelationship?.person.name ?? "them")
              }
              actions={selectedActions}
              onPress={(action) => removeActionFromCurrentRelationship(action)}
            />
            <ActionList
              title="Positive"
              actions={positiveAction}
              onPress={(action) => addActionToCurrentRelationship(action)}
            />
            <ActionList
              title="Negative"
              actions={negativeAction}
              onPress={(action) => addActionToCurrentRelationship(action)}
            />
          </ScrollView>
          <View className="flex-row items-center justify-center mb-4">
            <FontAwesome5
              name="arrow-left"
              size={24}
              color={current.basic}
              onPress={() => nextTurn({ whereTo: "left" })}
              style={{ marginRight: 20 }}
            />

            <View className="flex-row items-center justify-center">
              {visibleRelationshipIndices.map((index) => {
                const relationship = relationships[index];

                if (!relationship) {
                  return null;
                }

                return (
                  <TouchableOpacity
                    key={`${relationship.person.name}-${index}`}
                    onPress={() => setSelectedRelationship(index)}
                    style={{ marginHorizontal: 4 }}
                  >
                    <RenderAvatar
                      avatar={relationship.person.avatar}
                      size={"small"}
                      selected={selectedRelationship === index}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <FontAwesome5
              name="arrow-right"
              size={24}
              color={current.basic}
              onPress={() => nextTurn({ whereTo: "right" })}
              style={{ marginLeft: 20 }}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default DailyEntrys;
