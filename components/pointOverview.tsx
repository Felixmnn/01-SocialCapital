import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
          <Item
            iconName="user"
            label={t("pointOverview.you")}
            points={myPoints}
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
            iconName="users"
            label={t("pointOverview.they")}
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
            label={t("pointOverview.total")}
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
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 14,
                gap: 10,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: current.purpleGradient[0],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome5 name="star" size={16} color="#fff" solid />
              </View>
              <Text
                style={{
                  color: current.text,
                  fontWeight: "700",
                  fontSize: 16,
                  flexShrink: 1,
                }}
              >
                {t("pointOverview.infoTitle")}
              </Text>
            </View>

            {/* Row items */}
            {(
              [
                { icon: "user", key: "infoYou" },
                { icon: "users", key: "infoThey" },
                { icon: "calculator", key: "infoTotal" },
              ] as { icon: string; key: string }[]
            ).map(({ icon, key }) => (
              <View
                key={key}
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 8,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: current.purpleGradient[1],
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 1,
                  }}
                >
                  <FontAwesome5 name={icon} size={12} color="#fff" solid />
                </View>
                <Text
                  style={{
                    color: current.text,
                    fontSize: 13,
                    lineHeight: 20,
                    flex: 1,
                  }}
                >
                  {t(`pointOverview.${key}`)}
                </Text>
              </View>
            ))}

            {/* Detail */}
            <View
              style={{
                marginTop: 6,
                padding: 10,
                borderRadius: 10,
                backgroundColor:
                  resolvedScheme === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.05)",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
              }}
            >
              <FontAwesome5
                name="info-circle"
                size={13}
                color={current.purpleGradient[0]}
                solid
                style={{ marginTop: 2 }}
              />
              <Text
                style={{
                  color: current.text,
                  opacity: 0.85,
                  fontSize: 12,
                  lineHeight: 18,
                  flex: 1,
                }}
              >
                {t("pointOverview.infoDetail")}
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default PointOverview;
