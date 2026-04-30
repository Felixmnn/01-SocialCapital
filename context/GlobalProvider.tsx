import {
  calculateNewINKValue,
  calculateNewPoints,
} from "@/constants/constants";
import {
  GeneralSettings,
  GlobalProviderProps,
  SpecificBadgeId,
  WeekEntry,
} from "@/constants/types";
import { Avatar, Relationship } from "@/constants/typesRelationship";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

function getLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function generateWeekEntries(today: Date): WeekEntry[] {
  const dayOfWeek = today.getDay();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - dayOfWeek + i);
    return { date: d.toISOString(), completed: i === dayOfWeek };
  });
}

function updateStreak(settings: GeneralSettings): GeneralSettings {
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const lastOpen = settings.lastOpenDate;

  let newStreak = settings.streakDuration;
  if (!lastOpen) {
    newStreak = 1;
  } else if (lastOpen !== todayStr) {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    newStreak =
      getLocalDateString(yesterday) === lastOpen
        ? settings.streakDuration + 1
        : 1;
  }

  const dayOfWeek = today.getDay();
  const todayInWeek = settings.weekEntries.some(
    (e) => getLocalDateString(new Date(e.date)) === todayStr,
  );

  const weekEntries =
    todayInWeek && settings.weekEntries.length === 7
      ? settings.weekEntries.map((e, i) =>
          i === dayOfWeek ? { ...e, completed: true } : e,
        )
      : generateWeekEntries(today);

  return {
    ...settings,
    streakDuration: newStreak,
    weekEntries,
    lastOpenDate: todayStr,
  };
}

function normalizeGeneralSettings(
  settings: Partial<GeneralSettings>,
): GeneralSettings {
  return {
    theme: settings.theme ?? "light",
    patches: settings.patches ?? [],
    sync: settings.sync ?? false,
    notifications: settings.notifications ?? false,
    streakDuration: settings.streakDuration ?? 0,
    weekEntries: settings.weekEntries ?? [],
    addsWatchedAt: settings.addsWatchedAt ?? [],
    lastOpenDate: settings.lastOpenDate,
  };
}

type LegacyAvatar = Omit<Avatar, "hairType"> & {
  hairType?: Avatar["hairType"] | "none";
};

function normalizeAvatar(avatar: LegacyAvatar): Avatar {
  const normalizedHairType =
    avatar.hairType === "none" ? "type0" : (avatar.hairType ?? "type1");

  return {
    ...avatar,
    hairType: normalizedHairType,
  };
}

function updateRelationshipsDailyRecovery(
  currentRelationships: Relationship[],
  lastOpenDate?: string,
): Relationship[] {
  if (!lastOpenDate) {
    return currentRelationships;
  }

  const referenceDate = new Date(`${lastOpenDate}T00:00:00`);
  if (Number.isNaN(referenceDate.getTime())) {
    return currentRelationships;
  }

  return currentRelationships.map((relationship) => ({
    ...relationship,
    points: {
      yourPoints: calculateNewPoints(
        relationship.points.yourPoints,
        referenceDate,
      ),
      theirPoints: calculateNewPoints(
        relationship.points.theirPoints,
        referenceDate,
      ),
    },
    ink: {
      your: {
        trust: calculateNewINKValue(
          relationship.ink.your.trust,
          referenceDate,
          "trust",
        ),
        attention: calculateNewINKValue(
          relationship.ink.your.attention,
          referenceDate,
          "attention",
        ),
        support: calculateNewINKValue(
          relationship.ink.your.support,
          referenceDate,
          "support",
        ),
      },
      their: {
        trust: calculateNewINKValue(
          relationship.ink.their.trust,
          referenceDate,
          "trust",
        ),
        attention: calculateNewINKValue(
          relationship.ink.their.attention,
          referenceDate,
          "attention",
        ),
        support: calculateNewINKValue(
          relationship.ink.their.support,
          referenceDate,
          "support",
        ),
      },
    },
  }));
}

