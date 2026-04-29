import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";

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
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <LinearGradient
      colors={[current.purpleGradient[0], current.purpleGradient[1]]}
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
      }}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
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
        <Item iconName="users" label="They" points={theirPoints} />
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
          points={myPoints + theirPoints}
        />
      </View>
    </LinearGradient>
  );
};

export default PointOverview;
