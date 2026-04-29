import { theme } from "@/constants/theme";
import { Avatar, Relationship } from "@/constants/typesRelationship";
import { calculateBalance } from "@/functions/relationshipStats";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import RenderAvatar from "./avatar/avatar";

const Relation = ({
  name,
  avatar,
  yourPoints,
  theirPoints,
  status,
  tags,
  onPress,
}: {
  name?: string;
  avatar: Avatar;
  yourPoints?: number;
  theirPoints?: number;
  status?: "critical" | "balanced" | "positive";
  tags?: string[];
  onPress?: () => void;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={
          status === "critical"
            ? [current.critical[0], current.critical[1]]
            : status === "balanced"
              ? [current.balanced[0], current.balanced[1]]
              : [current.positive[0], current.positive[1]]
        }
        style={{
          height: 100,
          width: "100%",
          borderRadius: 20,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 8,
          flexDirection: "row",
          paddingHorizontal: 8,
          paddingVertical: 12,
        }}
      >
        <View className="flex-1 flex-row justify-start items-center  ">
          <RenderAvatar avatar={avatar} selected={false} size={"small"} />
          <View className="flex-1 justify-start items-start p-2">
            <Text
              style={{ color: current.text, fontSize: 18, fontWeight: "bold" }}
            >
              {name}
            </Text>
            <View
              className="flex-1 flex-row justify-start items-center "
              style={{
                height: 40,
                marginTop: 8,
              }}
            >
              <View className="flex-1 ">
                <Text
                  style={{
                    color: current.text,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {yourPoints}
                </Text>
                <Text
                  style={{
                    color: current.text,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Your
                </Text>
              </View>
              <View className="flex-1 ">
                <Text
                  style={{
                    color: current.text,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {theirPoints}
                </Text>
                <Text
                  style={{
                    color: current.text,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Their
                </Text>
              </View>
              <View className="flex-1 ">
                <Text
                  style={{
                    color: current.text,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  {yourPoints && theirPoints ? yourPoints + theirPoints : 0}
                </Text>
                <Text
                  style={{
                    color: current.text,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  Total
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          className=" items-center justify-center"
          style={{
            width: 60,
            height: 60,
          }}
        >
          <FontAwesome5 name="balance-scale" size={39} color={current.text} />
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const RelationshipList = ({
  relationships,
  onPressAddUser,
  onPressRelationship,
}: {
  relationships: Relationship[];
  onPressAddUser?: () => void;
  onPressRelationship?: (relationship: Relationship, index: number) => void;
}) => {
  const [sortRelationShips, setSortRelationShips] =
    React.useState<boolean>(false);
  return (
    <View className="w-full px-4 mt-5">
      <View className="flex-row w-full justify-between items-start px-4">
        <FontAwesome5
          name="sort"
          size={24}
          color={"white"}
          onPress={() => setSortRelationShips(!sortRelationShips)}
        />
        <FontAwesome5
          name="user-plus"
          size={24}
          color={"white"}
          onPress={onPressAddUser}
        />
      </View>
      {(sortRelationShips
        ? [...relationships].sort(
            (a, b) => b.points.yourPoints - a.points.yourPoints,
          )
        : relationships
      ).map((relationship, index) => (
        <Relation
          name={relationship.person.name}
          avatar={relationship.person.avatar}
          yourPoints={relationship.points.yourPoints}
          theirPoints={relationship.points.theirPoints}
          status={calculateBalance(
            relationship.points.yourPoints,
            relationship.points.theirPoints,
          )}
          onPress={() => onPressRelationship?.(relationship, index)}
          key={index}
        />
      ))}
    </View>
  );
};

export default RelationshipList;
