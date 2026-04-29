import { Avatar } from "./typesRelationship";

export type WeekEntry = {
  date: string; // ISO Datum
  completed: boolean;
};

export type SpecificBadgeId =
  | "critical"
  | "balanced"
  | "positive"
  | "streak1"
  | "streak2"
  | "streak3"
  | "streak4"
  | "streak5"
  | "streak6"
  | "streak7"
  | "streak8"
  | "streak9"
  | "streak10";

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
