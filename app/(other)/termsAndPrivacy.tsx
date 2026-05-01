import { theme } from "@/constants/theme";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TermsAndPrivacy = () => {
  const { colorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const { t } = useTranslation();

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
          {t("termsAndPrivacy.title")}
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
            {t("termsAndPrivacy.termsTitle")}
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            {t("termsAndPrivacy.termsText1")}
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            {t("termsAndPrivacy.termsText2")}
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
            {t("termsAndPrivacy.privacyTitle")}
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            {t("termsAndPrivacy.privacyText1")}
          </Text>
          <Text style={{ color: current.text, lineHeight: 22, marginTop: 10 }}>
            {t("termsAndPrivacy.privacyText2")}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsAndPrivacy;
