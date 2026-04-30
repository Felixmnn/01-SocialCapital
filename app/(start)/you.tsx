import RenderAvatar from "@/components/avatar/avatar";
import InkBadeCollection from "@/components/badges/inkBadeCollection";
import GradientToBackground from "@/components/gradientToBackground";
import PointOverview from "@/components/pointOverview";
import Streak from "@/components/streak";
import { theme } from "@/constants/theme";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  calculateAverageAttention,
  calculateAverageSupport,
  calculateAverageTrust,
  calculateTheirPoints,
  calculateYourPoints,
} from "@/functions/relationshipStats";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

/**TODO:
 * Man soll status zu App sehen(Apps)
 * Man sehen sollen was man für ein Typ person ist
 * Man soll informationen über die Patches erhalten können
 */
const You = () => {
  const { yourStats, relationships, generalSettings } = useGlobalContext();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const [statusModalVisible, setStatusModalVisible] = React.useState(false);

  function calculateRelationshipStatus(): "positive" | "critical" | "balanced" {
    const theirPoints = calculateTheirPoints(relationships);
    const yourPoints = calculateYourPoints(relationships);
    //wenn deine punkte min 20% höher sind als die ihrer, dann positiv
    if (yourPoints > theirPoints * 1.2) return "positive";
    //wenn ihre punkte min 20% höher sind als deine, dann kritisch
    if (theirPoints > yourPoints * 1.2) return "critical";
    //ansonsten balanced
    return "balanced";
  }

  const relationshipStatus = calculateRelationshipStatus();
  const statusColor =
    relationshipStatus === "positive"
      ? "green"
      : relationshipStatus === "critical"
        ? "red"
        : "blue";
  const statusIcon =
    relationshipStatus === "positive"
      ? "smile"
      : relationshipStatus === "critical"
        ? "frown"
        : "smile-wink";
  const statusLabel =
    relationshipStatus === "positive"
      ? "Geber"
      : relationshipStatus === "critical"
        ? "Nehmer"
        : "Balancierer";
  const statusDescription =
    relationshipStatus === "positive"
      ? "Du gibst aktuell mehr als du nimmst."
      : relationshipStatus === "critical"
        ? "Du nimmst aktuell mehr als du gibst."
        : "Geben und Nehmen sind bei dir gerade ausgeglichen.";

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
        state={relationshipStatus}
        visibleComponents="cog"
        onPressCog={() => router.push("/settings")}
      >
        <Pressable
          className="relative items-center justify-center"
          onPress={() => setStatusModalVisible(true)}
        >
          {yourStats?.avatar && (
            <RenderAvatar avatar={yourStats?.avatar} selected={false} />
          )}
          <View
            style={{
              borderRadius: 999,
              backgroundColor: statusColor,
              padding: 4,
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <FontAwesome5
              name={statusIcon}
              size={24}
              color="white"
              solid={true}
            />
          </View>
        </Pressable>
        <Text
          style={{
            color: current.text,
            fontSize: 18,
            fontWeight: "600",
            marginLeft: 12,
          }}
        >
          Du bist ein {statusLabel}
        </Text>

        <Modal
          visible={statusModalVisible}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={() => setStatusModalVisible(false)}
        >
          <Pressable
            onPress={() => setStatusModalVisible(false)}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              padding: 24,
            }}
          >
            <Pressable
              onPress={() => undefined}
              style={{
                width: "100%",
                maxWidth: 340,
                borderRadius: 16,
                padding: 18,
                backgroundColor: current.background,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  borderRadius: 999,
                  backgroundColor: statusColor,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <FontAwesome5 name={statusIcon} size={22} color="white" solid />
              </View>
              <Text
                style={{
                  color: current.text,
                  fontWeight: "700",
                  fontSize: 18,
                  marginBottom: 8,
                }}
              >
                Dein Status: {statusLabel}
              </Text>
              <Text
                style={{
                  color: current.text,
                  textAlign: "center",
                  lineHeight: 22,
                }}
              >
                {statusDescription}
              </Text>
            </Pressable>
          </Pressable>
        </Modal>
      </GradientToBackground>
      <View className="flex-1 w-full p-4">
        <Streak
          weekEntrys={generalSettings.weekEntries}
          duration={generalSettings.streakDuration}
        />
        <PointOverview
          myPoints={calculateYourPoints(relationships)}
          theirPoints={calculateTheirPoints(relationships)}
        />
        <InkBadeCollection
          horizontal
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
