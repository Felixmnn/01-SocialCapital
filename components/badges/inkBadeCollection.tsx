import { theme } from "@/constants/theme";
import { useColorScheme } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import InkBadgeInfoModal from "./inkBadgeInfoModal";
import InkBadges from "./inkBadges";

export default function InkBadeCollection({
  title,
  trust,
  attention,
  support,
  horizontal = false,
}: {
  title?: string;
  trust: number;
  attention: number;
  support: number;
  horizontal?: boolean;
}) {
  const [selectedBadge, setSelectedBadge] = React.useState<{
    icon: string;
    label: string;
    value: number;
    description: string;
  } | null>(null);

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
          label={"Trust"}
          value={trust}
          onPress={() =>
            setSelectedBadge({
              icon: "shield-alt",
              label: "Trust",
              value: trust,
              description:
                "Trust zeigt, wie sicher und verlässlich eure Verbindung gerade wirkt.",
            })
          }
        />
        <InkBadges
          icon="hands-helping"
          status={supportStatus}
          label={"Support"}
          value={support}
          onPress={() =>
            setSelectedBadge({
              icon: "hands-helping",
              label: "Support",
              value: support,
              description:
                "Support zeigt, wie stark ihr euch im Alltag gegenseitig unterstutzt.",
            })
          }
        />
        <InkBadges
          icon="eye"
          status={attentionStatus}
          label={"Attention"}
          value={attention}
          onPress={() =>
            setSelectedBadge({
              icon: "eye",
              label: "Attention",
              value: attention,
              description:
                "Attention zeigt, wie bewusst ihr euch Zeit, Fokus und Interesse schenkt.",
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
