import {
  GeneralSettings,
  GlobalProviderProps,
  SpecificBadgeId,
  WeekEntry,
} from "@/constants/types";
import { Relationship } from "@/constants/typesRelationship";
import React, { createContext, useState } from "react";

type GlobalContextType = {
  yourStats: {
    name: string;
    avatar: string;
  } | null;
  setYourStats: React.Dispatch<
    React.SetStateAction<{ name: string; avatar: string } | null>
  >;
  relationships: Relationship[]; // später typisieren
  setRelationships: React.Dispatch<React.SetStateAction<Relationship[]>>;
  generalSettings: GeneralSettings;
  setGeneralSettings: React.Dispatch<React.SetStateAction<GeneralSettings>>;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [yourStats, setYourStats] = useState<{
    name: string;
    avatar: string;
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

  return (
    <GlobalContext.Provider
      value={{
        yourStats,
        setYourStats,
        relationships,
        setRelationships,
        generalSettings,
        setGeneralSettings,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
