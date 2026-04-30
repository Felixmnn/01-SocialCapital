import { theme } from "@/constants/theme";
import { Avatar, Relationship } from "@/constants/typesRelationship";
import { returnScaleIcon } from "@/functions/general";
import { calculateBalance } from "@/functions/relationshipStats";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import {
  LayoutChangeEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import RenderAvatar from "./avatar/avatar";

const MIN_COMPACT_ITEM_WIDTH = 100;
const COMPACT_ITEM_SPACING = 8;

const Relation = ({
  name,
  avatar,
  yourPoints,
  theirPoints,
  status,
  compact,
  compactWidth,
  onPress,
}: {
  name?: string;
  avatar: Avatar;
  yourPoints?: number;
  theirPoints?: number;
  status?: "critical" | "balanced" | "positive";
  compact?: boolean;
  compactWidth?: number;
  onPress?: () => void;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={{
          width: compactWidth,
          paddingHorizontal: 4,
          marginBottom: 8,
        }}
      >
        <LinearGradient
          colors={
            status === "critical"
              ? [current.critical[0], current.critical[1]]
              : status === "balanced"
                ? [current.balanced[0], current.balanced[1]]
                : [current.positive[0], current.positive[1]]
          }
          style={{
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: 92,
            paddingHorizontal: 6,
            paddingVertical: 10,
          }}
        >
          <RenderAvatar avatar={avatar} selected={false} size={"small"} />
          <Text
            style={{
              color: "white",
              fontSize: 14,
              fontWeight: "bold",
              marginTop: 6,
              textAlign: "center",
            }}
          >
            {name}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  }

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
          marginVertical: 4,
          flexDirection: "row",
          paddingHorizontal: 8,
          paddingVertical: 12,
        }}
      >
        <View className="flex-1 flex-row justify-start items-center  ">
          <RenderAvatar avatar={avatar} selected={false} size={"small"} />
          <View className="flex-1 justify-start items-start p-2">
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>
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
                    color: "white",
                    fontSize: 14,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {Math.floor(yourPoints || 0)}
                </Text>
                <Text
                  style={{
                    color: "white",
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
                    color: "white",
                    fontSize: 14,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {Math.floor(theirPoints || 0)}
                </Text>
                <Text
                  style={{
                    color: "white",
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
                    color: "white",
                    fontSize: 14,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {yourPoints && theirPoints
                    ? Math.floor(yourPoints + theirPoints)
                    : 0}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    textAlign: "center",
                    fontWeight: "bold",
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
          <FontAwesome5
            name={returnScaleIcon(yourPoints || 0, theirPoints || 0)}
            size={39}
            color={"white"}
          />
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
  const [details, setDetails] = React.useState<boolean>(true);
  const [compactContainerWidth, setCompactContainerWidth] =
    React.useState<number>(0);

  const sortedRelationships = React.useMemo(() => {
    const indexed = relationships.map((r, i) => ({
      relationship: r,
      originalIndex: i,
    }));
    if (sortRelationShips) {
      indexed.sort(
        (a, b) =>
          b.relationship.points.yourPoints - a.relationship.points.yourPoints,
      );
    }
    return indexed;
  }, [relationships, sortRelationShips]);

  const compactColumns = Math.max(
    1,
    Math.floor(compactContainerWidth / MIN_COMPACT_ITEM_WIDTH),
  );
  const compactItemWidth =
    compactContainerWidth > 0
      ? Math.floor(
          (compactContainerWidth -
            (compactColumns - 1) * COMPACT_ITEM_SPACING) /
            compactColumns,
        )
      : MIN_COMPACT_ITEM_WIDTH;

  const handleCompactLayout = (event: LayoutChangeEvent) => {
    const nextWidth = Math.floor(event.nativeEvent.layout.width);
    setCompactContainerWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth,
    );
  };

  return (
    <View
      style={{ flex: 1, width: "100%", paddingHorizontal: 16, marginTop: 20 }}
    >
      <View className="flex-row w-full justify-between items-start px-4">
        <View className="flex-row items-center justify-center">
          <FontAwesome5
            name="sort"
            size={24}
            color={"white"}
            onPress={() => setSortRelationShips(!sortRelationShips)}
          />
          <FontAwesome5
            name={details ? "th-list" : "th"}
            size={24}
            color={"white"}
            onPress={() => setDetails(!details)}
            style={{ marginLeft: 20 }}
          />
        </View>
        <FontAwesome5
          name="user-plus"
          size={24}
          color={"white"}
          onPress={onPressAddUser}
        />
      </View>
      <ScrollView
        className=" w-full mt-4 "
        style={{
          marginBottom: 80,
        }}
      >
        <View
          key={details ? "details-layout" : `compact-layout-${compactColumns}`}
          onLayout={handleCompactLayout}
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {sortedRelationships.map(({ relationship, originalIndex }) => (
            <Relation
              name={relationship.person.name}
              avatar={relationship.person.avatar}
              yourPoints={relationship.points.yourPoints}
              theirPoints={relationship.points.theirPoints}
              status={calculateBalance(
                relationship.points.yourPoints,
                relationship.points.theirPoints,
              )}
              compact={!details}
              compactWidth={!details ? compactItemWidth : undefined}
              onPress={() => onPressRelationship?.(relationship, originalIndex)}
              key={originalIndex}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default RelationshipList;