type GlobalContextType = {
  yourStats: {
    name: string;
    avatar: Avatar;
  } | null;
  setYourStats: React.Dispatch<
    React.SetStateAction<{ name: string; avatar: Avatar } | null>
  >;
  relationships: Relationship[]; // später typisieren
  setRelationships: React.Dispatch<React.SetStateAction<Relationship[]>>;
  generalSettings: GeneralSettings;
  setGeneralSettings: React.Dispatch<React.SetStateAction<GeneralSettings>>;
  loading: boolean;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = React.useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [yourStats, setYourStats] = useState<{
    name: string;
    avatar: Avatar;
  } | null>(null);

  const [relationships, setRelationships] = useState<Relationship[]>([]); // später typisieren
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    theme: "light",
    patches: [] as SpecificBadgeId[],
    sync: false,
    notifications: false,
    streakDuration: 0,
    weekEntries: [] as WeekEntry[],
    addsWatchedAt: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Loading data from AsyncStorage...");
    if (yourStats != null) {
      AsyncStorage.setItem("yourStats", JSON.stringify(yourStats));
      console.log("Saved yourStats to AsyncStorage:", yourStats);
    }
    if (relationships.length > 0) {
      AsyncStorage.setItem("relationships", JSON.stringify(relationships));
      console.log("Saved relationships to AsyncStorage:", relationships);
    }
    AsyncStorage.setItem("generalSettings", JSON.stringify(generalSettings));
    console.log("Saved generalSettings to AsyncStorage:", generalSettings);
  }, [yourStats, relationships, generalSettings]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedYourStats = await AsyncStorage.getItem("yourStats");
        const storedRelationships = await AsyncStorage.getItem("relationships");
        const storedGeneralSettings =
          await AsyncStorage.getItem("generalSettings");
        if (storedYourStats) {
          const parsedYourStats = JSON.parse(storedYourStats) as {
            name: string;
            avatar: Avatar;
          };
          const needsYourStatsMigration = !parsedYourStats.avatar?.hairType;
          const normalizedYourStats = {
            ...parsedYourStats,
            avatar: normalizeAvatar(parsedYourStats.avatar),
          };
          setYourStats(normalizedYourStats);
          if (needsYourStatsMigration) {
            await AsyncStorage.setItem(
              "yourStats",
              JSON.stringify(normalizedYourStats),
            );
          }
          console.log(
            "Loaded yourStats from AsyncStorage:",
            normalizedYourStats,
          );
        }
        if (storedRelationships) {
          const parsedRelationships: Relationship[] =
            JSON.parse(storedRelationships);
          const needsRelationshipsMigration = parsedRelationships.some(
            (relationship) => !relationship.person.avatar?.hairType,
          );
          const normalizedRelationships = parsedRelationships.map(
            (relationship) => ({
              ...relationship,
              person: {
                ...relationship.person,
                avatar: normalizeAvatar(relationship.person.avatar),
              },
            }),
          );
          const parsedSettingsForRecovery: GeneralSettings =
            storedGeneralSettings
              ? normalizeGeneralSettings(JSON.parse(storedGeneralSettings))
              : generalSettings;
          const updatedRelationships = updateRelationshipsDailyRecovery(
            normalizedRelationships,
            parsedSettingsForRecovery.lastOpenDate,
          );

          setRelationships(updatedRelationships);
          if (needsRelationshipsMigration) {
            await AsyncStorage.setItem(
              "relationships",
              JSON.stringify(updatedRelationships),
            );
          }
          console.log(
            "Loaded relationships from AsyncStorage:",
            updatedRelationships,
          );
        }
        const parsedSettings: GeneralSettings = storedGeneralSettings
          ? normalizeGeneralSettings(JSON.parse(storedGeneralSettings))
          : generalSettings;
        const updatedSettings = updateStreak(parsedSettings);
        setGeneralSettings(updatedSettings);
        console.log(
          "Loaded generalSettings from AsyncStorage:",
          updatedSettings,
        );
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };
    if (loading) loadData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        yourStats,
        setYourStats,
        relationships,
        setRelationships,
        generalSettings,
        setGeneralSettings,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
