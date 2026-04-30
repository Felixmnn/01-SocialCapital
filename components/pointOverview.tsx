import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

const Item = ({
  iconName,
  label,
  points,
}: {
  iconName: string;
  label: string;
  points: number;
}) => {
  return (
    <View className="flex-1 items-center justify-center  rounded-lg">
      <FontAwesome5 name={iconName} size={24} color="#fff" solid={true} />
      <Text className="text-white text-sm mt-2">{label}</Text>
      <Text className="text-white text-xs mt-1">{points}</Text>
    </View>
  );
};
const PointOverview = ({
  myPoints,
  theirPoints,
}: {
  myPoints: number;
  theirPoints: number;
}) => {
  const [isInfoOpen, setIsInfoOpen] = React.useState(false);
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <>
      <LinearGradient
        colors={[current.purpleGradient[0], current.purpleGradient[1]]}
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          padding: 16,
          borderRadius: 12,
          marginTop: 16,
          position: "relative",
        }}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Pressable
          onPress={() => setIsInfoOpen(true)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            padding: 6,
          }}
        >
          <FontAwesome5 name="info-circle" size={16} color="white" solid />
        </Pressable>

        <View className="flex-row justify-between w-full">
          <Item iconName="user" label="You" points={myPoints} />
          <View
            className=" bg-white"
            style={{
              width: 2,
              backgroundColor: "white",
              height: 100,
            }}
          />
          <Item
            iconName="users"
            label="They"
            points={Math.floor(theirPoints)}
          />
          <View
            className=" bg-white"
            style={{
              width: 2,
              backgroundColor: "white",
              height: 100,
            }}
          />
          <Item
            iconName="calculator"
            label="Total"
            points={Math.floor(myPoints + theirPoints)}
          />
        </View>
      </LinearGradient>

      <Modal
        visible={isInfoOpen}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={() => setIsInfoOpen(false)}
      >
        <Pressable
          onPress={() => setIsInfoOpen(false)}
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
              maxWidth: 360,
              borderRadius: 16,
              padding: 18,
              backgroundColor: current.background,
            }}
          >
            <Text
              style={{
                color: current.text,
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Wie setzen sich die Punkte zusammen?
            </Text>

            <Text style={{ color: current.text, marginBottom: 8 }}>
              You: Das sind deine aktuellen Beziehungspunkte ueber alle
              Beziehungen hinweg.
            </Text>
            <Text style={{ color: current.text, marginBottom: 8 }}>
              They: Das sind die Punkte, die deine Gegenueber aktuell in euren
              Beziehungen haben.
            </Text>
            <Text style={{ color: current.text, marginBottom: 12 }}>
              Total: Summe aus You + They.
            </Text>

            <Text
              style={{ color: current.text, opacity: 0.85, lineHeight: 21 }}
            >
              Die Punkte entstehen durch eure eingetragenen taeglichen Aktionen
              (positiv/negativ). Die Wirkung einer Aktion wird durch die
              Beziehungswerte (INK: Trust, Attention, Support) verstaerkt oder
              abgeschwaecht.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default PointOverview;
