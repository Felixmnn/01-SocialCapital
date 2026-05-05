import { theme } from "@/constants/theme";
import { Avatar } from "@/constants/typesRelationship";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";

const SKIN_COLORS: Avatar["skinColor"][] = [
  "light",
  "medium-light",
  "medium",
  "medium-dark",
  "dark",
];

const HAIR_COLORS: Avatar["hairColor"][] = [
  "black",
  "brown",
  "blonde",
  "red",
  "gray",
  "white",
];

const BEARD_TYPES: Avatar["beardType"][] = ["none", "mustache", "full"];

const CHARACTERS: Avatar["selectedCharacter"][] = [
  "character1",
  "character2",
  "character3",
];

const HAIRTYPES: Avatar["hairType"][] = [
  "type0",
  "type1",
  "type2",
  "type3",
  "type4",
  "type5",
  "type6",
];

const BACKGROUND_COLORS: Avatar["backgroundColor"][] = [
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
];

const CLOTHING_TYPES: Avatar["clothing"][] = [
  "typ1",
  "typ2",
  "typ3",
  "typ4",
  "typ5",
  "typ6",
  "typ7",
];

const cycleValue = <T extends string>(
  values: T[],
  current: T,
  direction: -1 | 1,
): T => {
  const currentIndex = values.indexOf(current);

  if (currentIndex === -1) {
    return values[0];
  }

  const nextIndex = (currentIndex + direction + values.length) % values.length;
  return values[nextIndex];
};

const AvatarEditor = ({
  avatar,
  setAvatar,
}: {
  avatar: Avatar;
  setAvatar: (avatar: Avatar) => void;
}) => {
  const updateField = <K extends keyof Avatar>(key: K, value: Avatar[K]) => {
    setAvatar({
      ...avatar,
      [key]: value,
    });
  };

  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  return (
    <LinearGradient
      colors={[current.purpleGradient[0], current.purpleGradient[1]]}
      style={{
        backgroundColor: current.basic,
        borderRadius: 12,
      }}
      className=" max-w-md gap-2 rounded-2xl mt-2 rounded-2xl p-4"
    >
      <View className=" max-w-md gap-2 rounded-2xl mt-2 ">
        <Text>Character</Text>
        <RowControl
          label="Character"
          value={avatar.selectedCharacter}
          onPrevious={() =>
            updateField(
              "selectedCharacter",
              cycleValue(CHARACTERS, avatar.selectedCharacter, -1),
            )
          }
          onNext={() =>
            updateField(
              "selectedCharacter",
              cycleValue(CHARACTERS, avatar.selectedCharacter, 1),
            )
          }
        />
        <RowControl
          label="Skin"
          value={avatar.skinColor}
          onPrevious={() =>
            updateField(
              "skinColor",
              cycleValue(SKIN_COLORS, avatar.skinColor, -1),
            )
          }
          onNext={() =>
            updateField(
              "skinColor",
              cycleValue(SKIN_COLORS, avatar.skinColor, 1),
            )
          }
        />
        <Text>Hair</Text>
        <RowControl
          label="Hair"
          value={avatar.hairColor}
          onPrevious={() =>
            updateField(
              "hairColor",
              cycleValue(HAIR_COLORS, avatar.hairColor, -1),
            )
          }
          onNext={() =>
            updateField(
              "hairColor",
              cycleValue(HAIR_COLORS, avatar.hairColor, 1),
            )
          }
        />

        {avatar.selectedCharacter !== "character1" &&
          avatar.selectedCharacter !== "character3" &&
          avatar.selectedCharacter !== "character6" &&
          avatar.selectedCharacter !== "character5" && (
            <RowControl
              label="Beard"
              value={avatar.beardType}
              onPrevious={() =>
                updateField(
                  "beardType",
                  cycleValue(BEARD_TYPES, avatar.beardType, -1),
                )
              }
              onNext={() =>
                updateField(
                  "beardType",
                  cycleValue(BEARD_TYPES, avatar.beardType, 1),
                )
              }
            />
          )}

        {avatar.beardType !== "none" &&
          avatar.selectedCharacter !== "character1" &&
          avatar.selectedCharacter !== "character3" &&
          avatar.selectedCharacter !== "character6" &&
          avatar.selectedCharacter !== "character5" && (
            <RowControl
              label="Beard Color"
              value={avatar.beardColor}
              onPrevious={() =>
                updateField(
                  "beardColor",
                  cycleValue(HAIR_COLORS, avatar.beardColor, -1),
                )
              }
              onNext={() =>
                updateField(
                  "beardColor",
                  cycleValue(HAIR_COLORS, avatar.beardColor, 1),
                )
              }
            />
          )}
        <RowControl
          label="Hair Type"
          value={avatar.hairType}
          onPrevious={() =>
            updateField("hairType", cycleValue(HAIRTYPES, avatar.hairType, -1))
          }
          onNext={() =>
            updateField("hairType", cycleValue(HAIRTYPES, avatar.hairType, 1))
          }
        />
        <Text>Accessories</Text>
        <RowControl
          label="Background"
          value={avatar.backgroundColor}
          onPrevious={() =>
            updateField(
              "backgroundColor",
              cycleValue(BACKGROUND_COLORS, avatar.backgroundColor, -1),
            )
          }
          onNext={() =>
            updateField(
              "backgroundColor",
              cycleValue(BACKGROUND_COLORS, avatar.backgroundColor, 1),
            )
          }
        />
        <RowControl
          label="Clothing"
          value={avatar.clothing}
          onPrevious={() =>
            updateField(
              "clothing",
              cycleValue(CLOTHING_TYPES, avatar.clothing, -1),
            )
          }
          onNext={() =>
            updateField(
              "clothing",
              cycleValue(CLOTHING_TYPES, avatar.clothing, 1),
            )
          }
        />
      </View>
    </LinearGradient>
  );
};

const RowControl = ({
  label,
  value,
  onPrevious,
  onNext,
}: {
  label: string;
  value: string;
  onPrevious: () => void;
  onNext: () => void;
}) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  return (
    <LinearGradient
      colors={[current.purpleGradient[0], current.purpleGradient[1]]}
      className="flex-row items-center justify-between rounded-xl bg-zinc-800/80 px-3 py-2"
      style={{
        backgroundColor: current.basic,
        borderRadius: 12,
        height: 40,
      }}
    >
      <Text className="w-24 text-xs font-semibold text-zinc-300">{label}</Text>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={onPrevious}
          className="h-8 w-8 items-center justify-center rounded-lg bg-zinc-700"
          style={{ backgroundColor: current.background }}
        >
          <Text
            className="text-base font-bold text-white"
            style={{ color: current.text }}
          >
            {"<"}
          </Text>
        </Pressable>

        <Text className="min-w-[120px] text-center text-sm font-medium text-white">
          {value}
        </Text>

        <Pressable
          onPress={onNext}
          className="h-8 w-8 items-center justify-center rounded-lg bg-zinc-700"
          style={{ backgroundColor: current.background }}
        >
          <Text
            className="text-base font-bold text-white"
            style={{ color: current.text }}
          >
            {">"}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default AvatarEditor;
