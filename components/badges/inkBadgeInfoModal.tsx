import InkBadges from "@/components/badges/inkBadges";
import { positiveAction } from "@/constants/constants";
import { theme } from "@/constants/theme";
import { Status } from "@/constants/types";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, Text, View } from "react-native";

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
  const { t } = useTranslation();

  const recommendationCategory =
    icon === "shield-alt"
      ? "trust"
      : icon === "hands-helping"
        ? "support"
        : icon === "eye"
          ? "attention"
          : null;

  const recommendedActions = positiveAction
    .filter((action) =>
      recommendationCategory
        ? action.ink_kategorie === recommendationCategory
        : true,
    )
    .sort((a, b) => b.startwert - a.startwert)
    .slice(0, 4);

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

          <Text
            style={{
              marginTop: 14,
              color: current.text,
              textAlign: "center",
              lineHeight: 20,
              opacity: 0.85,
              fontWeight: "600",
            }}
          >
            {t("inkBadge.improve_hint")}
          </Text>

          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {recommendedActions.map((action) => (
              <View
                key={action.actionId}
                style={{ marginHorizontal: 4, marginVertical: 4 }}
              >
                <LinearGradient
                  colors={[current.positive[0], current.positive[1]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 15,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    opacity: 0.9,
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}
                  >
                    {t(`actions.${action.actionId}`)}
                  </Text>
                </LinearGradient>
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default InkBadgeInfoModal;
