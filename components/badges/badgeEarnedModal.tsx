import { theme } from "@/constants/theme";
import { SpecificBadgeId } from "@/constants/types";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text } from "react-native";

type BadgeEarnedModalProps = {
  visible: boolean;
  patch: SpecificBadgeId;
  onClose: () => void;
};

type PatchData = {
  icon: string;
  getColors: (current: any) => [string, string];
};

const PATCH_DATA: Record<SpecificBadgeId, PatchData> = {
  critical: {
    icon: "exclamation-circle",
    getColors: (current) => current.critical,
  },
  balanced: {
    icon: "balance-scale",
    getColors: (current) => current.balanced,
  },
  positive: {
    icon: "thumbs-up",
    getColors: (current) => current.positive,
  },
  veryPositive: {
    icon: "heart",
    getColors: (current) => current.veryPositive,
  },
  trustworthy: {
    icon: "handshake",
    getColors: (current) => current.positive,
  },
  attentive: {
    icon: "eye",
    getColors: (current) => current.balanced,
  },
  supportive: {
    icon: "hands-helping",
    getColors: (current) => current.positive,
  },
  giver: {
    icon: "gift",
    getColors: (current) => current.veryPositive,
  },
  strongRelationship: {
    icon: "heart",
    getColors: (current) => current.veryPositive,
  },
  receiver: {
    icon: "inbox",
    getColors: (current) => current.critical,
  },
  streak3: {
    icon: "fire",
    getColors: (current) => current.critical,
  },
  streak7: {
    icon: "fire",
    getColors: (current) => current.critical,
  },
  streak30: {
    icon: "fire",
    getColors: (current) => current.critical,
  },
  streak60: {
    icon: "fire",
    getColors: (current) => current.balanced,
  },
  streak67: {
    icon: "fire",
    getColors: (current) => current.balanced,
  },
  streak90: {
    icon: "fire",
    getColors: (current) => current.positive,
  },
  streak180: {
    icon: "star",
    getColors: (current) => current.positive,
  },
  streak365: {
    icon: "trophy",
    getColors: (current) => current.veryPositive,
  },
  streak500: {
    icon: "crown",
    getColors: (current) => current.veryPositive,
  },
  streak1000: {
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
  const { t } = useTranslation();
  const patchData = PATCH_DATA[patch];
  const label = t(`badge.${patch}`);
  const description = t(`badge.desc_${patch}`);

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
            {label}
          </Text>
          <Text
            style={{
              color: current.text,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 12,
            }}
          >
            {description}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default BadgeEarnedModal;
