import { theme } from "@/constants/theme";
import { SpecificBadgeId } from "@/constants/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { Modal, Pressable, Text } from "react-native";

type BadgeEarnedModalProps = {
  visible: boolean;
  patch: SpecificBadgeId;
  onClose: () => void;
};

type PatchData = {
  label: string;
  description: string;
  icon: string;
  getColors: (current: any) => [string, string];
};

const PATCH_DATA: Record<SpecificBadgeId, PatchData> = {
  critical: {
    label: "Kritisch",
    description:
      "Eine deiner Beziehungen war einmal in einem kritischen Zustand.",
    icon: "exclamation-circle",
    getColors: (current) => current.critical,
  },
  balanced: {
    label: "Ausgeglichen",
    description:
      "Eine deiner Beziehungen war einmal in einem ausgeglichenen Zustand.",
    icon: "balance-scale",
    getColors: (current) => current.balanced,
  },
  positive: {
    label: "Positiv",
    description:
      "Eine deiner Beziehungen war einmal in einem positiven Zustand.",
    icon: "thumbs-up",
    getColors: (current) => current.positive,
  },
  veryPositive: {
    label: "Sehr Positiv",
    description:
      "Eine deiner Beziehungen war einmal in einem sehr positiven Zustand.",
    icon: "heart",
    getColors: (current) => current.veryPositive,
  },
  trustworthy: {
    label: "Vertrauenswürdig",
    description:
      "Dieses Abzeichen hast du erhalten, weil du über einen längeren Zeitraum hinweg vertrauenswürdig warst.",
    icon: "handshake",
    getColors: (current) => current.positive,
  },
  attentive: {
    label: "Aufmerksam",
    description:
      "Dieses Abzeichen hast du erhalten, weil du über einen längeren Zeitraum hinweg aufmerksam warst.",
    icon: "eye",
    getColors: (current) => current.balanced,
  },
  supportive: {
    label: "Unterstützend",
    description:
      "Dieses Abzeichen hast du erhalten, weil du über einen längeren Zeitraum hinweg unterstützend warst.",
    icon: "hands-helping",
    getColors: (current) => current.positive,
  },
  giver: {
    label: "Geber",
    description:
      "Dieses Abzeichen hast du erhalten, weil du in deinen Beziehungen mehr gibst als nimmst.",
    icon: "gift",
    getColors: (current) => current.veryPositive,
  },
  strongRelationship: {
    label: "Starke Beziehung",
    description:
      "Dieses Abzeichen hast du erhalten, weil du in einer starken positiv geprägten Beziehung bist.",
    icon: "heart",
    getColors: (current) => current.veryPositive,
  },
  receiver: {
    label: "Nehmer",
    description:
      "Dieses Abzeichen hast du erhalten, weil du in deinen Beziehungen über einen längeren Zeitraum hinweg mehr nimmst als gibst.",
    icon: "inbox",
    getColors: (current) => current.critical,
  },
  streak3: {
    label: "Streak 3",
    description:
      "Du hast es geschafft, 3 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "fire",
    getColors: (current) => current.critical,
  },
  streak7: {
    label: "Streak 7",
    description:
      "Du hast es geschafft, 7 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "fire",
    getColors: (current) => current.critical,
  },
  streak30: {
    label: "Streak 30",
    description:
      "Du hast es geschafft, 30 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "fire",
    getColors: (current) => current.critical,
  },
  streak60: {
    label: "Streak 60",
    description:
      "Du hast es geschafft, 60 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "fire",
    getColors: (current) => current.balanced,
  },
  streak67: {
    label: "Streak 67",
    description:
      "Du hast es geschafft, 67 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "fire",
    getColors: (current) => current.balanced,
  },
  streak90: {
    label: "Streak 90",
    description:
      "Du hast es geschafft, 90 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "fire",
    getColors: (current) => current.positive,
  },
  streak180: {
    label: "Streak 180",
    description:
      "Du hast es geschafft, 180 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "star",
    getColors: (current) => current.positive,
  },
  streak365: {
    label: "Streak 365",
    description:
      "Du hast es geschafft, 365 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "trophy",
    getColors: (current) => current.veryPositive,
  },
  streak500: {
    label: "Streak 500",
    description:
      "Du hast es geschafft, 500 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "crown",
    getColors: (current) => current.veryPositive,
  },
  streak1000: {
    label: "Streak 1000",
    description:
      "Du hast es geschafft, 1000 Tage in Folge deine Beziehungen zu pflegen.",
    icon: "crown",
    getColors: (current) => current.veryPositive,
  },
};

const BadgeEarnedModal = ({
  visible,
  patch,
  onClose,
}: BadgeEarnedModalProps) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const patchData = PATCH_DATA[patch];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
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
          <LinearGradient
            colors={patchData.getColors(current)}
            style={{
              width: 70,
              height: 70,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <FontAwesome5
              name={patchData.icon as any}
              size={32}
              color="white"
              solid
            />
          </LinearGradient>
          <Text
            style={{
              color: current.text,
              fontWeight: "700",
              fontSize: 18,
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            {patchData.label}
          </Text>
          <Text
            style={{
              color: current.text,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 12,
            }}
          >
            {patchData.description}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default BadgeEarnedModal;
