import InkBadges from "@/components/badges/inkBadges";
import { theme } from "@/constants/theme";
import { Status } from "@/constants/types";
import { useColorScheme } from "nativewind";
import React from "react";
import { Modal, Pressable, Text } from "react-native";

type InkBadgeInfoModalProps = {
  visible: boolean;
  onClose: () => void;
  icon: string;
  label: string;
  status: Status;
  value: number;
  description: string;
};

const InkBadgeInfoModal = ({
  visible,
  onClose,
  icon,
  label,
  status,
  value,
  description,
}: InkBadgeInfoModalProps) => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

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
          <InkBadges icon={icon} label={label} status={status} value={value} />
          <Text
            style={{
              marginTop: 14,
              color: current.text,
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            {description}
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default InkBadgeInfoModal;
