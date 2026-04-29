import {
  GeneralSettings,
  GlobalProviderProps,
  SpecificBadgeId,
  WeekEntry,
} from "@/constants/types";
import { Avatar, Relationship } from "@/constants/typesRelationship";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useEffect, useState } from "react";

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
          setYourStats(JSON.parse(storedYourStats));
          console.log(
            "Loaded yourStats from AsyncStorage:",
            JSON.parse(storedYourStats),
          );
        }
        if (storedRelationships) {
          setRelationships(JSON.parse(storedRelationships));
          console.log(
            "Loaded relationships from AsyncStorage:",
            JSON.parse(storedRelationships),
          );
        }
        if (storedGeneralSettings) {
          setGeneralSettings(JSON.parse(storedGeneralSettings));
          console.log(
            "Loaded generalSettings from AsyncStorage:",
            JSON.parse(storedGeneralSettings),
          );
        }
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
