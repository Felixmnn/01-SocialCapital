import ActionList from "@/components/actionList";
import RenderAvatar from "@/components/avatar/avatar";
import AvatarCorrelation from "@/components/avatar/avatarCorrelation";
import Timer from "@/components/timer";
import { Action, negativeAction, positiveAction } from "@/constants/constants";
import { theme } from "@/constants/theme";
import { useGlobalContext } from "@/context/GlobalProvider";
import { calculateUpdatedRelationshipsAfterDailyTimers } from "@/functions/dailyEntryScoreCalculation";
import { FontAwesome5 } from "@expo/vector-icons";
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

  const currentRelationship = relationships[selectedRelationship];

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
      </View>
      {isFinished ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-lg" style={{ color: current.text }}>
            Alle Eintraege fuer heute gemacht. Komm morgen wieder, um neue
            Eintraege zu machen.
          </Text>
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
            <TouchableOpacity
              className="bg-green-500 px-4 py-2 rounded-full items-center justify-center mb-4"
              onPress={() => setIsFinished(true)}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
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

            {relationships.map((relationship, index) => (
              <RenderAvatar
                key={index}
                avatar={relationship.person.avatar}
                size={"small"}
                selected={selectedRelationship === index}
              />
            ))}

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
