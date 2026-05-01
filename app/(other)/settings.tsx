import AvatarNameEditor from "@/components/avatar/avatarNameEditor";
import BadgeCollection from "@/components/badges/badgeCollection";
import CustomButton from "@/components/customButton";
import { theme } from "@/constants/theme";
import { GeneralSettings } from "@/constants/types";
import { useGlobalContext } from "@/context/GlobalProvider";
import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
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

const Settings = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const resolvedScheme = colorScheme === "dark" ? "dark" : "light";
  const current = theme[resolvedScheme];
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
  const [openSection, setOpenSection] = React.useState<"sync" | null>(null);

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

  const toggleSection = (section: "sync") => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const setThemeMode = (mode: "light" | "dark") => {
    setGeneralSettings((prev) => ({ ...prev, theme: mode }));
    setColorScheme(mode);
  };

  const handleExportData = () => {
    const exportPayload = {
      yourStats,
      relationships,
      generalSettings,
    };

    console.log("Export data:", exportPayload);
    Alert.alert("Export", "Daten wurden im Log ausgegeben (Expo Konsole).");
  };

  const handleImportData = () => {
    Alert.alert(
      "Import",
      "Import-Flow kann hier angeschlossen werden (z. B. JSON-Datei oder Cloud).",
    );
  };

  const handleResetApp = () => {
    Alert.alert("App zurücksetzen", "Alle Daten wirklich löschen?", [
      { text: "Abbrechen", style: "cancel" },
      {
        text: "Löschen",
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
          Alert.alert("Erledigt", "Alle lokalen Daten wurden gelöscht.");
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
          <CustomButton title="Änderungen speichern" onPress={onSave} />
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
                Color mode
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
                Synchronisation
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
                    Import
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
                    Export
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
                Terms & Privacy
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
                App zurücksetzen
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
