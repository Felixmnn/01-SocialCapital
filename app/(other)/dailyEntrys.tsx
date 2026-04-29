import ActionList from "@/components/actionList";
import RenderAvatar from "@/components/avatar/avatar";
import AvatarCorrelation from "@/components/avatar/avatarCorrelation";
import Timer from "@/components/timer";
import { Action, negativeAction, positiveAction } from "@/constants/constants";
import { theme } from "@/constants/theme";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  calculateNewINKValue,
  calculateNewScoreBasedOnBed,
  calculateNewScoreBasedOnINK,
  calculateNewScoreBasedOnQAN,
} from "@/functions/calculateActionValue";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, View } from "react-native";
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
      .map((entry) => actionPool.find((a) => a.positiv === entry.actionID))
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
      calculateAndUpdateScores();
    }
  }, [isFinished]);

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
              actionID: action.positiv,
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
              entry.actionID === action.positiv
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

  function calculateAndUpdateScores() {
    setRelationships((prev) =>
      prev.map((relationship) => {
        const today = new Date();
        const actionPool = [...positiveAction, ...negativeAction];

        let newYourPoints = relationship.points.yourPoints;
        let newTheirPoints = relationship.points.theirPoints;
        let newYourInk = { ...relationship.ink.your };
        let newTheirInk = { ...relationship.ink.their };

        const todayActions = relationship.actions.filter((entry) =>
          isSameDayLocal(new Date(entry.date), today),
        );

        todayActions.forEach((entry) => {
          const actionDetails = actionPool.find(
            (a) => a.positiv === entry.actionID,
          );
          if (!actionDetails) return;

          const { startwert, quantor, ink_kategorie, ink_faktor } =
            actionDetails;
          const isYou = entry.actor === "you";

          // Neue Points berechnen
          if (quantor === "INK") {
            const inkey =
              (ink_kategorie?.toLowerCase() as
                | "trust"
                | "attention"
                | "support") || "trust";
            const currentInk = isYou ? newYourInk[inkey] : newTheirInk[inkey];

            const newScore = calculateNewScoreBasedOnINK(
              isYou ? newYourPoints : newTheirPoints,
              currentInk,
              startwert,
            );
            if (isYou) {
              newYourPoints = newScore;
            } else {
              newTheirPoints = newScore;
            }
          } else if (quantor === "BED") {
            const lastAction = relationship.actions
              .filter(
                (a) =>
                  a.actor === entry.actor &&
                  a.actionID === entry.actionID &&
                  new Date(a.date).getTime() < new Date(entry.date).getTime(),
              )
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )[0];

            const lastDate = lastAction
              ? new Date(lastAction.date)
              : new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            const newScore = calculateNewScoreBasedOnBed(
              isYou ? newYourPoints : newTheirPoints,
              lastDate,
              startwert,
            );
            if (isYou) {
              newYourPoints = newScore;
            } else {
              newTheirPoints = newScore;
            }
          } else if (quantor === "QAN" || quantor === "BED/QAN") {
            const thirtyDaysAgo = new Date(
              today.getTime() - 30 * 24 * 60 * 60 * 1000,
            );
            const last30Days = relationship.actions
              .filter(
                (a) =>
                  a.actor === entry.actor &&
                  a.actionID === entry.actionID &&
                  new Date(a.date) >= thirtyDaysAgo,
              )
              .map((a) => new Date(a.date));

            const newScore = calculateNewScoreBasedOnQAN(
              isYou ? newYourPoints : newTheirPoints,
              startwert,
              last30Days,
            );
            if (isYou) {
              newYourPoints = newScore;
            } else {
              newTheirPoints = newScore;
            }
          } else {
            // quantor === null
            if (isYou) {
              newYourPoints += startwert;
            } else {
              newTheirPoints += startwert;
            }
          }

          // Neue INK Werte berechnen
          if (ink_kategorie && ink_faktor) {
            const inkey = ink_kategorie.toLowerCase() as
              | "trust"
              | "attention"
              | "support";
            if (isYou) {
              newYourInk[inkey] = calculateNewINKValue(
                newYourInk[inkey],
                ink_faktor,
              );
            } else {
              newTheirInk[inkey] = calculateNewINKValue(
                newTheirInk[inkey],
                ink_faktor,
              );
            }
          }
        });

        return {
          ...relationship,
          points: { yourPoints: newYourPoints, theirPoints: newTheirPoints },
          ink: { your: newYourInk, their: newTheirInk },
        };
      }),
    );
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
