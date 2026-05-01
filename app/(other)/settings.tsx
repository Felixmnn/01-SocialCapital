import i18n from "@/assets/images/languages/i18n";
import AvatarNameEditor from "@/components/avatar/avatarNameEditor";
import BadgeCollection from "@/components/badges/badgeCollection";
import CustomButton from "@/components/customButton";
import { theme } from "@/constants/theme";
import {
  GeneralSettings,
  SpecificBadgeId,
  yourStats as YourStatsType,
} from "@/constants/types";
import { Relationship } from "@/constants/typesRelationship";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useColorScheme } from "nativewind";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  theme: "light",
  patches: [],
  sync: false,
  notifications: false,
  streakDuration: 0,
  weekEntries: [],
  addsWatchedAt: [],
};

const settingsRowStyle = {
  width: "100%" as const,
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 6,
};

const sectionCardStyle = {
  width: "100%" as const,
  borderRadius: 12,
  padding: 12,
};

type BackupPayload = {
  version: 1;
  exportedAt: string;
  language: string;
  yourStats: YourStatsType | null;
  relationships: Relationship[];
  generalSettings: GeneralSettings;
};

const VALID_BADGE_IDS: SpecificBadgeId[] = [
  "critical",
  "balanced",
  "positive",
  "veryPositive",
  "trustworthy",
  "attentive",
  "supportive",
  "giver",
  "strongRelationship",
  "receiver",
  "streak3",
  "streak7",
  "streak30",
  "streak60",
  "streak67",
  "streak90",
  "streak180",
  "streak365",
  "streak500",
  "streak1000",
];

const SKIN_COLORS = ["light", "medium-light", "medium", "medium-dark", "dark"];
const HAIR_COLORS = ["black", "brown", "blonde", "red", "gray", "white"];
const BEARD_TYPES = ["none", "mustache", "full"];
const CHARACTERS = [
  "character1",
  "character2",
  "character3",
  "character4",
  "character5",
  "character6",
  "character7",
];
const HAIR_TYPES = [
  "type0",
  "type1",
  "type2",
  "type3",
  "type4",
  "type5",
  "type6",
];
const BACKGROUND_COLORS = ["blue", "green", "yellow", "purple", "orange"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAvatar(value: unknown): value is YourStatsType["avatar"] {
  if (!isRecord(value)) return false;

  return (
    typeof value.skinColor === "string" &&
    SKIN_COLORS.includes(value.skinColor) &&
    typeof value.hairColor === "string" &&
    HAIR_COLORS.includes(value.hairColor) &&
    typeof value.beardType === "string" &&
    BEARD_TYPES.includes(value.beardType) &&
    typeof value.beardColor === "string" &&
    HAIR_COLORS.includes(value.beardColor) &&
    typeof value.selectedCharacter === "string" &&
    CHARACTERS.includes(value.selectedCharacter) &&
    typeof value.hairType === "string" &&
    HAIR_TYPES.includes(value.hairType) &&
    typeof value.backgroundColor === "string" &&
    BACKGROUND_COLORS.includes(value.backgroundColor)
  );
}

function isYourStats(value: unknown): value is YourStatsType {
  if (!isRecord(value)) return false;
  return typeof value.name === "string" && isAvatar(value.avatar);
}

function isInkValues(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.trust === "number" &&
    typeof value.attention === "number" &&
    typeof value.support === "number"
  );
}

function isRelationship(value: unknown): value is Relationship {
  if (!isRecord(value)) return false;
  if (
    typeof value.distance !== "number" ||
    typeof value.strength !== "number"
  ) {
    return false;
  }
  if (
    !isRecord(value.person) ||
    typeof value.person.name !== "string" ||
    !isAvatar(value.person.avatar)
  ) {
    return false;
  }
  if (
    !isRecord(value.points) ||
    typeof value.points.yourPoints !== "number" ||
    typeof value.points.theirPoints !== "number"
  ) {
    return false;
  }
  if (
    !isRecord(value.ink) ||
    !isInkValues(value.ink.your) ||
    !isInkValues(value.ink.their)
  ) {
    return false;
  }
  if (!Array.isArray(value.actions)) return false;

  return value.actions.every((action) => {
    if (!isRecord(action)) return false;
    return (
      (action.actor === "you" || action.actor === "them") &&
      typeof action.actionID === "string" &&
      typeof action.date === "string"
    );
  });
}

function normalizeImportedGeneralSettings(
  settings: Partial<GeneralSettings> | null | undefined,
): GeneralSettings {
  const patches = Array.isArray(settings?.patches)
    ? (settings?.patches.filter(
        (value): value is SpecificBadgeId =>
          typeof value === "string" &&
          VALID_BADGE_IDS.includes(value as SpecificBadgeId),
      ) ?? [])
    : [];
  const weekEntries = Array.isArray(settings?.weekEntries)
    ? settings.weekEntries.filter(
        (entry): entry is { date: string; completed: boolean } =>
          !!entry &&
          typeof entry.date === "string" &&
          typeof entry.completed === "boolean",
      )
    : [];
  const addsWatchedAt = Array.isArray(settings?.addsWatchedAt)
    ? settings.addsWatchedAt.filter(
        (value): value is string => typeof value === "string",
      )
    : [];

  return {
    theme: settings?.theme === "dark" ? "dark" : "light",
    patches,
    sync: settings?.sync ?? false,
    notifications: settings?.notifications ?? false,
    streakDuration:
      typeof settings?.streakDuration === "number"
        ? settings.streakDuration
        : 0,
    weekEntries,
    addsWatchedAt,
    lastOpenDate:
      typeof settings?.lastOpenDate === "string"
        ? settings.lastOpenDate
        : undefined,
  };
}

