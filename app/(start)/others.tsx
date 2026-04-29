import AvatarWithStats from "@/components/avatar/avatarWithStats";
import GradientToBackground from "@/components/gradientToBackground";
import RelationshipList from "@/components/relationshipList";
import { theme } from "@/constants/theme";
import { Avatar, Relationship } from "@/constants/typesRelationship";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { View } from "react-native";

const Others = () => {
  const { yourStats, relationships } = useGlobalContext();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  const exampleAvatar: Avatar = {
    skinColor: "light",
    hairColor: "black",
    beardType: "none",
    beardColor: "black",
    selectedCharacter: "character1",
    backgroundColor: "blue",
  };

  const theirStats: Relationship[] = [
    {
      distance: 2,
      strength: 3,
      person: {
        name: "Alice",
        avatar: exampleAvatar,
      },
      points: {
        yourPoints: 10,
        theirPoints: 15,
      },
      ink: {
        your: {
          trust: 3,
          attention: 2,
          support: 4,
        },
        their: {
          trust: 4,
          attention: 3,
          support: 5,
        },
      },
      actions: [],
    },
    {
      distance: 2,
      strength: 3,
      person: {
        name: "Charlie",
        avatar: exampleAvatar,
      },
      points: {
        yourPoints: 80,
        theirPoints: 15,
      },
      ink: {
        your: {
          trust: 3,
          attention: 2,
          support: 4,
        },
        their: {
          trust: 4,
          attention: 3,
          support: 5,
        },
      },
      actions: [],
    },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: current.background,
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <GradientToBackground
        state="critical"
        visibleComponents="cog"
        onPressCog={() => router.push("/settings")}
      >
        {yourStats && (
          <AvatarWithStats
            avatar={yourStats.avatar}
            name={yourStats.name}
            points={relationships.reduce((acc, relationship) => {
              return acc + relationship.points.yourPoints;
            }, 0)}
          />
        )}
      </GradientToBackground>
      <RelationshipList
        relationships={relationships}
        onPressAddUser={() => router.push("/(other)/addUser")}
        onPressRelationship={(_, index) =>
          router.push({
            pathname: "/(other)/relationship",
            params: { relationshipIndex: String(index) },
          })
        }
      />
    </View>
  );
};

export default Others;
