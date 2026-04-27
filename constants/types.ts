import { Avatar } from "./typesRelationship";

export type WeekEntry = {
  date: string; // ISO Datum
  completed: boolean;
};

export type SpecificBadgeId = "critical" | "balanced" | "positive";

export type Status = "critical" | "balanced" | "positive";

export type yourStats = {
  name: string;
  avatar: Avatar;
};

export type GlobalProviderProps = {
  children: React.ReactNode;
};

export type GeneralSettings = {
  theme: "light" | "dark";
  patches: SpecificBadgeId[];
  sync: boolean;
  notifications: boolean;
  streakDuration: number; // in Tagen
  weekEntries: WeekEntry[];
};
