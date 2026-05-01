import { Avatar } from "./typesRelationship";

export type WeekEntry = {
  date: string; // ISO Datum
  completed: boolean;
};

export type SpecificBadgeId =
  | "critical"
  | "balanced"
  | "positive"
  | "veryPositive"
  | "trustworthy"
  | "attentive"
  | "supportive"
  | "giver"
  | "strongRelationship"
  | "receiver"
  | "streak3"
  | "streak7"
  | "streak30"
  | "streak60"
  | "streak67"
  | "streak90"
  | "streak180"
  | "streak365"
  | "streak500"
  | "streak1000";

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
  addsWatchedAt: string[];
  lastOpenDate?: string; // YYYY-MM-DD
};
