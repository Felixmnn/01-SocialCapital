import AvatarNameEditor from "@/components/avatar/avatarNameEditor";
import AvatarWithName from "@/components/avatar/avatarWithName";
import CustomButton from "@/components/customButton";
import IconScale from "@/components/iconScale";
import { theme } from "@/constants/theme";
import { Avatar, Relationship } from "@/constants/typesRelationship";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const defaultAvatar: Avatar = {
  skinColor: "light",
  hairColor: "black",
  beardType: "none",
  beardColor: "black",
  selectedCharacter: "character1",
  backgroundColor: "blue",
  hairType: "type1",
  clothing: "typ1",
};

const defaultRelationship: Relationship = {
  distance: 1,
  strength: 1,
  person: {
    name: "",
    avatar: defaultAvatar,
  },
  points: {
    yourPoints: 0,
    theirPoints: 0,
  },
  ink: {
    your: {
      trust: 0,
      attention: 0,
      support: 0,
    },
    their: {
      trust: 0,
      attention: 0,
      support: 0,
    },
  },
  actions: [],
};

const AddUser = () => {
  const { yourStats, setRelationships } = useGlobalContext();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const { t } = useTranslation();

  const [newRelationship, setNewRelationship] =
    React.useState<Relationship>(defaultRelationship);
  const [currentStep, setCurrentStep] = React.useState<"one" | "two">("one");
  const [editAvatar, setEditAvatar] = React.useState(false);

  const iconScaleMeet = [
    { name: "shoe-prints", value: 1 },
    { name: "bicycle", value: 2 },
    { name: "car", value: 3 },
    { name: "plane", value: 4 },
  ];

  const iconScaleStrength = [
    { name: "seedling", value: 1 },
    { name: "leafs", value: 2 },
    { name: "small-tree", value: 3 },
    { name: "big-tree", value: 4 },
  ];

  const buttonTitle =
    currentStep === "one"
      ? newRelationship.person.name.length > 0
        ? t("addUser.continueBtn")
        : t("addUser.chooseName")
      : t("addUser.addUserBtn");

  const buttonDisabled =
    currentStep === "one" && newRelationship.person.name.length === 0;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: current.background,
      }}
    >
      <View className="flex-row items-center justify-center w-full px-4">
        <FontAwesome5
          name="arrow-left"
          size={24}
          color={current.basic}
          onPress={() => {
            if (currentStep === "one") {
              router.back();
            } else {
              setCurrentStep("one");
            }
          }}
          style={{ marginRight: 20 }}
        />
        <View className="flex-1" />
      </View>

      <View className="items-center justify-center">
        {currentStep === "one" && (
          <AvatarNameEditor
            you={newRelationship.person}
            setYou={(person) =>
              setNewRelationship((prev) => ({
                ...prev,
                person: { ...prev.person, ...person },
              }))
            }
            editAvatar={editAvatar}
            setEditAvatar={setEditAvatar}
            avatar={newRelationship.person.avatar}
            setAvatar={(avatar) =>
              setNewRelationship((prev) => ({
                ...prev,
                person: { ...prev.person, avatar },
              }))
            }
            text={newRelationship.person.name}
            setText={(text) =>
              setNewRelationship((prev) => ({
                ...prev,
                person: { ...prev.person, name: text },
              }))
            }
          />
        )}

        {currentStep === "two" && (
          <View className="items-center justify-center">
            <View className="flex-row items-center justify-between w-[300px] px-4">
              <AvatarWithName
                avatar={yourStats?.avatar ?? defaultAvatar}
                name={yourStats?.name || t("addUser.youLabel")}
              />
              <AvatarWithName
                avatar={newRelationship.person.avatar}
                name={newRelationship.person.name || t("addUser.themLabel")}
              />
            </View>
            {/*
            <IconScale
              iconScale={iconScaleMeet}
              title="How can you meet"
              selectedValue={newRelationship.distance}
              onSelect={(value: number) =>
                setNewRelationship((prev) => ({ ...prev, distance: value }))
              }
            />
            */}
            <IconScale
              iconScale={iconScaleStrength}
              title={t("addUser.howStrong")}
              selectedValue={newRelationship.strength}
              onSelect={(value: number) =>
                setNewRelationship((prev) => ({ ...prev, strength: value }))
              }
            />
          </View>
        )}
      </View>

      <CustomButton
        title={buttonTitle}
        disable={buttonDisabled}
        onPress={() => {
          if (currentStep === "one") {
            setCurrentStep("two");
            return;
          }

          setRelationships((prev) => [
            ...prev,
            {
              ...newRelationship,
              points: {
                yourPoints: 50 + (newRelationship.strength - 1) * 20,
                theirPoints: 50 + (newRelationship.strength - 1) * 20,
              },
              ink: {
                your: {
                  trust: 1 + (newRelationship.strength - 1) * 0.05,
                  attention: 1 + (newRelationship.strength - 1) * 0.05,
                  support: 1 + (newRelationship.strength - 1) * 0.05,
                },
                their: {
                  trust: 1 + (newRelationship.strength - 1) * 0.05,
                  attention: 1 + (newRelationship.strength - 1) * 0.05,
                  support: 1 + (newRelationship.strength - 1) * 0.05,
                },
              },
            },
          ]);
          router.back();
        }}
      />
    </SafeAreaView>
  );
};

export default AddUser;