const Settings = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
  const { t } = useTranslation();
  const {
    yourStats,
    setYourStats,
    relationships,
    setRelationships,
    generalSettings,
    setGeneralSettings,
  } = useGlobalContext();
  const [editAvatar, setEditAvatar] = React.useState(false);
  const [draftStats, setDraftStats] = React.useState(yourStats);
  const [openSection, setOpenSection] = React.useState<
    "sync" | "language" | null
  >(null);

  const LANGUAGES: { code: string; labelKey: string }[] = [
    { code: "de", labelKey: "settings.lang_de" },
    { code: "en", labelKey: "settings.lang_en" },
    { code: "es", labelKey: "settings.lang_es" },
    { code: "fra", labelKey: "settings.lang_fra" },
  ];

  React.useEffect(() => {
    setDraftStats(yourStats);
  }, [yourStats]);

  const hasChanges =
    !!yourStats &&
    !!draftStats &&
    (yourStats.name !== draftStats.name ||
      JSON.stringify(yourStats.avatar) !== JSON.stringify(draftStats.avatar));

  const onSave = () => {
    if (!draftStats) {
      return;
    }

    setYourStats(draftStats);
  };

  const toggleSection = (section: "sync" | "language") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const setThemeMode = (mode: "light" | "dark") => {
    setGeneralSettings((prev) => ({ ...prev, theme: mode }));
    setColorScheme(mode);
  };

  const handleExportData = async () => {
    try {
      if (!FileSystem.cacheDirectory) {
        Alert.alert(t("settings.exportTitle"), t("settings.exportSuccess"));
        return;
      }

      const payload: BackupPayload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        language: i18n.language,
        yourStats,
        relationships,
        generalSettings,
      };

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileUri = `${FileSystem.cacheDirectory}socialcapital-backup-${timestamp}.json`;

      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(payload, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 },
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: t("settings.exportTitle"),
          UTI: "public.json",
        });
      }

      Alert.alert(t("settings.exportTitle"), t("settings.exportSuccess"));
    } catch (error) {
      console.error("Export failed:", error);
      Alert.alert(t("settings.exportTitle"), t("settings.importInfo"));
    }
  };

  const handleImportData = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const selectedFile = result.assets?.[0];
      if (!selectedFile?.uri) {
        Alert.alert(t("settings.importTitle"), t("settings.importInfo"));
        return;
      }

      const raw = await FileSystem.readAsStringAsync(selectedFile.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const parsed = JSON.parse(raw) as Partial<BackupPayload>;
      const importedYourStats =
        parsed.yourStats === null || parsed.yourStats === undefined
          ? null
          : isYourStats(parsed.yourStats)
            ? parsed.yourStats
            : undefined;
      const importedRelationships = Array.isArray(parsed.relationships)
        ? parsed.relationships
        : undefined;
      const importedGeneralSettings = normalizeImportedGeneralSettings(
        parsed.generalSettings,
      );

      const hasValidRelationships =
        Array.isArray(importedRelationships) &&
        importedRelationships.every((relationship) =>
          isRelationship(relationship),
        );

      if (importedYourStats === undefined || !hasValidRelationships) {
        Alert.alert(t("settings.importTitle"), t("settings.importInfo"));
        return;
      }

      setYourStats(importedYourStats);
      setRelationships(importedRelationships);
      setGeneralSettings(importedGeneralSettings);
      setColorScheme(importedGeneralSettings.theme);

      if (typeof parsed.language === "string") {
        await i18n.changeLanguage(parsed.language);
      }

      Alert.alert(t("settings.importTitle"), t("settings.importInfo"));
    } catch (error) {
      console.error("Import failed:", error);
      Alert.alert(t("settings.importTitle"), t("settings.importInfo"));
    }
  };

  const handleResetApp = () => {
    Alert.alert(t("settings.resetTitle"), t("settings.resetConfirm"), [
      { text: t("settings.resetCancel"), style: "cancel" },
      {
        text: t("settings.resetDelete"),
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove([
            "yourStats",
            "relationships",
            "generalSettings",
          ]);
          setYourStats(null);
          setRelationships([]);
          setGeneralSettings(DEFAULT_GENERAL_SETTINGS);
          Alert.alert(t("settings.resetTitle"), t("settings.resetSuccess"));
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: current.background,
      }}
    >
      <View className="flex-row justify-start w-full p-4">
        <FontAwesome5
          name="arrow-left"
          size={24}
          color={current.text}
          onPress={() => {
            router.back();
          }}
        />
      </View>
      <ScrollView
        style={{ width: "100%" }}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 16,
          paddingBottom: 32,
        }}
      >
        {draftStats?.avatar && (
          <AvatarNameEditor
            you={draftStats}
            setYou={(you) => setDraftStats(you)}
            editAvatar={editAvatar}
            setEditAvatar={setEditAvatar}
            avatar={draftStats.avatar}
            setAvatar={(avatar) => setDraftStats({ ...draftStats, avatar })}
            text={draftStats.name}
            setText={(text) => setDraftStats({ ...draftStats, name: text })}
            showTextWhenNotEditing={true}
          />
        )}

        {hasChanges && (
          <CustomButton title={t("settings.saveChanges")} onPress={onSave} />
        )}

        <BadgeCollection badges={generalSettings.patches} />

        <View style={{ width: "100%", gap: 8 }}>
          <View
            style={{
              ...settingsRowStyle,
              backgroundColor: current.background,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome5 name="moon" size={16} color={current.text} />
              <Text style={{ color: current.text, fontWeight: "700" }}>
                {t("settings.colorMode")}
              </Text>
            </View>
            <Switch
              value={generalSettings.theme === "dark"}
              onValueChange={(value) => setThemeMode(value ? "dark" : "light")}
            />
          </View>

          {/* Maybe with version 2
          <View
            style={{
              ...settingsRowStyle,
              backgroundColor: current.background,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome5 name="bell" size={16} color={current.text} />
              <Text style={{ color: current.text, fontWeight: "700" }}>
                Notifications
              </Text>
            </View>
            <Switch
              value={generalSettings.notifications}
              onValueChange={(value) =>
                setGeneralSettings((prev) => ({
                  ...prev,
                  notifications: value,
                }))
              }
            />
          </View>
          */}
          <Pressable
            onPress={() => toggleSection("language")}
            style={{
              ...settingsRowStyle,
              backgroundColor: current.background,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome5 name="globe" size={16} color={current.text} />
              <Text style={{ color: current.text, fontWeight: "700" }}>
                {t("settings.language")}
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text style={{ color: current.text, opacity: 0.6, fontSize: 13 }}>
                {t(`settings.lang_${i18n.language}`)}
              </Text>
              <FontAwesome5
                name="chevron-right"
                size={14}
                color={current.text}
              />
            </View>
          </Pressable>

          {openSection === "language" && (
            <View
              style={{
                ...sectionCardStyle,
                backgroundColor: current.background,
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {LANGUAGES.map(({ code, labelKey }) => {
                const isActive = i18n.language === code;
                return (
                  <Pressable
                    key={code}
                    onPress={() => i18n.changeLanguage(code)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 999,
                      backgroundColor: isActive
                        ? current.basic
                        : current.background,
                      borderWidth: 1.5,
                      borderColor: isActive
                        ? current.basic
                        : current.text + "33",
                    }}
                  >
                    <Text
                      style={{
                        color: isActive ? "#fff" : current.text,
                        fontWeight: isActive ? "700" : "400",
                        fontSize: 14,
                      }}
                    >
                      {t(labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Pressable
            onPress={() => toggleSection("sync")}
            style={{
              ...settingsRowStyle,
              backgroundColor: current.background,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome5 name="sync-alt" size={16} color={current.text} />
              <Text style={{ color: current.text, fontWeight: "700" }}>
                {t("settings.sync")}
              </Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={current.text} />
          </Pressable>

          {openSection === "sync" && (
            <View
              style={{
                ...sectionCardStyle,
                backgroundColor: current.background,

                gap: 10,
              }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={handleImportData}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                    backgroundColor: current.basic,
                  }}
                >
                  <FontAwesome5
                    name="file-import"
                    size={14}
                    color={current.text}
                  />
                  <Text style={{ color: current.text, fontWeight: "700" }}>
                    {t("common.import")}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleExportData}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    gap: 8,
                    backgroundColor: current.basic,
                  }}
                >
                  <FontAwesome5
                    name="file-export"
                    size={14}
                    color={current.text}
                  />
                  <Text style={{ color: current.text, fontWeight: "700" }}>
                    {t("common.export")}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          <Pressable
            onPress={() => router.push("/(other)/termsAndPrivacy")}
            style={{
              ...settingsRowStyle,
              backgroundColor: current.background,

              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome5
                name="file-contract"
                size={16}
                color={current.text}
              />
              <Text style={{ color: current.text, fontWeight: "700" }}>
                {t("settings.termsAndPrivacy")}
              </Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color={current.text} />
          </Pressable>

          <Pressable
            onPress={handleResetApp}
            style={{
              ...settingsRowStyle,
              backgroundColor: current.background,
              borderColor: "#ef4444",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <FontAwesome5 name="trash-alt" size={16} color="#ef4444" />
              <Text style={{ color: "#ef4444", fontWeight: "700" }}>
                {t("settings.resetApp")}
              </Text>
            </View>
            <FontAwesome5 name="chevron-right" size={14} color="#ef4444" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
