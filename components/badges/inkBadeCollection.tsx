import { theme } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import InkBadgeInfoModal from "./inkBadgeInfoModal";
import InkBadges from "./inkBadges";

export default function InkBadeCollection({
  title,
  trust,
  attention,
  support,
  horizontal = false,
  recipent,
  nameOtherPerson,
}: {
  title?: string;
  trust: number;
  attention: number;
  support: number;
  horizontal?: boolean;
  recipent?: "youTotal" | "youThem" | "themYou";
  nameOtherPerson?: string;
}) {
  const [selectedBadge, setSelectedBadge] = React.useState<{
    icon: string;
    label: string;
    value: number;
    description: string;
  } | null>(null);

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  const trustStatus =
    trust > 1.2 ? "positive" : trust < 0.8 ? "critical" : "balanced";
  const supportStatus =
    support > 1.2 ? "positive" : support < 0.8 ? "critical" : "balanced";
  const attentionStatus =
    attention > 1.2 ? "positive" : attention < 0.8 ? "critical" : "balanced";

  const selectedStatus = selectedBadge
    ? selectedBadge.value > 1.2
      ? "positive"
      : selectedBadge.value < 0.8
        ? "critical"
        : "balanced"
    : "balanced";

  const getLevel = (value: number) =>
    value < 0.7
      ? "veryLow"
      : value < 0.9
        ? "low"
        : value < 1.2
          ? "balanced"
          : value < 1.5
            ? "high"
            : "veryHigh";

  const descriptionTrust = recipent
    ? t(`inkBadge.trust_${recipent}_${getLevel(trust)}`, {
        name: nameOtherPerson,
      })
    : "";

  const descriptionSupport = recipent
    ? t(`inkBadge.support_${recipent}_${getLevel(support)}`, {
        name: nameOtherPerson,
      })
    : "";

  const descriptionAttention = recipent
    ? t(`inkBadge.attention_${recipent}_${getLevel(attention)}`, {
        name: nameOtherPerson,
      })
    : "";

  return (
    <View className="mt-4">
      {title ? (
        <Text
          style={{
            textAlign: "center",
            color: current.text,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        className={`justify-between ${horizontal ? "flex-row" : "flex-col"}`}
        style={{
          alignItems: "center",
          borderRadius: 12,
        }}
      >
        <InkBadges
          icon="shield-alt"
          status={trustStatus}
          label={t("inkBadge.label_trust")}
          value={trust}
          onPress={() =>
            setSelectedBadge({
              icon: "shield-alt",
              label: t("inkBadge.label_trust"),
              value: trust,
              description: descriptionTrust,
            })
          }
        />
        <InkBadges
          icon="hands-helping"
          status={supportStatus}
          label={t("inkBadge.label_support")}
          value={support}
          onPress={() =>
            setSelectedBadge({
              icon: "hands-helping",
              label: t("inkBadge.label_support"),
              value: support,
              description: descriptionSupport,
            })
          }
        />
        <InkBadges
          icon="eye"
          status={attentionStatus}
          label={t("inkBadge.label_attention")}
          value={attention}
          onPress={() =>
            setSelectedBadge({
              icon: "eye",
              label: t("inkBadge.label_attention"),
              value: attention,
              description: descriptionAttention,
            })
          }
        />
      </View>

      <InkBadgeInfoModal
        visible={selectedBadge !== null}
        onClose={() => setSelectedBadge(null)}
        icon={selectedBadge?.icon ?? "shield-alt"}
        label={selectedBadge?.label ?? "Trust"}
        status={selectedStatus}
        value={selectedBadge?.value ?? 1}
        description={selectedBadge?.description ?? ""}
      />
    </View>
  );
}
