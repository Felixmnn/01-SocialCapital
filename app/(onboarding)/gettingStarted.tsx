import AvatarNameEditor from "@/components/avatar/avatarNameEditor";
import AvatarWithName from "@/components/avatar/avatarWithName";
import CustomButton from "@/components/customButton";
import IconScale from "@/components/iconScale";
import Timer from "@/components/timer";
import { theme } from "@/constants/theme";
import { Avatar, Person, Relationship } from "@/constants/typesRelationship";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
    gettingStartedButtonDisabled,
    gettingStartedButtonText,
} from "@/functions/gettingStarted";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
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

const defaultYou = {
  name: "",
  avatar: defaultAvatar,
};
const defaultSettingsThem: Relationship = {
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

const GettingStarted = () => {
  const { setYourStats, setRelationships } = useGlobalContext();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const [you, setYou] = React.useState<Person>(defaultYou);
  const [them, setThem] = React.useState<Relationship[]>([defaultSettingsThem]);

  const [currentStep, setCurrentStep] = React.useState<"one" | "two" | "three">(
    "one",
  );

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

  const [editAvatar, setEditAvatar] = React.useState(false);

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
            } else if (currentStep === "two") {
              setCurrentStep("one");
            } else {
              setCurrentStep("two");
            }
          }}
          style={{ marginRight: 20 }}
        />
        <Timer
          remainingPercentage={
            currentStep == "one" ? 33 : currentStep == "two" ? 66 : 100
          }
        />
      </View>
      <View className="items-center justify-center ">
        {currentStep === "one" && (
          <AvatarNameEditor
            you={you}
            setYou={setYou}
            editAvatar={editAvatar}
            setEditAvatar={setEditAvatar}
            avatar={you.avatar}
            setAvatar={(avatar) => setYou({ ...you, avatar })}
            text={you.name}
            setText={(text) => setYou({ ...you, name: text })}
          />
        )}
        {currentStep === "two" && (
          <AvatarNameEditor
            you={them[0].person}
            setYou={(person) =>
              setThem([
                { ...them[0], person: { ...them[0].person, ...person } },
              ])
            }
            editAvatar={editAvatar}
            setEditAvatar={setEditAvatar}
            avatar={them[0].person.avatar}
            setAvatar={(avatar) =>
              setThem([{ ...them[0], person: { ...them[0].person, avatar } }])
            }
            text={them[0].person.name}
            setText={(text) =>
              setThem([
                { ...them[0], person: { ...them[0].person, name: text } },
              ])
            }
          />
        )}

        {currentStep === "three" && (
          <View className="items-center justify-center">
            <View className="flex-row items-center justify-between w-[300px] px-4">
              <AvatarWithName avatar={you.avatar} name={you.name || "You"} />
              <AvatarWithName
                avatar={them[0].person.avatar}
                name={them[0].person.name || "Them"}
              />
            </View>
            {/*
            <IconScale
              iconScale={iconScaleMeet}
              title="How can you meet"
              selectedValue={them[0].distance}
              onSelect={(value: number) =>
                setThem([
                  {
                    ...them[0],
                    distance: value,
                  },
                ])
              }
            />*/}
            <IconScale
              iconScale={iconScaleStrength}
              title="How strong is your relationship"
              selectedValue={them[0].strength}
              onSelect={(value: number) =>
                setThem([{ ...them[0], strength: value }])
              }
            />
          </View>
        )}
      </View>
      <CustomButton
        title={gettingStartedButtonText(
          currentStep,
          you.name.length,
          them[0].person.name.length,
        )}
        onPress={() => {
          if (currentStep === "one") {
            setCurrentStep("two");
          } else if (currentStep === "two") {
            setCurrentStep("three");
          } else {
            setYourStats({ name: you.name, avatar: you.avatar });
            setRelationships([
              {
                ...them[0],
                points: {
                  yourPoints: 50 + (them[0].strength - 1) * 20,
                  theirPoints: 50 + (them[0].strength - 1) * 20,
                },
                ink: {
                  your: {
                    trust: 1 + (them[0].strength - 1) * 0.05,
                    attention: 1 + (them[0].strength - 1) * 0.05,
                    support: 1 + (them[0].strength - 1) * 0.05,
                  },
                  their: {
                    trust: 1 + (them[0].strength - 1) * 0.05,
                    attention: 1 + (them[0].strength - 1) * 0.05,
                    support: 1 + (them[0].strength - 1) * 0.05,
                  },
                },
              },
            ]);
            router.push("/(start)/you");
          }
        }}
        disable={gettingStartedButtonDisabled(
          currentStep,
          you.name.length,
          them[0].person.name.length,
        )}
      />
    </SafeAreaView>
  );
};

export default GettingStarted;
