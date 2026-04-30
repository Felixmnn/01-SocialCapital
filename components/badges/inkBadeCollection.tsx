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

  const allgemeinerTrustHinweis =
    "Vertauen kann nur durch zeit steigen hingegen kann es jederzeit durch negative Erfahrungen sinken.";
  const descriptionTrustYouTotal =
    trust < 0.7
      ? "Dein Vertrauensniveau ist sehr niedrig. Grund dafür sind in der Regel wiederholt entstandene Situationen, in denen dein Verhalten unzuverlässig war."
      : trust < 0.9
        ? "Dein Vertrauensniveau ist eher niedrig. Grund dafür sind Situationen, in denen du unzuverlässig warst oder dein Wort nicht gehalten hast."
        : trust < 1.2
          ? "Dein Vertrauensniveau ist ausgeglichen. Das bedeutet, das man sich in der Regel auf dich verlassen kann."
          : trust < 1.5
            ? "Dein Vertrauensniveau ist hoch. Das bedeutet, das du eine verlässliche Person bist, auf die man sich in den meisten Situationen verlassen kann."
            : "Dein Vertrauensniveau ist sehr hoch. Das bedeutet, das du eine extrem verlässliche Person bist, auf die man sich in jeder Hinsicht verlassen kann.";

  const descriptionTrustYouThem =
    trust < 0.7
      ? "Dein Verauensverhältnis zu " +
        nameOtherPerson +
        "ist schlecht. Das bedeutet, das sich " +
        nameOtherPerson +
        " sich aktuell nicht auf dich verlassen kann."
      : trust < 0.9
        ? "Dein Verauensverhältnis zu " +
          nameOtherPerson +
          "ist eher schlecht. Das bedeutet, das sich " +
          nameOtherPerson +
          " sich gelegentlich nicht auf dich verlassen kann."
        : support < 1.2
          ? "Dein Verauensverhältnis zu " +
            nameOtherPerson +
            "ist ausgeglichen. Das bedeutet, das sich " +
            nameOtherPerson +
            " sich in der Regel auf dich verlassen kann."
          : support < 1.5
            ? "Dein Verauensverhältnis zu " +
              nameOtherPerson +
              "ist gut. Das bedeutet, das sich " +
              nameOtherPerson +
              " sich regelmäßig auf dich verlassen kann."
            : "Dein Verauensverhältnis zu " +
              nameOtherPerson +
              "ist sehr gut. Das bedeutet, das sich " +
              nameOtherPerson +
              " sich immer auf dich verlassen kann.";

  const descriptionTrustThemYou =
    trust < 0.7
      ? "Dein Vertrauensverhältnis zu " +
        nameOtherPerson +
        "ist schlecht. Das bedeutet, das du dich aktuell nicht auf " +
        nameOtherPerson +
        " verlassen kannst."
      : trust < 0.9
        ? "Dein Vertrauensverhältnis zu " +
          nameOtherPerson +
          "ist eher schlecht. Das bedeutet, das du dich gelegentlich nicht auf " +
          nameOtherPerson +
          " verlassen kannst."
        : trust < 1.2
          ? "Dein Vertrauensverhältnis zu " +
            nameOtherPerson +
            "ist ausgeglichen. Das bedeutet, das du dich in der Regel auf " +
            nameOtherPerson +
            " verlassen kannst."
          : support < 1.5
            ? "Dein Vertrauensverhältnis zu " +
              nameOtherPerson +
              "ist gut. Das bedeutet, das du dich regelmäßig auf " +
              nameOtherPerson +
              " verlassen kannst."
            : "Dein Vertrauensverhältnis zu " +
              nameOtherPerson +
              "ist sehr gut. Das bedeutet, das du dich immer auf " +
              nameOtherPerson +
              " verlassen kannst.";

  const descriptionSupportYouTotal =
    support < 0.7
      ? "Dein Unterstützungsniveau ist sehr niedrig. Das bedeutet, das du häufig nicht bereit warst, bei Problemen oder Herausforderungen zu unterstützen"
      : support < 0.9
        ? "Dein Unterstützungsniveau ist eher niedrig. Das bedeutet, das du gelegentlich nicht bereit warst, bei Problemen oder Herausforderungen zu unterstützen."
        : support < 1.2
          ? "Dein Unterstützungsniveau ist ausgeglichen. Das bedeutet, das du in der Regel bereit bist, bei Problemen oder Herausforderungen zu unterstützen."
          : support < 1.5
            ? "Dein Unterstützungsniveau ist hoch. Das bedeutet, das du häufig bereit bist, bei Problemen oder Herausforderungen zu unterstützen."
            : "Dein Unterstützungsniveau ist sehr hoch. Das bedeutet, das du immer bereit bist, bei Problemen oder Herausforderungen zu unterstützen.";

  const descriptionSupportThemYou =
    support < 0.7
      ? "Dein Unterstützungsniveau ist sehr niedrig. Das bedeutet, das " +
        nameOtherPerson +
        " häufig nicht bereit war, bei Problemen oder Herausforderungen zu unterstützen."
      : support < 0.9
        ? "Dein Unterstützungsniveau ist eher niedrig. Das bedeutet, das " +
          nameOtherPerson +
          " gelegentlich nicht bereit war, bei Problemen oder Herausforderungen zu unterstützen."
        : support < 1.2
          ? "Dein Unterstützungsniveau ist ausgeglichen. Das bedeutet, das " +
            nameOtherPerson +
            " in der Regel bereit ist, bei Problemen oder Herausforderungen zu unterstützen."
          : support < 1.5
            ? ""
            : "";
  descriptionSupportYouTotal;
  const descriptionSupportYouThem =
    support < 0.7
      ? "Dein Unterstützungsniveau ist sehr niedrig. Das bedeutet, das du häufig nicht bereit warst, " +
        nameOtherPerson +
        " bei Problemen oder Herausforderungen zu unterstützen."
      : support < 0.9
        ? "Dein Unterstützungsniveau ist eher niedrig. Das bedeutet, das du gelegentlich nicht bereit warst, " +
          nameOtherPerson +
          " bei Problemen oder Herausforderungen zu unterstützen."
        : support < 1.2
          ? "Dein Unterstützungsniveau ist ausgeglichen. Das bedeutet, das du in der Regel bereit bist, " +
            nameOtherPerson +
            " bei Problemen oder Herausforderungen zu unterstützen."
          : support < 1.5
            ? "Dein Unterstützungsniveau ist hoch. Das bedeutet, das du häufig bereit bist, " +
              nameOtherPerson +
              " bei Problemen oder Herausforderungen zu unterstützen."
            : "Dein Unterstützungsniveau ist sehr hoch. Das bedeutet, das du immer bereit bist, " +
              nameOtherPerson +
              " bei Problemen oder Herausforderungen zu unterstützen.";

  const descriptionAttentionYouTotal =
    attention < 0.7
      ? "Dein Aufmerksamkeitsniveau ist sehr niedrig. Das bedeutet, das du häufig desintesse an den Bedürfnissen, Interessen oder Problemen deiner Kontakte gezeigt hast."
      : attention < 0.9
        ? "Dein Aufmerksamkeitsniveau ist eher niedrig. Das bedeutet, das du gelegentlich desintesse an den Bedürfnissen, Interessen oder Problemen deiner Kontakte gezeigt hast."
        : attention < 1.2
          ? "Dein Aufmerksamkeitsniveau ist ausgeglichen. Das bedeutet, das du in der Regel aufmerksam gegenüber den Bedürfnissen, Interessen oder Problemen deiner Kontakte bist."
          : attention < 1.5
            ? "Dein Aufmerksamkeitsniveau ist hoch. Das bedeutet, das du dir regelmäßig Zeit für die Bedürfnisse, Interessen oder Probleme deiner Kontakte nimmst."
            : "Dein Aufmerksamkeitsniveau ist sehr hoch. Das bedeutet, das du dir immer Zeit für die Bedürfnisse, Interessen oder Probleme deiner Kontakte nimmst.";

  const descriptionAttentionThemYou =
    attention < 0.7
      ? "Dein Aufmerksamkeitsniveau ist sehr niedrig. Das bedeutet, das " +
        nameOtherPerson +
        " häufig desintesse an deinen Bedürfnissen, Interessen oder Problemen gezeigt hat."
      : attention < 0.9
        ? "Dein Aufmerksamkeitsniveau ist eher niedrig. Das bedeutet, das " +
          nameOtherPerson +
          " gelegentlich desintesse an deinen Bedürfnissen, Interessen oder Problemen gezeigt hat."
        : attention < 1.2
          ? "Dein Aufmerksamkeitsniveau ist ausgeglichen. Das bedeutet, das " +
            nameOtherPerson +
            " in der Regel aufmerksam gegenüber deinen Bedürfnissen, Interessen oder Problemen ist."
          : attention < 1.5
            ? "Dein Aufmerksamkeitsniveau ist hoch. Das bedeutet, das " +
              nameOtherPerson +
              " sich regelmäßig Zeit für deine Bedürfnisse, Interessen oder Probleme nimmt."
            : "Dein Aufmerksamkeitsniveau ist sehr hoch. Das bedeutet, das " +
              nameOtherPerson +
              " sich immer Zeit für deine Bedürfnisse, Interessen oder Probleme nimmt.";

  const descriptionAttentionYouThem =
    attention < 0.7
      ? "Dein Aufmerksamkeitsniveau ist sehr niedrig. Das bedeutet, das du häufig desintesse an den Bedürfnissen, Interessen oder Problemen von " +
        nameOtherPerson +
        " gezeigt hast."
      : attention < 0.9
        ? "Dein Aufmerksamkeitsniveau ist eher niedrig. Das bedeutet, das du gelegentlich desintesse an den Bedürfnissen, Interessen oder Problemen von " +
          nameOtherPerson +
          " gezeigt hast."
        : attention < 1.2
          ? "Dein Aufmerksamkeitsniveau ist ausgeglichen. Das bedeutet, das du in der Regel aufmerksam gegenüber den Bedürfnissen, Interessen oder Problemen von " +
            nameOtherPerson +
            " bist."
          : attention < 1.5
            ? "Dein Aufmerksamkeitsniveau ist hoch. Das bedeutet, das du dir regelmäßig Zeit für die Bedürfnisse, Interessen oder Probleme von " +
              nameOtherPerson +
              " nimmst."
            : "";

  const descriptionTrust =
    recipent === "youTotal"
      ? descriptionTrustYouTotal
      : recipent === "youThem"
        ? descriptionTrustYouThem
        : recipent === "themYou"
          ? descriptionTrustThemYou
          : "";

  const descriptionSupport =
    recipent === "youTotal"
      ? descriptionSupportYouTotal
      : recipent === "youThem"
        ? descriptionSupportYouThem
        : recipent === "themYou"
          ? descriptionSupportThemYou
          : "";

  const descriptionAttention =
    recipent === "youTotal"
      ? descriptionAttentionYouTotal
      : recipent === "youThem"
        ? descriptionAttentionYouThem
        : recipent === "themYou"
          ? descriptionAttentionThemYou
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
          label={"Trust"}
          value={trust}
          onPress={() =>
            setSelectedBadge({
              icon: "shield-alt",
              label: "Trust",
              value: trust,
              description: descriptionTrust,
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
              description: descriptionSupport,
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
