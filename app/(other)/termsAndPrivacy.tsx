import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TermsAndPrivacy = () => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: current.background,
      }}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          alignItems: "center",
          gap: 14,
        }}
      >
        <FontAwesome5
          name="arrow-left"
          size={22}
          color={current.text}
          onPress={() => router.back()}
        />
        <Text style={{ color: current.text, fontSize: 20, fontWeight: "700" }}>
          Terms & Privacy
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 28,
          gap: 14,
        }}
      >
        <View
          style={{
            backgroundColor: current.background,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <Text
            style={{ color: current.text, fontSize: 18, fontWeight: "700" }}
          >
            Terms of Service
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            Diese App dient der persoenlichen Nutzung zur Dokumentation von
            Beziehungen und Aktivitaeten. Du bist verantwortlich fuer die
            Inhalte, die du eintraegst. Eine missbraeuchliche oder rechtswidrige
            Nutzung ist nicht erlaubt.
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            Die bereitgestellten Auswertungen und Anzeigen dienen zur
            Orientierung und stellen keine rechtliche, medizinische oder
            psychologische Beratung dar.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: current.background,
            borderRadius: 12,
            padding: 14,
          }}
        >
          <Text
            style={{ color: current.text, fontSize: 18, fontWeight: "700" }}
          >
            Privacy Policy
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            Deine Daten werden lokal auf deinem Geraet gespeichert. Ohne aktive
            Export- oder Sync-Funktion erfolgt keine automatische Weitergabe an
            Dritte.
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            Wenn du Daten exportierst oder Synchronisation aktivierst, liegt die
            Verantwortung fuer die sichere Uebertragung und Speicherung bei der
            von dir gewaehlten Umgebung.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndPrivacy;
